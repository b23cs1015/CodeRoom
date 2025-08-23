import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOneClassroom, reset as resetClassroom } from '../features/classrooms/classroomSlice';
import styles from './Classroom.module.css';

// Import the components for our tabs
import Announcements from '../components/Announcements';
import StudyMaterials from '../components/StudyMaterials';
import QuizList from '../components/QuizList';
import ProblemList from '../components/ProblemList';

function Classroom() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('announcements');

  const { user } = useSelector((state) => state.auth);
  const { 
    selectedClassroom, 
    isLoading: isClassroomLoading, 
    isError, 
    message 
  } = useSelector((state) => state.classrooms);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    dispatch(getOneClassroom(classroomId));

    return () => {
      dispatch(resetClassroom());
    };
  }, [user, navigate, dispatch, classroomId]);

  if (isError) {
    return (
      <div className={styles.container}>
        <h2>Error loading classroom</h2>
        <p>{message}</p>
      </div>
    );
  }

  if (isClassroomLoading || !selectedClassroom) {
    return <h1>Loading Classroom...</h1>;
  }

  return (
    <div className={styles.classroomContainer}>
      <header className={styles.header}>
        <h1>{selectedClassroom.name}</h1>
        <p>Class Code: {selectedClassroom.code}</p>
      </header>

      {/* Updated className for the tabs container */}
      <nav className={styles.tabs}>
        {/* Updated className for each tab button */}
        <button 
          className={`${styles.tabButton} ${activeTab === 'announcements' ? styles.active : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'materials' ? styles.active : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Study Materials
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'quizzes' ? styles.active : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'problems' ? styles.active : ''}`}
          onClick={() => setActiveTab('problems')}
        >
          Coding Problems
        </button>
      </nav>

      <main className={styles.mainContent}>
        {user.role === 'Teacher' && (
          <div className={styles.teacherControls}>
            {activeTab === 'quizzes' && (
              // Updated className for control buttons to use the global .btn style
              <Link to={`/classroom/${classroomId}/create-quiz`} className={`btn ${styles.controlButton}`}>
                + Create New Quiz
              </Link>
            )}
            {activeTab === 'problems' && (
              <Link to={`/classroom/${classroomId}/create-problem`} className={`btn ${styles.controlButton}`}>
                + Create New Problem
              </Link>
            )}
          </div>
        )}
        
        {activeTab === 'announcements' && <Announcements user={user} />}
        {activeTab === 'materials' && <StudyMaterials classroomId={classroomId} userRole={user.role} />}
        {activeTab === 'quizzes' && <QuizList />}
        {activeTab === 'problems' && <ProblemList />}
      </main>
    </div>
  );
}

export default Classroom;