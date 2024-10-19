import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SearchIcon, AttachmentIcon } from '@chakra-ui/icons';

const conversations = [
  { name: 'Mr. John', message: 'Great progress on your math!', time: '1 Min' },
  { name: 'Ms. Sarah', message: 'Remember to complete the exercises...', time: '2 Min' },
  { name: 'Dr. Lee', message: 'Let’s go over your essay during the session', time: '35 Min' },
  { name: 'Ms. Tina', message: 'Keep practicing those coding problems!', time: '35 Min' },
  { name: 'Mr. Adam', message: 'Good work on the geometry homework.', time: '12 hours' },
  { name: 'Ms. Jasmine', message: 'So tell the voice inside your mind...', time: '1 days' },
  { name: 'Mr. Parker', message: 'Great improvement in your test scores!', time: '2 days' },
];

const chatMessages = [
  { sender: 'Mr. John', message: 'Great progress on your math problems today!', time: '11:25 am', self: false },
  { sender: 'Student', message: 'Thank you! I found your explanations really helpful.', time: '11:30 am', self: true },
  { sender: 'Mr. John', message: 'Could you complete the practice set before our next session?', time: '11:45 pm', self: false },
  { sender: 'Student', message: 'Sure! I’ll send it over once done.', time: '12:00 pm', self: true },
  { sender: 'Mr. John', message: 'Awesome! Keep it up :)', time: '12:02 pm', self: false },
];

const ConversationList = () => {
  return (
    <VStack
      p={4}
      w="30%"
      h="100vh"
      bg="gray.100"
      spacing={4}
      overflowY="auto"
    >
      {/* Enhanced Search Bar */}
      <Flex w="full" alignItems="center" bg="white" p={2} borderRadius="lg" boxShadow="sm" mb={4}>
        <Input placeholder="Search tutors..." variant="outline" border="none" fontWeight="bold" />
        <IconButton icon={<SearchIcon />} aria-label="Search" variant="ghost" />
      </Flex>
      
      {conversations.map((conv, idx) => (
        <HStack key={idx} p={3} bg="white" w="full" borderRadius="lg" _hover={{ bg: 'gray.200' }}>
          <Avatar name={conv.name} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold">{conv.name}</Text>
            <Text fontSize="sm" color="gray.500">{conv.message}</Text>
          </VStack>
          <Spacer />
          <Text fontSize="xs" color="gray.400">{conv.time}</Text>
        </HStack>
      ))}
    </VStack>
  );
};

const ChatWindow = () => (
  <VStack
    flex={1}
    h="100vh"
    bg="white"
    p={6}
    spacing={4}
  >
    <HStack w="full" spacing={4}>
      <Avatar name="Mr. John" />
      <VStack align="start" spacing={0}>
        <Text fontWeight="bold">Mr. John</Text>
        <Text fontSize="sm" color="gray.500">Math Tutor</Text>
      </VStack>
      <Spacer />
      {/* Optional Action Icons */}
      <IconButton icon={<AttachmentIcon />} aria-label="Attachment" />
    </HStack>

    <VStack
      flex={1}
      w="full"
      spacing={4}
      overflowY="auto"
      mt={4}
      mb={4}
    >
      {chatMessages.map((msg, idx) => (
        <Flex key={idx} w="full" justify={msg.self ? 'flex-end' : 'flex-start'}>
          <Box
            bg={msg.self ? 'blue.400' : 'gray.200'}
            color={msg.self ? 'white' : 'black'}
            p={3}
            borderRadius="md"
            maxW="70%"
          >
            {msg.message}
          </Box>
        </Flex>
      ))}
    </VStack>

    {/* Chat Input Area */}
    <HStack w="full" spacing={4}>
      <Input placeholder="Write something..." />
      <IconButton icon={<AttachmentIcon />} aria-label="Attach" />
      <Button colorScheme="blue">Send</Button>
    </HStack>
  </VStack>
);

const StudentMessage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false }); // Detect screen size

  return (
    <Flex h="100vh">
      {!isMobile && <ConversationList />} {/* Only show the conversation list on larger screens */}
      <ChatWindow />
    </Flex>
  );
};

export default StudentMessage;

