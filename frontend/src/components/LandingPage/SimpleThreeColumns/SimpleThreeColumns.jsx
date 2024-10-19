import React from 'react';
import { Box, SimpleGrid, Text, Stack, Container, Heading } from '@chakra-ui/react'; // Removed Image
import { motion } from 'framer-motion';  // Import Framer Motion


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Feature = ({ number, title, text }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: number * 0.2 }} // Delay for staggered animation
      variants={fadeInUp}  
    >
      <Box
        px={6}
        py={10}
        borderWidth={1}
        borderColor={'#e1e1e1'}
        borderRadius={'md'}
        boxShadow={'md'}
        bg={'white'}
        _hover={{ borderColor: 'pink.300 !important', cursor: 'pointer', transition: 'all 1s', transform: "scale(0.96)" }}
        position={'relative'}
        minH="400px" 
        w="100%" 
      >
        {/* Number box on the top left */}
        <Box
          position={'absolute'}
          top={5}
          left={6}
          bg={'pink.300'}
          color={'white'}
          rounded={'md'}
          w={10}
          h={10}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          fontWeight={'bold'}
          fontSize="24px"
        >
          {number}
        </Box>

        {/* Title and Description */}
        <Stack spacing={4} mt={8}>
          <Text fontWeight={700} fontSize={'2.22em'}>{title}</Text>
          <Text color={'gray.600'} fontSize={'md'}>{text}</Text>
        </Stack>

      </Box>
    </motion.div>
  );
};

const SimpleThreeCards = () => {
  return (
    <Container maxW="container.xl" p={4}>
      <Box marginBottom={4}>
        <Heading
          fontSize={{ base: '3xl', md: '4xl', lg: '4xl' }}
          color="black"
          fontFamily=" 'Platform', 'Platform-fallback', 'Platform-fallback-android', 'Noto Sans', 'NotoSans-fallback', 'NotoSans-fallback-android', sans-serif"
        >
          How Learn Quest works:
        </Heading>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        <Feature
          number={1}
          title={'Sign Up'}
          text={'We’ll connect you with a tutor who will motivate, challenge, and inspire you.'}
        />
        <Feature
          number={2}
          title={'Find A Tutor'}
          text={'Your tutor will guide you through your first lesson and help you plan your next steps.'}
        />
        <Feature
          number={3}
          title={'Schedule a Session'}
          text={'Choose how you want to learn and start excelling in your writing skills.'}
        />
      </SimpleGrid>
    </Container>
  );
};

export default SimpleThreeCards;