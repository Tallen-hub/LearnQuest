// StudentSideBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
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
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom'; 
import { logoutUser } from '../../api'; 

import StudentCalendarPage from './StudentCalendarPage';
import StudentSchedule from './StudentSchedule';

const Message = () => <Text>Message View</Text>;

const StudentSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  // State to track which view to display
  const [activeView, setActiveView] = useState('home');

  // Call useColorModeValue unconditionally at the top level
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const sidebarBgColor = useColorModeValue('white', 'gray.800');
  const sidebarBorderColor = useColorModeValue('gray.200', 'gray.700');

  // Get the student's ID (assuming it's in the URL)
  const { id } = useParams(); 

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('userToken');
      navigate('/auth');
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, display an error message to the user using a toast or alert
    }
  };

  // Function to render different views based on state
  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <StudentCalendarPage />;
      case 'schedule':
        return <StudentSchedule />;
      case 'message':
        return <Message />;
      default:
        return <Text>Welcome to the homepage!</Text>;
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
              <MenuItem as={Link} to={`/student-profile/${id}`}>Profile</MenuItem> 
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Layout */}
      <Flex>
        {/* Sidebar */}
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
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('schedule')}>Schedule</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('calendar')}>Calendar</Button>
                  <Button w="100%" justifyContent="flex-start" onClick={() => setActiveView('message')}>Message</Button>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>

        {/* Right Content Area */}
        <Box flex={1} p={8}>
          {renderView()}
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentSideBar;