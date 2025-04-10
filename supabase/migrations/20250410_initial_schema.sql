-- Create videos table
CREATE TABLE public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    thumbnail TEXT,
    duration INTEGER,
    category VARCHAR(100),
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create storage bucket for video files
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('videos', 'videos', true);
EXCEPTION 
    WHEN unique_violation THEN 
        NULL;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for videos table
CREATE POLICY "Public videos are viewable by everyone"
    ON public.videos FOR SELECT
    USING (true);

CREATE POLICY "Anyone can upload videos"
    ON public.videos FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update videos"
    ON public.videos FOR UPDATE
    USING (true);

-- Create policies for storage
CREATE POLICY "Anyone can upload to videos bucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Anyone can update objects in videos bucket"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'videos');

CREATE POLICY "Anyone can read from videos bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'videos');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 