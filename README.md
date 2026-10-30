# 💻 CoCode – Real-Time Collaborative Code Editor

### A Full-Stack Collaborative Coding Platform

<p align="center">
  **Code Together. Learn Together. Build Together.**
</p>

<p align="center">
  A collaborative coding platform that brings developers and learners together in a shared coding environment with real-time communication and an interactive code editor.
</p>

<p align="center">
  <a href="https://cocode-two.vercel.app/">🌐 Live Demo</a> •
  <a href="https://github.com/jatinraghav22/CoCode">📂 GitHub Repository</a> •
  <a href="https://cocode-2l13.onrender.com/">⚙️ Backend Server</a>
</p>

---

# 🌐 Live Demo

- **Frontend:** https://cocode-two.vercel.app/
- **Backend:** https://cocode-2l13.onrender.com/
- **GitHub:** https://github.com/jatinraghav22/CoCode

---

# 🚀 Overview

**CoCode** is a full-stack, web-based collaborative coding platform designed to make programming collaboration easier and more accessible.

It provides a shared coding environment where users can create coding rooms, join collaborative sessions, and work together on programming tasks.

The platform combines a modern code editor with real-time communication technologies to provide an interactive coding experience.

Whether you are a student practising programming, a developer collaborating with teammates, or a learner working on coding challenges, CoCode provides a common workspace to code and collaborate.

---

# ✨ Key Features

## 👤 User Features

- 🔐 User Registration and Login.
- 👤 User Account Management.
- 🏠 Personalized Dashboard.
- 🚪 Create Collaborative Coding Rooms.
- 🔗 Join Existing Coding Rooms.
- 💻 Shared Coding Environment.
- ⚡ Real-Time Communication.
- 📝 Interactive Code Editing.
- 📱 Responsive User Interface.

## 💻 Code Editor Features

- Monaco Editor integration.
- Professional code-editing experience.
- Syntax highlighting.
- Structured coding workspace.
- Support for collaborative programming workflows.

## 🤝 Collaboration Features

- Create dedicated coding rooms.
- Join coding sessions with other users.
- Real-time communication using Socket.IO.
- Shared workspace for collaborative development.
- Room-based collaboration.

---

# 🏗️ System Architecture

CoCode follows a full-stack client-server architecture.

```text
                USER
                  |
                  v
           REACT FRONTEND
              (Vite)
                  |
          -----------------
          |               |
          v               v
       REST API       SOCKET.IO
          |               |
          v               v
       EXPRESS         REAL-TIME
        SERVER       COMMUNICATION
          |
          v
       PRISMA ORM
          |
          v
         MYSQL
```

### Application Workflow

```text
User Registration / Login
          |
          v
   Authentication
          |
          v
      Dashboard
          |
          v
  Create / Join Room
          |
          v
 Collaborative Workspace
          |
          v
     Monaco Editor
          |
          v
 Real-Time Communication
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React.js | User interface development |
| Vite | Frontend development and build tool |
| JavaScript | Application logic |
| CSS | Styling and responsive layouts |
| Monaco Editor | Code editing experience |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| Socket.IO | Real-time communication |
| JWT | Authentication |
| REST APIs | Client-server communication |

## Database

| Technology | Purpose |
|---|---|
| MySQL | Relational database |
| Prisma ORM | Database management and queries |

## Deployment & Development Tools

- Git
- GitHub
- Vercel
- Render
- Visual Studio Code
- npm

---

# 🔐 Authentication & User Management

CoCode includes an authentication system to manage user access.

### Authentication Features

- User registration.
- User login.
- JWT-based authentication.
- Protected application routes.
- Authenticated access to collaborative features.
- User session management.

Authentication helps ensure that collaborative room functionality is available to authorized users.

---

# 🤝 Collaborative Coding Workflow

### Room Creation

Users can create a dedicated coding room to start a collaborative programming session.

### Room Joining

Other users can join an existing room and participate in the coding session.

### Collaborative Workspace

Users access a shared coding environment powered by Monaco Editor and real-time communication technologies.

### Real-Time Communication

Socket.IO provides the communication layer between connected clients and the backend server.

---

# 🛠️ Getting Started

Follow these instructions to run CoCode locally.

## Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- MySQL
- Git
- Visual Studio Code (recommended)

---

## 1. Clone the Repository

```bash
git clone https://github.com/jatinraghav22/CoCode.git
```

Navigate to the project:

```bash
cd CoCode
```

---

## 2. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server directory.

Example:

```env
PORT=5000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/cocode_db"
JWT_SECRET="your_secret_key"
```

Replace the database username, password and other values with your local configuration.

Never upload actual credentials or secret keys to GitHub.

### Configure Prisma

Generate the Prisma Client:

```bash
npx prisma generate
```

Synchronize the database schema:

```bash
npx prisma db push
```

### Start Backend Server

```bash
npm run dev
```

The backend will run on the configured local port.

---

## 3. Frontend Setup

Open another terminal.

Navigate to the client directory:

```bash
cd CoCode/client
```

Install frontend dependencies:

```bash
npm install
```

### Configure Frontend Environment

Create a `.env` file inside the client directory.

Example:

```env
VITE_API_URL=http://localhost:5000
```

Use the environment variable name configured in the frontend API service.

### Start Frontend

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

Usually:

```text
http://localhost:5173/
```

---

# 📁 Project Structure

```text
CoCode/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🧪 Testing & Validation

The application can be validated through the following development and integration checks:

- User registration and login.
- Authentication and protected routes.
- Coding room creation.
- Coding room joining.
- Frontend-backend API communication.
- Socket.IO connection.
- Database connectivity.
- Prisma integration.
- Deployment connectivity.

---

# 🚀 Deployment

CoCode is deployed using separate frontend and backend hosting platforms.

| Component | Platform | Link |
|---|---|---|
| Frontend | Vercel | [Live Website](https://cocode-two.vercel.app/) |
| Backend | Render | [Backend Server](https://cocode-2l13.onrender.com/) |
| Source Code | GitHub | [CoCode Repository](https://github.com/jatinraghav22/CoCode) |

---

# 🔮 Future Enhancements

- Advanced real-time code synchronization.
- Support for multiple programming languages.
- Integrated code execution environment.
- Collaborative debugging tools.
- Voice and video communication.
- Improved user profiles.
- Room access management.
- Enhanced coding session management.
- Improved application performance and scalability.

---

# 🎓 Learning Outcomes

Developing CoCode provides practical experience in:

- Full-stack web application development.
- React component-based architecture.
- Node.js and Express backend development.
- REST API integration.
- Real-time communication using Socket.IO.
- Monaco Editor integration.
- Relational database management.
- Prisma ORM.
- JWT authentication.
- Frontend-backend integration.
- Cloud deployment.
- Git and GitHub version control.

---

# 👨‍💻 Author

**Jatin Raghav**

B.Tech – Computer Science & Engineering

- GitHub: [@jatinraghav22](https://github.com/jatinraghav22)
- LinkedIn: [Jatin Raghav](https://www.linkedin.com/in/jatin-raghav-a9a060357/)

---

<p align="center">
  **💻 CoCode – Code Together. Grow Together. 🚀**
</p>
