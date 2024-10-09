import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { openLocalDb } from './services/cardsBackup.js'

console.time('t');
openLocalDb();

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </Router>
    </Provider>
  </>
);


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </>
// );

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
// )
