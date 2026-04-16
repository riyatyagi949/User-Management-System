# MERN User Management System with JWT & RBAC

A full-stack MERN application built to manage users securely with authentication, authorization, and role-based access control. This project provides a complete user management workflow for Admin, Manager, and User roles, along with protected routes, audit tracking, and a clean responsive dashboard UI.

This application was developed as part of a MERN Stack Developer Intern assessment and demonstrates full-stack integration, secure API design, role-based permissions, clean project structure, and deployment readiness.

---

## Overview

The MERN User Management System is a full-stack web application that allows secure login and user administration based on roles and permissions. It is designed to demonstrate how a real-world admin panel can manage user accounts, enforce backend authorization, and separate admin-level capabilities from regular user actions.

The system supports:
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- User lifecycle management
- Profile management
- Search, filter, and pagination
- Audit metadata
- Frontend and backend deployment

---

## Problem Statement

Modern applications often require different levels of user access. An administrator should be able to manage all users, a manager may have limited control, and a regular user should only be able to access and edit personal profile data.

This project solves that problem by implementing:
- secure login
- protected APIs
- role-aware frontend rendering
- backend-enforced permissions
- maintainable architecture for future extension

---

## Key Objectives

- Build a secure MERN-based full-stack application
- Implement JWT authentication
- Add role-based authorization using RBAC
- Create a complete user management module
- Separate Admin, Manager, and User capabilities
- Track audit fields like creator/updater details
- Deploy frontend and backend to public URLs
- Write clean, scalable, and maintainable code

---

## Features

### Authentication
- Secure login with email and password
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes on frontend and backend
- Logout support
- Block inactive users from logging in

### Authorization
- Role-based access control for Admin, Manager, and User
- Admin-only actions protected on backend
- Manager permissions limited to non-admin users
- Regular users can only access their own profile
- Unauthorized requests return proper HTTP status codes

### User Management
- View paginated list of users
- Search users by name or email
- Filter users by role and status
- Create new users
- Edit existing users
- Activate/deactivate users
- View single user details
- Soft delete/deactivation workflow support

### Profile Management
- View own profile
- Update own name and password
- Restrict role change from self-profile
- Prevent viewing other users' private data

### Audit and Tracking
- Automatic `createdAt` and `updatedAt`
- `createdBy` and `updatedBy` references
- Audit details displayed in user detail view

### UI/UX
- Responsive dashboard layout
- Sidebar navigation with role-based items
- Clean cards, tables, filters, and forms
- Protected page access on client side
- Friendly status and error messages

---

## User Roles and Permissions

| Action | Admin | Manager | User |
|--------|-------|---------|------|
| Login | Yes | Yes | Yes |
| View dashboard | Yes | Yes | Yes |
| View all users | Yes | Yes | No |
| View single user | Yes | Yes (restricted) | Only self |
| Create user | Yes | No | No |
| Edit user | Yes | Yes (non-admin only) | Only self |
| Change role | Yes | No | No |
| Activate/Deactivate user | Yes | Limited/Optional | No |
| Delete user | Yes | No | No |
| View own profile | Yes | Yes | Yes |
| Update own profile | Yes | Yes | Yes |

---

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Context API
- Axios
- Lucide React Icons
- Custom CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- cors

### Deployment
- Frontend: Vercel / Netlify
- Backend: Render
- Database: MongoDB Atlas

---

## Project Architecture

This project follows a modular full-stack architecture with clear separation of concerns.

### Backend Layers
- **Models** for schema definitions
- **Controllers** for request handling
- **Routes** for API endpoints
- **Middlewares** for auth, RBAC, and error handling
- **Config** for database and environment setup
- **Seed scripts** for demo users

### Frontend Layers
- **Pages** for route-level screens
- **Components** for reusable UI blocks
- **Context** for auth state management
- **API layer** for Axios configuration
- **Layout** for dashboard shell and navigation
- **Protected routes** for client-side route control

---

## Folder Structure

```txt
mern-user-management-rbac/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Screens and Modules

### Authentication
- Login page
- Token persistence
- Logout flow

### Dashboard
- Welcome panel
- Role-specific quick overview
- Stats cards

### User Management
- User list page
- Search and filter panel
- User details page
- Add/Edit user form
- Status update actions

### Profile
- My profile page
- Update profile info
- Change password

### Shared UI
- Sidebar layout
- Top header
- Protected route handling
- Role-based navigation

---

## Authentication Flow

1. User enters email and password on the login page.
2. Backend validates credentials.
3. Password is compared using bcrypt.
4. If valid, backend returns a signed JWT token and safe user data.
5. Frontend stores token and user session state.
6. Protected API requests include the token in the `Authorization` header.
7. On logout, token and session state are cleared.

---

## Authorization Flow

Authorization is enforced on the backend using middleware and role checks.

### Examples
- Only **Admin** can create new users
- Only **Admin** can assign or change roles
- **Manager** can view user list and update non-admin users
- **User** can access only personal profile data
- Any invalid or restricted request returns `401 Unauthorized` or `403 Forbidden`

This ensures security is not dependent only on frontend UI hiding.

---

## Audit Tracking

The application includes basic audit support using the following fields:

- `createdAt`
- `updatedAt`
- `createdBy`
- `updatedBy`

Whenever possible, user creation and updates are linked to the authenticated user performing the action. These details are shown in user detail views to demonstrate audit awareness.

---

## API Endpoints

### Auth Routes
```http
POST   /api/auth/login
GET    /api/auth/me
```

### User Routes
```http
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
PATCH  /api/users/:id/status
DELETE /api/users/:id
```

### Profile Routes
```http
GET    /api/profile
PATCH  /api/profile
PATCH  /api/profile/password
```

---

## Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Demo Credentials

Use seeded accounts to test the application.

### Admin
```txt
Email: admin@example.com
Password: Admin@123
```

### Manager
```txt
Email: manager@example.com
Password: Manager@123
```

### User
```txt
Email: user@example.com
Password: User@123
```

> You can update these credentials in the seed script before deployment if required.

---

## Local Setup Instructions

Clone the repository and install dependencies separately for backend and frontend.

```bash
git clone https://github.com/your-username/mern-user-management-rbac.git
cd mern-user-management-rbac
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run backend server:

```bash
npm run dev
```

If seed script is included, run:

```bash
npm run seed
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder and add:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## Running the Project

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

After that, open:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## Deployment

### Live Links
- **Frontend:** `https://user-management-system-rbac-frontend.onrender.com`
- **Backend:** `https://user-management-system-rbac.onrender.com`



