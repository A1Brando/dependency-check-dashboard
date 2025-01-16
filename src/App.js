import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar'; 
import Dashboard from './components/dashboard'; 
import Repos from './components/repos'; 
import ProjectDetails from './components/projectDetails'; 
import Settings from './components/settings';
import VulnerableDependencies from './components/vulnerableDependencies';
import './App.css'; 


const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {

    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));  
    }
  }, []);

  useEffect(() => {    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  
  }, [isDarkMode]);
  

  // Toggle dark mode function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);  
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '50px', padding: '20px', width: '90%' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>} /> 
          <Route path="/repos" element={<Repos isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>} /> 
          <Route path="/project/:id" element={<ProjectDetails />} /> 
          <Route path="/vulnerableDependencies" element={<VulnerableDependencies isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>} />
          <Route path="/settings" element={<Settings isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
