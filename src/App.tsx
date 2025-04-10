import { ChakraProvider, Box, Heading, Flex } from '@chakra-ui/react';
import VideoLibrary from './components/VideoLibrary';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" minH="100vh" h="100vh" maxH="100vh" w="100vw" overflow="hidden" bg="gray.50">
        <Box 
          w="100%" 
          py={4} 
          px={8} 
          bg="blue.500" 
          color="white" 
          position="sticky" 
          top={0} 
          zIndex={10}
          boxShadow="sm"
        >
          <Box maxW="container.xl" mx="auto">
            <Heading size="lg">Driver Training Portal</Heading>
          </Box>
        </Box>
        <Box 
          flex="1" 
          w="100%" 
          overflowY="auto" 
          overflowX="hidden" 
          position="relative"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e0',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#a0aec0',
            },
          }}
        >
          <VideoLibrary />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
