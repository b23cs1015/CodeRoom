import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProblemSubmissions } from '../features/problems/problemSlice';
import CodeEditor from '@uiw/react-textarea-code-editor';
import styles from './ProblemSubmissions.module.css';

function ProblemSubmissions() {
  const { problemId } = useParams();
  const dispatch = useDispatch();

  const { submissions, isLoading } = useSelector((state) => state.problems);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    dispatch(getProblemSubmissions(problemId));
  }, [dispatch, problemId]);

  if (isLoading) {
    return <h2>Loading Submissions...</h2>;
  }

  return (
    <>
      <div className={styles.container}>
        <h1>Problem Submissions</h1>
        {submissions.length > 0 ? (
          <table className={styles.submissionsTable}>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Score</th>
                <th>Submitted On</th>
                <th>View Code</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id}>
                  <td>{sub.student.name} ({sub.student.email})</td>
                  <td>{sub.score} / {sub.totalTestCases}</td>
                  <td>{new Date(sub.createdAt).toLocaleString()}</td>
                  <td>
                    <button onClick={() => setSelectedSubmission(sub)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students have submitted a solution for this problem yet.</p>
        )}
      </div>

      {/* Code Viewing Modal */}
      {selectedSubmission && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedSubmission(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Submission by {selectedSubmission.student.name}</h3>
            <div data-color-mode="dark">
              <CodeEditor
                value={selectedSubmission.code}
                language={selectedSubmission.language}
                padding={15}
                readOnly
                style={{
                  fontSize: 16,
                  backgroundColor: "#1e1e1e",
                  fontFamily: 'monospace',
                  maxHeight: '60vh',
                  overflowY: 'auto'
                }}
              />
            </div>
            <button className={styles.closeButton} onClick={() => setSelectedSubmission(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProblemSubmissions;