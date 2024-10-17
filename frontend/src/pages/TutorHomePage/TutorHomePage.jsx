import React from 'react';
import { useParams } from 'react-router-dom';
import TutorSideBar from '../../components/TutorHomePage/TutorSideBar';

const TutorHomePage = () => {
  const { id } = useParams(); 
  
  return <TutorSideBar userId={id} />; 
};

export default TutorHomePage;
