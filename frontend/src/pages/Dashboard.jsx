import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Dashboard.module.css';
import {
  createClassroom,
  getClassrooms,
  joinClassroom, // Import joinClassroom
} from '../features/classrooms/classroomSlice';
import { TextField } from '@mui/material';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { classrooms, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.classrooms
  );

  // State for the create form (Teacher)
  const [createData, setCreateData] = useState({ name: '', subject: '' });
  const { name, subject } = createData;

  // State for the join form (Student)
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    // ... (existing useEffect logic)
    // We added a check for isSuccess to re-fetch classrooms after joining
    if (isSuccess) {
        dispatch(getClassrooms());
    }
  }, [user, navigate, isError, isSuccess, message, dispatch]);

  const onCreateChange = (e) => {
    setCreateData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onCreateSubmit = (e) => {
    e.preventDefault();
    dispatch(createClassroom({ name, subject }));
    setCreateData({ name: '', subject: '' });
  };

  // Handler for joining a class
  const onJoinSubmit = (e) => {
    e.preventDefault();
    dispatch(joinClassroom(joinCode));
    setJoinCode(''); // Clear the input field
  };

  if (isLoading && classrooms.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Welcome, {user.name}</h1>

      {user.role === 'Teacher' && (
        <div className={styles.formCard}>
          <h3>Create a New Classroom</h3>
          <form onSubmit={onCreateSubmit} className={styles.form}>
            <TextField label="Classroom Name" name="name" value={name} onChange={onCreateChange} required />
            <TextField label="Subject" name="subject" value={subject} onChange={onCreateChange} required />
            <button type="submit" className={styles.button}>Create Classroom</button>
          </form>
        </div>
      )}

      {user.role === 'Student' && (
        <div className={styles.formCard}>
          <h3>Join a Classroom</h3>
          <form onSubmit={onJoinSubmit} className={styles.form}>
            <TextField
              label="Enter Join Code"
              name="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
            />
            <button type="submit" className={styles.button}>Join</button>
          </form>
        </div>
      )}

      <div className={styles.classList}>
        <h2>Your Classrooms</h2>
        {classrooms.length > 0 ? (
          <div className={styles.grid}>
            {classrooms.map((classroom) => (
              <div key={classroom._id} className={styles.classCard}>
                <h3>{classroom.name}</h3>
                <p>{classroom.subject}</p>
                {user.role === 'Teacher' && (
                  <p className={styles.joinCode}>Code: <strong>{classroom.joinCode}</strong></p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>You have not created or joined any classrooms yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;