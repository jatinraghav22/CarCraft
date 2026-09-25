# 🚗 CarCraft

### Automotive Inventory & Dealership Management System

CarCraft is a web-based **Automotive Inventory & Dealership Management System** developed using **Python, Django, MySQL, and Bootstrap**.

The system helps dealerships manage vehicles, customers, sales, service appointments, and parts/accessories through a centralized web application.

---

## ✨ Features

- 🚗 **Vehicle Inventory**
  - Add vehicles
  - View vehicle details
  - Edit vehicle information
  - Delete vehicles
  - Vehicle status management
  - Vehicle images

- 👤 **Customer Management**
  - Add customers
  - View customer information
  - Edit customer details
  - Delete customers
  - Customer search

- 💰 **Sales Management**
  - Create sales
  - Manage customer and vehicle information
  - Track sales amount
  - Sales stage management
  - Inquiry → Booking → Sold → Delivered workflow

- 🔧 **Service Management**
  - Create service appointments
  - Assign customers and vehicles
  - Add service descriptions
  - Track service status
  - Scheduled → In Progress → Completed workflow

- 🛠️ **Parts & Accessories**
  - Add parts
  - View parts
  - Edit parts
  - Delete parts
  - Search parts
  - Manage stock
  - Place part orders

- 📊 **Dashboard**
  - Centralized dealership overview
  - Important system information

- 🔐 **Authentication**
  - Login system
  - Logout system
  - Protected application pages

- 🔎 **Search & Filtering**
  - Search vehicles
  - Search customers
  - Search parts
  - Filter sales
  - Filter service appointments

- 🖼️ **Vehicle Images**
  - Support for vehicle image management

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Django | Web framework |
| MySQL | Database |
| Bootstrap | UI and responsive design |
| HTML | Page structure |
| CSS | Styling |
| JavaScript | Frontend functionality |
| Git | Version control |
| GitHub | Source code management |

---

## 🏗️ Architecture

CarCraft follows the **Django MVT (Model-View-Template)** architecture.

```text
                    CarCraft
                       │
             ┌─────────┴─────────┐
             │                   │
           Django              MySQL
             │
       ┌─────┼─────┐
       │     │     │
     Model  View  Template
       │     │     │
       └─────┼─────┘
             │
        Web Application
