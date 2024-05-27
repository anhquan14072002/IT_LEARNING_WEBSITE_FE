import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "../node_modules/primeflex/primeflex.css"
import "../node_modules/primeflex/primeflex.css"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider >
    <App />
    </PrimeReactProvider>
  </React.StrictMode>,
)
