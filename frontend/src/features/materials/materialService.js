import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classrooms/';

// Upload a material
const uploadMaterial = async (data, token) => {
  const { classroomId, file } = data;
  const formData = new FormData();
  formData.append('material', file); // 'material' must match the backend field name

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(API_URL + classroomId + '/materials', formData, config);
  return response.data;
};

// Get all materials for a classroom
const getMaterials = async (classroomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + classroomId + '/materials', config);
  return response.data;
};

const materialService = {
  uploadMaterial,
  getMaterials,
};

export default materialService;