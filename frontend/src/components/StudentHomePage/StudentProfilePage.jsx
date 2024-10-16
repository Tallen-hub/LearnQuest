// StudentProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUser, updateUser } from '../../api';
import {
  Heading,
  Text,
  Input,
  Button,
  FormLabel,
  Textarea,
  Spinner,
  Box,
  Stack,
  Container,
  SimpleGrid,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';

const Blur = (props) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};

const StudentProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUser(id);
        setUser(userData);
        setFormData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, formData);
      // Optionally, display a success message (toast)
    } catch (error) {
      console.error('Error updating profile:', error);
      // Optionally, display an error message (toast)
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box position={'relative'}>
      <Container
        as={SimpleGrid}
        maxW={'7xl'}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}>
        <Stack spacing={{ base: 10, md: 20 }} pl={{ md: '0.12rem', lg: '3.5rem' }} pt={'2.5rem'}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
            <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            >
              Student
            </Text>{' '}
            Profile
          </Heading>
        </Stack>
        <Stack
          bg={'gray.50'}
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
        >
          <form onSubmit={handleSubmit}>
            <Heading as="h2" size="lg" mb={4}>Update Your Profile</Heading>

            <FormLabel htmlFor="name">Name:</FormLabel>
            <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />

            <FormLabel htmlFor="email">Email:</FormLabel>
            <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />

            <FormLabel htmlFor="bio">Bio:</FormLabel>
            <Textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} />

            <FormLabel htmlFor="concerns">Areas of Concern:</FormLabel>
            <Textarea id="concerns" name="concerns" value={formData.concerns || ''} onChange={handleChange} />

            <FormLabel htmlFor="preferredTimes">Preferred Tutoring Times:</FormLabel>
            <Input type="text" id="preferredTimes" name="preferredTimes" value={formData.preferredTimes || ''} onChange={handleChange} />

            <Button type="submit" mt={4} colorScheme="blue">Update Profile</Button>
          </form>
        </Stack>
      </Container>
      <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(70px)' }} />
    </Box>
  );
};

export default StudentProfilePage;