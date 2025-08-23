import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getQuizzesForClassroom } from '../features/quizzes/quizSlice';
import styles from './QuizList.module.css';

function QuizList() {
  const { classroomId } = useParams();
  const dispatch = useDispatch();
  
  // Get user from auth state
  const { user } = useSelector((state) => state.auth); 
  const { quizzes, isLoading } = useSelector((state) => state.quizzes);

  useEffect(() => {
    if (classroomId) {
      dispatch(getQuizzesForClassroom(classroomId));
    }
  }, [dispatch, classroomId]);

  if (isLoading) {
    return <p>Loading quizzes...</p>;
  }
  
  if (!Array.isArray(quizzes)) {
    return <p>No quizzes have been created for this class yet.</p>;
  }

  return (
    <div className={styles.quizListSection}>
      <h2>Quizzes</h2>
      <div className={styles.quizGrid}>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => {
            // Determine the correct link based on user role
            const linkTo = user.role === 'Teacher' 
              ? `/quiz/${quiz._id}/results` 
              : `/quiz/${quiz._id}`;

            return (
              <Link to={linkTo} key={quiz._id} className={styles.quizCard}>
                <h3>{quiz.title}</h3>
                <p>{quiz.questions?.length || 0} Questions</p>
              </Link>
            )
          })
        ) : (
          <p>No quizzes have been created for this class yet.</p>
        )}
      </div>
    </div>
  );
}

export default QuizList;