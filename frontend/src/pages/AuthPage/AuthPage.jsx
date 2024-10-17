import React from 'react';
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  SimpleGrid,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';
import AuthForm from '../../components/AuthForm/AuthForm';

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

const JoinOurTeam = () => {
  return (
    <Box position={'relative'}>
      <Container
        as={SimpleGrid}
        maxW={'7xl'}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}>
        <Stack spacing={{ base: 10, md: 20 }} pl={{md: '0.12rem', lg: '3.5rem'}} pt={'2.5rem'}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
              <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
              Unlock
            </Text>{' '} 
            Your Potential On Your Learning Journey{' '}
            <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
              
            </Text>{' '}
            With The Right Tutor As Your Guide
          </Heading>
         
        </Stack>
        <Stack
          bg={'gray.50'}
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          >
          
          <AuthForm />
        </Stack>
      </Container>
      <Blur position={'absolute'} top={-10} left={-10} style={{ filter: 'blur(70px)' }} />
    </Box>
  );
};

const AuthPage = () => {
  return <JoinOurTeam />;
};

export default AuthPage;
