# 🚗 CarCraft — Automotive Inventory & Dealership Management System

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Django-5.x-green?style=for-the-badge&logo=django" alt="Django">
  <img src="https://img.shields.io/badge/MySQL-8.x-orange?style=for-the-badge&logo=mysql" alt="MySQL">
  <img src="https://img.shields.io/badge/Bootstrap-5.x-purple?style=for-the-badge&logo=bootstrap" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Deployment-Render-black?style=for-the-badge&logo=render" alt="Render">
</p>

<p align="center">
  <b>A complete web-based dealership management system for managing vehicles, customers, sales, services, and automotive parts.</b>
</p>

<p align="center">
  <a href="https://car-craft.onrender.com">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-Visit_CarCraft-00C7B7?style=for-the-badge" alt="Live Demo">
  </a>
</p>

---

## 🌐 Live Demo

### 🚀 [Launch CarCraft](https://car-craft.onrender.com)

**Live Application:**
https://car-craft.onrender.com

CarCraft is deployed and accessible online through **Render**.

> **Note:** The live demo may initially take a few moments to respond if the Render service has been idle.

---

## 📌 Project Overview

**CarCraft** is an **Automotive Inventory & Dealership Management System** designed to digitally manage the complete dealership workflow from vehicle inventory to customer management, vehicle sales, service appointments, and automotive parts.

The application provides a centralized dashboard where dealership operations can be managed through dedicated modules.

### Core Modules

* 🚘 Vehicle Inventory Management
* 👥 Customer Management
* 💰 Sales Management
* 🔧 Service Management
* ⚙️ Parts Management
* 📊 Dealership Dashboard
* 🔐 Authentication & Admin Management
* ⚙️ Application Settings

---

## 🎯 Problem Statement

Traditional dealership operations often rely on spreadsheets, paper records, and disconnected systems for managing:

* Vehicle inventory
* Customer information
* Sales transactions
* Service appointments
* Automotive parts
* Dealership operations

This can make information difficult to track and maintain.

**CarCraft** provides a centralized digital platform that connects these dealership operations into a single system.

---

## 💡 Key Features

### 🚘 Vehicle Inventory

Manage dealership vehicles from a centralized inventory system.

Features include:

* Add vehicles
* Update vehicle information
* Track vehicle availability
* Manage vehicle details
* View dealership inventory
* Organize available and sold vehicles

---

### 👥 Customer Management

Maintain customer information in one place.

Features include:

* Add customers
* Update customer information
* View customer records
* Maintain customer details
* Connect customers with sales and services

---

### 💰 Sales Management

Manage the vehicle sales workflow.

Features include:

* Create sales records
* Associate customers with vehicles
* Track sale amounts
* Manage sales status
* View completed sales
* Monitor dealership sales activity

---

### 🔧 Service Management

Manage vehicle servicing and appointments.

Service workflow:

```text
Scheduled
    ↓
In Progress
    ↓
Completed
```

Features include:

* Customer selection
* Vehicle selection
* Appointment date
* Service description
* Service status
* Service cost
* Upcoming service tracking

---

### ⚙️ Parts Management

Manage automotive parts and accessories.

Features include:

* Add parts
* Track parts information
* Manage pricing
* Manage stock
* Update inventory
* View available parts

---

### 📊 Dashboard

The dashboard provides a dealership overview.

It tracks information such as:

```text
Total Vehicles
Available Vehicles
Customers
Open Services
Sales
Recent Sales
Upcoming Services
```

The live dashboard currently provides sections for these dealership metrics and recent/upcoming activity.

---

## 🔐 Authentication

CarCraft includes user authentication for secure access to dealership operations.

Supported functionality includes:

* User registration
* User login
* Logout
* Admin authentication
* Protected dealership operations

---

## 🏗️ System Architecture

CarCraft follows the **Django MVT (Model–View–Template)** architecture.

```text
                    ┌─────────────────────┐
                    │       Client        │
                    │   Web Browser       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Django URLs       │
                    │    / Routing        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Views          │
                    │  Business Logic     │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │    Templates    │       │     Models      │
        │ HTML + Bootstrap│       │ Django ORM      │
        └─────────────────┘       └────────┬────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │    Database     │
                                  │      MySQL      │
                                  └─────────────────┘
```

---

## 🛠️ Technology Stack

| Technology               | Purpose              |
| ------------------------ | -------------------- |
| 🐍 Python                | Backend programming  |
| 🌐 Django                | Web framework        |
| 🎨 HTML5                 | Frontend structure   |
| 🎨 CSS3                  | Styling              |
| 🅱️ Bootstrap            | Responsive UI        |
| 🗄️ MySQL                | Database             |
| 🔐 Django Authentication | User authentication  |
| 🧩 Django ORM            | Database interaction |
| 🚀 Render                | Cloud deployment     |
| 🔧 Git & GitHub          | Version control      |

---

## 📂 Project Structure

