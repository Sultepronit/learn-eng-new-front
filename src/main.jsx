import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
// import { openLocalDb } from './features/cards/indexedDbHandler.js'
import { restoreCards } from './features/cards/cardsThunks.js'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
// )


console.time('t');
console.timeLog('t', 'start');
store.dispatch(restoreCards());
console.timeLog('t', 'called restore');

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
)
