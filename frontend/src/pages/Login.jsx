import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import styles from './Login.module.css';

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
      alert(message); // You can replace this with a more modern toast notification later
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
      <h2 className={styles.title}>Welcome Back</h2>
      
      <form onSubmit={onSubmit}>
        {/* Replaced MUI TextField with standard HTML inputs and labels */}
        <div className={styles.formGroup}>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={onChange}
            placeholder='Enter your email'
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            value={password}
            onChange={onChange}
            placeholder='Enter your password'
            required
          />
        </div>
        
        {/* Updated classNames to match the new dark theme styles */}
        <button type='submit' className={`btn ${styles.submitButton}`} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {/* Added a link to the registration page */}
      <p className={styles.linkText}>
        Don't have an account? <Link to='/register'>Register here</Link>
      </p>
    </div>
  );
}

export default Login;