import { supabase } from '../lib/supabase';

// Video CRUD Operations
export const videoService = {
  // Get all published videos with pagination and filtering
  async getPublishedVideos(options = {}) {
    const {
      page = 1,
      limit = 20,
      category = null,
      contentRating = null,
      searchTerm = null,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    let query = supabase?.from('videos')?.select(`
        *,
        uploader:user_profiles!uploader_id(id, full_name, username, avatar_url)
      `)?.eq('status', 'published')?.eq('approval_status', 'approved');

    // Apply filters
    if (category) {
      query = query?.eq('category', category);
    }

    if (contentRating) {
      query = query?.eq('content_rating', contentRating);
    }

    if (searchTerm) {
      query = query?.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply sorting and pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query?.order(sortBy, { ascending: sortOrder === 'asc' })?.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error fetching videos: ${error.message}`);
    }

    return {
      videos: data || [],
      totalCount: count,
      hasMore: data?.length === limit
    };
  },

  // Get user's own videos
  async getUserVideos(userId, status = null) {
    let query = supabase?.from('videos')?.select('*')?.eq('uploader_id', userId);

    if (status) {
      query = query?.eq('status', status);
    }

    query = query?.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching user videos: ${error.message}`);
    }

    return data || [];
  },

  // Get video by ID with uploader info
  async getVideoById(videoId) {
    const { data, error } = await supabase?.from('videos')?.select(`
        *,
        uploader:user_profiles!uploader_id(id, full_name, username, avatar_url, role)
      `)?.eq('id', videoId)?.single();

    if (error) {
      throw new Error(`Error fetching video: ${error.message}`);
    }

    return data;
  },

  // Create new video record
  async createVideo(videoData) {
    const { data, error } = await supabase?.from('videos')?.insert({
        title: videoData?.title,
        description: videoData?.description,
        uploader_id: videoData?.uploaderId,
        file_path: videoData?.filePath,
        thumbnail_path: videoData?.thumbnailPath,
        duration_seconds: videoData?.durationSeconds,
        file_size_bytes: videoData?.fileSizeBytes,
        mime_type: videoData?.mimeType,
        category: videoData?.category,
        content_rating: videoData?.contentRating,
        tags: videoData?.tags || [],
        status: 'processing'
      })?.select()?.single();

    if (error) {
      throw new Error(`Error creating video: ${error.message}`);
    }

    return data;
  },

  // Update video metadata
  async updateVideo(videoId, updates) {
    const { data, error } = await supabase?.from('videos')?.update({
        ...updates,
        updated_at: new Date()?.toISOString()
      })?.eq('id', videoId)?.select()?.single();

    if (error) {
      throw new Error(`Error updating video: ${error.message}`);
    }

    return data;
  },

  // Delete video
  async deleteVideo(videoId) {
    const { error } = await supabase?.from('videos')?.delete()?.eq('id', videoId);

    if (error) {
      throw new Error(`Error deleting video: ${error.message}`);
    }

    return true;
  },

  // Track video view
  async recordView(videoId, userId = null) {
    const viewData = {
      video_id: videoId,
      viewer_id: userId,
      viewed_at: new Date()?.toISOString()
    };

    const { error } = await supabase?.from('video_views')?.insert(viewData);

    if (error) {
      console.error('Error recording view:', error?.message);
      // Don't throw error for view tracking failures
    }
  },

  // Update view progress
  async updateViewProgress(videoId, userId, watchDurationSeconds, completed = false) {
    if (!userId) return;

    const { error } = await supabase?.from('video_views')?.update({
        watch_duration_seconds: watchDurationSeconds,
        completed
      })?.eq('video_id', videoId)?.eq('viewer_id', userId);

    if (error) {
      console.error('Error updating view progress:', error?.message);
    }
  },

  // Toggle video reaction (like/love/etc)
  async toggleReaction(videoId, userId, reactionType = 'like') {
    try {
      // First, try to get existing reaction
      const { data: existingReaction } = await supabase?.from('video_reactions')?.select('id, reaction_type')?.eq('video_id', videoId)?.eq('user_id', userId)?.single();

      if (existingReaction) {
        // If same reaction exists, remove it
        if (existingReaction?.reaction_type === reactionType) {
          const { error } = await supabase?.from('video_reactions')?.delete()?.eq('id', existingReaction?.id);

          if (error) throw error;
          return { action: 'removed', reactionType };
        } else {
          // Update to new reaction type
          const { error } = await supabase?.from('video_reactions')?.update({ reaction_type: reactionType })?.eq('id', existingReaction?.id);

          if (error) throw error;
          return { action: 'updated', reactionType };
        }
      } else {
        // Create new reaction
        const { error } = await supabase?.from('video_reactions')?.insert({
            video_id: videoId,
            user_id: userId,
            reaction_type: reactionType
          });

        if (error) throw error;
        return { action: 'added', reactionType };
      }
    } catch (error) {
      throw new Error(`Error toggling reaction: ${error.message}`);
    }
  },

  // Get user's reaction to video
  async getUserReaction(videoId, userId) {
    const { data, error } = await supabase?.from('video_reactions')?.select('reaction_type')?.eq('video_id', videoId)?.eq('user_id', userId)?.single();

    if (error && error?.code !== 'PGRST116') {
      throw new Error(`Error fetching user reaction: ${error.message}`);
    }

    return data?.reaction_type || null;
  },

  // Get featured videos
  async getFeaturedVideos(limit = 10) {
    const { data, error } = await supabase?.from('videos')?.select(`
        *,
        uploader:user_profiles!uploader_id(id, full_name, username, avatar_url)
      `)?.eq('is_featured', true)?.eq('status', 'published')?.eq('approval_status', 'approved')?.order('created_at', { ascending: false })?.limit(limit);

    if (error) {
      throw new Error(`Error fetching featured videos: ${error.message}`);
    }

    return data || [];
  },

  // Report video for moderation
  async reportVideo(videoId, reporterId, reason, description = null) {
    const { data, error } = await supabase?.from('moderation_reports')?.insert({
        video_id: videoId,
        reporter_id: reporterId,
        reason,
        description
      })?.select()?.single();

    if (error) {
      throw new Error(`Error reporting video: ${error.message}`);
    }

    return data;
  }
};

