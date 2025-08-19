import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classrooms/';

// Create new announcement
const createAnnouncement = async (data, token) => {
  const { classroomId, text } = data;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + classroomId + '/announcements', { text }, config);
  return response.data;
};

// Get announcements for a classroom
const getAnnouncements = async (classroomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + classroomId + '/announcements', config);
  return response.data;
};

const announcementService = {
  createAnnouncement,
  getAnnouncements,
};

export default announcementService;