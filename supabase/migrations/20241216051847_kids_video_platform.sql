-- Location: supabase/migrations/20241216051847_kids_video_platform.sql
-- Schema Analysis: Fresh Supabase project with no existing schema
-- Integration Type: Complete kids video platform implementation
-- Dependencies: None (fresh project)

-- 1. Create Custom Types
CREATE TYPE public.user_role AS ENUM ('parent', 'child', 'admin');
CREATE TYPE public.video_status AS ENUM ('processing', 'published', 'private', 'flagged', 'archived');
CREATE TYPE public.content_rating AS ENUM ('all_ages', 'ages_3_plus', 'ages_6_plus', 'ages_12_plus', 'parental_guidance');
CREATE TYPE public.video_category AS ENUM ('educational', 'creative', 'music', 'stories', 'games', 'family');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected', 'needs_review');

-- 2. Create Core Tables

-- User profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    username TEXT UNIQUE,
    role public.user_role NOT NULL DEFAULT 'child'::public.user_role,
    age INTEGER,
    parent_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    safety_settings JSONB DEFAULT '{"content_filter": "strict", "time_limits": {"daily": 60, "session": 30}, "allowed_categories": ["educational", "creative", "music", "stories"]}',
    parental_controls JSONB DEFAULT '{"comments_enabled": false, "sharing_enabled": false, "download_enabled": false}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Video metadata table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    uploader_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL, -- Storage path in Supabase Storage
    thumbnail_path TEXT,
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    mime_type TEXT,
    status public.video_status DEFAULT 'processing'::public.video_status,
    category public.video_category NOT NULL DEFAULT 'educational'::public.video_category,
    content_rating public.content_rating DEFAULT 'all_ages'::public.content_rating,
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    approval_status public.approval_status DEFAULT 'pending'::public.approval_status,
    approved_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}', -- Additional video metadata
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Video views tracking
CREATE TABLE public.video_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    viewed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    watch_duration_seconds INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    session_id TEXT, -- For anonymous tracking
    ip_address INET
);

-- Video likes/reactions
CREATE TABLE public.video_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    reaction_type TEXT DEFAULT 'like', -- like, love, laugh, etc.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(video_id, user_id)
);

-- Video playlists
CREATE TABLE public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Playlist videos junction table
CREATE TABLE public.playlist_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(playlist_id, video_id)
);

-- Content moderation reports
CREATE TABLE public.moderation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_parent_id ON public.user_profiles(parent_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_videos_uploader_id ON public.videos(uploader_id);
CREATE INDEX idx_videos_status ON public.videos(status);
CREATE INDEX idx_videos_category ON public.videos(category);
CREATE INDEX idx_videos_content_rating ON public.videos(content_rating);
CREATE INDEX idx_videos_created_at ON public.videos(created_at);
CREATE INDEX idx_videos_approval_status ON public.videos(approval_status);
CREATE INDEX idx_video_views_video_id ON public.video_views(video_id);
CREATE INDEX idx_video_views_viewer_id ON public.video_views(viewer_id);
CREATE INDEX idx_video_views_viewed_at ON public.video_views(viewed_at);
CREATE INDEX idx_video_reactions_video_id ON public.video_reactions(video_id);
CREATE INDEX idx_video_reactions_user_id ON public.video_reactions(user_id);
CREATE INDEX idx_playlists_owner_id ON public.playlists(owner_id);
CREATE INDEX idx_playlist_videos_playlist_id ON public.playlist_videos(playlist_id);
CREATE INDEX idx_playlist_videos_video_id ON public.playlist_videos(video_id);
CREATE INDEX idx_moderation_reports_video_id ON public.moderation_reports(video_id);

-- 4. Helper Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.is_parent_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('parent', 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.is_child_of_parent(child_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = child_uuid 
    AND up.parent_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_view_video(video_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.videos v
    JOIN public.user_profiles up ON up.id = auth.uid()
    WHERE v.id = video_uuid
    AND v.status = 'published'
    AND v.approval_status = 'approved'
    AND (
        -- Admin can view all
        up.role = 'admin'
        OR
        -- Owner can view own videos
        v.uploader_id = auth.uid()
        OR
        -- Public videos for appropriate age
        (v.status = 'published' AND 
         CASE 
            WHEN v.content_rating = 'all_ages' THEN true
            WHEN v.content_rating = 'ages_3_plus' AND up.age >= 3 THEN true
            WHEN v.content_rating = 'ages_6_plus' AND up.age >= 6 THEN true
            WHEN v.content_rating = 'ages_12_plus' AND up.age >= 12 THEN true
            ELSE false
         END)
    )
)
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, age)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'child')::public.user_role,
        COALESCE((NEW.raw_user_meta_data->>'age')::integer, 8)
    );
    RETURN NEW;
