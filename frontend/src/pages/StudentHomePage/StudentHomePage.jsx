import React from 'react'
import StudentSideBar from '../../components/StudentHomePage/StudentSideBar'
import { useParams } from 'react-router-dom'

const StudentHomePage = () => {
    const { id } = useParams();
    return <StudentSideBar userId={id} />;
}

export default StudentHomePage

