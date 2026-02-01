import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Set global axios defaults so API calls use the configured backend URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.timeout = 30000; // 30s default client-side timeout (allow backend cold-starts)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
