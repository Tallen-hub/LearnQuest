import React from 'react';
import { Box, SimpleGrid, Text, Flex, Icon, Container, Stack } from '@chakra-ui/react';
import {
  FaChevronRight, FaBookOpen, FaCalculator, FaLanguage, FaGlobe, FaMicroscope, FaHistory,
  FaAtom, FaChalkboardTeacher, FaPaintBrush, FaMusic, FaDesktop, FaDumbbell, FaFlask, FaDollarSign
} from 'react-icons/fa';
import { motion } from 'framer-motion';  

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const subjects = [
  { title: 'English', teachers: '26,718 teachers', icon: FaBookOpen },
  { title: 'Mathematics', teachers: '8,860 teachers', icon: FaCalculator },
  { title: 'Science', teachers: '12,004 teachers', icon: FaMicroscope },
  { title: 'History', teachers: '9,274 teachers', icon: FaHistory },
  { title: 'Geography', teachers: '4,112 teachers', icon: FaGlobe },
  { title: 'Physics', teachers: '5,892 teachers', icon: FaAtom },
  { title: 'Chemistry', teachers: '4,672 teachers', icon: FaFlask },
  { title: 'Biology', teachers: '6,893 teachers', icon: FaMicroscope },
  { title: 'Languages', teachers: '10,538 teachers', icon: FaLanguage },
  { title: 'Music', teachers: '3,764 teachers', icon: FaMusic },
  { title: 'Art', teachers: '2,310 teachers', icon: FaPaintBrush },
  { title: 'Computer Science', teachers: '7,293 teachers', icon: FaDesktop },
  { title: 'Physical Education', teachers: '1,834 teachers', icon: FaDumbbell },
  { title: 'Economics', teachers: '2,978 teachers', icon: FaDollarSign },
  { title: 'General Studies', teachers: '15,203 teachers', icon: FaChalkboardTeacher }
];

const SubjectsSection = () => {
  return (
    <Container maxW="container.xl" py={8} bg="gray.50"> {/* Matching the background color of AuthPage */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }} 
            variants={fadeInUp}  
          >
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              _hover={{ shadow: "lg", bg: "red.400", color: "white" }}  
              cursor="pointer"
              transition="background 0.3s ease"
            >
              <Flex alignItems="center" justifyContent="space-between">
                <Stack direction={'row'} spacing={4} align={'center'}>
                  <Icon as={subject.icon} w={8} h={8} color="red.400" />  {/* Matching icon color */}
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" color="gray.700">{subject.title}</Text>  {/* Matching text color */}
                    <Text color="gray.500" fontSize="sm">{subject.teachers}</Text>
                  </Box>
                </Stack>
                <Icon as={FaChevronRight} color="gray.400" />
              </Flex>
            </Box>
          </motion.div>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default SubjectsSection;
