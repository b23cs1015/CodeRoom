import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Welcome, {user.name}</h1>
      <p className={styles.subheading}>
        This is your central hub for learning and coding.
      </p>

      <div className={styles.content}>
        {user.role === 'Teacher' ? (
          <div>
            <h3>Teacher Dashboard</h3>
            <p>Here you can create classrooms, post announcements, and manage your students.</p>
            {/* Add buttons for teacher actions here */}
          </div>
        ) : (
          <div>
            <h3>Student Dashboard</h3>
            <p>Here you can find your classrooms, view study materials, and submit your assignments.</p>
            {/* Add links to classrooms here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;