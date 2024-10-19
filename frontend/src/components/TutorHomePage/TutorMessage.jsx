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
  { name: 'Jane Doe', message: 'I completed the homework!', time: '1 Min' },
  { name: 'Sam Lee', message: 'I’m struggling with chapter 3...', time: '5 Min' },
  { name: 'Paul Baker', message: 'Can we reschedule our session?', time: '30 Min' },
  { name: 'Emma Clark', message: 'Thanks for the feedback!', time: '1 hour' },
  { name: 'Mike Thompson', message: 'I have a few questions about the assignment.', time: '3 hours' },
  { name: 'Sophie Turner', message: 'The session was super helpful!', time: '1 days' },
  { name: 'Tom Holland', message: 'Could you review my essay?', time: '2 days' },
];

const chatMessages = [
  { sender: 'Jane Doe', message: 'I’ve just finished the homework you gave me. Can you check it?', time: '10:30 am', self: false },
  { sender: 'Tutor', message: 'Sure! I’ll review it and get back to you by tomorrow.', time: '10:35 am', self: true },
  { sender: 'Jane Doe', message: 'Thanks so much! I found today’s session really helpful.', time: '10:40 am', self: false },
  { sender: 'Tutor', message: 'Glad to hear that! Keep practicing and you’ll see even more improvement.', time: '10:45 am', self: true },
  { sender: 'Jane Doe', message: 'I will, thanks again!', time: '10:50 am', self: false },
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
        <Input placeholder="Search students..." variant="outline" border="none" fontWeight="bold" />
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
      <Avatar name="Jane Doe" />
      <VStack align="start" spacing={0}>
        <Text fontWeight="bold">Jane Doe</Text>
        <Text fontSize="sm" color="gray.500">Student</Text>
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

const TutorMessage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false }); // Detect screen size

  return (
    <Flex h="100vh">
      {!isMobile && <ConversationList />} {/* Only show the conversation list on larger screens */}
      <ChatWindow />
    </Flex>
  );
};

export default TutorMessage;
