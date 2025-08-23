import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProblemById, reset, submitSolution, runCode } from '../features/problems/problemSlice';
import CodeEditor from '@uiw/react-textarea-code-editor';
import styles from './ProblemView.module.css';

function ProblemView() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentProblem, isLoading, isError, message, submissionResult, runResults } = useSelector((state) => state.problems);
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    if (!user) navigate('/login');
    dispatch(getProblemById(problemId));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, problemId, user, navigate]);

  const templateParts = useMemo(() => {
    if (!currentProblem || !currentProblem.codeTemplates) return null;
    
    const templateObj = currentProblem.codeTemplates.find(t => t.language === language);
    if (!templateObj) return { before: `// No template for ${language}`, studentCode: '', after: '' };
    
    const template = templateObj.template;
    const startMarker = `// START_STUDENT_CODE`;
    const endMarker = `// END_STUDENT_CODE`;
    const pythonStartMarker = `# START_STUDENT_CODE`;
    const pythonEndMarker = `# END_STUDENT_CODE`;

    let startIndex, endIndex, actualStartMarker, actualEndMarker;

    if (template.includes(startMarker)) {
        actualStartMarker = startMarker;
        actualEndMarker = endMarker;
    } else {
        actualStartMarker = pythonStartMarker;
        actualEndMarker = pythonEndMarker;
    }
    startIndex = template.indexOf(actualStartMarker);
    endIndex = template.lastIndexOf(actualEndMarker);

    // This is the crucial safety net. If markers are NOT found,
    // it returns the whole template as a read-only 'before' section.
    if (startIndex === -1 || endIndex === -1) {
      return { before: template, studentCode: '', after: '' };
    }

    const before = template.substring(0, startIndex + actualStartMarker.length);
    const studentCode = template.substring(startIndex + actualStartMarker.length, endIndex).trim();
    const after = template.substring(endIndex);

    return { before, studentCode, after };
  }, [currentProblem, language]);

  useEffect(() => {
    // This logic now correctly sets the code when the template loads or language changes.
    if (templateParts) {
      setCode(templateParts.studentCode);
    }
  }, [templateParts]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleRunCode = () => {
    dispatch(runCode({ problemId, solutionData: { code, language } }));
  };
  
  const handleSubmitSolution = () => {
    dispatch(submitSolution({ problemId, solutionData: { code, language } }));
  };

  if (isError) {
    return (
        <div className={styles.container}>
            <h2>Error</h2>
            <p>{message}</p>
        </div>
    );
  }

  if (isLoading || !currentProblem) {
    return <h2>Loading Problem...</h2>;
  }
  
  if (submissionResult) {
    return (
      <div className={styles.resultsContainer}>
        <h2>Submission Results</h2>
        <p className={styles.score}>
          You Passed: <strong>{submissionResult.submission.score} / {submissionResult.submission.totalTestCases}</strong> test cases
        </p>
        <div className={styles.testResultList}>
            {submissionResult.results.map((result, index) => (
                <div key={index} className={styles.testResultItem}>
                    <span>{result.name}</span>
                    <span className={result.passed ? styles.pass : styles.fail}>
                        {result.passed ? 'Passed' : 'Failed'}
                    </span>
                </div>
            ))}
        </div>
        <button className="btn" onClick={() => navigate(`/classroom/${currentProblem.classroom}`)}>Back to Classroom</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.problemDetails}>
        <h2>{currentProblem.title}</h2>
        <p className={styles.description}>{currentProblem.description}</p>
        <h3>Visible Test Cases</h3>
        {currentProblem.testCases.map((tc, index) => (
          <div key={tc._id} className={styles.testCase}>
            <strong>Test Case {index + 1}</strong>
            <pre><strong>Input:</strong><br/>{tc.input}</pre>
            <pre><strong>Expected Output:</strong><br/>{tc.expectedOutput}</pre>
          </div>
        ))}
      </div>

      <div className={styles.ide}>
        <div className={styles.controls}>
          <select value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          <button onClick={handleRunCode} disabled={isLoading} className={`btn ${styles.runButton}`}>
            {isLoading ? 'Running...' : 'Run'}
          </button>
          <button onClick={handleSubmitSolution} disabled={isLoading} className={`btn ${styles.submitButton}`}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        <div className={styles.editorWrapper} data-color-mode="dark">
          <CodeEditor
            value={templateParts?.before || ''}
            language={language}
            padding={15}
            readOnly
            className={styles.readOnlyEditor}
            style={{ fontSize: 16, fontFamily: 'monospace' }}
          />
          <CodeEditor
            value={code}
            language={language}
            onChange={(e) => setCode(e.target.value)}
            padding={15}
            className={styles.editableEditor}
            style={{ fontSize: 16, fontFamily: 'monospace' }}
          />
          <CodeEditor
            value={templateParts?.after || ''}
            language={language}
            padding={15}
            readOnly
            className={styles.readOnlyEditor}
            style={{ fontSize: 16, fontFamily: 'monospace' }}
          />
        </div>

        <div className={styles.output}>
            {isLoading && !runResults.length && <p>Running...</p>}
            {runResults.length > 0 && !isLoading && (
                <div className={styles.runResultsContainer}>
                    {runResults.map((result, index) => (
                        <div key={index} className={styles.resultCard}>
                            <div className={styles.resultHeader}>
                                <h4>{result.testCase}</h4>
                                <span className={result.passed ? styles.pass : styles.fail}>
                                    {result.passed ? 'Passed' : 'Failed'}
                                </span>
                            </div>
                            <pre><strong>Input:</strong><br/>{result.input}</pre>
                            <pre><strong>Expected Output:</strong><br/>{result.expectedOutput}</pre>
                            <pre><strong>Your Output:</strong><br/>{result.actualOutput}</pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default ProblemView;