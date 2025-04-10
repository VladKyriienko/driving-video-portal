import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Progress,
  Text,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FiUpload, FiYoutube } from 'react-icons/fi';
import { videosService } from '../services/videos';
import { VideoUploadFormData, Video } from '../types';

interface VideoUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  editVideo?: Video | null;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ isOpen, onClose, onUploadComplete, editVideo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const toast = useToast();
  const modalSize = useBreakpointValue({ base: 'full', md: 'xl' });

  const handleFileUpload = async (formData: FormData) => {
    const file = formData.get('video') as File;
    if (!file || !file.type.startsWith('video/')) {
      throw new Error('Please select a valid video file');
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      await videosService.uploadVideo(file, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
      });
      
      setUploadProgress(100);
      clearInterval(progressInterval);
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  };

  const handleYouTubeUpload = async (formData: FormData) => {
    const url = formData.get('url') as string;
    if (!url) {
      throw new Error('Please enter a YouTube URL');
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      throw new Error('Please enter a valid YouTube URL');
    }

    const videoData: VideoUploadFormData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      url,
    };

    return videosService.addYouTubeVideo(videoData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData(e.currentTarget);
      const isYouTube = e.currentTarget.id === 'youtube-form';

      if (editVideo) {
        // Handle edit mode
        await videosService.updateVideo(editVideo.id, {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          category: formData.get('category') as string,
        });
        toast({
          title: 'Video updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        // Handle create mode
        if (isYouTube) {
          await handleYouTubeUpload(formData);
        } else {
          await handleFileUpload(formData);
        }
        toast({
          title: 'Video added successfully',
          status: 'success',
          duration: 3000,
        });
      }

      onUploadComplete();
      onClose();
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: editVideo ? 'Update failed' : 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editVideo ? 'Edit Video' : 'Add New Video'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs isFitted variant="enclosed" colorScheme="blue" defaultIndex={editVideo ? 0 : undefined}>
            <TabList mb="1em">
              <Tab isDisabled={!!editVideo}>
                <Icon as={FiUpload} mr={2} />
                Upload File
              </Tab>
              <Tab isDisabled={!!editVideo}>
                <Icon as={FiYoutube} mr={2} />
                YouTube URL
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    {!editVideo && (
                      <FormControl isRequired>
                        <FormLabel>Video File</FormLabel>
                        <Input
                          type="file"
                          name="video"
                          accept="video/*"
                          required
                          disabled={isLoading}
                          sx={{
                            '&::file-selector-button': {
                              border: 'none',
                              bg: 'blue.500',
                              color: 'white',
                              borderRadius: 'md',
                              px: 4,
                              py: 2,
                              mr: 4,
                              cursor: 'pointer',
                              _hover: {
                                bg: 'blue.600',
                              },
                            },
                          }}
                        />
                      </FormControl>
                    )}

                    {uploadProgress > 0 && (
                      <Box w="100%">
                        <Text mb={2} fontSize="sm">Upload Progress: {uploadProgress}%</Text>
                        <Progress value={uploadProgress} size="sm" colorScheme="blue" borderRadius="full" />
                      </Box>
                    )}

                    <FormControl isRequired>
                      <FormLabel>Title</FormLabel>
                      <Input
                        name="title"
                        placeholder="Enter video title"
                        required
                        disabled={isLoading}
                        defaultValue={editVideo?.title}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        placeholder="Enter video description"
                        disabled={isLoading}
                        defaultValue={editVideo?.description}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Category</FormLabel>
                      <Input
                        name="category"
                        placeholder="Enter video category"
                        disabled={isLoading}
                        defaultValue={editVideo?.category}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      isLoading={isLoading}
                      width="100%"
                    >
                      {editVideo ? 'Save Changes' : 'Upload Video'}
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
              <TabPanel px={0}>
                <form id="youtube-form" onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>YouTube URL</FormLabel>
                      <Input
                        name="url"
                        placeholder="Enter YouTube video URL"
                        required
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Title</FormLabel>
                      <Input
                        name="title"
                        placeholder="Enter video title"
                        required
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        placeholder="Enter video description"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Category</FormLabel>
                      <Input
                        name="category"
                        placeholder="Enter video category"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      isLoading={isLoading}
                      loadingText="Adding..."
                    >
                      Add YouTube Video
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoUpload; 