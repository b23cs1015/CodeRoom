import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';

// Import the CSS Module
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        CodeRoom
      </Link>
      <nav className={styles.navLinks}>
        {user ? (
          <a href="#!" onClick={onLogout}>Logout</a>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;