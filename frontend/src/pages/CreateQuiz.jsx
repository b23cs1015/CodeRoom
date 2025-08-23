import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createQuiz } from '../features/quizzes/quizSlice';
import styles from './CreateQuiz.module.css';

function CreateQuiz() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] },
  ]);

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = event.target.value;
    setQuestions(newQuestions);
  };
  
  const handleCorrectOptionChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.forEach((option, i) => {
        option.isCorrect = i === oIndex;
    });
    setQuestions(newQuestions);
  }

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }]);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quizData = { title, questions };
    dispatch(createQuiz({ quizData, classroomId })).then(() => {
        navigate(`/classroom/${classroomId}`);
    });
  };

  return (
    <div className={styles.container}>
      <h2>Create New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.quizTitle}
        />

        {questions.map((q, qIndex) => (
          <div key={qIndex} className={styles.questionBox}>
            <h4>Question {qIndex + 1}</h4>
            <input
              type="text"
              name="questionText"
              placeholder="Enter question text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              required
            />

            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className={styles.optionInput}>
                <input 
                    type="radio" 
                    name={`correct_option_${qIndex}`}
                    checked={opt.isCorrect}
                    onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt.text}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => addOption(qIndex)}>Add Option</button>
          </div>
        ))}

        <button type="button" onClick={addQuestion}>Add Another Question</button>
        <button type="submit" className={styles.submitQuiz}>Create Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;