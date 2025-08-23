import axios from 'axios';

const API_URL_CLASSROOM = '/api/classrooms/';
const API_URL_PROBLEM = '/api/problems/';

// Create a new problem
const createProblem = async (problemData, classroomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_URL_CLASSROOM}${classroomId}/problems`,
    problemData,
    config
  );
  return response.data;
};

// Get all problems for a classroom
const getProblemsForClassroom = async (classroomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL_CLASSROOM}${classroomId}/problems`, config);
  return response.data;
};

// Get a single problem by ID
const getProblemById = async (problemId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL_PROBLEM + problemId, config);
  return response.data;
};
const submitSolution = async (problemId, solutionData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(
    `${API_URL_PROBLEM}${problemId}/submit`,
    solutionData,
    config
  );
  return response.data;
};

const getProblemSubmissions = async (problemId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`${API_URL_PROBLEM}${problemId}/submissions`, config);
  return response.data;
};

const runCode = async (problemId, solutionData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${API_URL_PROBLEM}${problemId}/run`, solutionData, config);
  return response.data;
};

const updateProblem = async (problemId, problemData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL_PROBLEM}${problemId}`, problemData, config);
  return response.data;
};

const problemService = {
  createProblem,
  getProblemsForClassroom,
  getProblemById, 
  submitSolution,
  getProblemSubmissions,
  runCode,
  updateProblem,
};
export default problemService;