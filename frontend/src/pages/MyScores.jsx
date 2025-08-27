import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMySubmissions, reset } from '../features/quizzes/quizSlice';
import styles from './MyScores.module.css';

function MyScores() {
  const dispatch = useDispatch();
  const { mySubmissions, isLoading } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(getMySubmissions());
    return () => {
        dispatch(reset()); // Reset on unmount to refetch next time
    };
  }, [dispatch]);

  // Group submissions by quiz title
  const groupedSubmissions = useMemo(() => {
    if (!mySubmissions) return {};
    return mySubmissions.reduce((acc, sub) => {
      const title = sub.quiz.title;
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(sub);
      // Sort attempts by date, newest first
      acc[title].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return acc;
    }, {});
  }, [mySubmissions]);

  if (isLoading) {
    return <h2>Loading Scores...</h2>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.scoresTitle}>My Quiz Scores</h1>
      {Object.keys(groupedSubmissions).length > 0 ? (
        <div className={styles.scoresGrid}>
          {Object.entries(groupedSubmissions).map(([title, subs]) => (
            <div key={title} className={styles.scoreCard}>
              <h3>{title}</h3>
              <ul className={styles.attemptsList}>
                {subs.map((sub, index) => (
                  <li key={sub._id} className={styles.attemptItem}>
                    <span>Attempt #{subs.length - index}</span>
                    <span className={styles.date}>
                      {new Date(sub.createdAt).toLocaleString()}
                    </span>
                    <span className={styles.score}>
                      <strong>{sub.score} / {sub.totalQuestions}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't taken any quizzes yet.</p>
      )}
    </div>
  );
}

export default MyScores;