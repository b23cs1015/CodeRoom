import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
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
      <ul className={styles.navLinks}>
        {user ? (
          <>
            {location.pathname !== '/' && (
              <li>
                <Link to='/'>Dashboard</Link>
              </li>
            )}
            {user.role === 'Student' && (
              <li>
                <Link to='/my-scores'>My Scores</Link>
              </li>
            )}
            <li>
              <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/register'>Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;