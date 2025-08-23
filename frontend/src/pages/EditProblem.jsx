import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProblemById, updateProblem, reset } from '../features/problems/problemSlice';
import styles from './CreateProblem.module.css'; // Reuses styles from CreateProblem

function EditProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProblem, isLoading, isError, message } = useSelector((state) => state.problems);

  // Use local state for form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    testCases: [{ input: '', expectedOutput: '', isHidden: false }],
    codeTemplates: [],
  });
  const [activeTemplateLang, setActiveTemplateLang] = useState('javascript');
  const [formError, setFormError] = useState('');

  // Fetch problem data when the component mounts
  useEffect(() => {
    dispatch(getProblemById(problemId));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, problemId]);

  // Populate the form with the fetched problem data
  useEffect(() => {
    if (currentProblem) {
      setFormData({
        title: currentProblem.title,
        description: currentProblem.description,
        testCases: currentProblem.testCases,
        codeTemplates: currentProblem.codeTemplates,
      });
    }
  }, [currentProblem]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
  };

  const handleTemplateChange = (e) => {
    const newTemplates = formData.codeTemplates.map(t => 
        t.language === activeTemplateLang ? { ...t, template: e.target.value } : t
    );
    setFormData((prevState) => ({ ...prevState, codeTemplates: newTemplates }));
  };

  const handleTestCaseChange = (index, event) => {
    const newTestCases = [...formData.testCases];
    if (event.target.name === 'isHidden') {
      newTestCases[index].isHidden = event.target.checked;
    } else {
      newTestCases[index][event.target.name] = event.target.value;
    }
    setFormData((prevState) => ({ ...prevState, testCases: newTestCases }));
  };

  const addTestCase = () => {
    setFormData((prevState) => ({
      ...prevState,
      testCases: [...prevState.testCases, { input: '', expectedOutput: '', isHidden: false }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    for (const tc of formData.testCases) {
      if (!tc.input.trim() || !tc.expectedOutput.trim()) {
        setFormError('All test case fields (Input and Expected Output) must be filled out.');
        return;
      }
    }
    
    const problemData = {
        title: formData.title,
        description: formData.description,
        testCases: formData.testCases,
        codeTemplates: formData.codeTemplates
    };

    dispatch(updateProblem({ problemId, problemData })).then(() => {
        navigate(`/classroom/${currentProblem.classroom}`);
    });
  };

  if (isLoading) return <p>Loading Problem for Editing...</p>;
  if (isError) return <p>Error: {message}</p>;

  return (
    <div className={styles.container}>
      <h2>Edit Coding Problem</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Problem Title"
          value={formData.title}
          onChange={handleChange}
          required
          className={styles.problemTitle}
        />
        <textarea
          name="description"
          placeholder="Problem Description (supports Markdown)"
          value={formData.description}
          onChange={handleChange}
          required
          rows="10"
          className={styles.problemDescription}
        ></textarea>
        
        <h3>Code Templates</h3>
        <p className={styles.instructions}>
          Provide the full runnable code below, marking the editable area for the student.
        </p>
        <div className={styles.templateEditor}>
            <div className={styles.templateTabs}>
                <button type="button" onClick={() => setActiveTemplateLang('javascript')} className={activeTemplateLang === 'javascript' ? styles.active : ''}>JavaScript</button>
                <button type="button" onClick={() => setActiveTemplateLang('python')} className={activeTemplateLang === 'python' ? styles.active : ''}>Python</button>
                <button type="button" onClick={() => setActiveTemplateLang('cpp')} className={activeTemplateLang === 'cpp' ? styles.active : ''}>C++</button>
            </div>
            <textarea
              value={formData.codeTemplates.find(t => t.language === activeTemplateLang)?.template || ''}
              onChange={handleTemplateChange}
              rows="15"
              className={styles.templateTextarea}
              placeholder={`Enter the starter code for ${activeTemplateLang}...`}
            />
        </div>

        <h3>Test Cases</h3>
        {formData.testCases.map((tc, index) => (
          <div key={index} className={styles.testCaseBox}>
            <h4>Test Case {index + 1}</h4>
            <textarea
              name="input"
              placeholder="Input"
              value={tc.input}
              onChange={(e) => handleTestCaseChange(index, e)}
              rows="3"
            ></textarea>
            <textarea
              name="expectedOutput"
              placeholder="Expected Output"
              value={tc.expectedOutput}
              onChange={(e) => handleTestCaseChange(index, e)}
              rows="3"
            ></textarea>
            <label>
              <input
                type="checkbox"
                name="isHidden"
                checked={tc.isHidden}
                onChange={(e) => handleTestCaseChange(index, e)}
              />
              Hidden Test Case
            </label>
          </div>
        ))}

        <button type="button" onClick={addTestCase}>Add Test Case</button>
        
        {formError && <p className={styles.formError}>{formError}</p>}
        
        <button type="submit" className={styles.submitProblem}>Update Problem</button>
      </form>
    </div>
  );
}

export default EditProblem;