import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMySubmissions } from '../features/quizzes/quizSlice';
import styles from './MyScores.module.css';

function MyScores() {
  const dispatch = useDispatch();
  const { mySubmissions, isLoading } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(getMySubmissions());
  }, [dispatch]);

  if (isLoading) {
    return <h2>Loading Scores...</h2>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.scoresTitle}>My Quiz Scores</h1>
      {mySubmissions.length > 0 ? (
        <div className={styles.scoresGrid}>
          {mySubmissions.map((sub) => (
            <div key={sub._id} className={styles.scoreCard}>
              <h3>{sub.quiz.title}</h3>
              <p className={styles.score}>
                Score: <strong>{sub.score} / {sub.totalQuestions}</strong>
              </p>
              <p className={styles.date}>
                Taken on: {new Date(sub.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.scoresText}>You haven't taken any quizzes yet.</p>
      )}
    </div>
  );
}

export default MyScores;