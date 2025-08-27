import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getQuizSubmissions } from '../features/quizzes/quizSlice';
import styles from './QuizResults.module.css';

function QuizResults() {
  const { quizId } = useParams();
  const dispatch = useDispatch();

  const { submissions, isLoading } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(getQuizSubmissions(quizId));
  }, [dispatch, quizId]);

  if (isLoading) {
    return <h2>Loading Results...</h2>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz Submissions</h1>
      {submissions.length > 0 ? (
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student Email</th>
              <th>Score</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.student.name}</td>
                <td>{sub.student.email}</td>
                <td className={styles.score}>{sub.score} / {sub.totalQuestions}</td>
                <td>{new Date(sub.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noSubmissions}>No students have submitted this quiz yet.</p>
      )}
    </div>
  );
}

export default QuizResults;