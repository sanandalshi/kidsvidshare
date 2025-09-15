import { supabase } from '../lib/supabase';

export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' }
        };
      }
      return { data: null, error: { message: 'Network error. Please try again.' } };
    }
  },

  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || '',
            role: userData?.role || 'child',
            age: userData?.age || 8
          }
        }
      });

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to authentication service. Please check your network connection and try again.' }
        };
      }
      return { data: null, error: { message: 'Network error. Please try again.' } };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      return { error };
    } catch (error) {
      return { error: { message: 'Network error during sign out.' } };
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase?.auth?.getSession();
      return { data, error };
    } catch (error) {
      return { data: null, error: { message: 'Error getting session.' } };
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          *,
          children:user_profiles!parent_id(id, full_name, username, age, avatar_url, created_at),
          parent:user_profiles!parent_id(id, full_name, username, avatar_url)
        `)?.eq('id', userId)?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Error fetching user profile.' } };
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', userId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Error updating profile.' } };
    }
  },

  // Upload avatar
  async uploadAvatar(file, userId) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${userId}/avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('avatars')?.upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        return { data: null, error: uploadError };
      }

      // Get public URL
      const { data: urlData } = supabase?.storage?.from('avatars')?.getPublicUrl(uploadData?.path);

      // Update user profile with new avatar URL
      const { data: profileData, error: profileError } = await this.updateUserProfile(userId, {
        avatar_url: urlData?.publicUrl
      });

      if (profileError) {
        return { data: null, error: profileError };
      }

      return { data: { url: urlData?.publicUrl, profile: profileData }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Error uploading avatar.' } };
    }
  },

  // Create child account (for parents)
  async createChildAccount(childData, parentId) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email: childData?.email,
        password: childData?.password,
        options: {
          data: {
            full_name: childData?.fullName,
            role: 'child',
            age: childData?.age
          }
        }
      });

      if (error) {
        return { data: null, error };
      }

      // Update child profile to link to parent
      if (data?.user) {
        await this.updateUserProfile(data?.user?.id, {
          parent_id: parentId
        });
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Error creating child account.' } };
    }
  },

  // Update parental controls
  async updateParentalControls(childId, controls) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update({
          parental_controls: controls,
          updated_at: new Date()?.toISOString()
        })?.eq('id', childId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Error updating parental controls.' } };
    }
  },

  // Update safety settings
  async updateSafetySettings(userId, settings) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.update({
          safety_settings: settings,
          updated_at: new Date()?.toISOString()
        })?.eq('id', userId)?.select()?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Error updating safety settings.' } };
    }
  },

  // Verify parent with code (mock implementation)
  async verifyParentCode(code) {
    // In production, this would verify against a secure parent code system
    const validCode = '1234'; // Mock parental code from migration
    return { 
      isValid: code === validCode, 
      error: code !== validCode ? { message: 'Invalid parental code' } : null 
    };
  },

  // Check if user can perform action based on parental controls
  canPerformAction(userProfile, action) {
    if (!userProfile) return false;

    // Admin and parent can do everything
    if (userProfile?.role === 'admin' || userProfile?.role === 'parent') {
      return true;
    }

    // Check parental controls for children
    const controls = userProfile?.parental_controls || {};

    switch (action) {
      case 'comment':
        return controls?.comments_enabled !== false;
      case 'share':
        return controls?.sharing_enabled !== false;
      case 'download':
        return controls?.download_enabled !== false;
      case 'upload':
        return userProfile?.role !== 'child' || controls?.upload_enabled === true;
      default:
        return true;
    }
  },

  // Check content rating access
  canViewContent(userProfile, contentRating) {
    if (!userProfile) return false;

    // Admin and parent can view all content
    if (userProfile?.role === 'admin' || userProfile?.role === 'parent') {
      return true;
    }

    const userAge = userProfile?.age || 0;

    switch (contentRating) {
      case 'all_ages':
        return true;
      case 'ages_3_plus':
        return userAge >= 3;
      case 'ages_6_plus':
        return userAge >= 6;
      case 'ages_12_plus':
        return userAge >= 12;
      case 'parental_guidance':
        return userProfile?.role === 'parent';
      default:
        return false;
    }
  }
};