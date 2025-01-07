import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';  // Or import './App.css'; depending on where you're writing your styles


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>  {/* Wrap your entire app with BrowserRouter */}
    <App />
  </BrowserRouter>
);
