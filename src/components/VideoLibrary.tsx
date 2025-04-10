import { useState, useEffect } from 'react';
import { 
  SimpleGrid, 
  Box, 
  Text, 
  Image, 
  VStack, 
  HStack,
  Flex,
  useDisclosure, 
  Button, 
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
  Container,
  Divider
} from '@chakra-ui/react';
import { FiEdit2, FiUpload, FiSearch, FiVideo } from 'react-icons/fi';
import { Video } from '../types';
import VideoPlayer from './VideoPlayer';
import VideoUpload from './VideoUpload';
import { videosService } from '../services/videos';

const VideoLibrary: React.FC = () => {
  const playerDisclosure = useDisclosure();
  const uploadDisclosure = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  const fetchVideos = async () => {
    try {
      const data = await videosService.getAllVideos();
      setVideos(data);
      setFilteredVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const filtered = videos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchQuery, videos]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    playerDisclosure.onOpen();
  };

  const handleUploadComplete = () => {
    uploadDisclosure.onClose();
    fetchVideos();
  };

  const handleEditClick = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    setEditingVideo(video);
    uploadDisclosure.onOpen();
  };

  const handleUploadClose = () => {
    uploadDisclosure.onClose();
    setEditingVideo(null);
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading videos...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={6} px={{ base: 4, md: 8 }}>
      <Box mb={8}>
        <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="space-between" 
          align={{ base: "stretch", md: "center" }}
          gap={4}
        >
          <HStack spacing={3}>
            <FiVideo size={24} color="blue.500" />
            <Heading size="lg">Video Library</Heading>
          </HStack>
          
          <HStack spacing={4} width={{ base: "100%", md: "auto" }}>
            <InputGroup maxW={{ base: "100%", md: "300px" }}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="full"
              />
            </InputGroup>
            
            <Button
              leftIcon={<FiUpload />}
              colorScheme="blue"
              onClick={() => {
                setEditingVideo(null);
                uploadDisclosure.onOpen();
              }}
              borderRadius="full"
              w={{ base: "full", md: "auto" }}
            >
              Upload
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Divider mb={8} />

      <SimpleGrid 
        columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} 
        spacing={{ base: 4, md: 6 }}
        w="100%"
      >
        {filteredVideos.map((video) => (
          <Box
            key={video.id}
            onClick={() => handleVideoClick(video)}
            cursor="pointer"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            shadow="md"
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.02)', shadow: 'lg' }}
            position="relative"
            h="100%"
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
              opacity={0.9}
              _hover={{ opacity: 1 }}
            />
            <Image
              src={video.thumbnail || 'https://via.placeholder.com/300x200'}
              alt={video.title}
              width="100%"
              height="200px"
              objectFit="cover"
            />
            <VStack p={4} align="start" spacing={2} h="calc(100% - 200px)">
              <Text fontSize="xl" fontWeight="bold" noOfLines={1}>
                {video.title}
              </Text>
              <Text noOfLines={2} color="gray.600" fontSize="sm">
                {video.description}
              </Text>
              {video.category && (
                <Text color="blue.500" fontSize="sm" mt="auto">
                  {video.category}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {filteredVideos.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">No videos found</Text>
        </Box>
      )}

      <VideoUpload 
        isOpen={uploadDisclosure.isOpen}
        onClose={handleUploadClose}
        onUploadComplete={handleUploadComplete}
        editVideo={editingVideo}
      />

      {selectedVideo && playerDisclosure.isOpen && (
        <VideoPlayer video={selectedVideo} onClose={playerDisclosure.onClose} />
      )}
    </Container>
  );
};

export default VideoLibrary; 