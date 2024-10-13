import React, { useState } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, setOptions } from '@mobiscroll/react';

const TutorSchedule = () => {
  const [events, setEvents] = useState([]);

  setOptions({
    theme: 'ios',
    themeVariant: 'light'
  });

  const handleEventCreation = (args) => {
    // The new event to add to the events list
    const newEvent = {
      id: events.length + 1,  // Unique id for each event
      start: args.event.start,
      end: args.event.end,
      title: 'Available for Tutoring',
      color: '#4CAF50'  
    };

    // Persist the new event by adding it to the existing events array
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div>
      <h2>Set Your Availability</h2>
      <Eventcalendar
        view={{
          schedule: { 
            type: 'day',
            startTime: '08:00',  // Start at 8 AM
            endTime: '20:00'     // End at 8 PM
          }
        }}
        data={events}              
        clickToCreate={true}       
        dragToCreate={true}        
        dragToMove={false}         
        onEventCreate={handleEventCreation}  
      />
    </div>
  );
};

export default TutorSchedule;


