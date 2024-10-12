import React, { useState } from 'react';
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

// Import CalendarPage component
import StudentCalendarPage from './StudentCalendarPage';
import StudentSchedule from './StudentSchedule';
// Dummy components for Schedule and Message

const Message = () => <Text>Message View</Text>;

const StudentSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // State to track which view to display
  const [activeView, setActiveView] = useState('home');

  // Function to render different views based on state
  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <StudentCalendarPage />; // Render the CalendarPage component
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
        {/* Sidebar */}
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
          {/* Render the current active view */}
          {renderView()}
        </Box>
      </Flex>
    </Box>
  );
};

export default StudentSideBar;