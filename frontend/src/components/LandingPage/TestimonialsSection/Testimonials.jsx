import React from 'react';
import {
  Avatar,
  Box,
  chakra,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';

const testimonials = [
  {
    name: 'Emily S.',
    role: 'High School Student',
    content:
      'Learn Quest helped me improve my grades in math! My tutor was patient and explained concepts in a way that finally made sense to me. I went from struggling to getting A’s!',
    avatar:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
  },
  {
    name: 'David R.',
    role: 'Parent',
    content:
      "I couldn't be happier with the progress my daughter made after using Learn Quest. Her confidence has soared, and she's now ahead of her class in science. The platform is easy to use and the tutors are excellent.",
    avatar:
      'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
  },
  {
    name: 'Sarah P.',
    role: 'College Student',
    content:
      "Thanks to Learn Quest, I was able to get the help I needed with my college essays. My tutor gave me great feedback and helped me improve my writing skills. Now, I feel much more confident submitting my papers.",
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80',
  },
  {
    name: 'Lucas M.',
    role: 'High School Tutor',
    content:
      "As a tutor, I love using Learn Quest. It makes scheduling sessions and communicating with students so easy. I've been able to help more students excel in their subjects, and the platform is fantastic for both students and tutors.",
    avatar:
      'https://images.unsplash.com/photo-1606513542745-97629752a13b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80',
  },
];

const TestimonialCard = ({ name, role, content, avatar }) => {
  return (
    <Flex
      boxShadow={'lg'}
      maxW={'640px'}
      direction={{ base: 'column-reverse', md: 'row' }}
      width={'full'}
      rounded={'xl'}
      p={8}  
      justifyContent={'space-between'}
      position={'relative'}
      bg={'white'}  
      _hover={{ shadow: "xl", bg: "gray.50" }}  
      transition="background 0.3s ease"
    >
      <Flex direction={'column'} textAlign={'left'} justifyContent={'space-between'}>
        <chakra.p  fontWeight={'medium'} fontSize={'md'} pb={4} color="gray.700">  {/* Updated font to match AuthForm */}
          {content}
        </chakra.p>
        <chakra.p  fontWeight={'bold'} fontSize={'lg'} color="red.400">  {/* Name and role styling */}
          {name}
          <chakra.span  fontWeight={'medium'} color={'gray.500'}>
            {' '} - {role}
          </chakra.span>
        </chakra.p>
      </Flex>
      <Avatar
        src={avatar}
        height={'80px'}
        width={'80px'}
        alignSelf={'center'}
        m={{ base: '0 0 35px 0', md: '0 0 0 50px' }}
      />
    </Flex>
  );
};

const Testimonials = () => {
  return (
    <Flex
      textAlign={'center'}
      pt={10}
      justifyContent={'center'}
      direction={'column'}
      width={'full'}
      overflow={'hidden'}
      bg="gray.50"  
    >
      <Box width={{ base: 'full', sm: 'lg', lg: 'xl' }} margin={'auto'}>
        <chakra.h3

          fontWeight={'bold'}
          fontSize={20}
          textTransform={'uppercase'}
          color={'red.400'} 
        >
          What students and parents say
        </chakra.h3>
        <chakra.h1
          py={5}
          fontSize={36}  
          fontWeight={'bold'}
          color={useColorModeValue('gray.700', 'gray.50')}
        >
          Success stories from our tutoring platform
        </chakra.h1>
        <chakra.h2
          margin={'auto'}
          width={'70%'}
          
          fontWeight={'medium'}
          color={useColorModeValue('gray.500', 'gray.400')}
        >
          Hear how students improved their grades and parents found the perfect tutors for their children using Learn Quest.
        </chakra.h2>
      </Box>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={'20'} mt={16} mb={16} mx={'auto'}>
        {testimonials.map((cardInfo, index) => (
          <TestimonialCard key={index} {...cardInfo} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default Testimonials;


