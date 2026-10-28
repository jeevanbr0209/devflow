# DevFlow — Developer Workspace

DevFlow is a full-stack web application that helps developers organize, manage, and track their projects.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Create, view, edit, and delete projects
- Search projects by name
- Filter projects by status
- Separate project workspaces for users

## Tech Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs

## Project Structure

- `client/` — React frontend
- `server/` — Express backend
- `README.md` — Project documentation

## Getting Started

### Prerequisites

Install Node.js, npm, and MongoDB.

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd DevFlow
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install dependencies

Open a terminal in the project folder and run:

```bash
cd server
npm install
```

Then open another terminal in the project folder and run:

```bash
cd client
npm install
```

### 3. Configure the backend

Create a `.env` file inside `server/` and configure the MongoDB connection string and JWT secret required by your backend.

Never upload your `.env` file or secrets to GitHub.

### 4. Start the backend

From the `server/` directory:

```bash
node server.js
```

### 5. Start the frontend

From the `client/` directory:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Author

Jeevan BR
