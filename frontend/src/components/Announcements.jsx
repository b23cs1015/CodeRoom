import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getAnnouncements,
  createAnnouncement,
  reset as resetAnnouncements,
} from '../features/announcements/announcementSlice';
import styles from './Announcements.module.css';

function Announcements({ user }) {
  const { classroomId } = useParams();
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const { announcements, isLoading: isAnnouncementsLoading } = useSelector(
    (state) => state.announcements
  );

  useEffect(() => {
    // Fetch announcements and set up polling
    dispatch(getAnnouncements(classroomId));
    const interval = setInterval(() => {
      dispatch(getAnnouncements(classroomId));
    }, 15000); // Polling every 15 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      dispatch(resetAnnouncements());
    };
  }, [dispatch, classroomId]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createAnnouncement({ classroomId, text }));
    setText('');
  };

  return (
    <div className={styles.announcementsSection}>
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
                Posted on {new Date(ann.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p>No announcements have been made yet.</p>
        )}
      </div>
    </div>
  );
}

export default Announcements;