# Dependency Check Vulnerability Dashboard

A web application built to visualize and manage vulnerabilities in software dependencies. This project fetches vulnerability data from a set of JSON files outputted by OWASP dependency check, processes it, and displays it in various charts and cards, including trends, severity breakdowns, and per-file vulnerabilities. The application is designed to provide an interactive UI to explore vulnerable dependencies.

https://github.com/dependency-check/DependencyCheck

https://owasp.org/www-project-dependency-check/

## Features

- **Dark Mode Support**: Toggle between light and dark themes.
- **Vulnerability Overview**: Display the total number of critical, high, medium, and low vulnerabilities across all dependencies.
- **Trend Analysis**: Visualize trends in vulnerabilities over time.
- **Vulnerabilities per File**: View a breakdown of vulnerabilities by file.
- **Interactive Cards**: Expandable cards to show detailed information about vulnerable dependencies, including CVE codes and the repositories they are located in.
- **Sorting and Filtering**: Dependencies are sorted by the number of vulnerabilities and severity.
- **Responsive Design**: The app is fully responsive and adapts to different screen sizes.

## Images

Main dashboard & all graphs included:

![image](https://github.com/user-attachments/assets/04ad5ea8-9bfe-4c71-9f1b-b4e602de0e59)

![image](https://github.com/user-attachments/assets/76524859-9f5c-4781-aebe-9e2419a84198)

![image](https://github.com/user-attachments/assets/87d056a4-ecd2-4f0f-8277-c37895036995)

Dark mode:

![image](https://github.com/user-attachments/assets/14834881-10ff-4913-96b6-17083364c210)

Repos page - Used to drill into the reports for each repoistory scanned by OWASP dependency check. When clicked, takes you to the html report outputted by OWASP dependency check.

Repos Page:

![image](https://github.com/user-attachments/assets/84ac7a52-af9d-4263-8a45-dfda539975cd)

Example of report:

![image](https://github.com/user-attachments/assets/2a9727ee-73c8-4060-abfc-af1da5e811d3)

Vulnerabiltiies page. Used to see what the exact vulnerable dependencies are and where they are located:

![image](https://github.com/user-attachments/assets/7c586e2e-716a-4b95-a4f2-64942d1aa361)

Settings Page:

![image](https://github.com/user-attachments/assets/3831c5b2-13d9-4662-83c0-413d57861696)







