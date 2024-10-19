import React, { useState, useEffect } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  useToast,
  Input,
  Select,
} from '@chakra-ui/react';
import { getAvailableTutors, bookTutorSlot } from '../../api'; 
import { useParams } from 'react-router-dom';
import { StarIcon } from '@chakra-ui/icons'; 

const timeOptions = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
];

const getEndTime = (startTime) => {
  const index = timeOptions.indexOf(startTime);
  if (index >= 0 && index < timeOptions.length - 1) {
    return timeOptions[index + 1];
  }
  return '10:00 PM'; // Default for the last slot
};

const getCurrentDay = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  return days[today];
};

const StudentSchedule = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeId, setSelectedTimeId] = useState('');
  const [tutors, setTutors] = useState([]); 
  const [visibleTutors, setVisibleTutors] = useState(2);
  const [showAllDays, setShowAllDays] = useState([]); // Track if full availability should be shown for each tutor
  const [showMoreTimeSlots, setShowMoreTimeSlots] = useState([]); // Track if more time slots are shown
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const toast = useToast();

  const currentDay = getCurrentDay();

  useEffect(() => {
    setUserId(id);
  }, [id]);

  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      const availableTutors = await getAvailableTutors();
      if (availableTutors) {
        setTutors(availableTutors);
        setShowAllDays(availableTutors.map(() => false)); // Default to not showing all days
        setShowMoreTimeSlots(availableTutors.map(() => false)); // Default to not showing all time slots
      }
      setLoading(false);
    }
    fetchTutors();
  }, []);

  const handleTimeClick = (tutor, time, id) => {
    console.log('Selected Tutor:', tutor);
    console.log('Selected Time:', time);
    console.log('Selected Time ID:', id);
  
    setSelectedTutor(tutor);
    setSelectedTime(time); 
    setSelectedTimeId(id);
    onOpen(); 
  };
  

  const confirmBooking = async () => {
    try {
      setLoading(true);
      const endTime = getEndTime(selectedTime); 
      const response = await bookTutorSlot(selectedTimeId, userId, selectedTutor.tutorInfo._id);
      
      setLoading(false);
      toast({
        title: 'Booking confirmed!',
        description: `You have booked a session with ${selectedTutor.tutorInfo.name} from ${selectedTime} to ${endTime}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose(); 
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Booking failed!',
        description: error.response.data.message || 'There was an issue confirming your booking.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = tutor.tutorInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? tutor.selectedSubjects.includes(selectedSubject) : true;
    return matchesSearch && matchesSubject;
  });

  const toggleShowMoreDays = (index) => {
    const updatedShowAllDays = [...showAllDays];
    updatedShowAllDays[index] = !updatedShowAllDays[index]; // Toggle visibility of all days for the tutor
    setShowAllDays(updatedShowAllDays);
  };

  const toggleShowMoreTimeSlots = (index) => {
    const updatedShowMoreTimeSlots = [...showMoreTimeSlots];
    updatedShowMoreTimeSlots[index] = !updatedShowMoreTimeSlots[index]; // Toggle visibility of all time slots
    setShowMoreTimeSlots(updatedShowMoreTimeSlots);
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={6}>
        Recommended Tutors
      </Heading>

      <Input
        placeholder="Search tutor by name"
        mb={4}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select
        placeholder="All Subjects"
        mb={4}
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Biology">Biology</option>
      </Select>

      {loading ? (
        <Spinner />
      ) : filteredTutors.length === 0 ? (
        <Text>No tutors available.</Text>
      ) : (
        filteredTutors.slice(0, visibleTutors).map((tutor, index) => (
          <Box key={tutor._id} mb={4} pb={2} borderWidth={1} borderRadius="md" p={4}>
            <HStack align="center" spacing={3}>
              <Avatar size="lg" name={tutor.tutorInfo.name} />
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">{tutor.tutorInfo.name}</Text>
                <HStack>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} color="yellow.400" />
                  ))}
                </HStack>
                <Text fontSize="sm" color="gray.500">{tutor.selectedSubjects.join(', ')}</Text>
              </VStack>
            </HStack>

            <Flex direction="column" mt={2}>
  {(showAllDays[index] ? tutor.availability : tutor.availability.filter(day => day.day === currentDay)).map((dayAvailability, dayIndex) => (
    <Box key={dayIndex} mb={2}>
      <Text fontSize="sm" fontWeight="bold">{dayAvailability.day}</Text>
      <Flex wrap="wrap" justifyContent="flex-start" alignItems="center" maxW="full">
        {(showMoreTimeSlots[index] ? timeOptions : timeOptions.slice(0, 31)).map((time, slotIdx) => (
          <Button
            key={slotIdx}
            size="xs"
            m={1}
            minW="75px"  // Ensure minimum width for uniform size
            disabled={dayAvailability.slots.some(slot => slot.isBooked && slot.start === time)}
            colorScheme="blue"
            onClick={() => handleTimeClick(tutor, time, dayAvailability.slots[slotIdx]?.id)}
          >
            {time}
          </Button>
        ))}
        {dayAvailability.slots.length > 4 && (
          <Button size="xs" m={1} variant="outline" colorScheme="blue" onClick={() => toggleShowMoreTimeSlots(index)}>
            {showMoreTimeSlots[index] ? 'Show Less' : 'View More'}
          </Button>
        )}
      </Flex>
    </Box>
              ))}
              {!showAllDays[index] && (
                <Button size="xs" m={1} variant="outline" colorScheme="blue" onClick={() => toggleShowMoreDays(index)}>
                  View More Days
                </Button>
              )}
              {showAllDays[index] && (
                <Button size="xs" m={1} variant="outline" colorScheme="blue" onClick={() => toggleShowMoreDays(index)}>
                  Show Less
                </Button>
              )}
            </Flex>

            <Divider mt={2} />
          </Box>
        ))
      )}

      <Button mt={4} colorScheme="blue" onClick={() => setVisibleTutors((prev) => prev + 2)}>
        View More Tutors
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTutor && (
              <Text>
                Booking session with <strong>{selectedTutor.tutorInfo.name}</strong> from{' '}
                <strong>{selectedTime}</strong> to <strong>{getEndTime(selectedTime)}</strong>.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={confirmBooking} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Confirm Booking'}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentSchedule;







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
