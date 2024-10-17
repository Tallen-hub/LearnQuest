import { createUser } from '../../api'; 
import React, { useState } from 'react';
import { Box, Stack, Input, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const StudentSignUpForm = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    // Check if all fields are filled
    if (!user.email || !user.password || !user.firstName || !user.lastName || !user.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill all the required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    // Check if email is valid
    if (!user.email.includes('@')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    // Check if passwords match
    if (user.password !== user.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      // Call API to create user and capture the response
      const response = await createUser({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        password: user.password,
        role: 'student',
      });
  
      if (response.status === 200) {
        const userData = response.data; 
  
        // Clear form and show success
        setUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        toast({
          title: 'Success',
          description: 'Student signed up successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
  
        // Use the insertedId from the response to navigate
        //vhange navigate('/quiz when done)
        navigate(`/student-home/${userData.insertedId}`);
      } else {
        throw new Error('Sign-up failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during sign-up',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Stack spacing={4}>
      <Box mt={1}> 
        <Stack spacing={4}>
          <Input
            placeholder="First name"
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
          />
          <Input
            placeholder="Last name"
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
          />
          <Input
            placeholder="Email"
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
          />
          <Input
            placeholder="Password"
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            type='password'
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
          />
          <Input
            placeholder="Confirm Password"
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            type='password'
            value={user.confirmPassword}
            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
          />
        </Stack>
        <Button
          fontFamily={'heading'}
          mt={8}
          w={'full'}
          bgGradient="linear(to-r, red.400,pink.400)"
          color={'white'}
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </Box>
    </Stack>
  );
};

export default StudentSignUpForm;
