import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

// Import the CSS Module
import styles from './Register.module.css'; 

// Import MUI components for form fields
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'Student',
  });

  const { name, email, password, password2, role } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

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
    } else {
      const userData = { name, email, password, role };
      dispatch(register(userData));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register</h1>
      <p className={styles.subheading}>Please create an account</p>

      <form onSubmit={onSubmit} className={styles.form}>
        <TextField
          required
          fullWidth
          label="Full Name"
          name="name"
          value={name}
          onChange={onChange}
        />
        <TextField
          required
          fullWidth
          label="Email Address"
          name="email"
          value={email}
          onChange={onChange}
        />
        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={onChange}
        />
        <TextField
          required
          fullWidth
          name="password2"
          label="Confirm Password"
          type="password"
          value={password2}
          onChange={onChange}
        />
        <FormControl fullWidth>
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
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;