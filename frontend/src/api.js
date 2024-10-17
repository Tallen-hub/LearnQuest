// This file will contain all the API calls that we will make to the backend server.
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const URL = 'http://localhost:3000'


//"http://localhost:3000/users/12345"
export async function getUser(id) {
  const response = await axios.get(`${URL}/users/getUser/${id}`)

  if (response.status === 200) {
    return response.data
  } else {
    return
  }
}

// http://localhost:3000/signup
export async function createUser(user) {
  const response = await axios.post(`${URL}/signup`, user)
  return response
}


// http://localhost:3000/users/12345
export async function updateUser(id, user) {
  const response = await axios.put(`${URL}/users/manage/${id}`, user)
  return response
}

// http://localhost:3000/login

export async function verifyUser(user) {
  try {
    const response = await axios.post(`${URL}/login`, user);

    if (response.data.success) {
      return response.data.user;
    } else {
      throw new Error(response.data.message || "Authentication failed");
    }
  } catch (error) {
    // Pass the error back so it can be handled in the UI
    throw new Error(error.response?.data?.message || "An error occurred during login");
  }
}

// 1. Get tutor availability by user ID (and check if role is 'tutor')
export async function getTutorAvailability(userId) {
  try {
    // Fetch the tutor's availability directly
    const response = await axios.get(`${URL}/tutors/availability/${userId}`);

    return response.data;
  } catch (error) {
    // Check if the error response exists and log the message
    if (error.response) {
      console.error("Error fetching tutor availability:", error.response.data.message);
    } else {
      console.error("Error fetching tutor availability:", error.message);
    }
    return null;
  }
}

export async function createTutorAvailability(userId, availability) {
  try {
    const payload = {
      userId,
      availability // Availability array
    };


    // Send the request to create/update availability
    const response = await axios.post(`${URL}/tutors/availability`, payload);

    return response.data;
  } catch (error) {
    // Check if the error response exists and log the message
    if (error.response) {
      console.error("Error creating tutor availability:", error.response.data.message);
    } else {
      console.error("Error creating tutor availability:", error.message);
    }
    return null;
  }
}
// Fetch all tutors who have availability
export async function getAvailableTutors() {
  try {
    const response = await axios.get('http://localhost:3000/tutors/available');
    return response.data;
  } catch (error) {
    console.error("Error fetching available tutors:", error);
    return null;
  }
}

// Logout function (make sure this is exported)
export async function logoutUser() {
  try {

    const response = await axios.post(`${URL}/api/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; // Re-throw the error to be handled by the component
  }
}




export async function bookTutorSlot(timeId, userId, tutorId) {
  try {
    const response = await axios.post(`${URL}/users/bookTutor`, {
      timeId,
      userId,
      tutorId
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error booking tutor slot:", error);
    throw error; // Optionally rethrow the error for further handling
  }
}


export const fetchUserBookings = async (userId) => {
  try {
    const response = await axios.get(`${URL}/users/bookings/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};



export const fetchTutorBookings = async (userId) => {
  const response = await axios.get(`${URL}/tutors/bookings/${userId}`);
  return response.data;
};

// Update booking approval status
export const updateBookingStatus = async (bookingId, status) => {
  const response = await axios.patch(`${URL}/tutors/Updatebooking`, { bookingId, status });
  return response.data;
};




export const fetchTutorAvailability = async (id) => {
  try {
    const response = await axios.get(`${URL}/tutors/Calendar/${id}`);

    return response.data // Return the availability data

  } catch (error) {
    console.error("Error fetching tutor availability:", error);
    throw error; // Propagate the error for handling in the component
  }
};


export const markAsCompleted = async (bookingId) => {
  const response = await axios.patch(`${URL}/tutors/markAsCompleted`, { bookingId });
  return response.data;
};