import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Collapse,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom'; // Import Link for navigation
import learnquestlogo from '../../../assets/learnquestlogo.png'; // Corrected import

const Navigation = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg="gray.50"  // Matching the background color of the AuthPage
        color="gray.700"  // Text color consistent with AuthPage
        py={{ base: 2 }}
        px={{ base: 4 }}
        align="center"
        justify="space-between"
        borderBottom={0}
        width="100%"
        position="relative"
        zIndex={1}
      >
        {/* Mobile Menu Button */}
        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
            _hover={{ bg: 'none' }}
          />
        </Flex>

        {/* Logo Image */}
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} align="center">
          <Image src={learnquestlogo} alt="Learn Quest Logo" maxH="70px" maxW="200px" objectFit="contain" />
        </Flex>

        {/* Sign In / Sign Up Buttons */}
        <Stack flex={{ base: 1, md: 0 }} justify="flex-end" direction="row" spacing={6}>
          {/* Updated Sign In Button */}
          <Button
            as={Link}
            to="/auth"
            fontSize="sm"
            fontWeight={400}
            variant="link"
            color="gray.600"  // Matching the gray tone of the AuthPage
            _hover={{ color: 'pink.400' }}  // Hover effect matching AuthPage
          >
            Sign In
          </Button>
          {/* Updated Sign Up Button */}
          <Button
            as={Link}
            to="/auth"
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="red.400"  // Matching the red tone of AuthPage buttons
            _hover={{ bg: 'pink.400' }}  // Matching the hover style of AuthPage buttons
          >
            Sign Up
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack bg="gray.50" p={4} display={{ md: 'none' }}> {/* Consistent background color */}
      {/* Mobile navigation items go here */}
    </Stack>
  );
};

export default Navigation;
