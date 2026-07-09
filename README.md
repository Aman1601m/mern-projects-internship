# Human Resource Management System (HRMS)

A secure Human Resource Management System (HRMS) built using the MERN Stack. This project provides employee, department, leave, and payroll management with secure authentication and role-based authorization.

---

# Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Password Encryption using bcryptjs
- Protected Routes

## Role-Based Access Control (RBAC)
- Admin
- HR
- Employee

## Employee Management
- Add Employee
- View Employees
- Update Employee
- Delete Employee
- Search Employees
- Pagination
- Profile Image Upload

## Department Management
- Create Department
- View Departments
- Update Department
- Delete Department

## Leave Management
- Apply Leave
- View Leave Requests
- Approve / Reject Leave

## Payroll Management
- Create Payroll
- View Payroll
- Update Payroll
- Delete Payroll
- Salary Summary

## Dashboard
- Total Employees
- Total Departments
- Total Salary Statistics

## Security
- JWT Authentication
- Helmet Security Middleware
- Express Rate Limiting
- Input Validation using Express Validator
- Global Error Handling Middleware

---

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap
- Vite

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Security
- JWT
- bcryptjs
- Helmet
- Express Rate Limit

## File Upload
- Multer

## Validation
- Express Validator

---

# Project Structure

```
HRMS
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── config
│   ├── utils
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
```

---

# Installation

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# API Modules

- Authentication API
- Employee API
- Department API
- Leave API
- Payroll API
- Dashboard API

---

# 🔑 Login & Testing Credentials

UAT/Testing ke liye niche diye gaye accounts ka use kiya ja sakta hai:

### 1. Admin Account 
- **Email/ID:** `admin@hrms.com`
- **Password:** `admin123`
*(Poore system ke access ke liye, employees onboard karne aur department aur payroll setup karne ke liye iska use karein)*

### 2. Employee Account 🧑‍💻
- **Email/ID:** Jo email onboard karte waqt add kiya ho (e.g. `employee@gmail.com`)
- **Password:** Employee ke First Name ko lowercase mein likh kar aage `123` lagayein.
  - *Example:* Agar employee ka naam **Shikhar Sharma** hai, toh password **`shikhar123`** hoga.

---

# Author

**Team Lead:** Aman Shrivastava

**Project:** Human Resource Management System (HRMS)

**Technology:** MERN Stack

**Internship Project**
