import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { executeCode, reset } from '../features/code/codeSlice';
import styles from './CodingArena.module.css';

function CodingArena() {
  const dispatch = useDispatch();
  const { output, isLoading } = useSelector((state) => state.code);

  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 10));`
  );
  const [language, setLanguage] = React.useState('javascript');

  React.useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleExecute = () => {
    dispatch(executeCode({ language, code }));
  };

  return (
    <div className={styles.arenaContainer}>
      <div className={styles.controls}>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button onClick={handleExecute} disabled={isLoading}>
          {isLoading ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      {/* 👇 WRAP THE EDITOR TO ACTIVATE DARK MODE 👇 */}
      <div className={styles.editor} data-color-mode="dark">
        <CodeEditor
          value={code}
          language={language}
          placeholder="Please enter your code."
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          style={{
            fontSize: 16,
            backgroundColor: '#1e1e1e', // Dark background for the editor
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
      </div>

      <div className={styles.output}>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default CodingArena;