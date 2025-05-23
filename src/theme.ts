import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        size: 'lg',
      },
    },
    Text: {
      defaultProps: {
        fontSize: 'lg',
      },
    },
  },
});

export default theme; 