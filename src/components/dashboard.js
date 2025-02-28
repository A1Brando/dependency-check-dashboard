import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import config from '../config';

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    return `Vulnerabilities: ${tooltipItem.raw}`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Date'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Number of Vulnerabilities'
            }         
        }
    }
};

const pieChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    return `Vulnerabilities: ${tooltipItem.raw}`;
                }
            }
        }
    }
};

const barChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    return `Vulnerabilities: ${tooltipItem.raw}`;
                }
            }
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Files'
            },
            stacked: true,
        },
        y: {
            title: {
                display: true,
                text: 'Number of Vulnerabilities'
            },
            stacked: true
        }
    }
};

const Dashboard = () => {
    const [data, setData] = useState({
        dependencies: 0,
        vulnerabilities: [],
        trend: [], 
        fileVulnerabilitiesCount: [],
        severityCountForPie: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
        dailyVulnerabilityTrendData: []
    });

    useEffect(() => {
        const backendUrl = config.backendUrl;

        // Fetch data from the API
        fetch(`${backendUrl}/api/get-dashboard-data`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);  
                setData({
                    dependencies: data.totalDependencies,
                    vulnerabilities: data.vulnerabilities,
                    trend: data.trend || [], 
                    fileVulnerabilitiesCount: data.vulnerabilitiesPerFile,
                    severityCountForPie: data.severityCountForPie || { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
                    dailyVulnerabilityTrendData: data.dailyVulnerabilityTrendData || []
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);
    
    const trendVulnerabilityData = {
        labels: data.dailyVulnerabilityTrendData.map(item => item.date), 
        datasets: [
            {
                label: 'LOW Vulnerabilities',
                data: data.dailyVulnerabilityTrendData.map(item => item.LOW),
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.3)',
                fill: false,
            },
            {
                label: 'MEDIUM Vulnerabilities',
                data: data.dailyVulnerabilityTrendData.map(item => item.MEDIUM),
                borderColor: 'yellow',
                backgroundColor: 'rgba(255, 255, 0, 0.3)',
                fill: false,
            },
            {
                label: 'HIGH Vulnerabilities',
                data: data.dailyVulnerabilityTrendData.map(item => item.HIGH),
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                fill: false,
            },
            {
                label: 'CRITICAL Vulnerabilities',
                data: data.dailyVulnerabilityTrendData.map(item => item.CRITICAL),
                borderColor: 'purple',
                backgroundColor: 'rgba(128, 0, 128, 0.3)',
                fill: false,
            }
        ]
    };
    
    const pieChartData = {
        labels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        datasets: [
            {
                data: [
                    data.severityCountForPie.LOW || 0,
                    data.severityCountForPie.MEDIUM || 0,
                    data.severityCountForPie.HIGH || 0,
                    data.severityCountForPie.CRITICAL || 0
                ],
                backgroundColor: ['green', 'orange', 'red', 'purple'],
                hoverBackgroundColor: ['darkgreen', 'darkorange', 'darkred', 'indigo']
            }
        ]
    };

    // Calculate the max value from the trend data
    const maxVulnerabilities = Math.max(...data.trend.map(item => item.vulnerabilities), 0);
    console.log('Max Vulnerabilities:', maxVulnerabilities);

    const dynamicYScale = {
        min: maxVulnerabilities * 0.9 || 100,
        max: maxVulnerabilities * 1.01 || 100,
    };

    const dynamicOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `Vulnerabilities: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Vulnerabilities'
                },
                suggestedMin: dynamicYScale.min, 
                suggestedMax: dynamicYScale.max, 
            }
        }
    };
    
    const chartData = {
        labels: data.trend.map(item => item.date), 
        datasets: [
            {
                label: 'Vulnerabilities Over Time',
                data: data.trend.map(item => item.vulnerabilities),  
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };
    
    const barChartData = {
        labels: data.fileVulnerabilitiesCount.map((file) => 
            file.name.replace('dependency-check-report-', '').replace('.json', '')
        ),
        datasets: [
            {
                label: 'LOW',
                data: data.fileVulnerabilitiesCount.map((file) => file.low),
                backgroundColor: 'rgba(0, 255, 34, 0.49)', 
            },
            {
                label: 'MEDIUM',
                data: data.fileVulnerabilitiesCount.map((file) => file.medium),
                backgroundColor: 'rgba(255, 166, 0, 0.65)', 
            },
            {
                label: 'HIGH',
                data: data.fileVulnerabilitiesCount.map((file) => file.high),
                backgroundColor: 'rgba(255, 0, 0, 0.74)', 
            },
            {
                label: 'CRITICAL',
                data: data.fileVulnerabilitiesCount.map((file) => file.critical),
                backgroundColor: 'rgb(76, 11, 151)', 
            },
        ],
    };

    console.log(barChartData)
    

    return (
        <div>
            <h1>Vulnerability Dashboard</h1>

            <div className="dashboard">
                <h2>Overall Summary</h2>
                <p>Total Dependencies: {data.dependencies}</p>
                <p>Total Vulnerabilities: {data.vulnerabilities.length}</p>

                <div>
                    <h3>Vulnerabilities by Severity</h3>
                    <ul>
                        {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(severity => {
                            const count = data.vulnerabilities.filter(v => v.severity === severity).length;
                            return (
                                <li key={severity}>
                                    {severity}: {count}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, paddingRight: '20px' }}>
                        <h3>Vulnerability Trend Over Time</h3>
                        <Line data={chartData} options={dynamicOptions} />
                    </div>
                    <div style={{ flex: 1, paddingLeft: '20px', maxWidth: '500px' }}>
                        <h3>Vulnerability Distribution</h3>
                        <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                </div>
                <div>
                    <h3>Vulnerabilities Per File</h3>
                    <Bar
                        data={barChartData}
                        options={barChartOptions}
                    />
                </div>
                <div>
                    <h3>Vulnerability Trend by Type</h3>
                    <Line data={trendVulnerabilityData} options={options} />
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
