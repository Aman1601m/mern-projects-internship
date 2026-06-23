#  HRMS Backend (MERN Stack)

##  Project Overview

This project is a backend system for a Human Resource Management System (HRMS) built using the MERN stack. It provides APIs for managing departments, employees, and user authentication.

---

##  Features

###  Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes using Middleware

###  Department Module

* Create Department
* Get All Departments
* Update Department
* Delete Department
* Validation and Duplicate Checks

###  Employee Module

* Create Employee
* Get Employees (with Department relation)
* Update Employee
* Delete Employee

###  Advanced Features

* Search (by employee name)
* Filter (by department)
* Pagination (for large data handling)

---

##  Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (Authentication)
* bcrypt.js (Password hashing)

---

##  Project Structure

```
backend/
│── controllers/
│── models/
│── routes/
│── middleware/
│── utils/
│── server.js
```

---

##  Installation

```bash
git clone <repo-link>
cd backend
npm install
```

---

##  Run the Server

```bash
npm run dev
```

---

##  API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Department

* POST /api/departments
* GET /api/departments
* PUT /api/departments/:id
* DELETE /api/departments/:id

### Employee

* POST /api/employees
* GET /api/employees
* PUT /api/employees/:id
* DELETE /api/employees/:id

---

##  Testing

All APIs were tested using Postman.

---

##  Current Status

* Backend APIs fully functional
* Authentication implemented
* Protected routes enabled

---

## Future Improvements

* Role-based Access Control (Admin/HR)
* File Upload (Profile Image)
* Dashboard APIs

---

##  Contribution

Worked on implementing Department and Employee modules, adding validation, and improving APIs with search, filtering, and pagination.

---

## Conclusion

This project demonstrates a secure and scalable backend system ready for real-world applications.
