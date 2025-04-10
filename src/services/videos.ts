import { supabase } from '../lib/supabase';
import { Video, VideoUploadFormData } from '../types';

export const videosService = {
  async getAllVideos(): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async uploadVideo(file: File, videoData: Omit<Video, 'id' | 'url' | 'source'>): Promise<Video> {
    try {
      // 1. Upload video file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading file to storage...', { fileName, filePath });

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // 2. Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      // 3. Create video record in the database
      const { data: video, error: dbError } = await supabase
        .from('videos')
        .insert([
          {
            ...videoData,
            url: publicUrl,
            source: 'file',
          },
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      console.log('Video record created:', video);
      return video;
    } catch (error) {
      console.error('Upload process failed:', error);
      throw error;
    }
  },

  async addYouTubeVideo(videoData: VideoUploadFormData): Promise<Video> {
    if (!videoData.url) {
      throw new Error('YouTube URL is required');
    }

    // Extract video ID from YouTube URL
    const youtubeId = extractYouTubeId(videoData.url);
    if (!youtubeId) {
      throw new Error('Invalid YouTube URL');
    }

    // Create video record in the database
    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          title: videoData.title,
          description: videoData.description,
          category: videoData.category,
          url: `https://www.youtube.com/watch?v=${youtubeId}`,
          thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          source: 'youtube',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteVideo(id: string): Promise<void> {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video> {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
} 