import axios from 'axios';

// @desc    Execute a code snippet
// @route   POST /api/code/execute
// @access  Private
const executeCode = async (req, res) => {
    // 1. Destructure 'language', 'code', and 'input' from the request body
    const { language, code, input } = req.body;

    try {
        const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
            // 2. Ensure the 'language' variable is used here
            language: language,
            version: '*',
            files: [{ content: code }],
            // 3. Pass the 'input' as stdin to the execution engine
            stdin: input,
        });
        
        // 4. Return only the 'run' object for a cleaner response
        res.json(response.data.run);
    } catch (error) {
        // 5. Provide more detailed error feedback
        res.status(400).json({ 
            message: 'Error executing code', 
            error: error.response ? error.response.data : error.message 
        });
    }
};

export { executeCode };