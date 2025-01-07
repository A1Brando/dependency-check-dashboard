import React from 'react';

const Settings = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="settings">
      <h2>Settings</h2>
      <button onClick={toggleTheme}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
};

export default Settings;
