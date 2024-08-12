import './App.css';
import DatabaseEdit from './modes/DatabaseEdit/DatabaseEdit.jsx';
import StatusBar from "./features/status/StatusBar.jsx";

function App() {
  return (
    <>
      <StatusBar />
      <DatabaseEdit />
    </>
  );
}

export default App;
