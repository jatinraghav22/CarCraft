# 🚗 CarCraft - Automotive Inventory & Dealership Suite

### Modern Vehicle Dealership, Inventory, E-Commerce & Service Management Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-CarCraft-blue?style=for-the-badge)](https://car-craft.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge\&logo=github)](https://github.com/jatinraghav22/CarCraft)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![Django](https://img.shields.io/badge/Backend-Django-092E20?style=for-the-badge\&logo=django)](https://www.djangoproject.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)](https://www.mysql.com/)

---

## 🌐 Live Demo

🚘 **Live Website:**
https://car-craft.vercel.app/

📂 **GitHub Repository:**
https://github.com/jatinraghav22/CarCraft

---

# 🚀 Overview

**CarCraft** is a full-stack automotive inventory and dealership management platform designed to bring vehicle sales, inventory management, parts & accessories e-commerce, service appointments, customer management, and financial tracking into a unified system.

The platform provides two primary interfaces:

* 👤 **Customer Interface** — Browse vehicles, explore parts and accessories, manage purchases, book services, and interact with dealership services.
* 🛠️ **Admin Dashboard** — Manage vehicles, customers, sales, services, parts, orders, revenue, expenses, and dealership operations.

CarCraft combines a modern **React frontend** with a **Django REST API backend**, providing a scalable architecture for automotive dealership operations.

---

# ✨ Features

## 👤 Customer Features

* 🚘 Browse available vehicles
* 🔍 Explore vehicle details
* 🏷️ View vehicle pricing and specifications
* 🛒 Browse automotive parts and accessories
* 🛍️ Add parts to cart
* 📦 Manage orders
* 🔧 Book vehicle service appointments
* 📅 View service information
* 👤 Customer account management
* 🔐 Secure authentication
* 📱 Responsive customer interface
* 🎨 Modern automotive-focused UI

---

## 🛠️ Admin Features

* 📊 Admin dashboard
* 🚘 Vehicle inventory management
* ➕ Add new vehicles
* ✏️ Update vehicle information
* 🗑️ Remove vehicles
* 👥 Customer management
* 💰 Sales management
* 🔧 Service appointment management
* 🛒 Parts & accessories management
* 📦 Order management
* 💵 Revenue tracking
* 💸 Expense tracking
* 📈 Financial analytics
* 📊 Revenue vs expenditure visualization
* 🧮 Net profit calculation
* 📋 Operational status tracking

---

# 📊 Financial Dashboard

CarCraft includes a financial analytics dashboard designed to provide a clear view of dealership finances.

## Financial Trajectory & Inflow

**Inflow (Revenue) vs Expenditure (MONTHLY Interval)**

Available views:

* 📅 Monthly
* 📆 Weekly
* 📊 Yearly
* 🗓️ Custom

### Financial Metrics

| Metric            | Description             |
| ----------------- | ----------------------- |
| 💰 Total Revenue  | Total income generated  |
| 💸 Total Expenses | Total recorded expenses |
| 📈 Net Profit     | Revenue minus expenses  |

### Formula

```text
Net Profit = Total Revenue - Total Expenses
```

---

# 🔄 Business Workflows

## 🚘 Vehicle Sales Workflow

```text
Inquiry
   ↓
Booking
   ↓
Sold
   ↓
Delivered
```

---

## 🔧 Service Workflow

```text
Scheduled
   ↓
In Progress
   ↓
Completed
```

---

## 🛒 Parts & Accessories Workflow

```text
Browse Products
      ↓
Product Details
      ↓
Add to Cart
      ↓
Place Order
      ↓
Order Management
```

---

# 🏗️ System Architecture

CarCraft follows a modern full-stack architecture:

```text
                 ┌─────────────────────────┐
                 │       Customer          │
                 │      Web Interface      │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │      React Frontend     │
                 │                         │
                 │ React + Vite             │
                 │ React Router             │
                 │ Axios                    │
                 │ Three.js / R3F           │
                 │ GSAP / Lenis             │
                 └────────────┬────────────┘
                              │
                         REST API
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     Django Backend      │
                 │                         │
                 │ Django 5.2              │
                 │ Django REST Framework   │
                 │ SimpleJWT               │
                 │ CORS                    │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │        Database         │
                 │                         │
                 │          MySQL          │
                 │     SQLite (Local)      │
                 └─────────────────────────┘
```

