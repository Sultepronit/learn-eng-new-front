import { useState } from "react";
import './App.css';
import fetchStatus2 from "./services/fetchStatus.js";
import StatusBar from './components/StatusBar.jsx';
import DatabaseEdit from './modes/DatabaseEdit/DatabaseEdit.jsx';

function App() {
  const [fetchStatus, setFetchStatus] = useState('clear');

  return (
    <>
      {/* <StatusBar fetchStatus={fetchStatus} /> */}
      {/* <StatusBar fetchStatus={fetchStatus2.value} /> */}
      <DatabaseEdit setFetchStatus={setFetchStatus} />
    </>
  );
}

export default App;
