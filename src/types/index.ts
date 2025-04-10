export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
  source: 'file' | 'youtube';
}

export interface VideoLibraryProps {
  videos: Video[];
}

export interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export interface VideoUploadFormData {
  title: string;
  description?: string;
  category?: string;
  url?: string;
} 