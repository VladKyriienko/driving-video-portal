import { Box, Button, Text, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useBreakpointValue } from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import { VideoPlayerProps } from '../types';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  const modalSize = useBreakpointValue({ base: 'full', lg: '6xl' });

  return (
    <Modal isOpen={true} onClose={onClose} size={modalSize} isCentered>
      <ModalOverlay />
      <ModalContent 
        bg="gray.900" 
        maxH={{ base: '100vh', md: '90vh' }} 
        h={{ base: '100vh', md: 'auto' }}
        my="auto"
        display="flex"
        flexDirection="column"
      >
        <ModalHeader color="white" py={3} flex="0 0 auto">
          {video.title}
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody 
          p={4} 
          flex="1 1 auto" 
          display="flex" 
          flexDirection="column" 
          overflow="hidden"
        >
          <VStack spacing={4} align="stretch" flex="1" minH="0">
            <Box
              flex="1"
              minH="0"
              position="relative"
              bg="black"
              borderRadius="md"
              overflow="hidden"
              // 16:9 aspect ratio wrapper
              sx={{
                '&::before': {
                  content: '""',
                  display: 'block',
                  paddingTop: '56.25%',
                },
              }}
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
              >
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                      },
                    },
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            <Box 
              overflowY="auto" 
              flex="0 0 auto" 
              maxH={{ base: "30vh", md: "20vh" }}
            >
              <Text color="white" fontSize="lg" mb={2}>
                {video.description}
              </Text>
              {video.category && (
                <Text color="blue.300" fontSize="md" mb={4}>
                  Category: {video.category}
                </Text>
              )}
              <Button colorScheme="blue" onClick={onClose} size="lg" mb={2}>
                Close
              </Button>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoPlayer; 