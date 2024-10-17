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
import { getUser, logoutUser } from '../../api';
import { useNavigate } from 'react-router-dom';
import TutorOrders from './TutorOrders';

const TutorSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();  // Correctly set up useDisclosure
  const btnRef = React.useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });  // Determines if mobile view

  // State to track which view to display
  const [activeView, setActiveView] = useState('home');
  const { id } = useParams(); // Get user ID from the route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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


  // Function to handle logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem('userToken');
      navigate('/auth');
      await logoutUser();

    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, display an error message to the user using a toast or alert
    }
  };

  // Function to render different views based on state
  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <TutorCalendarPage />; // Render the CalendarPage component
      case 'schedule':
        return <TutorSchedule userId={id} />;
      case 'message':
        return <TutorMessage />;
      case 'availability':
        return <TutorAvailability userId={id} />; // Pass userId as a prop
      case 'orders':
        return <TutorOrders userId={id} />;
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
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('orders')}>Orders</Button>
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
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('orders')}>Orders</Button>
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

/* 
how i would like the frontend to look:
import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
  Divider,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const StudentSchedule = () => {
  // Updated list of tutors
  const tutors = [
    {
      name: 'Jordan B',
      email: 'jordanb@example.com',
      rating: 4.5,
      avatar: 'https://bit.ly/dan-abramov',
    },
    {
      name: 'Taylor S',
      email: 'taylors@example.com',
      rating: 4.0,
      avatar: 'https://bit.ly/prosper-baba',
    },
    {
      name: 'Chris M',
      email: 'chrism@example.com',
      rating: 4.7,
      avatar: 'https://bit.ly/ryan-florence',
    },
    {
      name: 'Alex P',
      email: 'alexp@example.com',
      rating: 4.8,
      avatar: 'https://bit.ly/code-beast',
    },
  ];

  const [visibleTutors, setVisibleTutors] = useState(2);

  const loadMoreTutors = () => {
    setVisibleTutors((prev) => Math.min(prev + 2, tutors.length));
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="md" shadow="md">
      <Heading size="lg" mb={6}>
        Recommended Tutors
      </Heading>

      {/* Display only the number of tutors controlled by visibleTutors */
/*{tutors.slice(0, visibleTutors).map((tutor, index) => (
  <Box key={index} mb={4} p={4} bg="white" borderRadius="md" shadow="sm">
    {/* Tutor Profile */
/*<HStack align="center" spacing={4}>
  <Avatar size={'lg'} src={tutor.avatar} />
  <VStack align="start" spacing={1}>
    <Text fontSize="lg" fontWeight="bold">{tutor.name}</Text>
    <Text fontSize="sm" color="gray.500">{tutor.email}</Text>
    <HStack>
      {Array(5)
        .fill('')
        .map((_, i) => (
          <StarIcon
            key={i}
            color={i < Math.floor(tutor.rating) ? 'yellow.400' : 'gray.300'}
            boxSize={4}
          />
        ))}
      <Text fontSize="sm">({tutor.rating})</Text>
    </HStack>
  </VStack>
</HStack>

{/* Book Now Button */
/*<Flex justify="end" mt={2}>
  <Button colorScheme="green" size="sm">
    Book Now
  </Button>
</Flex>

<Divider mt={3} />
</Box>
))}

{/* "Load More" button if there are more tutors to display */
/*{visibleTutors < tutors.length && (
  <Button mt={4} colorScheme="blue" onClick={loadMoreTutors}>
    View More Tutors
  </Button>
)}
</Box>
);
};

export default StudentSchedule;
*/


