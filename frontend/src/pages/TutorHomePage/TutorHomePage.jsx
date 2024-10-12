import React from 'react';
import { useParams } from 'react-router-dom';
import TutorSideBar from '../../components/TutorHomePage/TutorSideBar';

const TutorHomePage = () => {
  const { id } = useParams(); // Get the userId from the URL params
  
  return <TutorSideBar userId={id} />; // Pass userId as a prop to TutorSideBar
};

export default TutorHomePage;
