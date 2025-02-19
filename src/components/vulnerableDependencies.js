import React, { useEffect, useState } from 'react';
import './vulnerableDependencies.css';
import config from '../config';

const VulnerableDependencies = () => {
  const [data, setData] = useState({});
  const [expandedDependencies, setExpandedDependencies] = useState({});

  useEffect(() => {
    const backendUrl = config.backendUrl;
    fetch(`${backendUrl}/api/get-vulnerable-dependencies`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const toggleDependency = (depName) => {
    setExpandedDependencies(prevState => ({
      ...prevState,
      [depName]: !prevState[depName]
    }));
  };

  const renderVulnerabilities = (vulnerabilities, type) => {
    if (vulnerabilities.length === 0) {
      return <div>No vulnerabilities found.</div>;
    }
  
    // Create a set to store unique files and CVEs
    const uniqueFiles = new Set();
    
    const uniqueCVE = new Set();
  
    // Loop through the vulnerabilities and collect unique files and CVEs
    vulnerabilities.forEach(vuln => {
      // Check and collect unique file names (if 'files' exists and is an array)
      if (vuln.files && Array.isArray(vuln.files)) {
        vuln.files.forEach(file => uniqueFiles.add(file.replace('dependency-check-report-', ''))); // Remove prefix from filename
      }
  
      // Check and collect unique CVEs (if 'cves' exists and is an array)
      if (vuln.cveCode && Array.isArray(vuln.cveCode)) {
        vuln.cveCode.forEach(cve => uniqueCVE.add(cve)); // Add each CVE to the set
      }
    });
  
    return (
      <div>
        <h4>{type} Vulnerabilities</h4>
        <ul>
          <li>
            <div>
              <strong>CVE(s):</strong> {[...uniqueCVE].join(", ")} {/* Join unique CVEs */}
            </div>
          </li>
        </ul>
        <div>
          <strong>Located in:</strong>
          <ul>
            {[...uniqueFiles].map((file, idx) => (
              <li key={idx}>{file}</li> 
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Vulnerable Dependencies</h1>
      <div>
        {Object.keys(data).length > 0 ? (
          Object.keys(data)
            .sort((a, b) => {
              // Sort by total number of critical vulnerabilities first
              const criticalA = data[a]?.critical?.length || 0;
              const criticalB = data[b]?.critical?.length || 0;
              if (criticalA !== criticalB) return criticalB - criticalA; // Descending order

              // If criticals are the same, sort by number of high vulnerabilities
              const highA = data[a]?.high?.length || 0;
              const highB = data[b]?.high?.length || 0;
              if (highA !== highB) return highB - highA; // Descending order

              // If highs are the same, sort by number of medium vulnerabilities
              const mediumA = data[a]?.medium?.length || 0;
              const mediumB = data[b]?.medium?.length || 0;
              return mediumB - mediumA; // Descending order
            })
            .map(depName => {
              const criticalCount = data[depName]?.critical?.length || 0;
              const highCount = data[depName]?.high?.length || 0;
              const mediumCount = data[depName]?.medium?.length || 0;
              const lowCount = data[depName]?.low?.length || 0;
              const filesCount = data[depName]?.filesCount || 0;

              return (
                <div key={depName} className="dependency-card">
                  <div className="dependency-header" onClick={() => toggleDependency(depName)}>
                    <h3>
                      {depName}
                      <span>
                        ({criticalCount} critical, {highCount} high, {mediumCount} medium, {lowCount} low, {filesCount} files)
                      </span>
                    </h3>
                  </div>
                  {expandedDependencies[depName] && (
                    <div className="dependency-content">
                      {data[depName]?.critical && renderVulnerabilities(data[depName].critical, 'CRITICAL')}
                      {data[depName]?.high && renderVulnerabilities(data[depName].high, 'HIGH')}
                      {data[depName]?.medium && renderVulnerabilities(data[depName].medium, 'MEDIUM')}
                      {data[depName]?.low && renderVulnerabilities(data[depName].low, 'LOW')}
                    </div>
                  )}
                </div>
              );
            })
        ) : (
          <p>No dependencies found.</p>
        )}
      </div>
    </div>
  );
};

export default VulnerableDependencies;
