const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3001;


const fileDirectoryPath = 'C:/data';

app.use(cors()); 
app.use(express.json()); 
const reportsDirectory = path.join(fileDirectoryPath); 
app.use('/reports', express.static(reportsDirectory));

// SQLite database connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'trendData.sqlite'  // The SQLite database file
});

const Trend = sequelize.define('Trend', {
    date: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    vulnerabilities: {
        type: DataTypes.INTEGER,  
        allowNull: false
    }
});

const VulnerabilityTrend = sequelize.define('VulnerabilityTrend', {
    date: {
        type: DataTypes.STRING,  
        allowNull: false
    },
    LOW: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    MEDIUM: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    HIGH: {
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    CRITICAL: {
        type: DataTypes.INTEGER, 
        allowNull: false
    }
});

sequelize.sync({ force: false })  
    .then(() => console.log('Trend table is in sync with the database.'))
    .catch(error => console.error('Error syncing database:', error));

// Function to read all JSON files in a directory and process them
const readFilesInDirectory = (directoryPath) => {
    let totalDependencies = 0;
    let totalVulnerabilities = [];
    let fileVulnerabilitiesCount = [];
    let vulnerabilitiesPerFile = [];
    let currentDayVulnerabilities = 0;
    let severityCountsForPie = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };

    // Get all files in the directory
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(directoryPath, file);
            //const htmlFilePath = path.join(directoryPath, file.replace('.json', '.html'));
            const parsedData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

            // Parse dependencies and vulnerabilities
            totalDependencies += parsedData.dependencies.length;
            parsedData.dependencies.forEach(dep => {
                if (dep.vulnerabilities) {
                    totalVulnerabilities.push(...dep.vulnerabilities);
                    currentDayVulnerabilities += dep.vulnerabilities.length;

                    dep.vulnerabilities.forEach(vuln => {
                        if (vuln.severity === 'LOW') severityCountsForPie.LOW++;
                        if (vuln.severity === 'MEDIUM') severityCountsForPie.MEDIUM++;
                        if (vuln.severity === 'HIGH') severityCountsForPie.HIGH++;
                        if (vuln.severity === 'CRITICAL') severityCountsForPie.CRITICAL++;
                    });
                }
            });

            // Count vulnerabilities for this file
            let low = 0, medium = 0, high = 0, critical = 0;

            parsedData.dependencies.forEach(dep => {
                if (dep.vulnerabilities) {
                    dep.vulnerabilities.forEach(vuln => {
                        if (vuln.severity === 'LOW') low++;
                        if (vuln.severity === 'MEDIUM') medium++;
                        if (vuln.severity === 'HIGH') high++;
                        if (vuln.severity === 'CRITICAL') critical++;
                    });
                }
            });

            vulnerabilitiesPerFile.push({
                name: file.replace('dependency-check-report-', '').replace('.json', ''),
                low: low,
                medium: medium,
                high: high,
                critical: critical,
                htmlReport: `http://localhost:3001/reports/${file.replace('.json', '.html')}`
            });
        }
    });
    
    // Use the current date for the trend data
    const currentDay = new Date().toISOString().split('T')[0];
    const trendData = [{
        date: currentDay,
        vulnerabilities: currentDayVulnerabilities
    }];
    
    const dailyVulnerabilityTrendData = [{
        date: new Date().toISOString().split('T')[0], 
        LOW: severityCountsForPie.LOW,
        MEDIUM: severityCountsForPie.MEDIUM,
        HIGH: severityCountsForPie.HIGH,
        CRITICAL: severityCountsForPie.CRITICAL
    }];


    Trend.findOne({ where: { date: currentDay } })
        .then(existingTrend => {
            if (existingTrend) {
                console.log(`Replacing vulnerabilities for ${currentDay}`);
                existingTrend.vulnerabilities = currentDayVulnerabilities; 
                existingTrend.save(); 
                console.log(`Updated vulnerabilities for ${currentDay}: ${currentDayVulnerabilities}`);
            } else {
                // If the record doesn't exist, create a new one with the current day's vulnerabilities
                Trend.create({
                    date: currentDay,
                    vulnerabilities: currentDayVulnerabilities
                }).then(() => {
                    console.log(`Created new record for ${currentDay} with vulnerabilities: ${currentDayVulnerabilities}`);
                });
            }
        })
        .catch(err => {
            console.error("Error updating or creating trend data:", err);
        });

    VulnerabilityTrend.findOne({ where: { date: currentDay } })
    .then(existingTrend => {
        if (existingTrend) {
            existingTrend.LOW = severityCountsForPie.LOW;
            existingTrend.MEDIUM = severityCountsForPie.MEDIUM;
            existingTrend.HIGH = severityCountsForPie.HIGH;
            existingTrend.CRITICAL = severityCountsForPie.CRITICAL;
            existingTrend.save();
        } else {
            // Create new record if no data exists for the current day
            VulnerabilityTrend.create({
                date: currentDay,
                LOW: severityCountsForPie.LOW,
                MEDIUM: severityCountsForPie.MEDIUM,
                HIGH: severityCountsForPie.HIGH,
                CRITICAL: severityCountsForPie.CRITICAL
            });
        }
    })
    .catch(error => {
        console.error("Error updating or creating vulnerability trend data:", error);
    });

    return {
        totalDependencies,
        totalVulnerabilities,
        trend: trendData,
        dailyVulnerabilityTrendData,
        fileVulnerabilitiesCount,
        vulnerabilitiesPerFile,
        severityCountsForPie 
    };
};