The admin interface follows the same API-driven architecture:

```text
Admin
  │
  ▼
React Admin Dashboard
  │
  ▼
Django REST API
  │
  ▼
Database
```

---

# 🛠️ Tech Stack

## Frontend

| Technology           | Purpose                    |
| -------------------- | -------------------------- |
| ⚛️ React             | User interface             |
| ⚡ Vite               | Frontend build tool        |
| 🧭 React Router      | Client-side routing        |
| 📡 Axios             | API communication          |
| 🎨 GSAP              | Animations                 |
| 🌀 Lenis             | Smooth scrolling           |
| 🧊 Three.js          | 3D graphics                |
| 🔺 React Three Fiber | React-based 3D rendering   |
| 🧩 Drei              | Three.js helper components |
| 🎯 Lucide React      | Icons                      |

---

## Backend

| Technology               | Purpose                        |
| ------------------------ | ------------------------------ |
| 🐍 Python                | Backend programming language   |
| 🟢 Django                | Web framework                  |
| 🔌 Django REST Framework | REST API development           |
| 🔐 SimpleJWT             | JWT authentication             |
| 🌐 django-cors-headers   | Frontend-backend CORS handling |

---

## Database

```text
MySQL
```

SQLite is also supported for local development.

---

# 🔐 Authentication

CarCraft uses token-based authentication through **SimpleJWT**.

The authentication flow can be represented as:

```text
User
  ↓
Login / Register
  ↓
Django Authentication
  ↓
JWT Access Token
  ↓
Authenticated API Requests
  ↓
Customer / Admin Interface
```

Protected functionality can be accessed according to the authenticated user's role.

---

# 👥 User Roles

CarCraft uses two primary roles.

## 👤 Customer

Customers can:

* Browse vehicles
* View vehicle details
* Explore parts
* Purchase accessories
* Manage orders
* Book services
* Manage their account
* View relevant information

---

## 🛠️ Admin

Admins can:

* Manage vehicles
* Manage customers
* Manage parts
* Manage orders
* Manage services
* Manage sales
* Track revenue
* Track expenses
* View financial analytics
* Update dealership information

---

# 📋 Prerequisites

Before running CarCraft locally, make sure you have the following installed.

### Required

* Python 3.10+
* Node.js
* npm
* Git
* MySQL

### Recommended

* Visual Studio Code
* MySQL Workbench
* Modern web browser

Verify installations:

```bash
python --version
```

```bash
node --version
```

```bash
npm --version
```

```bash
git --version
```

```bash
mysql --version
```

---

# 📦 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/jatinraghav22/CarCraft.git
```

```bash
cd CarCraft
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

## Create Virtual Environment

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

---

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

# 🗄️ Database Configuration

CarCraft uses MySQL for the primary database environment.

Create a database:

```sql
CREATE DATABASE carcraft_db;
```

Configure your database settings using environment variables.

Example:

```env
DB_ENGINE=mysql
DB_NAME=carcraft_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

For local SQLite development, configure the project to use SQLite if supported by your current backend configuration.

---

# 🔐 Backend Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
SECRET_KEY=your_secret_key

DEBUG=True

DB_ENGINE=mysql
DB_NAME=carcraft_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

> ⚠️ Never commit your `.env` file or real credentials to GitHub.

---

# 🧱 Run Database Migrations

```bash
python manage.py makemigrations
```

```bash
python manage.py migrate
```

---

# 👨‍💼 Create Admin User

Create a Django superuser:

```bash
python manage.py createsuperuser
```

Follow the terminal instructions.

---

# ▶️ Start Backend Server

```bash
python manage.py runserver
```

The Django backend will normally be available at:

```text
http://127.0.0.1:8000/
```

---

# 💻 Frontend Setup

Open another terminal.

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Frontend Environment Variables

Create a `.env` or `.env.local` file inside the frontend directory.

Example:

```env
VITE_API_URL=http://127.0.0.1:8000
```

If your frontend uses a different API variable name, keep the variable name consistent with the existing Axios/API configuration in the project.

---

# ▶️ Start Frontend

```bash
npm run dev
```

Vite will provide the local development URL in the terminal, typically:

```text
http://localhost:5173/
```

Open the URL in your browser.

---

# 📁 Project Structure

```text
CarCraft/
│
├── backend/
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── apps/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── customers/
│   │   ├── sales/
│   │   ├── service/
│   │   └── parts/
│   │
│   └── ...
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── assets/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact internal filenames may vary as the project evolves.