END;
$$;

-- Function to update video view count
CREATE OR REPLACE FUNCTION public.update_video_view_count()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.videos 
    SET view_count = view_count + 1 
    WHERE id = NEW.video_id;
    RETURN NEW;
END;
$$;

-- Function to update video like count
CREATE OR REPLACE FUNCTION public.update_video_like_count()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.videos 
        SET like_count = like_count + 1 
        WHERE id = NEW.video_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.videos 
        SET like_count = like_count - 1 
        WHERE id = OLD.video_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_reports ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- User profiles policies (Pattern 1: Core User Tables)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "parents_view_children_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (parent_id = auth.uid() OR public.is_admin());

-- Videos policies
CREATE POLICY "users_manage_own_videos"
ON public.videos
FOR ALL
TO authenticated
USING (uploader_id = auth.uid() OR public.is_admin())
WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "public_can_view_approved_videos"
ON public.videos
FOR SELECT
TO authenticated
USING (public.can_view_video(id));

-- Video views policies
CREATE POLICY "users_manage_own_video_views"
ON public.video_views
FOR ALL
TO authenticated
USING (viewer_id = auth.uid() OR public.is_admin())
WITH CHECK (viewer_id = auth.uid());

-- Video reactions policies
CREATE POLICY "users_manage_own_video_reactions"
ON public.video_reactions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Playlists policies
CREATE POLICY "users_manage_own_playlists"
ON public.playlists
FOR ALL
TO authenticated
USING (owner_id = auth.uid() OR public.is_admin())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "public_can_view_public_playlists"
ON public.playlists
FOR SELECT
TO authenticated
USING (is_public = true OR owner_id = auth.uid() OR public.is_admin());

-- Playlist videos policies
CREATE POLICY "playlist_owners_manage_playlist_videos"
ON public.playlist_videos
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.playlists p
        WHERE p.id = playlist_videos.playlist_id
        AND (p.owner_id = auth.uid() OR public.is_admin())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.playlists p
        WHERE p.id = playlist_videos.playlist_id
        AND p.owner_id = auth.uid()
    )
);

-- Moderation reports policies
CREATE POLICY "users_can_create_moderation_reports"
ON public.moderation_reports
FOR INSERT
TO authenticated
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "admins_manage_moderation_reports"
ON public.moderation_reports
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. Create Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_video_view_insert
  AFTER INSERT ON public.video_views
  FOR EACH ROW EXECUTE FUNCTION public.update_video_view_count();

CREATE TRIGGER on_video_reaction_change
  AFTER INSERT OR DELETE ON public.video_reactions
  FOR EACH ROW EXECUTE FUNCTION public.update_video_like_count();

-- 8. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'videos', 
        'videos', 
        false, 
        524288000, -- 500MB limit per video
        ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    ),
    (
        'thumbnails', 
        'thumbnails', 
        true, 
        5242880, -- 5MB limit per thumbnail
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    ),
    (
        'avatars', 
        'avatars', 
        true, 
        2097152, -- 2MB limit per avatar
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    );

-- 9. Storage RLS Policies

-- Videos bucket (private)
CREATE POLICY "authenticated_users_upload_videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'videos' 
    AND owner = auth.uid()
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "users_view_own_videos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'videos' AND owner = auth.uid());

CREATE POLICY "admins_manage_videos"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'videos' 
    AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'videos' 
    AND public.is_admin()
);

-- Thumbnails bucket (public)
CREATE POLICY "public_can_view_thumbnails"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'thumbnails');

CREATE POLICY "authenticated_users_upload_thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'thumbnails'
    AND owner = auth.uid()
);

CREATE POLICY "users_manage_own_thumbnails"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'thumbnails' AND owner = auth.uid())
WITH CHECK (bucket_id = 'thumbnails' AND owner = auth.uid());

-- Avatars bucket (public)
CREATE POLICY "public_can_view_avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "authenticated_users_manage_avatars"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid())
WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());

