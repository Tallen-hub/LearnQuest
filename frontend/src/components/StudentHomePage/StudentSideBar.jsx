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
  Image, // Import the Image component
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
import untitledDesign from '../../assets/Untitled design.png'; // Import the Untitled design image
import StudentCalendarPage from './StudentCalendarPage';
import StudentMessage from './StudentMessage';
import StudentSchedule from './StudentSchedule';
import Orders from './Orders';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, logoutUser } from '../../api';

const StudentSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [activeView, setActiveView] = useState('home');

  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const userData = await getUser(id); 
        setUser(userData); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }
    fetchStudentData();
  }, [id]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      localStorage.removeItem('userToken');
      navigate('/auth');
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <StudentCalendarPage />;
      case 'schedule':
        return <StudentSchedule />;
      case 'message':
        return <StudentMessage />; 
      case 'orders':
        return <Orders />;
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
        {/* Replace the heading with the Untitled design logo */}
        <Image
          src={untitledDesign}
          alt="Untitled Design Logo"
          sx={{
            cursor: "pointer",
            width: "204px",   // Set width to 204px
            height: "46px",   // Set height to 46px
            display: { base: "none", md: "block" },  // Hide on small screens
          }}
        />

        <HStack spacing={4}>
          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              ref={btnRef}
              icon={<HamburgerIcon />} 
              variant="ghost"
              aria-label="Open Menu"
              onClick={onOpen}  
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
                <Avatar
                  size={'sm'}
                  src={user && user.profilePicUrl ? user.profilePicUrl : undefined}
                  name={user ? user.name : ''} 
                />
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
            minHeight="calc(100vh - 64px)" 
          >
            <VStack align="start" spacing={4}>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('home')}>Home</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('schedule')}>Book a Session</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('calendar')}>My Calendar</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('message')}>Inbox</Button>
              <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('orders')}>Bookings</Button>
            </VStack>
          </Box>
        )}

        {/* Drawer for Mobile */}
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}  
          finalFocusRef={btnRef}
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton color={'black'} />
              <DrawerHeader>Menu</DrawerHeader>

              <DrawerBody>
                <VStack align="start" spacing={4}>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('home')}>Home</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('schedule')}>Book a Sessions</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('calendar')}>Session Calendar</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('message')}>Inbox</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('orders')}>Bookings</Button>
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

export default StudentSideBar;

