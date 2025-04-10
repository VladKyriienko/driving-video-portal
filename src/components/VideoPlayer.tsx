import { Box, Button, Text, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import { VideoPlayerProps } from '../types';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg="gray.900">
        <ModalHeader color="white">{video.title}</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box
              width="100%"
              paddingTop="56.25%"
              position="relative"
            >
              <Box position="absolute" top="0" left="0" width="100%" height="100%">
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  controls
                  playing
                />
              </Box>
            </Box>
            <Text color="white" fontSize="lg">
              {video.description}
            </Text>
            <Button colorScheme="blue" onClick={onClose} size="lg">
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoPlayer; 