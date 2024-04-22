import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import './index.css'

import App from './App'

const promise = axios.get('http://localhost:3001/db')
console.log(promise)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)