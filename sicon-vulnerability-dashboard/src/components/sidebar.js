import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaGithub, FaProjectDiagram, FaTools } from 'react-icons/fa'; 
import './sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/dashboard">
                        <FaHome /> Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/repos">
                        <FaGithub /> Repos
                    </Link>
                </li>
                <li>
                    <Link to="/settings">
                        <FaTools /> Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
