import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Text, Image, VStack, useDisclosure, Button, IconButton } from '@chakra-ui/react';
import { FiEdit2 } from 'react-icons/fi';
import { Video } from '../types';
import VideoPlayer from './VideoPlayer';
import VideoUpload from './VideoUpload';
import { videosService } from '../services/videos';

const VideoLibrary: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const fetchVideos = async () => {
    try {
      const data = await videosService.getAllVideos();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    onOpen();
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchVideos();
  };

  const handleEditClick = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    setEditingVideo(video);
    setShowUpload(true);
  };

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Text>Loading videos...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Button
        colorScheme="blue"
        mb={6}
        onClick={() => {
          setEditingVideo(null);
          setShowUpload(!showUpload);
        }}
      >
        {showUpload ? 'Hide Upload Form' : 'Upload New Video'}
      </Button>

      {showUpload && (
        <Box mb={6}>
          <VideoUpload 
            isOpen={showUpload}
            onClose={() => {
              setShowUpload(false);
              setEditingVideo(null);
            }}
            onUploadComplete={handleUploadComplete}
            editVideo={editingVideo}
          />
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {videos.map((video) => (
          <Box
            key={video.id}
            onClick={() => handleVideoClick(video)}
            cursor="pointer"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            shadow="md"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.02)' }}
            position="relative"
          >
            <IconButton
              icon={<FiEdit2 />}
              aria-label="Edit video"
              position="absolute"
              top={2}
              right={2}
              size="sm"
              colorScheme="blue"
              onClick={(e) => handleEditClick(e, video)}
              zIndex={2}
            />
            <Image
              src={video.thumbnail || 'https://via.placeholder.com/300x200'}
              alt={video.title}
              width="100%"
              height="200px"
              objectFit="cover"
            />
            <VStack p={4} align="start" spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                {video.title}
              </Text>
              <Text noOfLines={2} color="gray.600">
                {video.description}
              </Text>
              {video.category && (
                <Text color="blue.500" fontSize="sm">
                  {video.category}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {selectedVideo && isOpen && (
        <VideoPlayer video={selectedVideo} onClose={onClose} />
      )}
    </Box>
  );
};

export default VideoLibrary; 