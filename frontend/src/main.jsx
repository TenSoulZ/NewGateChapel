import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/scss/main.scss'

// Hide the initial loader once React finishes mounting
const initialLoader = document.getElementById('initial-loader');
if (initialLoader) {
  initialLoader.classList.add('fade-out');
  // Remove from DOM after fade-out animation completes
  setTimeout(() => {
    initialLoader.remove();
  }, 500);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

