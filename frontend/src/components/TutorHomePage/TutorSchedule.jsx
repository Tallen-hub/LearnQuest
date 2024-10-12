//tutor avalibility schedule: tutor can set their avalibility schedule 
//here they can select there time they are avalible for tutoring
//this will be displayed in the student calendar page(do later)
//using mobiscroll for the calendar view
//umm not quite avalibilty should be daily view like i should be able to see hour by hour and you know how the user(tutor) can drag and select the time they are avalible for tutoring
// add a load spinner from charkaui when tutor slect this screen

//TUTOR AVABILITY ROUTES maybe? 
//tutor should be able to set their avalibility schedule for multiple days 
//in yhr frontend tutor schedule page
//from there it should be store in the database
//api?
//here is my frontend 
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
      color: '#4CAF50'  // Optionally, set a color for better visibility
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
        data={events}              // Use the state to hold event data
        clickToCreate={true}       // Enable click-to-create for event creation
        dragToCreate={true}        // Enable drag-to-create new events
        dragToMove={false}         // Disable moving of events after they are created
        onEventCreate={handleEventCreation}  // Handle event creation with onEventCreate
      />
    </div>
  );
};

export default TutorSchedule;


