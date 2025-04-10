import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize storage bucket
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const videoBucketExists = buckets?.some(bucket => bucket.name === 'videos');

    if (!videoBucketExists) {
      const { data, error } = await supabase.storage.createBucket('videos', {
        public: true,
        fileSizeLimit: 524288000, // 500MB
      });

      if (error) {
        console.error('Error creating storage bucket:', error);
      } else {
        console.log('Storage bucket created successfully:', data);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
})(); 