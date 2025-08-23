import React, { useState } from 'react';
// The CSS module import is no longer needed

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
} from '@mui/material';

// Updated theme to style the "standard" input variant
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3a86ff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    // Target MuiInput for the "standard" variant's underline
    MuiInput: {
      styleOverrides: {
        root: {
          // Style for the underline before focus
          '&:before': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          // Style for the underline on hover
          '&:hover:not(.Mui-disabled):before': {
            borderColor: '#3a86ff',
          },
        },
      },
    },
    // Also style the "standard" variant for the Select component
    MuiInputLabel: {
        styleOverrides: {
            root: {
                // Ensure the label color is correct
                color: 'rgba(255, 255, 255, 0.7)',
            }
        }
    }
  },
});

// CSS is now embedded directly into the component
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

  .root {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 1rem;
    font-family: 'Inter', sans-serif;
    background-color: #121212;
  }

  .container {
    width: 100%;
    max-width: 450px;
    padding: 2.5rem;
    border-radius: 12px;
    background-color: #1e1e1e;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .title {
    text-align: center;
    margin: 0 0 0.75rem 0;
    font-size: 2.25rem;
    font-weight: 700;
    color: #ffffff;
  }

  .subheading {
    text-align: center;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    font-weight: 400;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .submitButton {
    width: 100%;
    padding: 12px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    background-color: #3a86ff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    margin-top: 1rem;
  }

  .submitButton:hover {
    background-color: #2656b6;
  }

  .submitButton:disabled {
    background-color: rgba(255, 255, 255, 0.12);
    cursor: not-allowed;
  }
`;

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'Student',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password, password2, role } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    console.log("Registering user:", { name, email, password, role });

    setTimeout(() => {
      setIsLoading(false);
      alert('Registration successful! (Simulated)');
    }, 2000);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{styles}</style>
      <div className="root">
        <Box component="div" className="container">
          <h1 className="title">Register</h1>
          <p className="subheading">Please create an account</p>

          <form onSubmit={onSubmit} className="form">
            <TextField
              required
              fullWidth
              label="Full Name"
              name="name"
              value={name}
              onChange={onChange}
              variant="standard"
              placeholder="Enter your full name"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              variant="standard"
              placeholder="Enter your email address"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={onChange}
              variant="standard"
              placeholder="Enter your password"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              value={password2}
              onChange={onChange}
              variant="standard"
              placeholder="Confirm your password"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth variant="standard">
              <InputLabel>I am a...</InputLabel>
              <Select
                name="role"
                value={role}
                label="I am a..."
                onChange={onChange}
              >
                <MenuItem value={'Student'}>Student</MenuItem>
                <MenuItem value={'Teacher'}>Teacher</MenuItem>
              </Select>
            </FormControl>
            <button
              type="submit"
              className="submitButton"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </button>
          </form>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default Register;
