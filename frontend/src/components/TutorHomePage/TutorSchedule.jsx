import React, { useState, useEffect } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, setOptions } from '@mobiscroll/react';
import { fetchTutorAvailability } from '../../api';
import { useParams } from 'react-router-dom';
import { Box, Button, ButtonGroup, Heading, useBreakpointValue } from '@chakra-ui/react';

const TutorSchedule = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [viewType, setViewType] = useState('day'); // Default to 'day' view
  const showWeeklyView = useBreakpointValue({ base: false, md: true }); // Show weekly view only on larger screens

  setOptions({
    theme: 'ios',
    themeVariant: 'light',
    display: 'inline', // Inline display to avoid all-day
  });

  useEffect(() => {
    const getAvailability = async () => {
      try {
        const availabilityData = await fetchTutorAvailability(id);
        const formattedEvents = availabilityData
          .filter(event => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            return endDate > startDate;
          })
          .map((event) => ({
            id: event.id,
            start: event.start,
            end: event.end,
            title: event.title || 'Slot booked for Tutoring',
            color: '#4CAF50',
          }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching tutor availability:', error);
      }
    };

    getAvailability();
  }, [id]);

  // Function to change the view type
  const handleViewChange = (type) => {
    setViewType(type);
  };

  return (
    <Box maxW="960px" mx="auto" p={6}>
      <Heading as="h2" size="lg" mb={6} textAlign="center" color="teal.600">
        Set Your Availability
      </Heading>

      {/* Buttons to toggle between daily and weekly views */}
      <ButtonGroup mb={4} spacing={4} justifyContent="center" display="flex">
        <Button
          colorScheme={viewType === 'day' ? 'teal' : 'gray'}
          onClick={() => handleViewChange('day')}
        >
          Daily View
        </Button>
        {/* Only show Weekly View on screens larger than 'md' */}
        {showWeeklyView && (
          <Button
            colorScheme={viewType === 'week' ? 'teal' : 'gray'}
            onClick={() => handleViewChange('week')}
          >
            Weekly View
          </Button>
        )}
      </ButtonGroup>

      <Box
        bg="white"
        p={4}
        borderRadius="md"
        boxShadow="md"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Eventcalendar
          view={{
            schedule: viewType === 'day'
              ? {
                  type: 'day',
                  startTime: '09:00',  // Start at 9:00 AM
                  endTime: '21:00',     // End at 9:00 PM
                  allDay: false, // Disable the "All Day" display
                }
              : {
                  type: 'week',
                  startTime: '09:00',  // Start at 9:00 AM
                  endTime: '21:00',     // End at 9:00 PM
                  allDay: false, // Disable the "All Day" display
                },
          }}
          data={events}
          clickToCreate={false}
          dragToCreate={false}
          dragToMove={false}
        />
      </Box>
    </Box>
  );
};

export default TutorSchedule;

