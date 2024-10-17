import React, { useEffect, useState } from 'react';
import {
  Box, Checkbox, IconButton, HStack, VStack, Text, Select, Flex, Spacer,
  useToast, Heading, Button, Spinner
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { getTutorAvailability, createTutorAvailability } from '../../api';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const subjectsList = ['Mathematics', 'Chemistry', 'Physics', 'Biology']; // Add more subjects here

const timeOptions = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
];

const TutorAvailability = ({ userId }) => {
  const toast = useToast();
  const [availability, setAvailability] = useState(daysOfWeek.map(day => ({
    day,
    enabled: false,
    slots: [{ start: '9:00 AM', end: '9:00 PM' }]
  })));
  const [loading, setLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]); // State to track selected subjects

  useEffect(() => {
    if (!userId) return;

    async function fetchAvailability() {
      setLoading(true);
      try {
        const result = await getTutorAvailability(userId);
        if (result && result.availability) {
          const updatedAvailability = daysOfWeek.map(day => {
            const existingDay = result.availability.find(a => a.day === day);
            return existingDay ? existingDay : { day, enabled: false, slots: [{ start: '9:00 AM', end: '9:00 PM' }] };
          });
          setAvailability(updatedAvailability);
          setSelectedSubjects(result.selectedSubjects || []); // Set previously selected subjects
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [userId]);

  const handleDayToggle = (dayIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].enabled = !updatedAvailability[dayIndex].enabled;
    setAvailability(updatedAvailability);
  };

  const handleTimeChange = (dayIndex, slotIndex, timeType, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots[slotIndex][timeType] = value;
    setAvailability(updatedAvailability);
  };

  const handleAddSlot = (dayIndex) => {
    const updatedAvailability = [...availability];
    const lastSlot = updatedAvailability[dayIndex].slots[updatedAvailability[dayIndex].slots.length - 1];
    const nextSlot = getNextTimeSlot(lastSlot.end);
    updatedAvailability[dayIndex].slots.push(nextSlot);
    setAvailability(updatedAvailability);
  };

  const handleRemoveSlot = (dayIndex, slotIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(updatedAvailability);
  };

  // Handle subject checkbox change
  const handleSubjectChange = (subject) => {
    setSelectedSubjects(prev =>
      prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
    );
  };

  // Ensure at least one subject is selected
  const validateSelectedSubjects = () => {
    if (selectedSubjects.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one subject must be selected.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSaveAvailability = async () => {
    if (!validateSelectedSubjects()) return; // Ensure subject validation

    setLoading(true);
    try {
      const result = await createTutorAvailability(userId, { availability, selectedSubjects });
      if (result) {
        toast({
          title: 'Success',
          description: 'Availability saved successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save availability.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        title: 'Error',
        description: 'An error occurred while saving availability.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <Heading as="h1" size="2xl" mb={2}>
        Availability
      </Heading>

      <Text fontSize="lg" color="gray.600">
        Your availability and subject preferences inform others of your open time slots
      </Text>

      {/* Subjects Selection */}
      <Box>
        <Text>Select Subjects (at least one):</Text>
        <HStack>
          {subjectsList.map((subject) => (
            <Checkbox
              key={subject}
              isChecked={selectedSubjects.includes(subject)}
              onChange={() => handleSubjectChange(subject)}
            >
              {subject}
            </Checkbox>
          ))}
        </HStack>
      </Box>

      {loading ? (
        <Spinner />
      ) : (
        availability.map((day, dayIndex) => (
          <Box key={day.day} borderWidth="1px" borderColor="blackAlpha.500" borderRadius="lg" p={4} width="100%">
            <HStack justifyContent="space-between">
              <Checkbox isChecked={day.enabled} onChange={() => handleDayToggle(dayIndex)}>
                {day.day}
              </Checkbox>
            </HStack>

            {day.enabled && (
              <VStack spacing={3} mt={2}>
                {day.slots.map((slot, slotIndex) => (
                  <Flex key={slotIndex} width="100%" align="center">
                    <Select
                      value={slot.start}
                      onChange={(e) => handleTimeChange(dayIndex, slotIndex, 'start', e.target.value)}
                      size="sm"
                      width="150px"
                    >
                      {timeOptions.map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                      ))}
                    </Select>

                    <Text mx={2}>to</Text>

                    <Select
                      value={slot.end}
                      onChange={(e) => handleTimeChange(dayIndex, slotIndex, 'end', e.target.value)}
                      size="sm"
                      width="150px"
                    >
                      {timeOptions.map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                      ))}
                    </Select>

                    <Spacer />

                    <IconButton
                      aria-label="Remove Time Slot"
                      icon={<MinusIcon />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                      visibility={day.slots.length > 1 ? 'visible' : 'hidden'}
                      mx={2}
                    />

                    {slotIndex === day.slots.length - 1 && (
                      <IconButton
                        aria-label="Add Time Slot"
                        icon={<AddIcon />}
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddSlot(dayIndex)}
                        mx={2}
                      />
                    )}
                  </Flex>
                ))}
              </VStack>
            )}
          </Box>
        ))
      )}

      <Button colorScheme="blue" onClick={handleSaveAvailability} isLoading={loading} loadingText="Saving...">
        Save Availability
      </Button>
    </VStack>
  );
};

export default TutorAvailability;