import './App.css';
import { Route, Routes } from 'react-router-dom';
import StatusBar from "./features/status/StatusBar.jsx";
import ListView from "./features/list/ListView.jsx";
import Home from './components/Home.jsx';

function App() {
  return (
    <>
      <header>
        <StatusBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="list" element={<ListView />} />
        </Routes>
      </main>
      {/* <ListView /> */}
    </>
  );
}

export default App;
