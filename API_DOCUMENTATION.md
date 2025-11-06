# 🔌 API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-app.pages.dev/api
```

## Authentication

All API endpoints (except `/auth/login`) require JWT authentication.

### Headers
```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## 🔐 Authentication Endpoints

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@company.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

---

### GET /api/auth/me
Get current authenticated user information.

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

---

## 📋 Task Management Endpoints

### GET /api/tasks
Get all tasks with optional filtering.

**Query Parameters:**
- `team` (optional): Filter by team (`production` or `logistics`)
- `status` (optional): Filter by status (`pending`, `in_progress`, `completed`)
- `assigned_to` (optional): Filter by user ID

**Example:**
```
GET /api/tasks?team=production&status=in_progress
```

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "id": 1,
      "name": "Manufacturing Process",
      "description": "Begin manufacturing of product line A",
      "team": "production",
      "status": "in_progress",
      "assigned_to": 2,
      "assigned_to_name": "John Smith",
      "expected_completion": "2025-11-15",
      "actual_completion": null,
      "priority": 10,
      "dependencies": "[2]",
      "created_at": "2025-11-06T10:00:00.000Z",
      "updated_at": "2025-11-06T11:30:00.000Z"
    }
  ]
}
```

**Role-based Filtering:**
- Admin: Can see all tasks
- Production: Only sees production team tasks
- Logistics: Only sees logistics team tasks

---

### GET /api/tasks/:id
Get detailed information about a specific task including comments.

**Response (200 OK):**
```json
{
  "task": {
    "id": 1,
    "name": "Manufacturing Process",
    "description": "Begin manufacturing of product line A",
    "team": "production",
    "status": "in_progress",
    "assigned_to": 2,
    "assigned_to_name": "John Smith",
    "expected_completion": "2025-11-15",
    "actual_completion": null,
    "priority": 10,
    "dependencies": "[2]",
    "created_at": "2025-11-06T10:00:00.000Z",
    "updated_at": "2025-11-06T11:30:00.000Z"
  },
  "comments": [
    {
      "id": 1,
      "task_id": 1,
      "user_id": 2,
      "user_name": "John Smith",
      "content": "Started manufacturing process",
      "created_at": "2025-11-06T11:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found`: Task not found

---

### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "name": "New Task Name",
  "description": "Task description",
  "team": "production",
  "assigned_to": 2,
  "expected_completion": "2025-11-20",
  "priority": 7,
  "dependencies": "[]"
}
```

**Required Fields:**
- `name`
- `team`
- `expected_completion`

**Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "taskId": 11
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `403 Forbidden`: User can only create tasks for their team

---

### PUT /api/tasks/:id
Update an existing task.

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Task Name",
  "description": "Updated description",
  "status": "completed",
  "assigned_to": 3,
  "expected_completion": "2025-11-25",
  "priority": 8,
  "actual_completion": "2025-11-15"
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: No valid fields to update
- `403 Forbidden`: User can only update tasks for their team
- `404 Not Found`: Task not found

---

### DELETE /api/tasks/:id
Delete a task (Admin only).

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden`: Only admins can delete tasks

---

## 💬 Comment Endpoints

### POST /api/tasks/:id/comments
Add a comment to a task.

**Request Body:**
```json
{
  "content": "This is my comment"
}
```

**Response (201 Created):**
```json
{
  "message": "Comment added successfully",
  "commentId": 5
}
```

**Error Responses:**
- `400 Bad Request`: Content is required

---

## 🔔 Notification Endpoints

### GET /api/notifications
Get all notifications for the current user.

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": 1,
      "user_id": 2,
      "task_id": 3,
      "task_name": "Manufacturing Process",
      "message": "Task \"Manufacturing Process\" is now in progress",
      "type": "task_update",
      "is_read": 0,
      "created_at": "2025-11-06T12:00:00.000Z"
    }
  ]
}
```

**Notification Types:**
- `task_update`: Task status changed
- `deadline_warning`: Deadline approaching
- `assignment`: Task assigned to user

---

### PUT /api/notifications/:id/read
Mark a specific notification as read.

**Response (200 OK):**
```json
{
  "message": "Notification marked as read"
}
```

---

### PUT /api/notifications/read-all
Mark all notifications as read for the current user.

**Response (200 OK):**
```json
{
  "message": "All notifications marked as read"
}
```

---

## 👥 User Management Endpoints (Admin Only)

### GET /api/users
Get all users.

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": 1,
      "email": "admin@company.com",
      "name": "Admin User",
      "role": "admin",
      "created_at": "2025-11-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `403 Forbidden`: Only admins can access this endpoint

---

### POST /api/users
Create a new user.

**Request Body:**
```json
{
  "email": "newuser@company.com",
  "password": "securepassword",
  "name": "New User",
  "role": "production"
}
```

**Valid Roles:**
- `admin`
- `production`
- `logistics`

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "userId": 6
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid role
- `403 Forbidden`: Only admins can create users
- `409 Conflict`: User with this email already exists

---

## 📊 Dashboard Endpoints

### GET /api/dashboard/stats
Get dashboard statistics for the current user.

**Response (200 OK):**
```json
{
  "statusStats": [
    { "status": "pending", "count": 5 },
    { "status": "in_progress", "count": 3 },
    { "status": "completed", "count": 7 }
  ],
  "teamStats": [
    { "team": "production", "count": 8 },
    { "team": "logistics", "count": 7 }
  ],
  "upcomingDeadlines": 3,
  "myTasks": 2
}
```

**Role-based Stats:**
- Admin: All tasks statistics
- Production/Logistics: Only their team's statistics

---

## 🔒 Error Responses

All endpoints may return the following errors:

### 401 Unauthorized
```json
{
  "error": "Unauthorized: No token provided"
}
```
or
```json
{
  "error": "Unauthorized: Invalid token"
}
```
or
```json
{
  "error": "Unauthorized: Token expired"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: Insufficient permissions"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Example Usage

### Complete Flow Example (JavaScript)

```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@company.com',
    password: 'password123'
  })
})
const { token } = await loginResponse.json()

// 2. Get tasks
const tasksResponse = await fetch('/api/tasks?status=in_progress', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const { tasks } = await tasksResponse.json()

// 3. Update task
await fetch('/api/tasks/1', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'completed' })
})

// 4. Add comment
await fetch('/api/tasks/1/comments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: 'Task completed!' })
})

// 5. Get notifications
const notificationsResponse = await fetch('/api/notifications', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const { notifications } = await notificationsResponse.json()
```

---

## 🔑 Rate Limiting

Currently, there are no rate limits on the API. This may be added in future versions.

## 🌐 CORS

CORS is enabled for `/api/*` routes to allow frontend-backend communication.

## 📅 Date Format

All dates are in ISO 8601 format:
- DateTime: `2025-11-06T12:00:00.000Z`
- Date: `2025-11-06`

---

**API Version:** 1.0.0  
**Last Updated:** 2025-11-06
