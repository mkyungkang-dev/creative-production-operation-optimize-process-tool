/**
 * Production-Logistics Management System
 * Main application entry point with API routes
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'
import { authMiddleware, requireRole } from './middleware/auth'
import { generateToken, hashPassword, verifyPassword } from './utils/auth'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ======================
// Authentication Routes
// ======================

/**
 * POST /api/auth/login
 * Login with email and password
 */
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    // Find user by email
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first()

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password as string)
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT token
    const token = await generateToken(
      user.id as number,
      user.email as string,
      user.role as string
    )

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * GET /api/auth/me
 * Get current user info
 */
app.get('/api/auth/me', authMiddleware, async (c) => {
  const user = c.get('user')
  
  const dbUser = await c.env.DB.prepare(
    'SELECT id, email, name, role FROM users WHERE id = ?'
  ).bind(user.userId).first()

  if (!dbUser) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({ user: dbUser })
})

// ======================
// User Management Routes
// ======================

/**
 * GET /api/users
 * Get all users (Admin only)
 */
app.get('/api/users', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const users = await c.env.DB.prepare(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
    ).all()

    return c.json({ users: users.results })
  } catch (error) {
    console.error('Get users error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * POST /api/users
 * Create new user (Admin only)
 */
app.post('/api/users', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const { email, password, name, role } = await c.req.json()

    if (!email || !password || !name || !role) {
      return c.json({ error: 'All fields are required' }, 400)
    }

    if (!['admin', 'production', 'logistics'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400)
    }

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    ).bind(email, hashedPassword, name, role).run()

    return c.json({
      message: 'User created successfully',
      userId: result.meta.last_row_id
    }, 201)
  } catch (error) {
    console.error('Create user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ======================
// Task Management Routes
// ======================

/**
 * GET /api/tasks
 * Get all tasks with filtering
 */
app.get('/api/tasks', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const team = c.req.query('team')
    const status = c.req.query('status')
    const assignedTo = c.req.query('assigned_to')

    let query = `
      SELECT t.*, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE 1=1
    `
    const params: any[] = []

    // Role-based filtering
    if (user.role === 'production') {
      query += ' AND t.team = ?'
      params.push('production')
    } else if (user.role === 'logistics') {
      query += ' AND t.team = ?'
      params.push('logistics')
    }

    // Additional filters
    if (team) {
      query += ' AND t.team = ?'
      params.push(team)
    }
    if (status) {
      query += ' AND t.status = ?'
      params.push(status)
    }
    if (assignedTo) {
      query += ' AND t.assigned_to = ?'
      params.push(assignedTo)
    }

    query += ' ORDER BY t.priority DESC, t.expected_completion ASC'

    const stmt = c.env.DB.prepare(query)
    const tasks = await stmt.bind(...params).all()

    return c.json({ tasks: tasks.results })
  } catch (error) {
    console.error('Get tasks error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * GET /api/tasks/:id
 * Get single task by ID
 */
app.get('/api/tasks/:id', authMiddleware, async (c) => {
  try {
    const taskId = c.req.param('id')
    
    const task = await c.env.DB.prepare(`
      SELECT t.*, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = ?
    `).bind(taskId).first()

    if (!task) {
      return c.json({ error: 'Task not found' }, 404)
    }

    // Get comments for this task
    const comments = await c.env.DB.prepare(`
      SELECT c.*, u.name as user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = ?
      ORDER BY c.created_at DESC
    `).bind(taskId).all()

    return c.json({
      task,
      comments: comments.results
    })
  } catch (error) {
    console.error('Get task error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * POST /api/tasks
 * Create new task
 */
app.post('/api/tasks', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const { name, description, team, assigned_to, expected_completion, priority, dependencies } = await c.req.json()

    if (!name || !team || !expected_completion) {
      return c.json({ error: 'Name, team, and expected_completion are required' }, 400)
    }

    // Check permissions
    if (user.role !== 'admin' && user.role !== team) {
      return c.json({ error: 'You can only create tasks for your team' }, 403)
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO tasks (name, description, team, assigned_to, expected_completion, priority, dependencies)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name,
      description || null,
      team,
      assigned_to || null,
      expected_completion,
      priority || 5,
      dependencies || '[]'
    ).run()

    // Create notification if task is assigned
    if (assigned_to) {
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, task_id, message, type)
        VALUES (?, ?, ?, ?)
      `).bind(
        assigned_to,
        result.meta.last_row_id,
        `You have been assigned to "${name}"`,
        'assignment'
      ).run()
    }

    return c.json({
      message: 'Task created successfully',
      taskId: result.meta.last_row_id
    }, 201)
  } catch (error) {
    console.error('Create task error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * PUT /api/tasks/:id
 * Update task
 */
app.put('/api/tasks/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const taskId = c.req.param('id')
    const updates = await c.req.json()

    // Get existing task
    const task = await c.env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(taskId).first()
    if (!task) {
      return c.json({ error: 'Task not found' }, 404)
    }

    // Check permissions
    if (user.role !== 'admin' && user.role !== task.team) {
      return c.json({ error: 'You can only update tasks for your team' }, 403)
    }

    // Build update query
    const allowedFields = ['name', 'description', 'status', 'assigned_to', 'expected_completion', 'priority', 'actual_completion']
    const updateFields: string[] = []
    const params: any[] = []

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`)
        params.push(updates[field])
      }
    }

    if (updateFields.length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400)
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    params.push(taskId)

    await c.env.DB.prepare(`
      UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?
    `).bind(...params).run()

    // Create notification for status change
    if (updates.status && updates.status !== task.status && task.assigned_to) {
      await c.env.DB.prepare(`
        INSERT INTO notifications (user_id, task_id, message, type)
        VALUES (?, ?, ?, ?)
      `).bind(
        task.assigned_to,
        taskId,
        `Task "${task.name}" status changed to ${updates.status}`,
        'task_update'
      ).run()
    }

    return c.json({ message: 'Task updated successfully' })
  } catch (error) {
    console.error('Update task error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * DELETE /api/tasks/:id
 * Delete task (Admin only)
 */
app.delete('/api/tasks/:id', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const taskId = c.req.param('id')
    
    await c.env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(taskId).run()
    
    return c.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Delete task error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ======================
// Comments Routes
// ======================

/**
 * POST /api/tasks/:id/comments
 * Add comment to task
 */
app.post('/api/tasks/:id/comments', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const taskId = c.req.param('id')
    const { content } = await c.req.json()

    if (!content) {
      return c.json({ error: 'Content is required' }, 400)
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO comments (task_id, user_id, content)
      VALUES (?, ?, ?)
    `).bind(taskId, user.userId, content).run()

    return c.json({
      message: 'Comment added successfully',
      commentId: result.meta.last_row_id
    }, 201)
  } catch (error) {
    console.error('Add comment error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ======================
// Notifications Routes
// ======================

/**
 * GET /api/notifications
 * Get notifications for current user
 */
app.get('/api/notifications', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    
    const notifications = await c.env.DB.prepare(`
      SELECT n.*, t.name as task_name
      FROM notifications n
      LEFT JOIN tasks t ON n.task_id = t.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `).bind(user.userId).all()

    return c.json({ notifications: notifications.results })
  } catch (error) {
    console.error('Get notifications error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
app.put('/api/notifications/:id/read', authMiddleware, async (c) => {
  try {
    const user = c.get('user')
    const notificationId = c.req.param('id')

    await c.env.DB.prepare(`
      UPDATE notifications SET is_read = 1
      WHERE id = ? AND user_id = ?
    `).bind(notificationId, user.userId).run()

    return c.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Mark notification read error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
app.put('/api/notifications/read-all', authMiddleware, async (c) => {
  try {
    const user = c.get('user')

    await c.env.DB.prepare(`
      UPDATE notifications SET is_read = 1 WHERE user_id = ?
    `).bind(user.userId).run()

    return c.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ======================
// Dashboard Statistics
// ======================

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
app.get('/api/dashboard/stats', authMiddleware, async (c) => {
  try {
    const user = c.get('user')

    // Total tasks by status
    let query = 'SELECT status, COUNT(*) as count FROM tasks'
    if (user.role !== 'admin') {
      query += ` WHERE team = '${user.role}'`
    }
    query += ' GROUP BY status'

    const statusStats = await c.env.DB.prepare(query).all()

    // Tasks by team
    const teamStats = await c.env.DB.prepare(
      'SELECT team, COUNT(*) as count FROM tasks GROUP BY team'
    ).all()

    // Upcoming deadlines (next 7 days)
    let deadlineQuery = `
      SELECT COUNT(*) as count FROM tasks
      WHERE status != 'completed'
      AND expected_completion BETWEEN date('now') AND date('now', '+7 days')
    `
    if (user.role !== 'admin') {
      deadlineQuery += ` AND team = '${user.role}'`
    }

    const deadlineStats = await c.env.DB.prepare(deadlineQuery).first()

    // User's assigned tasks
    const myTasks = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM tasks
      WHERE assigned_to = ? AND status != 'completed'
    `).bind(user.userId).first()

    return c.json({
      statusStats: statusStats.results,
      teamStats: teamStats.results,
      upcomingDeadlines: deadlineStats?.count || 0,
      myTasks: myTasks?.count || 0
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// ======================
// Frontend Route
// ======================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>생산-물류 관리 시스템</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <div id="app"></div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