// Storage service for video files
export const videoStorageService = {
  // Upload video file
  async uploadVideo(file, userId, onProgress = null) {
    const fileExt = file?.name?.split('.')?.pop();
    const fileName = `${userId}/${Date.now()}_${Math.random()?.toString(36)?.substring(2)}.${fileExt}`;
    const filePath = `videos/${fileName}`;

    const { data, error } = await supabase?.storage?.from('videos')?.upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Error uploading video: ${error.message}`);
    }

    return {
      path: data?.path,
      fullPath: data?.fullPath
    };
  },

  // Upload thumbnail
  async uploadThumbnail(file, userId) {
    const fileExt = file?.name?.split('.')?.pop();
    const fileName = `${Date.now()}_${Math.random()?.toString(36)?.substring(2)}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { data, error } = await supabase?.storage?.from('thumbnails')?.upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Error uploading thumbnail: ${error.message}`);
    }

    // Get public URL for thumbnail
    const { data: urlData } = supabase?.storage?.from('thumbnails')?.getPublicUrl(data?.path);

    return {
      path: data?.path,
      url: urlData?.publicUrl
    };
  },

  // Get signed URL for private video
  async getVideoUrl(filePath, expiresIn = 3600) {
    const { data, error } = await supabase?.storage?.from('videos')?.createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Error getting video URL: ${error.message}`);
    }

    return data?.signedUrl;
  },

  // Get public thumbnail URL
  getThumbnailUrl(filePath) {
    const { data } = supabase?.storage?.from('thumbnails')?.getPublicUrl(filePath);

    return data?.publicUrl;
  },

  // Delete video file
  async deleteVideo(filePath) {
    const { error } = await supabase?.storage?.from('videos')?.remove([filePath]);

    if (error) {
      throw new Error(`Error deleting video file: ${error.message}`);
    }

    return true;
  },

  // Delete thumbnail
  async deleteThumbnail(filePath) {
    const { error } = await supabase?.storage?.from('thumbnails')?.remove([filePath]);

    if (error) {
      throw new Error(`Error deleting thumbnail: ${error.message}`);
    }

    return true;
  }
};

// Playlist service
export const playlistService = {
  // Get user's playlists
  async getUserPlaylists(userId) {
    const { data, error } = await supabase?.from('playlists')?.select(`*,playlist_videos(id,position,video:videos(id, title, thumbnail_path, duration_seconds))`)?.eq('owner_id', userId)?.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching playlists: ${error.message}`);
    }

    return data || [];
  },

  // Create new playlist
  async createPlaylist(playlistData) {
    const { data, error } = await supabase?.from('playlists')?.insert({
        name: playlistData?.name,
        description: playlistData?.description,
        owner_id: playlistData?.ownerId,
        is_public: playlistData?.isPublic || false
      })?.select()?.single();

    if (error) {
      throw new Error(`Error creating playlist: ${error.message}`);
    }

    return data;
  },

  // Add video to playlist
  async addVideoToPlaylist(playlistId, videoId, position = null) {
    // If no position specified, add to end
    if (position === null) {
      const { data: lastVideo } = await supabase?.from('playlist_videos')?.select('position')?.eq('playlist_id', playlistId)?.order('position', { ascending: false })?.limit(1)?.single();

      position = (lastVideo?.position || 0) + 1;
    }

    const { data, error } = await supabase?.from('playlist_videos')?.insert({
        playlist_id: playlistId,
        video_id: videoId,
        position
      })?.select()?.single();

    if (error) {
      throw new Error(`Error adding video to playlist: ${error.message}`);
    }

    return data;
  },

  // Remove video from playlist
  async removeVideoFromPlaylist(playlistId, videoId) {
    const { error } = await supabase?.from('playlist_videos')?.delete()?.eq('playlist_id', playlistId)?.eq('video_id', videoId);

    if (error) {
      throw new Error(`Error removing video from playlist: ${error.message}`);
    }

    return true;
  }
};