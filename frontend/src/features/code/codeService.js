import axios from 'axios';

const API_URL_EXECUTE = '/api/code/execute';

// Execute code
const executeCode = async (codeData, token) => { // 1. Accept the token as an argument
  // 2. Create the config object with the Authorization header
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 3. Pass the config object with the request
  const response = await axios.post(API_URL_EXECUTE, codeData, config);

  return response.data;
};

const codeService = {
  executeCode,
};

export default codeService;