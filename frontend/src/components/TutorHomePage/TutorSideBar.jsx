// TutorSideBar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
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
  useDisclosure,
  useBreakpointValue,
  VStack,
  Text,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, logoutUser } from '../../api';

// Import other components
import TutorCalendarPage from './TutorCalendarPage';
import TutorMessage from './TutorMessage';
import TutorSchedule from './TutorSchedule';
import TutorAvailability from './TutorAvailability';

const TutorSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State to track which view to display
  const [activeView, setActiveView] = useState('home');

  // Call useColorModeValue unconditionally at the top level
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const sidebarBgColor = useColorModeValue('white', 'gray.800');
  const sidebarBorderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUser(id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [id]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('userToken');
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
      // Consider adding error handling (e.g., a toast) for the user here
    }
  };

  // Function to render different views based on state
  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <TutorCalendarPage />;
      case 'schedule':
        return <TutorSchedule />;
      case 'message':
        return <TutorMessage />;
      case 'availability':
        return <TutorAvailability userId={id} />;
      default:
        return <Text>Welcome to the homepage, {user ? user.name : ''}!</Text>;
    }
  };

  return (
    <Box
      bg={bgColor}
      minHeight="100vh"
      width="100vw"
    >
      {/* Header */}
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'} px={4} backgroundColor={'white'}>
        <Heading size="md">Logo</Heading>

        <HStack spacing={4}>
          {isMobile && (
            <IconButton
              ref={btnRef}
              icon={<HamburgerIcon />}
              variant="ghost"
              aria-label="Open Menu"
              onClick={onOpen}
            />
          )}

          <IconButton
            size={'lg'}
            variant={'ghost'}
            aria-label={'notifications'}
            icon={<BellIcon />}
          />

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
              <MenuItem as={Link} to={`/tutor-profile/${id}`}>Profile</MenuItem> {/* Link to TutorProfilePage */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Flex>
        {!isMobile && (
          <Box
            w="250px"
            bg={sidebarBgColor}
            p={4}
            borderRight="1px solid"
            borderColor={sidebarBorderColor}
            minHeight="calc(100vh - 64px)"
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

        {/* ... (rest of your component code - Drawer and Right Content Area) ... */}
      </Flex>
    </Box>
  );
};

export default TutorSideBar;