import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Dashboard.module.css';
import {
  createClassroom,
  getClassrooms,
  joinClassroom,
  reset as resetClassrooms,
} from '../features/classrooms/classroomSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading: isAuthLoading } = useSelector((state) => state.auth);
  const { classrooms, isLoading, isError, message } = useSelector(
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
    } else {
      dispatch(getClassrooms());
    }

    return () => {
      dispatch(resetClassrooms());
    };
  }, [user, navigate, dispatch, isError, message]);

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

  if (isAuthLoading || !user) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Welcome, {user.name}</h1>

      <div className={styles.formCardsRow}>
        {user.role === 'Teacher' && (
          <div className={styles.formCard} tabIndex={0}>
            <h3 className={styles.formCardTitle}>Create a New Classroom</h3>
            <form onSubmit={onCreateSubmit} className={styles.form}>
              <div className={styles.inlineInputs}>
                <input
                  className={styles.formCardInput}
                  name="name"
                  value={name}
                  onChange={onCreateChange}
                  placeholder="Classroom Name"
                  required
                />
                <input
                  className={styles.formCardInput}
                  name="subject"
                  value={subject}
                  onChange={onCreateChange}
                  placeholder="Subject"
                  required
                />
              </div>
              <button type="submit" className={styles.formCardButton}>Create Classroom</button>
            </form>
          </div>
        )}

        {user.role === 'Student' && (
          <div className={styles.formCard} tabIndex={0}>
            <h3 className={styles.formCardTitle}>Join a Classroom</h3>
            <form onSubmit={onJoinSubmit} className={styles.form}>
              <input
                className={styles.formCardInput}
                name="joinCode"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter Join Code"
                required
              />
              <button type="submit" className={styles.formCardButton}>Join</button>
            </form>
          </div>
        )}
      </div>

      <div className={styles.classList}>
        <h2>Your Classrooms</h2>
        {isLoading ? (
          <p>Loading classrooms...</p>
        ) : classrooms.length > 0 ? (
          <div className={styles.grid}>
            {classrooms.map((classroom) => (
              <Link
                to={`/classroom/${classroom._id}`}
                key={classroom._id}
                className={styles.cardLink}
              >
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