import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Ensure Link is imported
import { useSelector, useDispatch } from 'react-redux';
import styles from './Dashboard.module.css';
import {
  createClassroom,
  getClassrooms,
  joinClassroom,
} from '../features/classrooms/classroomSlice';
import { TextField } from '@mui/material';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { classrooms, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.classrooms
  );

  const [createData, setCreateData] = useState({ name: '', subject: '' });
  const { name, subject } = createData;

  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getClassrooms());

    if (isSuccess) {
      // After a successful action, reset the success flag and re-fetch
      dispatch(getClassrooms());
    }
  }, [user, navigate, isError, message, dispatch, isSuccess]);

  const onCreateChange = (e) => {
    setCreateData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onCreateSubmit = (e) => {
    e.preventDefault();
    dispatch(createClassroom({ name, subject }));
    setCreateData({ name: '', subject: '' });
  };

  const onJoinSubmit = (e) => {
    e.preventDefault();
    dispatch(joinClassroom(joinCode));
    setJoinCode('');
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
            {/* 👇 THIS IS THE UPDATED SECTION 👇 */}
            {classrooms.map((classroom) => (
              <Link to={`/classroom/${classroom._id}`} key={classroom._id} className={styles.cardLink}>
                <div className={styles.classCard}>
                  <h3>{classroom.name}</h3>
                  <p>{classroom.subject}</p>
                  {user.role === 'Teacher' && (
                    <p className={styles.joinCode}>
                      Code: <strong>{classroom.joinCode}</strong>
                    </p>
                  )}
                </div>
              </Link>
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