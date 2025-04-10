export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
}

export interface VideoLibraryProps {
  videos: Video[];
}

export interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
} 