```text
CarCraft/
│
├── carcraft/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── ...
│
├── dashboard/
│   ├── management/
│   │   └── commands/
│   │       └── create_admin.py
│   ├── models.py
│   ├── views.py
│   └── ...
│
├── inventory/
│   ├── models.py
│   ├── views.py
│   └── ...
│
├── customers/
│   ├── models.py
│   ├── views.py
│   └── ...
│
├── sales/
│   ├── models.py
│   ├── views.py
│   └── ...
│
├── service/
│   ├── models.py
│   ├── views.py
│   └── ...
│
├── parts/
│   ├── models.py
│   ├── views.py
│   └── ...
│
├── templates/
│   ├── registration/
│   └── ...
│
├── static/
│   └── css/
│       └── style.css
│
├── media/
│
├── manage.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/jatinraghav22/CarCraft.git
cd CarCraft
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

### Windows

```powershell
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

---

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 5. Configure environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=your-database-url

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@carcraft.com
ADMIN_PASSWORD=your-secure-password
```

> Never commit `.env` or other secrets to GitHub.

---

### 6. Apply migrations

```bash
python manage.py migrate
```

---

### 7. Create an admin account

```bash
python manage.py createsuperuser
```

Or use the project's automated admin command:

```bash
python manage.py create_admin
```

---

### 8. Run the development server

```bash
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/
```

---

## 🚀 Deployment

CarCraft is deployed using **Render**.

### Deployment workflow

```text
GitHub Repository
       │
       ▼
    Render
       │
       ├── Install dependencies
       ├── Run migrations
       ├── Create admin
       ├── Collect static files
       │
       ▼
   Django / Gunicorn
       │
       ▼
  Live Web Application
```

### Production Build Command

```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py create_admin && python manage.py collectstatic --no-input
```

### Production Start Command

```bash
gunicorn carcraft.wsgi:application
```

---

## 🗄️ Database

CarCraft uses a relational database for storing dealership data.

Main entities include:

```text
User
 │
 ├── Customer
 │
 ├── Vehicle
 │
 ├── Sale
 │
 ├── Service
 │
 └── Part
```

The Django ORM handles communication between the application and database.

---

## 🔄 Dealership Workflow

The system supports a connected dealership workflow:

```text
Vehicle Inventory
       │
       ▼
    Customer
       │
       ▼
     Sales
       │
       ▼
Vehicle Ownership
       │
       ▼
   Service
       │
       ▼
Parts / Maintenance
```

---

## 📊 Dashboard Metrics

The dashboard provides an overview of dealership activity including:

* Total vehicles
* Available vehicles
* Customers
* Open services
* Sales
* Recent sales
* Upcoming services

The live deployment currently displays these dashboard categories.

---

## 🔒 Security

Security considerations include:

* Django authentication
* Password hashing through Django
* Environment-based secrets
* `.env` excluded from Git
* CSRF protection
* Django ORM
* Production configuration
* Secure deployment environment variables

---

## 🧪 Testing

Before deployment, run:

```bash
python manage.py check
```

Expected result:

```text
System check identified no issues (0 silenced).
```

You can also run:

```bash
python manage.py test
```

---

## 📈 Future Enhancements

Possible future improvements include:

* 📱 Mobile-responsive improvements
* 📊 Advanced analytics
* 📈 Sales charts and reports
* 📄 Invoice generation
* 📧 Email notifications
* 🔔 Service reminders
* 💳 Online payments
* 🚘 Advanced vehicle search
* 🧾 PDF invoices
* 📦 Advanced parts stock management
* 👤 Role-based access control
* ☁️ Cloud media storage
* 🔍 Advanced reporting and filtering

---

## 🎓 Academic / Portfolio Value

CarCraft demonstrates practical implementation of:

* Python programming
* Django web development
* MVC/MVT architecture
* CRUD operations
* Database management
* Authentication
* ORM
* REST-oriented application structure
* Responsive web design
* Git/GitHub
* Cloud deployment
* Production configuration

The project can be used as a **college project, portfolio project, internship project, or software engineering demonstration**.

---

## 📸 Project Highlights

### Dashboard

Centralized dealership overview showing vehicle, customer, service, and sales information.

### Inventory

Manage vehicles available in the dealership.

### Customers

Maintain customer records and dealership relationships.

### Sales

Track vehicle sales and transaction information.

### Service

Manage service appointments and service status.

### Parts

Manage automotive parts and accessories.

---

## 🌐 Links

### 🚀 Live Demo

**https://car-craft.onrender.com**

### 💻 GitHub Repository

**https://github.com/jatinraghav22/CarCraft**

---

## 👨‍💻 Author

### Jatin Raghav

**B.Tech Computer Science & Engineering Student**

Interested in:

* Software Development
* Full-Stack Development
* Data Structures & Algorithms
* Cloud Technologies
* Web Application Development

### Connect With Me

* **GitHub:** https://github.com/jatinraghav22
* **LinkedIn:** https://www.linkedin.com/in/jatin-raghav-a9a060357/
* **Portfolio:** https://jatinraghav22.vercel.app/

---

## ⭐ Support

If you find **CarCraft** useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is created for educational, portfolio, and demonstration purposes.