-- 10. Mock Data for Testing
DO $$
DECLARE
    parent_uuid UUID := gen_random_uuid();
    child_uuid UUID := gen_random_uuid();
    admin_uuid UUID := gen_random_uuid();
    video1_uuid UUID := gen_random_uuid();
    video2_uuid UUID := gen_random_uuid();
    video3_uuid UUID := gen_random_uuid();
    playlist_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (parent_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'parent@kidsvid.com', crypt('SafeParent123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "parent", "age": "35"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (child_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'kiddo@kidsvid.com', crypt('FunKid456!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emma Johnson", "role": "child", "age": "8"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@kidsvid.com', crypt('Admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin", "age": "30"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles to establish parent-child relationship
    UPDATE public.user_profiles 
    SET parent_id = parent_uuid 
    WHERE id = child_uuid;

    -- Create sample videos
    INSERT INTO public.videos (id, title, description, uploader_id, file_path, thumbnail_path, duration_seconds, status, category, content_rating, tags, approval_status, approved_by, approved_at, view_count, like_count) VALUES
        (video1_uuid, 'Learning the Alphabet Song', 'Fun and educational alphabet song for young learners', parent_uuid, 'videos/' || parent_uuid::text || '/alphabet-song.mp4', 'thumbnails/alphabet-song-thumb.jpg', 180, 'published'::public.video_status, 'educational'::public.video_category, 'all_ages'::public.content_rating, ARRAY['alphabet', 'learning', 'song'], 'approved'::public.approval_status, admin_uuid, now() - interval '1 day', 1250, 45),
        (video2_uuid, 'Creative Drawing Tutorial', 'Learn to draw animals step by step', parent_uuid, 'videos/' || parent_uuid::text || '/drawing-tutorial.mp4', 'thumbnails/drawing-tutorial-thumb.jpg', 420, 'published'::public.video_status, 'creative'::public.video_category, 'ages_3_plus'::public.content_rating, ARRAY['drawing', 'art', 'creative'], 'approved'::public.approval_status, admin_uuid, now() - interval '2 days', 890, 32),
        (video3_uuid, 'Fun Math Games', 'Interactive math games for children', child_uuid, 'videos/' || child_uuid::text || '/math-games.mp4', 'thumbnails/math-games-thumb.jpg', 300, 'published'::public.video_status, 'educational'::public.video_category, 'ages_6_plus'::public.content_rating, ARRAY['math', 'games', 'education'], 'approved'::public.approval_status, admin_uuid, now() - interval '3 days', 675, 28);

    -- Create sample playlist
    INSERT INTO public.playlists (id, name, description, owner_id, is_public, created_at) VALUES
        (playlist_uuid, 'Educational Favorites', 'Best educational videos for kids', parent_uuid, true, now() - interval '1 day');

    -- Add videos to playlist
    INSERT INTO public.playlist_videos (playlist_id, video_id, position) VALUES
        (playlist_uuid, video1_uuid, 1),
        (playlist_uuid, video3_uuid, 2);

    -- Create sample video views
    INSERT INTO public.video_views (video_id, viewer_id, watch_duration_seconds, completed) VALUES
        (video1_uuid, child_uuid, 180, true),
        (video2_uuid, child_uuid, 300, false),
        (video3_uuid, child_uuid, 300, true);

    -- Create sample reactions
    INSERT INTO public.video_reactions (video_id, user_id, reaction_type) VALUES
        (video1_uuid, child_uuid, 'love'),
        (video2_uuid, child_uuid, 'like'),
        (video3_uuid, child_uuid, 'like');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 11. Create cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    test_user_ids UUID[];
BEGIN
    -- Get test user IDs
    SELECT ARRAY_AGG(id) INTO test_user_ids
    FROM auth.users
    WHERE email LIKE '%@kidsvid.com';

    -- Delete in dependency order
    DELETE FROM public.video_reactions WHERE user_id = ANY(test_user_ids);
    DELETE FROM public.video_views WHERE viewer_id = ANY(test_user_ids);
    DELETE FROM public.playlist_videos WHERE playlist_id IN (SELECT id FROM public.playlists WHERE owner_id = ANY(test_user_ids));
    DELETE FROM public.playlists WHERE owner_id = ANY(test_user_ids);
    DELETE FROM public.moderation_reports WHERE reporter_id = ANY(test_user_ids);
    DELETE FROM public.videos WHERE uploader_id = ANY(test_user_ids);
    DELETE FROM public.user_profiles WHERE id = ANY(test_user_ids);
    DELETE FROM auth.users WHERE id = ANY(test_user_ids);

    RAISE NOTICE 'Test data cleanup completed successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;