import './App.css';
import { Route, Routes } from 'react-router-dom';
import StatusBar from "./features/status/StatusBar.jsx";
import ListView from "./features/list/ListView.jsx";
import Home from './components/Home.jsx';
import TapLessonView from './features/tap/TapLessonView.jsx';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { implementResotredUpdates } from './services/updateQueue.js';
import WriteSessionView from './features/write/WriteSessionView.jsx';

function App() {
  console.timeLog('t', 'inside the App');
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(implementResotredUpdates());
  }, [dispatch])

  return (
    <>
      <header>
        <StatusBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/tap-lesson" element={<TapLessonView />} />
          <Route path="/write-session" element={<WriteSessionView />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
