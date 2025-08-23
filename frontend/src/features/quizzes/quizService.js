import axios from 'axios';

const API_URL_CLASSROOM = '/api/classrooms/';
const API_URL_QUIZ = '/api/quizzes/';

// Create a new quiz for a classroom
const createQuiz = async (quizData, classroomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_URL_CLASSROOM}${classroomId}/quizzes`,
    quizData,
    config
  );
  return response.data;
};

// Get all quizzes for a classroom
const getQuizzesForClassroom = async (classroomId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL_CLASSROOM}${classroomId}/quizzes`, config);
    return response.data;
};

// Get a single quiz by ID
const getQuizById = async (quizId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_QUIZ + quizId, config);
  return response.data;
};

// Submit a quiz
const submitQuiz = async (quizId, answers, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL_QUIZ + quizId + '/submit', { answers }, config);
  return response.data;
};

const getQuizSubmissions = async (quizId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`/api/quizzes/${quizId}/submissions`, config);
  return response.data;
};

const getMySubmissions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get('/api/submissions/mysubmissions', config);
  return response.data;
};

const quizService = {
  createQuiz,
  getQuizzesForClassroom,
  getQuizById,
  submitQuiz,
  getQuizSubmissions,
  getMySubmissions,
};

export default quizService;