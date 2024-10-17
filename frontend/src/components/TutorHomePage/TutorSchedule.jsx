import React, { useState, useEffect } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, setOptions } from '@mobiscroll/react';
import { fetchTutorAvailability } from '../../api';
import { useParams } from 'react-router-dom';

const TutorSchedule = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]); // Initialize with an empty array

  setOptions({
    theme: 'ios',
    themeVariant: 'light'
  });

  useEffect(() => {
    const getAvailability = async () => {
      try {
        const availabilityData = await fetchTutorAvailability(id); // Fetch availability data
        const formattedEvents = availabilityData
          .filter(event => {
            const startDate = new Date(event.start); // Add 'Z' for UTC
            const endDate = new Date(event.end); // Add 'Z' for UTC
            
            return endDate > startDate;
          })
          .map((event) => ({
            id: event.id, // Unique id for each event
            start: event.start, // Ensure these match your API's response structure
            end: event.end,
            title: event.title || 'Slot booked for Tutoring', // Use event title or default
            color: '#4CAF50'
          }));
        setEvents(formattedEvents); // Set the fetched events to state
      } catch (error) {
        console.error('Error fetching tutor availability:', error);
      }
    };

    getAvailability();
  }, [id]); // Re-fetch when tutorId changes

  return (
    <div>
      <h2>Set Your Availability</h2>
      <Eventcalendar
        view={{
          schedule: {
            type: 'day',
            startTime: '00:00',  // Start at midnight
            endTime: '23:59'     // End at 11:59 PM
          }
        }}
        data={events}
        clickToCreate={false}  // Disable creating new events on click
        dragToCreate={false}   // Disable creating new events by drag
        dragToMove={false}
      />
    </div>
  );
};

export default TutorSchedule;
