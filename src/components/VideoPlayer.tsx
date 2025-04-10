import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import { VideoPlayerProps } from '../types';
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiSettings,
  FiMonitor,
} from 'react-icons/fi';
import { formatTime } from '../utils/formatTime';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  const modalSize = useBreakpointValue({ base: 'full', lg: '6xl' });
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { isOpen: isVolumeOpen, onToggle: onVolumeToggle, onClose: onVolumeClose } = useDisclosure();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullScreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePlayPause = () => {
    setPlaying(prev => !prev);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleToggleMute = () => {
    if (muted) {
      setMuted(false);
      if (volume === 0) setVolume(0.7);
    } else {
      setMuted(true);
    }
  };

  const handleSeekChange = (newValue: number) => {
    setSeeking(true);
    setPlayed(newValue);
    if (playerRef.current) {
      playerRef.current.seekTo(newValue, 'fraction');
    }
  };

  const handleSeekMouseUp = (newValue: number) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(newValue, 'fraction');
    }
  };

  const handleProgress = useCallback(({ played }: { played: number }) => {
    if (!seeking) {
      setPlayed(played);
    }
  }, [seeking]);

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoContainerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handlePictureInPicture = async () => {
    try {
      const video = document.querySelector('video');
      if (video) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  const handlePlayerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handlePlayPause();
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      size={modalSize} 
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
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
        <ModalCloseButton 
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
          _active={{ bg: 'whiteAlpha.300' }}
        />
        <ModalBody
          p={4}
          flex="1 1 auto"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          <VStack spacing={4} align="stretch" flex="1" minH="0">
            <Box
              ref={videoContainerRef}
              flex="1"
              minH="0"
              position="relative"
              bg="black"
              borderRadius="md"
              overflow="hidden"
              onClick={handlePlayerClick}
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
                  ref={playerRef}
                  url={video.url}
                  width="100%"
                  height="100%"
                  playing={playing}
                  volume={volume}
                  muted={muted}
                  playbackRate={playbackRate}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  progressInterval={100}
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        playsinline: 1,
                        enablejsapi: 1,
                        origin: window.location.origin,
                        widget_referrer: window.location.origin,
                        iv_load_policy: 3,
                        showinfo: 0
                      },
                      embedOptions: {
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        playsinline: 1,
                        rel: 0
                      }
                    },
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                        disablePictureInPicture: false,
                        style: { pointerEvents: 'none' }
                      }
                    }
                  }}
                  style={{ pointerEvents: 'none' }}
                />
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  onClick={handlePlayerClick}
                  cursor="pointer"
                />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  bg="rgba(0, 0, 0, 0.7)"
                  px={4}
                  py={2}
                  transition="opacity 0.2s"
                  _hover={{ opacity: 1 }}
                  opacity={0.8}
                  onClick={(e) => e.stopPropagation()}
                >
                  <VStack spacing={2}>
                    <Slider
                      aria-label="video-progress"
                      value={played}
                      onChange={handleSeekChange}
                      onChangeEnd={handleSeekMouseUp}
                      min={0}
                      max={1}
                      step={0.001}
                      focusThumbOnChange={false}
                    >
                      <SliderTrack bg="gray.600">
                        <SliderFilledTrack bg="blue.500" />
                      </SliderTrack>
                      <SliderThumb boxSize={3} />
                    </Slider>
                    <HStack width="100%" justify="space-between">
                      <HStack spacing={2}>
                        <IconButton
                          aria-label={playing ? 'Pause' : 'Play'}
                          icon={playing ? <FiPause /> : <FiPlay />}
                          onClick={handlePlayPause}
                          variant="ghost"
                          color="white"
                          size="sm"
                        />
                        <Box position="relative" onMouseLeave={onVolumeClose}>
                          <IconButton
                            aria-label={muted ? 'Unmute' : 'Mute'}
                            icon={muted ? <FiVolumeX /> : <FiVolume2 />}
                            onClick={handleToggleMute}
                            onMouseEnter={onVolumeToggle}
                            variant="ghost"
                            color="white"
                            size="sm"
                          />
                          {isVolumeOpen && (
                            <Box
                              position="absolute"
                              bottom="100%"
                              left="50%"
                              transform="translateX(-50%)"
                              width="32px"
                              height="100px"
                              bg="gray.800"
                              p={2}
                              borderRadius="md"
                              marginBottom={2}
                            >
                              <Slider
                                aria-label="volume"
                                orientation="vertical"
                                min={0}
                                max={1}
                                step={0.1}
                                value={muted ? 0 : volume}
                                onChange={handleVolumeChange}
                              >
                                <SliderTrack bg="gray.600">
                                  <SliderFilledTrack bg="blue.500" />
                                </SliderTrack>
                                <SliderThumb boxSize={2} />
                              </Slider>
                            </Box>
                          )}
                        </Box>
                        <Text color="white" fontSize="sm">
                          {formatTime(played * duration)} / {formatTime(duration)}
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Picture-in-Picture"
                          icon={<FiMonitor />}
                          onClick={handlePictureInPicture}
                          variant="ghost"
                          color="white"
                          size="sm"
                        />
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Playback Speed"
                            icon={<FiSettings />}
                            variant="ghost"
                            color="white"
                            size="sm"
                          />
                          <MenuList>
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <MenuItem
                                key={rate}
                                onClick={() => handlePlaybackRateChange(rate)}
                                bg={playbackRate === rate ? 'blue.500' : undefined}
                              >
                                {rate}x
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                        <IconButton
                          aria-label={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                          icon={fullscreen ? <FiMinimize /> : <FiMaximize />}
                          onClick={toggleFullScreen}
                          variant="ghost"
                          color="white"
                          size="sm"
                        />
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            </Box>
            <Box
              overflowY="auto"
              flex="0 0 auto"
              maxH={{ base: "30vh", md: "20vh" }}
              color="white"
            >
              <Text fontSize="lg" mb={2}>
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