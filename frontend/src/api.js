// This file will contain all the API calls that we will make to the backend server.
import axios from 'axios'

const URL = 'http://localhost:3000'


//"http://localhoost:3000/users/12345"
export async function getUser(id) {
    const response = await axios.get(`${URL}/users/${id}`)
    
    if (response.status === 200){
        return response.data
    }else{
        return
    }
}

// http://localhost:3000/users
export async function createUser(user) {
    const response = await axios.post(`${URL}/users`, user)
    return response
}


// http://localhost:3000/users/12345
export async function updateUser(id, user) {
    const response = await axios.put(`${URL}/users/${id}`, user)
    return response
}

export async function verifyUser(user) {
    try {
      const response = await axios.post(`${URL}/users/login`, user);
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
      const response = await axios.get(`${URL}/users/${userId}`);
      if (response.status === 200 && response.data.role === 'tutor') {
          // Fetch tutor's availability if the role is 'tutor'
          const availabilityResponse = await axios.get(`${URL}/tutor/availability/${userId}`);
          return availabilityResponse.data;
      } else {
          throw new Error('User is not a tutor or not found');
      }
  } catch (error) {
      console.error("Error fetching tutor availability:", error);
      return null;
  }
}

export async function createTutorAvailability(userId, availability) {
  try {
      // First, fetch the user and check if they are a tutor
      const userResponse = await axios.get(`${URL}/users/${userId}`);
      
      if (userResponse.status === 200 && userResponse.data.role === 'tutor') {
          // Proceed with creating/updating availability
          const payload = {
              tutorId: userId,  // Pass the user's _id as tutorId
              availability      // Availability array
          };

          console.log("Sending payload to backend:", payload);  // Log the payload
          
          const response = await axios.post(`${URL}/tutor/availability`, payload);
          console.log("Response from backend:", response);  // Log the response
          
          return response.data;
      } else {
          throw new Error('User is not a tutor');
      }
  } catch (error) {
      console.error("Error creating tutor availability:", error);
      return null;
  }
}


 




 

 
  
  