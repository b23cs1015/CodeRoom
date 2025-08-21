import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOneClassroom, reset as resetClassroom } from '../features/classrooms/classroomSlice';
import {
  getAnnouncements,
  createAnnouncement,
  reset as resetAnnouncements,
} from '../features/announcements/announcementSlice';
import styles from './Classroom.module.css';
import StudyMaterials from '../components/StudyMaterials'; // Your import is correct

function Classroom() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [text, setText] = useState('');

  const { user } = useSelector((state) => state.auth);
  const { selectedClassroom, isLoading: isClassroomLoading } = useSelector(
    (state) => state.classrooms
  );
  const { announcements, isLoading: isAnnouncementsLoading } = useSelector(
    (state) => state.announcements
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    dispatch(getOneClassroom(classroomId));
    dispatch(getAnnouncements(classroomId));

    const interval = setInterval(() => {
      dispatch(getAnnouncements(classroomId));
    }, 10000);

    return () => {
      clearInterval(interval);
      dispatch(resetClassroom());
      dispatch(resetAnnouncements());
    };
  }, [user, navigate, dispatch, classroomId]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createAnnouncement({ classroomId, text }));
    setText('');
  };

  if (isClassroomLoading || !selectedClassroom) {
    return <h1>Loading Classroom...</h1>;
  }

  return (
    <div className={styles.classroomContainer}>
      <header className={styles.header}>
        <h1>{selectedClassroom.name}</h1>
        <p>{selectedClassroom.subject}</p>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.announcementsSection}>
          <h2>Announcements</h2>
          {user.role === 'Teacher' && (
            <form onSubmit={onSubmit} className={styles.announcementForm}>
              <textarea
                placeholder="Make an announcement..."
                rows="3"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              ></textarea>
              <button type="submit" disabled={isAnnouncementsLoading}>Post</button>
            </form>
          )}

          <div className={styles.announcementList}>
            {announcements.length > 0 ? (
              announcements.map((ann) => (
                <div key={ann._id} className={styles.announcementCard}>
                  <p>{ann.text}</p>
                  <small>
                    Posted on {new Date(ann.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            ) : (
              <p>No announcements have been made yet.</p>
            )}
          </div>
        </div>
        
        {/* 👇 THIS IS THE NEWLY ADDED PART 👇 */}
        <StudyMaterials classroomId={classroomId} userRole={user.role} />
      </main>
    </div>
  );
}

export default Classroom;