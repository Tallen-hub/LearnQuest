import React from 'react';
import { Box, Grid, GridItem, Text, Button, Image, Stack } from '@chakra-ui/react';
import { motion } from 'framer-motion'; 
import tutorImage from '../../../assets/clay-elliot-mpDV4xaFP8c-unsplash.jpg';

const BecomeaTutor = () => {
  return (
    <Box p={8} bg="gray.50"> {/* Match the background color of the AuthForm */}
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          alignItems="stretch" 
          gap={0} 
          maxW="1200px"
          mx="auto"
          borderTopRightRadius="0px !important" 
          borderBottomRightRadius="0px !important"
        >
          {/* Left side image */}
          <GridItem>
            <Image
              src={tutorImage}
              alt="Tutor"
              borderRadius="md"
              boxShadow="lg"
              height="100%" 
              objectFit="cover"
              borderTopRightRadius="0px !important" 
              borderBottomRightRadius="0px !important"
            />
          </GridItem>

          {/* Right side content */}
          <GridItem 
            bg="red.400"  /* Matching the red tone of the AuthForm */
            p={12} 
            borderTopLeftRadius="0px !important" 
            borderBottomLeftRadius="0px !important" 
            borderRadius="md" 
            boxShadow="lg" 
            height="100%" 
            display="flex" 
            flexDirection="column" 
            justifyContent="center"
          >
            <Text
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }} /* Font size adjusted to match AuthForm */
              fontWeight="bold"
              color="white"  /* White text for contrast */
              mb={4}
            >
              Become a tutor
            </Text>

            <Text fontSize="lg" color="white" mb={4}>
              Earn money sharing your expert knowledge with students. Sign up to start tutoring online.
            </Text>

            <Stack spacing={3} mb={6} color="white">
              <Text fontWeight="bold" fontSize="22px">• Find new students</Text>
              <Text fontWeight="bold" fontSize="22px">• Grow your business</Text>
              <Text fontWeight="bold" fontSize="22px">• Get paid securely</Text>
            </Stack>

            <Button colorScheme="teal" bg="gray.800" color="white" width="300px" size="lg" _hover={{ bg: 'gray.700' }} rightIcon={<span>→</span>}>
              Become a tutor
            </Button>

            <Text mt={4} color="white">
              How our platform works
            </Text>
          </GridItem>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default BecomeaTutor;

