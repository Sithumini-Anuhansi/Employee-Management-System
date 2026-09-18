<div align="center">

# 👥 FSD\_2\_EmployeeManagementSystem\_BYTE

### Employee Management System

**AVIP 2026 — Full Stack Development, Task 2**

[!\[Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[!\[Express](https://img.shields.io/badge/Express-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[!\[MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[!\[React](https://img.shields.io/badge/React-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[!\[Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[!\[JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)
[!\[License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

A full-stack MERN application providing CRUD operations for employee records, with admin-only authentication guarding create/update/delete actions, and a responsive React frontend.

</div>

\---

## 📋 Table of Contents

* [Tech Stack](#tech-stack)
* [Features](#features)
* [Project Structure](#project-structure)
* [Setup Instructions](#setup-instructions)
* [API Endpoints](#api-endpoints)
* [HTTP Status Codes](#http-status-codes)
* [Seed Data](#seed-data)
* [Frontend Notes](#frontend-notes)
* [Screenshots](#screenshots)
* [Deployment](#deployment)

\---

## <a id="tech-stack"></a>🛠️ Tech Stack

|Layer|Technology|
|-|-|
|**Frontend**|React.js · Vite · React Router · Axios|
|**Backend**|Node.js · Express.js · JWT · bcryptjs · express-validator|
|**Database**|MongoDB (Mongoose)|

## <a id="features"></a>✨ Features

* ✅ Full CRUD on employee records — Create, Read, Update, Delete
* 🔑 Admin login with JWT-protected write operations
* 🌐 Public read access — anyone can browse the employee directory
* 🔒 Server-side validation on every mutating request
* 📱 Responsive frontend table that scrolls cleanly on small screens
* 🌱 One-command seed script for an admin account + sample employees

## <a id="project-structure"></a>📁 Project Structure

```
FSD\_2\_EmployeeManagementSystem\_BYTE/
├── backend/
│   ├── config/db.js
│   ├── models/Admin.js
│   ├── models/Employee.js
│   ├── middleware/auth.js
│   ├── middleware/errorHandler.js
│   ├── controllers/authController.js
│   ├── controllers/employeeController.js
│   ├── routes/authRoutes.js
│   ├── routes/employeeRoutes.js
│   ├── seed/seedEmployees.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/AdminRoute.jsx
    │   ├── pages/AdminLogin.jsx
    │   ├── pages/EmployeeList.jsx
    │   ├── pages/EmployeeForm.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── .env.example
```

## <a id="setup-instructions"></a>🚀 Setup Instructions

### 1\. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set `MONGO\_URI` and a strong `JWT\_SECRET`
# `ADMIN\_EMAIL` / `ADMIN\_PASSWORD` control the seeded admin login
npm run seed   # creates the admin account + 5 sample employees
npm run dev
```

Backend runs at `http://localhost:5001`.

### 2\. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5174`.

Visit `/employees` to browse the public directory, or `/admin/login` to sign in as admin (default seeded credentials: `admin@company.com` / `Admin@123` — change these in `.env` before deploying).

## <a id="api-endpoints"></a>🔌 API Endpoints

|Method|Endpoint|Access|Description|
|-|-|-|-|
|POST|`/api/auth/login`|🌐 Public|Admin login, returns a JWT|
|GET|`/api/employees`|🌐 Public|List all employees|
|GET|`/api/employees/:id`|🌐 Public|Get a single employee by ID|
|POST|`/api/employees`|🔒 Admin only|Create a new employee|
|PUT|`/api/employees/:id`|🔒 Admin only|Update an existing employee|
|DELETE|`/api/employees/:id`|🔒 Admin only|Delete an employee|

### Admin Login — Request

```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "Admin@123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": { "id": "665f2...", "email": "admin@company.com" }
}
```

### Create Employee — Sample Authenticated Request

```bash
curl -X POST http://localhost:5001/api/employees \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Maria",
    "lastName": "Silva",
    "email": "maria.silva@company.com",
    "position": "QA Engineer",
    "department": "Engineering",
    "salary": 68000,
    "status": "active"
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Employee created successfully",
  "employee": { "\_id": "665f3...", "firstName": "Maria", "lastName": "Silva", "email": "maria.silva@company.com", "position": "QA Engineer", "department": "Engineering", "salary": 68000, "status": "active" }
}
```

**Attempting the same request with no token (401 Unauthorized):**

```json
{ "success": false, "message": "Not authorized, no token provided" }
```

### Sample Payload for Update (PUT)

```json
PUT /api/employees/665f3...

{
  "firstName": "Maria",
  "lastName": "Silva",
  "email": "maria.silva@company.com",
  "position": "Senior QA Engineer",
  "department": "Engineering",
  "salary": 75000,
  "status": "active"
}
```

## <a id="http-status-codes"></a>📊 HTTP Status Codes Used

|Code|Meaning|
|-|-|
|200|✅ Successful fetch / update / delete / login|
|201|✅ Employee created|
|400|⚠️ Validation error or malformed ID|
|401|🚫 Missing/invalid admin token or bad credentials|
|403|⛔ Valid token but not an admin role|
|404|🔍 Employee or route not found|
|409|♻️ Duplicate employee email|
|500|💥 Server error|

## <a id="seed-data"></a>🌱 Seed Data

Running `npm run seed` inserts 5 sample employees (Alice Johnson, Bilal Khan, Chen Wei, Diana Perez, Ethan Brown) across Engineering, Product, and Design departments, plus a single seeded admin account. Re-running the seed script clears and re-inserts the employee collection (idempotent for the admin account).

## <a id="frontend-notes"></a>💻 Frontend Notes

* `/employees` — public, responsive table of all employees (scrolls horizontally on small screens).
* `/admin/login` — admin sign-in; on success a JWT is stored in `localStorage` and used for all write requests.
* `/employees/new` and `/employees/edit/:id` — protected client-side routes; redirect to `/admin/login` if no admin token is present. The server independently re-validates the token on every write request, so client-side route protection is a UX convenience, not the security boundary.

## <a id="screenshots"></a>📸 Screenshots

<div align="center">

<h3>Employee Directory</h3>
<img src="screenshots/employee-list.png" alt="Public employee directory" width="700"/>

<br/><br/>

<h3>Admin Login</h3>
<img src="screenshots/admin-login.png" alt="Admin login form" width="700"/>

<br/><br/>

<h3>Admin Dashboard</h3>
<img src="screenshots/admin-dashboard.png" alt="Admin dashboard page" width="700"/>

<br/><br/>

<h3>Add / Create Employee</h3>
<img src="screenshots/create-employee.png" alt="Create employee form" width="700"/>

<br/><br/>

<h3>Add / Edit Employee</h3>
<img src="screenshots/update-employee.png" alt="Edit employee form" width="700"/>

<br/><br/>

<h3>Delete EmployeeView</h3>
<img src="screenshots/delete-employee.png" alt="Delete employee" width="400"/>

</div>

## <a id="deployment"></a> ☁️ Deployment (per AVIP guide)

1. Push this repo to GitHub as **`FSD\_2\_EmployeeManagementSystem\_BYTE`** (public).
2. Deploy `backend/` to **Render**, set env vars, and run the seed script once via Render's shell (or locally against the Atlas URI) to create the admin + sample data.
3. Deploy `frontend/` to **Vercel**, setting `VITE\_API\_URL` to your live Render backend URL.

\---

<div align="center">

Built with 💙 for **AVIP 2026** · [B.Y.T.E by Arithmatrix](https://www.linkedin.com/)

</div>

