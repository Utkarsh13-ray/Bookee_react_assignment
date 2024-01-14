# Bookee React Assignment
A WebApp use to manage and book your shifts.
## Project Overview

This project is a web application built with **Create React App** and uses **TailwindCSS** for designing.. The backend is developed using **Node.js** with **Hapi.js**. The development environment is set up on a 64-bit **Windows 10** system.

### Node Versions

- Use Node `v12.0.0` to run the Hapi server. Versions above 12 may cause issues with POST requests and route configurations.
- Use Node `>=v16` to run the client. First, start the client with Node v16, then switch to Node v12 using nvm to run the server.

## Getting Started

### Prerequisites

- **Node.js** (`v12.0.0` for server, `v>=16` for client)
- **npm** (Node Package Manager)

### Installation

Run the following command in the project directory to set up the project:

for Client
```bash
npm install
This script installs dependencies for both the client and server.

npm start
This  script starts the development sever
```
for sever use node v12
```bash
npm install
This script installs dependencies for both the client and server.

npm start
This  script starts the development sever
```
Build Client:
To build the client, run the following command in the client folder:

bash
Copy code
npm build

Before running the Hapi server, ensure that you have globally installed Babel-CLI:
```bash
Copy code
npm install -g babel-cli
```
Client application runs on port 3000 if available; otherwise, it picks any available port.
The server runs on port 5000. (You can change port according to your significance)
