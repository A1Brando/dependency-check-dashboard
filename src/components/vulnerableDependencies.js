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
    
    const uniqueFiles = new Set();
    vulnerabilities.forEach(vuln => {
    const files = Array.isArray(vuln.files) ? vuln.files : Array.from(vuln.files);
    files.forEach(file => uniqueFiles.add(file.replace('dependency-check-report-', ''))); // Remove 'dependency-check-report-' from the filename
  });

    return (
      <div>
        <h4>{type} Vulnerabilities</h4>
        <ul>
          {vulnerabilities.map((vuln, index) => (
            <li key={index}>
              <div>CVE(s): {vuln.cveCode.join(", ")}</div>
            </li>
          ))}
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
              const severityA = data[a].critical && data[a].critical.length > 0
                ? 'CRITICAL'
                : data[a].high && data[a].high.length > 0
                ? 'HIGH'
                : data[a].medium && data[a].medium.length > 0
                ? 'MEDIUM'
                : 'LOW';

              const severityB = data[b].critical && data[b].critical.length > 0
                ? 'CRITICAL'
                : data[b].high && data[b].high.length > 0
                ? 'HIGH'
                : data[b].medium && data[b].medium.length > 0
                ? 'MEDIUM'
                : 'LOW';

              const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
              return severities.indexOf(severityA) - severities.indexOf(severityB);
            })
            .map(depName => {
              const criticalCount = data[depName]?.criticalCount || 0;
              const highCount = data[depName]?.highCount || 0;
              const mediumCount = data[depName]?.mediumCount || 0;
              const lowCount = data[depName]?.lowCount || 0;
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

