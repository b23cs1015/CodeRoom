import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classrooms/';

// Create a new classroom
const createClassroom = async (classroomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'create', classroomData, config);
  return response.data;
};

// Get user classrooms
const getClassrooms = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Join a classroom
const joinClassroom = async (joinCode, token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // The data needs to be an object with the key 'joinCode'
    const response = await axios.post(API_URL + 'join', { joinCode }, config);
    return response.data;
  };

const classroomService = {
  createClassroom,
  getClassrooms,
  joinClassroom, // Make sure this is exported
};
export default classroomService;