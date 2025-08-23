import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProblem } from '../features/problems/problemSlice';
import styles from './CreateProblem.module.css';

// 1. Define the default templates outside the component
const defaultTemplates = {
  javascript: `function solve() {\n  // START_STUDENT_CODE\n  // Write your code here\n  // END_STUDENT_CODE\n}\n\n// Example of how to call the function and print output\n// const result = solve();\n// console.log(result);`,
  python: `def solve():\n  # START_STUDENT_CODE\n  # Write your code here\n  # END_STUDENT_CODE\n\n# Example of how to call the function and print output\n# result = solve()\n# print(result)`,
  cpp: `#include <iostream>\n\nvoid solve() {\n  // START_STUDENT_CODE\n  // Write your code here\n  // END_STUDENT_CODE\n}\n\nint main() {\n  solve();\n  return 0;\n}`,
};

function CreateProblem() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [testCases, setTestCases] = useState([
    { input: '', expectedOutput: '', isHidden: false },
  ]);

  const [activeTemplateLang, setActiveTemplateLang] = useState('javascript');
  // 2. Initialize the state with the default templates
  const [codeTemplates, setCodeTemplates] = useState([
      { language: 'javascript', template: defaultTemplates.javascript },
      { language: 'python', template: defaultTemplates.python },
      { language: 'cpp', template: defaultTemplates.cpp },
  ]);
  const [formError, setFormError] = useState('');

  const handleTemplateChange = (e) => {
    const newTemplates = codeTemplates.map(t => 
        t.language === activeTemplateLang 
        ? { ...t, template: e.target.value } 
        : t
    );
    setCodeTemplates(newTemplates);
  };

  const handleTestCaseChange = (index, event) => {
    const newTestCases = [...testCases];
    if (event.target.name === 'isHidden') {
      newTestCases[index].isHidden = event.target.checked;
    } else {
      newTestCases[index][event.target.name] = event.target.value;
    }
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: '', expectedOutput: '', isHidden: false },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    for (const tc of testCases) {
      if (!tc.input.trim() || !tc.expectedOutput.trim()) {
        setFormError('All test case fields (Input and Expected Output) must be filled out.');
        return;
      }
    }

    const problemData = { title, description, testCases, codeTemplates };
    dispatch(createProblem({ problemData, classroomId })).then(() => {
      navigate(`/classroom/${classroomId}`);
    });
  };

  return (
    <div className={styles.container}>
      <h2>Create New Coding Problem</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.problemTitle}
        />
        <textarea
          placeholder="Problem Description (supports Markdown)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="10"
          className={styles.problemDescription}
        ></textarea>
        
        <h3>Code Templates</h3>
        <p className={styles.instructions}>
          Provide the full runnable code below. Mark the area where the student should write their code by placing their starter code between 
          <strong>`// START_STUDENT_CODE`</strong> and <strong>`// END_STUDENT_CODE`</strong> comments (use `#` for Python).
        </p>
        <div className={styles.templateEditor}>
            <div className={styles.templateTabs}>
                <button type="button" onClick={() => setActiveTemplateLang('javascript')} className={activeTemplateLang === 'javascript' ? styles.active : ''}>JavaScript</button>
                <button type="button" onClick={() => setActiveTemplateLang('python')} className={activeTemplateLang === 'python' ? styles.active : ''}>Python</button>
                <button type="button" onClick={() => setActiveTemplateLang('cpp')} className={activeTemplateLang === 'cpp' ? styles.active : ''}>C++</button>
            </div>
            <textarea
              value={codeTemplates.find(t => t.language === activeTemplateLang).template}
              onChange={handleTemplateChange}
              rows="15"
              className={styles.templateTextarea}
              placeholder={`Enter the starter code for ${activeTemplateLang}...`}
            />
        </div>

        <h3>Test Cases</h3>
        {testCases.map((tc, index) => (
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
        
        <button type="submit" className={styles.submitProblem}>Create Problem</button>
      </form>
    </div>
  );
}

export default CreateProblem;