---

# 🔌 API Architecture

The React frontend communicates with Django through REST APIs.

```text
React
  │
  │ HTTP Request
  ▼
Django REST Framework
  │
  │ Business Logic
  ▼
Django Models
  │
  ▼
MySQL
```

Responses are returned to the frontend as JSON.

```text
Database
    ↓
Django
    ↓
REST API
    ↓
Axios
    ↓
React UI
```

---

# 🚘 Vehicle Inventory Management

The inventory module allows administrators to maintain vehicle information.

Typical vehicle information can include:

```text
Vehicle
├── Name
├── Brand
├── Model
├── Variant
├── Price
├── Year
├── Fuel Type
├── Transmission
├── Mileage
├── Images
└── Availability
```

Administrators can manage vehicle records while customers can browse available vehicles through the customer interface.

---

# 🔧 Service Management

Customers can request/book vehicle services.

The service lifecycle is:

```text
Scheduled
     ↓
In Progress
     ↓
Completed
```

The admin dashboard can be used to manage service appointments and update their status.

---

# 🛒 Parts & Accessories

CarCraft also provides an e-commerce experience for automotive parts and accessories.

```text
Product Catalog
      ↓
Product Details
      ↓
Shopping Cart
      ↓
Order
      ↓
Admin Order Management
```

Products can contain information such as:

```text
Product
├── Name
├── SKU
├── Category
├── Price
├── Stock Quantity
└── Product Image
```

---

# 💰 Sales Management

Vehicle sales can be managed through a structured lifecycle:

```text
Inquiry
   ↓
Booking
   ↓
Sold
   ↓
Delivered
```

This provides a clear way to track the progress of vehicle transactions.

---

# 📈 Financial Management

CarCraft connects sales and expenses with the financial dashboard.

```text
Vehicle Sales ──────┐
                    │
Parts Orders ───────┼──→ Revenue
                    │
                    ▼
               Financial Data
                    ▲
                    │
Expenses ───────────┘
```

The dashboard calculates:

```text
Total Revenue
      -
Total Expenses
      =
Net Profit
```

---

# 🎨 UI / UX

CarCraft focuses on a modern automotive experience.

### Design Characteristics

* 🚘 Automotive-focused visual identity
* 🌑 Modern interface
* ✨ Smooth animations
* 🧊 3D visual elements
* 📱 Responsive layouts
* 🧭 Clear navigation
* 📊 Dashboard-based information
* 🎯 Customer-focused browsing
* 🛠️ Admin-focused management tools

### Animation & Interaction

The frontend uses technologies such as:

* GSAP
* Lenis
* Three.js
* React Three Fiber
* Drei

These technologies are used to create interactive and visually engaging experiences.

---

# 🧪 Testing

The project was tested across major functional areas.

## Automated Test Summary

| Category    | Result |
| ----------- | -----: |
| Total Tests |    100 |
| Passed      |     94 |
| Failed      |      0 |
| Skipped     |      0 |
| Manual      |      6 |
| Pass Rate   |  94.0% |

---

## Connectivity Validation

The major system connections were validated across:

```text
Customer → Backend
Dealer/Admin → Backend
Admin → Database
Customer → Database
Vehicle → Customer
Test Drive → Admin
Admin Approval → Customer
Service → Admin
Order → Admin
Sales → Financials
Expense → P&L
```

---

## Manual Validation

Manual validation included UI/interactive functionality such as:

* 🎬 Cinematic video completion
* 🧊 Showroom 3D canvas

---

# 📱 Responsive Design

CarCraft is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The interface adapts its layout and components according to screen size.

---

# 🚀 Deployment

## Frontend — Vercel

The CarCraft customer-facing frontend is deployed through Vercel.

