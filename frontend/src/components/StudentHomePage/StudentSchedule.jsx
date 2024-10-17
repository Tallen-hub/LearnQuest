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
import { getAvailableTutors, bookTutorSlot } from '../../api'; // Import your API functions
import { useParams } from 'react-router-dom';

const StudentSchedule = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeId, setSelectedTimeId] = useState('');
  const [tutors, setTutors] = useState([]); // Store tutors fetched from the backend
  const [visibleTutors, setVisibleTutors] = useState(2);
  const [visibleTimes, setVisibleTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [selectedSubject, setSelectedSubject] = useState(''); // Subject filter state
  const toast = useToast();

  useEffect(() => {
    setUserId(id);
  }, [id]);

  useEffect(() => {
    async function fetchTutors() {
      setLoading(true);
      const availableTutors = await getAvailableTutors();
      if (availableTutors) {
        setTutors(availableTutors);
        setVisibleTimes(availableTutors.map(() => 3)); // Show 3 time slots by default
      }
      setLoading(false);
    }
    fetchTutors();
  }, []);

  // Handle time slot click and open the modal
  const handleTimeClick = (tutor, time, id) => {
    setSelectedTutor(tutor);
    setSelectedTime(time);
    setSelectedTimeId(id);
    onOpen();
  };

  const confirmBooking = async () => {
    try {
      setLoading(true);
      const response = await bookTutorSlot(selectedTimeId, userId, selectedTutor.tutorInfo._id);
      setLoading(false);
      toast({
        title: 'Booking confirmed!',
        description: `You have booked a session with ${selectedTutor.tutorInfo.name} at ${selectedTime}.`,
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

  // Filter tutors based on search term and selected subject
  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = tutor.tutorInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject ? tutor.selectedSubjects.includes(selectedSubject) : true;
    return matchesSearch && matchesSubject;
  });

  return (
    <Box p={5}>
      <Heading size="lg" mb={6}>
        Available Tutors
      </Heading>

      {/* Search Bar */}
      <Input
        placeholder="Search tutor by name"
        mb={4}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Subject Filter */}
      <Select
        placeholder="All Subjects"
        mb={4}
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      >
        {/* Assuming you know the available subjects, list them here */}
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Biology">Biology</option>
        {/* Add more subjects as necessary */}
      </Select>

      {/* Tutor List */}
      {loading ? (
        <Spinner />
      ) : filteredTutors.length === 0 ? (
        <Text>No tutors available.</Text>
      ) : (
        filteredTutors.slice(0, visibleTutors).map((tutor, index) => (
          <Box key={tutor._id} mb={4} pb={2} borderWidth={1} borderRadius="md" p={4}>
            <HStack align="center" spacing={3}>
              <VStack align="start" spacing={0}>
                <Text fontSize="md" fontWeight="bold">{tutor.tutorInfo.name}</Text>
              </VStack>
            </HStack>
            <HStack align="center" spacing={3}>
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" fontWeight="bold" textColor="grey">
                  {tutor.selectedSubjects.join(', ')}
                </Text>
              </VStack>
            </HStack>

            <Flex direction="column" mt={2}>
              {tutor.availability.map((dayAvailability, dayIndex) => (
                <Box key={dayIndex} mb={2}>
                  <Text fontSize="sm" fontWeight="bold">{dayAvailability.day}</Text>
                  <Flex wrap="wrap" alignItems="center">
                    {dayAvailability.slots.slice(0, visibleTimes[index]).map((timeSlot, slotIdx) => (
                      <Button
                        key={slotIdx}
                        size="xs"
                        m={1}
                        disabled={timeSlot.isBooked}
                        colorScheme="blue"
                        onClick={() => handleTimeClick(tutor, timeSlot.start, timeSlot.id)}
                      >
                        {timeSlot.start} - {timeSlot.end}
                      </Button>
                    ))}
                  </Flex>
                </Box>
              ))}
            </Flex>

            <Divider mt={2} />
          </Box>
        ))
      )}

      {visibleTutors < filteredTutors.length && (
        <Button mt={4} colorScheme="blue" onClick={() => setVisibleTutors((prev) => prev + 2)}>
          View More Tutors
        </Button>
      )}

      {/* Modal for booking session */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Book Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTutor && (
              <Text>
                Booking session with <strong>{selectedTutor.tutorInfo.name}</strong> at{' '}
                <strong>{selectedTime}</strong>.
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
