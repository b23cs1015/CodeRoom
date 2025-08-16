import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';

// Import the CSS Module
import styles from './Login.module.css';

// Import MUI components
import { TextField, CircularProgress } from '@mui/material';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
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
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome Back</h1>
      <p className={styles.subheading}>Please log in to your account</p>

      <form onSubmit={onSubmit} className={styles.form}>
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
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;