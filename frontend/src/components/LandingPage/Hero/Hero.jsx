import React from 'react';
import {
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Button,
  Box,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaBook, FaChalkboardTeacher, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HeroStudent from "../../../assets/HeroStudent.png";

const Hero = () => {
  return (
    <Box bg="gray.50" minH="80vh" width="100%" position="relative">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        px={8}
        py={12}
        height="100%"
        minH="80vh"
      >
        {/* Text Section */}
        <Stack spacing={6} maxW="lg" flex={1}>
          <Text fontSize="22px" color="gray.500" fontWeight="700">
            Hi, there!
          </Text>
          <Heading
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} 
            fontWeight="bold"
            lineHeight={1.1}
            color="gray.700">
            <Text as="span" color="red.400" bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
              LEARN QUEST
            </Text>{' '}
            IS HERE TO HELP YOU EXCEL
          </Heading>
          <Text fontSize="20px" color="gray.600">
            We provide the best resources and tutoring services to help you succeed in your academic journey.
          </Text>
          <Link to="/auth">
            <Button
              size="lg"
              bg="red.400"
              color="white"
              _hover={{ bg: "pink.400" }}>
              Get Started
            </Button>
          </Link>
        </Stack>

        {/* Image Section */}
        <Box flex={1} position="relative" display="flex" justifyContent="center" maxW="50%">
          <Image
            src={HeroStudent}
            alt="Hero Student Image"
            objectFit="contain"
            maxW="100%"
            zIndex="2"
          />
          {/* Decorative shapes behind the image */}
          <Box
            position="absolute"
            top="0"
            right="0"
            width="250px"
            height="250px"
            bg="red.400"
            borderRadius="full"
            zIndex="1"
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            width="200px"
            height="200px"
            bg="pink.400"
            borderRadius="full"
            zIndex="1"
          />
        </Box>
      </Flex>

      {/* Service Section Below */}
      <SimpleGrid columns={3} spacing={6} mt={8} px={8}>
        <Box textAlign="center">
          <Icon as={FaBook} color="red.400" boxSize={10} />
          <Heading fontSize="lg" mt={4} color="gray.700">
            Personalized Tutoring
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Get one-on-one tutoring sessions tailored to your needs.
          </Text>
        </Box>

        <Box textAlign="center">
          <Icon as={FaChalkboardTeacher} color="red.400" boxSize={10} />
          <Heading fontSize="lg" mt={4} color="gray.700">
            Expert Tutors
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Learn from certified and experienced tutors in various subjects.
          </Text>
        </Box>

        <Box textAlign="center">
          <Icon as={FaClock} color="red.400" boxSize={10} />
          <Heading fontSize="lg" mt={4} color="gray.700">
            Flexible Scheduling
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Choose the time that fits your schedule, anytime, anywhere.
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default Hero;

