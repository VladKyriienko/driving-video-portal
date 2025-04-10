import { useState } from 'react';
import { SimpleGrid, Box, Text, Image, VStack, useDisclosure } from '@chakra-ui/react';
import { Video, VideoLibraryProps } from '../types';
import VideoPlayer from './VideoPlayer';

const VideoLibrary: React.FC<VideoLibraryProps> = ({ videos }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    onOpen();
  };

  return (
    <Box p={4}>
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
          >
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