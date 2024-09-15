import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { openLocalDb } from './features/cards/indexedDbHandler.js'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
// )

console.log('So, here we go!');

console.time('idb');
  // await openLocalDb();
  openLocalDb();
  // initIndexedDb();
// console.timeEnd('idb');
console.timeLog('idb');

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
)
