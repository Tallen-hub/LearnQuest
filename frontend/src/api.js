import axios from "axios";

const URL = "http://localhost:3000"; 

export async function getUser(id) {
  const response = await axios.get(`${URL}/users/${id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

export async function createUser(user) {
  const response = await axios.post(`${URL}/users`, user);
  return response;
}

export async function updateUser(id, user) {
  const response = await axios.put(`${URL}/users/${id}`, user);
  return response;
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
    throw new Error(
      error.response?.data?.message || "An error occurred during login"
    );
  }
}

export async function getTutorAvailability(userId) {
  try {
    const response = await axios.get(`${URL}/users/${userId}`);
    if (response.status === 200 && response.data.role === "tutor") {
      const availabilityResponse = await axios.get(
        `${URL}/tutor/availability/${userId}`
      );
      return availabilityResponse.data;
    } else {
      throw new Error("User is not a tutor or not found");
    }
  } catch (error) {
    console.error("Error fetching tutor availability:", error);
    return null;
  }
}

export async function createTutorAvailability(userId, availability) {
  try {
    const userResponse = await axios.get(`${URL}/users/${userId}`);

    if (userResponse.status === 200 && userResponse.data.role === "tutor") {
      const payload = {
        tutorId: userId,
        availability,
      };

      console.log("Sending payload to backend:", payload);

      const response = await axios.post(
        `${URL}/tutor/availability`,
        payload
      );
      console.log("Response from backend:", response);

      return response.data;
    } else {
      throw new Error("User is not a tutor");
    }
  } catch (error) {
    console.error("Error creating tutor availability:", error);
    return null;
  }
}

export async function logoutUser() {
  try {
    const response = await axios.post(`${URL}/api/logout`);
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; 
  }
}