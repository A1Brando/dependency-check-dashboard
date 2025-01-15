import React, { useEffect, useState } from 'react';
import './repos.css';
import config from '../config'; // Import the config file


const Repos = () => {
    const [files, setFiles] = useState([]);  

    useEffect(() => {
        const backendUrl = config.backendUrl;

        fetch(`${backendUrl}/api/get-file-names`)
            .then(response => response.json())
            .then(data => {
                const newFiles = data.files;

                const cleanedFiles = newFiles.map(file =>
                    file.replace('dependency-check-report-', '').replace('.json', '')
                );

                setFiles(cleanedFiles);  
            })
            .catch(error => console.error('Error fetching file names:', error));
    }, []);

    const handleFileRemove = (fileToRemove) => {
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles); 
    };

    return (
        <div className="repos">
            <h1>Repos</h1>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <a href={`${config.backendUrl}/reports/dependency-check-report-${file}.html`} target="_blank" rel="noopener noreferrer">
                            {file} 
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Repos;
