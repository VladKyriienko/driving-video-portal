import { ChakraProvider, Box, Heading } from '@chakra-ui/react';
import VideoLibrary from './components/VideoLibrary';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        <Box p={4} bg="blue.500" color="white">
          <Heading size="lg">Driver Training Portal</Heading>
        </Box>
        <Box maxW="1200px" mx="auto" p={4}>
          <VideoLibrary />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
