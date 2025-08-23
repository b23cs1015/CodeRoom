import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getQuizById, submitQuiz, reset } from '../features/quizzes/quizSlice';
import styles from './TakeQuiz.module.css';

function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentQuiz, isLoading, submissionResult } = useSelector((state) => state.quizzes);
  
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    // Only fetch the quiz if there isn't a submission result yet
    if (!submissionResult) {
      dispatch(getQuizById(quizId));
    }

    // This cleanup function will now only run if the component is left *before* submitting
    return () => {
      if (!submissionResult) {
        dispatch(reset());
      }
    };
  }, [dispatch, quizId, user, navigate, submissionResult]);

  const handleOptionSelect = (questionId, selectedOptionId) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId)];
    newAnswers.push({ questionId, selectedOptionId });
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    dispatch(submitQuiz({ quizId, answers }));
  };

  if (isLoading || (!currentQuiz && !submissionResult)) {
    return <h2>Loading Quiz...</h2>;
  }

  if (submissionResult) {
    return (
        <div className={styles.resultsContainer}>
            <h2>Quiz Submitted!</h2>
            <p className={styles.score}>Your Score: {submissionResult.score} / {submissionResult.totalQuestions}</p>
            <button onClick={() => {
                dispatch(reset()); // Reset state before navigating away
                navigate(`/classroom/${currentQuiz.classroom}`);
            }}>Back to Classroom</button>
        </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>{currentQuiz.title}</h1>
      {currentQuiz.questions.map((q, qIndex) => (
        <div key={q._id} className={styles.questionBox}>
          <h4>{qIndex + 1}. {q.questionText}</h4>
          <div className={styles.options}>
            {q.options.map((opt) => (
              <label key={opt._id} className={styles.optionLabel}>
                <input
                  type="radio"
                  name={q._id}
                  value={opt._id}
                  onChange={() => handleOptionSelect(q._id, opt._id)}
                />
                {opt.text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} className={styles.submitButton}>Submit Quiz</button>
    </div>
  );
}

export default TakeQuiz;