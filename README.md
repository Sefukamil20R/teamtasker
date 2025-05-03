# TeamTasker

TeamTasker is a task management application designed to help teams collaborate effectively, manage projects, and track tasks seamlessly. It includes features for user authentication, role-based access control, and project/task management.

## 🌐 Deployed URL

Access the live application here: [TeamTasker](https://team-tasker.netlify.app/)

---

## 📖 Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Folder Structure](#folder-structure)
* [Contributing](#contributing)

---

## ✨ Features

* **User Authentication**: Secure login and signup with JWT-based authentication.
* **Role-Based Access Control**: Admins can manage users, projects, and tasks.
* **Project Management**: Create, update, and manage projects with team members.
* **Task Management**: Assign tasks, set deadlines, and track progress.
* **Responsive Design**: Fully responsive UI for desktop and mobile devices.
* **Real-Time Updates**: Seamless updates for tasks and projects.

---

## 🛠️ Technologies Used

### Frontend

* **Framework**: React (with Vite)
* **Routing**: React Router
* **State Management**: Context API
* **Styling**: CSS
* **Deployment**: Netlify

### Backend

* **Framework**: Node.js with Express
* **Database**: MongoDB (via Mongoose)
* **Authentication**: JSON Web Tokens (JWT)
* **CORS**: Configured for secure cross-origin requests
* **Deployment**: Render

---

## 🚀 Getting Started

### Prerequisites

Before starting, ensure you have the following:

* Node.js
* MongoDB (local or cloud instance)
* A code editor (e.g., VS Code)

---

## 🧩 Full Setup Instructions

### 🔧 Frontend Setup

1. Navigate to the `client` folder:

   ```bash
   cd client
   ```
2. Install the necessary dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```

### 🔧 Backend Setup

1. Navigate to the `server` folder:

   ```bash
   cd server
   ```
2. Install the necessary dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the server folder and configure the following environment variables:

   ```env
   MONGO_URI=<your_mongo_db_uri>
   JWT_SECRET=<your_jwt_secret_key>
   ```
4. Start the server:

   ```bash
   npm start
   ```

   The backend will run on `http://localhost:3006` by default.

---

## 📁 Folder Structure

### Frontend (client)

```
client/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable components
│   ├── pages/            # Application pages (e.g., Login, Signup, Dashboard)
│   ├── styles/           # CSS and styling files
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Entry point
│   └── utils/            # Utility functions (e.g., API calls)
├── .env                  # Environment variables
├── package.json          # Project metadata and dependencies
└── vite.config.js        # Vite configuration
```

### Backend (server)

```
server/
├── models/               # Mongoose models (e.g., User, Project, Task)
├── routes/               # API routes (e.g., auth, projects, tasks)
├── controllers/          # Route handlers
├── middleware/           # Middleware (e.g., authentication)
├── server.js             # Main server file
├── .env                  # Environment variables
├── package.json          # Project metadata and dependencies
└── README.md             # Backend documentation
```

---

## 🤝 Contributing

Feel free to fork the repository, create a branch, and submit a pull request. Please follow the existing code style and ensure all features are tested before submitting.