🌐 **Live Website:**

https://car-craft.vercel.app/

### General deployment process

```text
GitHub Repository
       ↓
Connect Repository to Vercel
       ↓
Configure Environment Variables
       ↓
Build React Application
       ↓
Deploy
       ↓
Live Website
```

Typical build command:

```bash
npm run build
```

---

# 🔧 Production Environment Variables

Before deployment, configure your production API endpoint.

Example:

```env
VITE_API_URL=your_production_backend_url
```

Do not expose sensitive backend secrets in frontend environment variables.

---

# 🔒 Security Considerations

CarCraft follows several basic security practices:

* 🔐 JWT-based authentication
* 🔑 Environment-based secret configuration
* 🚫 `.env` excluded from Git
* 🌐 CORS configuration
* 🛡️ Protected API functionality
* 👥 Role-based access considerations
* 🔒 Secure API communication

---

# 🧩 Key Modules

```text
CarCraft
│
├── Authentication
│
├── Customer Management
│
├── Vehicle Inventory
│
├── Vehicle Sales
│
├── Parts & Accessories
│
├── Orders
│
├── Service Appointments
│
├── Financial Management
│
└── Admin Dashboard
```

---

# 📚 What I Learned

Building CarCraft helped me gain practical experience in:

* ⚛️ React application development
* 🐍 Django backend development
* 🔌 REST API integration
* 🔐 JWT authentication
* 🗄️ Database management
* 🧩 Full-stack architecture
* 📡 Frontend-backend communication
* 📊 Dashboard development
* 💰 Financial data handling
* 🛒 E-commerce workflows
* 🚘 Inventory management
* 🔧 Service management
* 🎨 Modern UI/UX development
* 🧊 3D web experiences
* ✨ Web animations
* 🚀 Deployment and production workflows

---

# 🔮 Future Improvements

Potential future enhancements include:

* 🤖 AI-powered vehicle recommendations
* 🔍 Advanced vehicle search and filtering
* 💳 Online payment gateway integration
* 📧 Automated email notifications
* 📱 Customer notification system
* 📊 Advanced business analytics
* 📈 Sales forecasting
* 🧠 AI-based service recommendations
* 📄 Automated invoices
* 📑 Downloadable sales/service reports
* 🌍 Multi-dealership support
* 🔔 Real-time notifications
* 🗺️ Dealership location integration

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the Repository

```bash
git clone https://github.com/jatinraghav22/CarCraft.git
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/new-feature
```

### 3. Make Your Changes

Implement and test your changes locally.

### 4. Commit Changes

```bash
git add .
```

```bash
git commit -m "Add new feature"
```

### 5. Push Your Branch

```bash
git push origin feature/new-feature
```

### 6. Open a Pull Request

Create a Pull Request with a clear explanation of your changes.

---

# 📌 Development Guidelines

* Write clean and readable code
* Keep components modular
* Follow existing project structure
* Use meaningful variable and function names
* Test features before committing
* Keep API logic organized
* Never commit `.env` files
* Keep frontend and backend responsibilities separated
* Update documentation when adding major features

---

# 👨‍💻 Developer

## Jatin Raghav

**B.Tech Computer Science & Engineering**

ABES Engineering College, Ghaziabad

### Technologies & Interests

```text
C++
C
Python
JavaScript
React.js
Django
REST APIs
MySQL
Git
GitHub
Data Structures & Algorithms
Full Stack Development
Cloud Computing
```

### Connect With Me

* 💼 **LinkedIn:**
  https://www.linkedin.com/in/jatin-raghav-a9a060357/

* 💻 **GitHub:**
  https://github.com/jatinraghav22

* 🌐 **Portfolio:**
  https://jatinraghav.vercel.app/

* 🚗 **CarCraft:**
  https://car-craft.vercel.app/

---

# 📄 License

This project is intended as an academic and portfolio full-stack development project.

---

# ⭐ Support

If you found **CarCraft** useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<div align="center">

### 🚗 CarCraft

**Automotive Inventory • Dealership Management • E-Commerce • Service Management**

Built with ❤️ using **React + Django + MySQL**

**© 2026 Jatin Raghav**

</div>
