import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getProblemsForClassroom, reset } from '../features/problems/problemSlice'; // 1. Import reset
import styles from './ProblemList.module.css';

function ProblemList() {
  const { classroomId } = useParams();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { problems, isLoading, isError, message } = useSelector((state) => state.problems);

  useEffect(() => {
    if (classroomId) {
      dispatch(getProblemsForClassroom(classroomId));
    }
    
    // 2. Add this cleanup function to reset the state on unmount
    return () => {
        dispatch(reset());
    };
  }, [dispatch, classroomId]);

  if (isError) {
    return (
      <div className={styles.problemListSection}>
        <h3>Error loading problems</h3>
        <p>{message}</p>
      </div>
    );
  }
  
  if (isLoading) {
    return <p>Loading problems...</p>;
  }

  return (
    <div className={styles.problemListSection}>
      {problems.length > 0 ? (
        <ul className={styles.problemList}>
          {problems.map((problem) => (
            <li key={problem._id}>
              <Link to={`/problem/${problem._id}`} className={styles.problemLink}>
                <div className={styles.problemInfo}>
                  <span>{problem.title}</span>
                  <small>Created on: {new Date(problem.createdAt).toLocaleDateString()}</small>
                </div>
                <div className={styles.submissionCount}>
                  {problem.submissionCount} Submissions
                </div>
              </Link>
              {user.role === 'Teacher' && (
                <div className={styles.teacherLinks}>
                  <Link to={`/problem/${problem._id}/submissions`} className={styles.submissionsLink}>
                    View Submissions
                  </Link>
                  <Link to={`/problem/${problem._id}/edit`} className={styles.editLink}>
                    Edit
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No coding problems have been created for this class yet.</p>
      )}
    </div>
  );
}

export default ProblemList;