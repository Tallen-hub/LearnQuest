import React, { useState, useEffect } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,  // Imported for use in mobile drawer
  useBreakpointValue,
  VStack,
  Text,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';

import TutorCalendarPage from './TutorCalendarPage';
import TutorMessage from './TutorMessage';
import TutorSchedule from './TutorSchedule';
import TutorAvailability from './TutorAvailability';
import { useParams } from 'react-router-dom';
import { getUser } from '../../api';

const TutorSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();  // Correctly set up useDisclosure
  const btnRef = React.useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });  // Determines if mobile view

  // State to track which view to display
  const [activeView, setActiveView] = useState('home');
  const { id } = useParams(); // Get user ID from the route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUser(id);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
  }, [id]);

  // Function to render different views based on state
  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <TutorCalendarPage />; // Render the CalendarPage component
      case 'schedule':
        return <TutorSchedule />;
      case 'message':
        return <TutorMessage />;
      case 'availability':
        return <TutorAvailability userId={id} />; // Pass userId as a prop
      default:
        return <Text>Welcome to the homepage, {user ? user.name : ''}!</Text>;
    }
  };

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      minHeight="100vh"
      width="100vw"
    >
      {/* Header */}
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} px={4} backgroundColor={'white'}>
        <Heading size="md">Logo</Heading>

        <HStack spacing={4}>
          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              ref={btnRef}
              icon={<HamburgerIcon />}  // Hamburger icon to open the drawer
              variant="ghost"
              aria-label="Open Menu"
              onClick={onOpen}  // Opens the mobile drawer when clicked
            />
          )}

          {/* Notification Icon */}
          <IconButton
            size={'lg'}
            variant={'ghost'}
            aria-label={'notifications'}
            icon={<BellIcon />}
          />

          {/* Profile Dropdown */}
          <Menu>
            <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
              <HStack>
                <Avatar size={'sm'} src={'https://bit.ly/dan-abramov'} />
                <Box display={{ base: 'none', md: 'flex' }}>
                  <ChevronDownIcon />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Layout */}
      <Flex>
        {/* Sidebar (for non-mobile view) */}
        {!isMobile && (
          <Box
            w="250px"
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            borderRight="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            minHeight="calc(100vh - 64px)" // Subtracting height of header
          >
            <VStack align="start" spacing={4}>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('home')}>Home</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('schedule')}>Schedule</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('calendar')}>Calendar</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('message')}>Message</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('availability')}>Availability</Button>
            </VStack>
          </Box>
        )}

        {/* Drawer for Mobile */}
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}  // Closes the mobile drawer
          finalFocusRef={btnRef}
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton color={'black'} />
              <DrawerHeader>Menu</DrawerHeader>

              <DrawerBody>
                <VStack align="start" spacing={4}>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('home')}>Home</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('schedule')}>Schedule</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('calendar')}>Calendar</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('message')}>Message</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('availability')}>Availability</Button>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>

        {/* Right Content Area */}
        <Box flex={1} p={8}>
          {loading ? <Spinner size="xl" /> : renderView()}
        </Box>
      </Flex>
    </Box>
  );
};

export default TutorSideBar;



