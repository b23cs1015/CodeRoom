import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Classroom from './pages/Classroom';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import MyScores from './pages/MyScores';
import CreateProblem from './pages/CreateProblem';
import ProblemView from './pages/ProblemView';
import ProblemSubmissions from './pages/ProblemSubmissions';
import EditProblem from './pages/EditProblem';

function App() {
  return (
    <div className="dark-bg">
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/classroom/:classroomId' element={<Classroom />} />
          <Route path='/classroom/:classroomId/create-quiz' element={<CreateQuiz />} />
          <Route path='/classroom/:classroomId/create-problem' element={<CreateProblem />} />
          <Route path='/quiz/:quizId' element={<TakeQuiz />} />
          <Route path='/quiz/:quizId/results' element={<QuizResults />} />
          <Route path='/my-scores' element={<MyScores />} />
          <Route path='/problem/:problemId' element={<ProblemView />} />
          <Route path='/problem/:problemId/submissions' element={<ProblemSubmissions />} />
          <Route path='/problem/:problemId/edit' element={<EditProblem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;