app.get('/api/get-dashboard-data', (req, res) => {
    const directoryPath = fileDirectoryPath; 

    try {
        Trend.findAll()  
            .then(trends => {
                const trendData = trends.map(trend => ({
                    date: trend.date,
                    vulnerabilities: trend.vulnerabilities
                }));

                VulnerabilityTrend.findAll() 
                    .then(vulnerabilityTrends => {
                        const dailyVulnerabilityTrendData = vulnerabilityTrends.map(item => ({
                            date: item.date,
                            LOW: item.LOW,
                            MEDIUM: item.MEDIUM,
                            HIGH: item.HIGH,
                            CRITICAL: item.CRITICAL
                        }));

                        const { totalDependencies, totalVulnerabilities, fileVulnerabilitiesCount, vulnerabilitiesPerFile, severityCountsForPie } = readFilesInDirectory(directoryPath);


                        const severityCount = totalVulnerabilities.reduce((acc, vuln) => {
                            if (vuln.severity) {
                                acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
                            }
                            return acc;
                        }, {});

                        // Send back the data as JSON response
                        res.json({
                            totalDependencies,
                            vulnerabilities: totalVulnerabilities,
                            severityCountForPie: severityCountsForPie,
                            severityCount,
                            trend: trendData, 
                            dailyVulnerabilityTrendData,
                            fileVulnerabilitiesCount,
                            vulnerabilitiesPerFile
                        });

                        console.log("Sending data to client:", {
                            totalDependencies,
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching vulnerability type trend data:', error);
                        res.status(500).json({ error: 'Error fetching vulnerability type trend data' });
                    });
            })
            .catch(error => {
                console.error('Error fetching trend data:', error);
                res.status(500).json({ error: 'Error fetching trend data' });
            });
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Error reading files' });
    }
});

// Refresh every 30 mins
setInterval(() => {
    console.log("Refreshing data...");
    readFilesInDirectory(fileDirectoryPath);
}, 1800000);  


// Endpoint to show file names
app.get('/api/get-file-names', (req, response) => {
    const directoryPath = fileDirectoryPath; 

    try {
        const files = fs.readdirSync(directoryPath);  
        const jsonFiles = files.filter(file => file.endsWith('.json')); 

        const cleanedFiles = jsonFiles.map(file => file.replace('dependency-check-report-', '').replace('.json', ''));

        response.json({
            files: cleanedFiles  
        });
    } catch (error) {
        console.error('Error reading files:', error);
        response.status(500).json({ error: 'Error reading files' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
