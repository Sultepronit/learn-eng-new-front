import { useState } from "react";
import './App.css';
import StatusBar from './components/StatusBar.jsx';
import DatabaseEdit from './modes/DatabaseEdit/DatabaseEdit.jsx';

function App() {
  const [fetchStatus, setFetchStatus] = useState('clear');

  return (
    <>
      <StatusBar fetchStatus={fetchStatus} />
      <DatabaseEdit setFetchStatus={setFetchStatus} />
    </>
  );
}

export default App;
