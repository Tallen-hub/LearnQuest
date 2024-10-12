import React, { useEffect, useState } from 'react';
import { Box, Checkbox, IconButton, HStack, VStack, Text, Select, Flex, Spacer, Heading, Button } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { getTutorAvailability, createTutorAvailability } from '../../api';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Array of times to show in the dropdown (in 30-minute intervals)
const timeOptions = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
];

const TutorAvailability = ({ userId }) => {
  const [availability, setAvailability] = useState(
    daysOfWeek.map(day => ({
      day, 
      enabled: false, 
      slots: [{ start: '9:00 AM', end: '9:00 PM' }]
    }))
  );

  useEffect(() => {
    if (!userId) return;

    // Fetch the tutor's availability when the component mounts
    async function fetchAvailability() {
      try {
        const result = await getTutorAvailability(userId);  // Get the tutor's availability
        if (result && result.availability) {
          // Merge the fetched availability with default days of the week
          const updatedAvailability = daysOfWeek.map(day => {
            const existingDay = result.availability.find(a => a.day === day);
            return existingDay ? existingDay : { day, enabled: false, slots: [{ start: '9:00 AM', end: '9:00 PM' }] };
          });
          setAvailability(updatedAvailability);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    }

    fetchAvailability();
  }, [userId]);

  // Toggle availability for a specific day
  const handleDayToggle = (dayIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].enabled = !updatedAvailability[dayIndex].enabled;
    setAvailability(updatedAvailability);
  };

  // Handle time slot changes
  const handleTimeChange = (dayIndex, slotIndex, timeType, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots[slotIndex][timeType] = value;
    setAvailability(updatedAvailability);
  };

  // Function to get the next time slot's start time based on the previous slot's end time
  const getNextTimeSlot = (currentEndTime) => {
    const currentIndex = timeOptions.indexOf(currentEndTime);
    const nextStart = currentIndex !== -1 && currentIndex + 1 < timeOptions.length ? timeOptions[currentIndex + 1] : '';
    const nextEnd = '9:00 PM'; // Set the default end time for the new slot
    return { start: nextStart, end: nextEnd };
  };

  // Add a new time slot for a specific day, defaulting to the end of the previous slot
  const handleAddSlot = (dayIndex) => {
    const updatedAvailability = [...availability];
    const lastSlot = updatedAvailability[dayIndex].slots[updatedAvailability[dayIndex].slots.length - 1];
    const { start, end } = getNextTimeSlot(lastSlot.end); // Get the next start and default end time
    updatedAvailability[dayIndex].slots.push({ start, end });
    setAvailability(updatedAvailability);
  };

  // Remove an existing time slot
  const handleRemoveSlot = (dayIndex, slotIndex) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].slots.splice(slotIndex, 1);
    setAvailability(updatedAvailability);
  };

  // Handle save to backend
  const handleSaveAvailability = async () => {
    const result = await createTutorAvailability(userId, availability);  // Save to backend
    if (result) {
      alert('Availability saved successfully!');
    } else {
      alert('Failed to save availability.');
    }
  };

  return (
    <VStack spacing={5}>
      {/* Page Title */}
      <Heading as="h1" size="2xl" mb={2}>
        Availability
      </Heading>

      {/* Subheading */}
      <Text fontSize="lg" color="gray.600">
        Your availability informs others of your open time slots
      </Text>

      {availability.map((day, dayIndex) => (
        <Box 
          key={day.day} 
          borderWidth="1px" 
          borderColor="blackAlpha.500" 
          borderRadius="lg" 
          p={4} 
          width="100%"
        >
          <HStack justifyContent="space-between">
            <Checkbox
              isChecked={day.enabled}
              onChange={() => handleDayToggle(dayIndex)}
            >
              {day.day}
            </Checkbox>
          </HStack>

          {day.enabled && (
            <VStack spacing={3} mt={2}>
              {day.slots.map((slot, slotIndex) => (
                <Flex key={slotIndex} spacing={3} width="100%" align="center">
                  {/* Start Time Dropdown */}
                  <Select
                    placeholder="Start Time"
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

                  {/* End Time Dropdown */}
                  <Select
                    placeholder="End Time"
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

                  {/* Minus Button (only show if there is more than one slot) */}
                  <IconButton
                    aria-label="Remove Time Slot"
                    icon={<MinusIcon />}
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                    visibility={day.slots.length > 1 ? 'visible' : 'hidden'}
                    mx={2}
                  />

                  {/* Add Button (only on the last slot) */}
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
      ))}

      {/* Save Button */}
      <Button colorScheme="blue" onClick={handleSaveAvailability}>
        Save Availability
      </Button>
    </VStack>
  );
};

export default TutorAvailability;



