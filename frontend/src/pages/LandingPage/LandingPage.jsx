import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import Navigation from '../../components/LandingPage/Navigation/Navigation'
import Hero from '../../components/LandingPage/Hero/Hero'
import BecomeaTutor from '../../components/LandingPage/BecomeaTutor/BecomeaTutor'
import Footer from '../../components/LandingPage/Footer/Footer'
import SimpleThreeColumns from '../../components/LandingPage/SimpleThreeColumns/SimpleThreeColumns'
import SubjectsSection from '../../components/LandingPage/SubjectsSection/SubjectsSection'
import Testimonials from '../../components/LandingPage/TestimonialsSection/Testimonials'
const LandingPage = () => {
  return (
    <Box>
      <Navigation />

      {/* Hero Section */}
      <Box>
        <Hero />
      </Box>

      {/* Subjects Section */}
      <Box >
        <SubjectsSection />
      </Box>

      {/* Three Column Grid */}
      <Box mb={6}>
        <SimpleThreeColumns />
      </Box>

      {/* Testimonials Section */}
      <Box mb={6}>
        <Text>Testimonials Section</Text>
        <Testimonials />
      </Box>

      {/* Promo Section */}
      <Box
  bg="red.400"  
  p={10}
  borderRadius="lg"
  textAlign="center"
  maxW="1000px"
  mx="auto"
  mt={6}
>
  <Text fontSize="3xl" fontWeight="bold" color="white">  {/* White text for contrast */}
    Lessons you’ll love. Guaranteed.
  </Text>
  <Text fontSize="lg" color="white" mt={2}>  {/* White text for subtitle */}
    Try another tutor for free if you’re not satisfied.
  </Text>
</Box>


      {/* Become a Tutor Section */}
      <Box>
        <BecomeaTutor />
      </Box>

      {/* Footer Section */}
      <Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default LandingPage;
