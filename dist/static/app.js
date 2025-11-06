/**
 * Production-Logistics Management System
 * Frontend Application
 */

// ======================
// State Management
// ======================

const state = {
  user: null,
  token: localStorage.getItem('token'),
  tasks: [],
  users: [],
  notifications: [],
  currentView: 'dashboard',
  filters: {
    team: '',
    status: '',
    assignedTo: ''
  },
  pollingInterval: null
}

// ======================
// API Client
// ======================

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use(config => {
  if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      logout()
    }
    return Promise.reject(error)
  }
)

// ======================
// Authentication
// ======================

async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password })
    state.token = response.data.token
    state.user = response.data.user
    localStorage.setItem('token', state.token)
    
    // Start polling for updates
    startPolling()
    
    showView('dashboard')
    loadDashboard()
    showNotification('로그인 성공!', 'success')
  } catch (error) {
    showNotification('로그인 실패: ' + (error.response?.data?.error || '서버 오류'), 'error')
  }
}

function logout() {
  state.token = null
  state.user = null
  localStorage.removeItem('token')
  stopPolling()
  showView('login')
}

async function checkAuth() {
  if (!state.token) {
    showView('login')
    return false
  }

  try {
    const response = await api.get('/auth/me')
    state.user = response.data.user
    startPolling()
    return true
  } catch (error) {
    logout()
    return false
  }
}

// ======================
// Data Loading
// ======================

async function loadTasks() {
  try {
    const params = new URLSearchParams()
    if (state.filters.team) params.append('team', state.filters.team)
    if (state.filters.status) params.append('status', state.filters.status)
    if (state.filters.assignedTo) params.append('assigned_to', state.filters.assignedTo)

    const response = await api.get(`/tasks?${params}`)
    state.tasks = response.data.tasks
    return state.tasks
  } catch (error) {
    console.error('Failed to load tasks:', error)
    showNotification('작업 로드 실패', 'error')
    return []
  }
}

async function loadUsers() {
  try {
    const response = await api.get('/users')
    state.users = response.data.users
    return state.users
  } catch (error) {
    console.error('Failed to load users:', error)
    return []
  }
}

async function loadNotifications() {
  try {
    const response = await api.get('/notifications')
    state.notifications = response.data.notifications
    updateNotificationBadge()
    return state.notifications
  } catch (error) {
    console.error('Failed to load notifications:', error)
    return []
  }
}

async function loadDashboardStats() {
  try {
    const response = await api.get('/dashboard/stats')
    return response.data
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
    return null
  }
}

// ======================
// Polling for Real-time Updates
// ======================

function startPolling() {
  // Poll every 5 seconds
  state.pollingInterval = setInterval(async () => {
    await loadNotifications()
    if (state.currentView === 'tasks') {
      await loadTasks()
      renderTasksList()
    } else if (state.currentView === 'dashboard') {
      loadDashboard()
    }
  }, 5000)
}

function stopPolling() {
  if (state.pollingInterval) {
    clearInterval(state.pollingInterval)
    state.pollingInterval = null
  }
}

// ======================
// UI Rendering
// ======================

function showView(viewName) {
  state.currentView = viewName
  const app = document.getElementById('app')

  if (viewName === 'login') {
    app.innerHTML = renderLoginPage()
    attachLoginHandlers()
  } else {
    app.innerHTML = renderMainLayout()
    attachMainHandlers()
    
    // Show the selected view
    switch (viewName) {
      case 'dashboard':
        loadDashboard()
        break
      case 'tasks':
        loadTasksView()
        break
      case 'diagram':
        loadDiagramView()
        break
      case 'settings':
        loadSettingsView()
        break
    }
  }
}

function renderLoginPage() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div class="card p-8 max-w-md w-full">
        <div class="text-center mb-8">
          <i class="fas fa-industry text-5xl text-blue-600 mb-4"></i>
          <h1 class="text-3xl font-bold text-gray-800">생산-물류 관리</h1>
          <p class="text-gray-600 mt-2">로그인하여 시작하세요</p>
        </div>
        
        <form id="loginForm" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-envelope mr-2"></i>이메일
            </label>
            <input type="email" id="loginEmail" required
              class="form-input w-full"
              placeholder="your@email.com">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-lock mr-2"></i>비밀번호
            </label>
            <input type="password" id="loginPassword" required
              class="form-input w-full"
              placeholder="••••••••">
          </div>
          
          <button type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            <i class="fas fa-sign-in-alt mr-2"></i>로그인
          </button>
        </form>
        
        <div class="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <p class="font-medium text-gray-700 mb-2">테스트 계정:</p>
          <p class="text-gray-600">Admin: admin@company.com</p>
          <p class="text-gray-600">생산팀: production1@company.com</p>
          <p class="text-gray-600">물류팀: logistics1@company.com</p>
          <p class="text-gray-500 text-xs mt-2">비밀번호: password123</p>
        </div>
      </div>
    </div>
  `
}

function renderMainLayout() {
  const unreadCount = state.notifications.filter(n => !n.is_read).length
  
  return `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside class="sidebar w-64 bg-white shadow-lg">
        <div class="p-6 border-b">
          <div class="flex items-center space-x-3">
            <i class="fas fa-industry text-2xl text-blue-600"></i>
            <div>
              <h2 class="font-bold text-gray-800">생산물류</h2>
              <p class="text-xs text-gray-500">${state.user?.name}</p>
            </div>
          </div>
        </div>
        
        <nav class="p-4 space-y-2">
          <a href="#" data-view="dashboard" class="nav-item flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition">
            <i class="fas fa-chart-line w-5"></i>
            <span>대시보드</span>
          </a>
          <a href="#" data-view="tasks" class="nav-item flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition">
            <i class="fas fa-tasks w-5"></i>
            <span>작업 관리</span>
          </a>
          <a href="#" data-view="diagram" class="nav-item flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition">
            <i class="fas fa-project-diagram w-5"></i>
            <span>프로세스 다이어그램</span>
          </a>
          ${state.user?.role === 'admin' ? `
          <a href="#" data-view="settings" class="nav-item flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition">
            <i class="fas fa-cog w-5"></i>
            <span>설정</span>
          </a>
          ` : ''}
        </nav>
        
        <div class="absolute bottom-0 w-64 p-4 border-t">
          <button onclick="logout()" class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition">
            <i class="fas fa-sign-out-alt w-5"></i>
            <span>로그아웃</span>
          </button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
          <div class="px-6 py-4 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800" id="viewTitle">대시보드</h1>
            
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button onclick="toggleNotifications()" class="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <i class="fas fa-bell text-gray-600 text-xl"></i>
                ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
              </button>
              
              <!-- User Menu -->
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-800">${state.user?.name}</p>
                  <p class="text-xs text-gray-500">${getRoleLabel(state.user?.role)}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  ${state.user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <!-- Main Content Area -->
        <main class="flex-1 overflow-y-auto p-6">
          <div id="mainContent"></div>
        </main>
      </div>
      
      <!-- Notifications Panel -->
      <div id="notificationsPanel" class="hidden fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto">
        <div class="p-6 border-b flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800">
            <i class="fas fa-bell mr-2"></i>알림
          </h3>
          <button onclick="toggleNotifications()" class="p-2 hover:bg-gray-100 rounded-lg">
            <i class="fas fa-times text-gray-600"></i>
          </button>
        </div>
        <div id="notificationsList"></div>
      </div>
    </div>
  `
}

async function loadDashboard() {
  const stats = await loadDashboardStats()
  await loadTasks()
  
  if (!stats) return
  
  const content = document.getElementById('mainContent')
  document.getElementById('viewTitle').textContent = '대시보드'
  
  const myTasks = state.tasks.filter(t => t.assigned_to === state.user?.id && t.status !== 'completed')
  const upcomingTasks = state.tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.expected_completion) - new Date(b.expected_completion))
    .slice(0, 5)
  
  content.innerHTML = `
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">내 작업</p>
            <p class="text-3xl font-bold text-blue-600">${stats.myTasks}</p>
          </div>
          <i class="fas fa-user-check text-4xl text-blue-200"></i>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">진행 중</p>
            <p class="text-3xl font-bold text-yellow-600">
              ${stats.statusStats.find(s => s.status === 'in_progress')?.count || 0}
            </p>
          </div>
          <i class="fas fa-spinner text-4xl text-yellow-200"></i>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">완료됨</p>
            <p class="text-3xl font-bold text-green-600">
              ${stats.statusStats.find(s => s.status === 'completed')?.count || 0}
            </p>
          </div>
          <i class="fas fa-check-circle text-4xl text-green-200"></i>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">마감 임박</p>
            <p class="text-3xl font-bold text-red-600">${stats.upcomingDeadlines}</p>
          </div>
          <i class="fas fa-exclamation-triangle text-4xl text-red-200"></i>
        </div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          <i class="fas fa-chart-pie mr-2"></i>상태별 작업
        </h3>
        <canvas id="statusChart"></canvas>
      </div>
      
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          <i class="fas fa-chart-bar mr-2"></i>팀별 작업
        </h3>
        <canvas id="teamChart"></canvas>
      </div>
    </div>
    
    <!-- Recent Tasks -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          <i class="fas fa-user mr-2"></i>내 작업 (${myTasks.length})
        </h3>
        <div class="space-y-3">
          ${myTasks.length > 0 ? myTasks.map(task => `
            <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              onclick="viewTaskDetail(${task.id})">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-800">${task.name}</span>
                ${renderStatusBadge(task.status)}
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <span><i class="far fa-calendar mr-1"></i>${formatDate(task.expected_completion)}</span>
                ${renderTeamBadge(task.team)}
              </div>
            </div>
          `).join('') : '<p class="text-gray-500 text-center py-4">할당된 작업이 없습니다</p>'}
        </div>
      </div>
      
      <div class="card p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          <i class="fas fa-clock mr-2"></i>다가오는 마감일
        </h3>
        <div class="space-y-3">
          ${upcomingTasks.map(task => `
            <div class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              onclick="viewTaskDetail(${task.id})">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-800">${task.name}</span>
                ${renderStatusBadge(task.status)}
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <span><i class="far fa-calendar mr-1"></i>${formatDate(task.expected_completion)}</span>
                <span class="text-xs">${task.assigned_to_name || '미배정'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
  
  // Render charts
  renderStatusChart(stats.statusStats)
  renderTeamChart(stats.teamStats)
}

function renderStatusChart(data) {
  const ctx = document.getElementById('statusChart')
  if (!ctx) return
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['대기중', '진행중', '완료'],
      datasets: [{
        data: [
          data.find(s => s.status === 'pending')?.count || 0,
          data.find(s => s.status === 'in_progress')?.count || 0,
          data.find(s => s.status === 'completed')?.count || 0
        ],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

function renderTeamChart(data) {
  const ctx = document.getElementById('teamChart')
  if (!ctx) return
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['생산팀', '물류팀'],
      datasets: [{
        label: '작업 수',
        data: [
          data.find(s => s.team === 'production')?.count || 0,
          data.find(s => s.team === 'logistics')?.count || 0
        ],
        backgroundColor: ['#3b82f6', '#10b981']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
}

async function loadTasksView() {
  document.getElementById('viewTitle').textContent = '작업 관리'
  await loadTasks()
  
  if (state.user?.role === 'admin') {
    await loadUsers()
  }
  
  renderTasksList()
}

function renderTasksList() {
  const content = document.getElementById('mainContent')
  
  content.innerHTML = `
    <!-- Filters -->
    <div class="card p-6 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">팀</label>
          <select id="filterTeam" class="form-input">
            <option value="">전체</option>
            ${state.user?.role === 'admin' ? `
              <option value="production">생산팀</option>
              <option value="logistics">물류팀</option>
            ` : ''}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
          <select id="filterStatus" class="form-input">
            <option value="">전체</option>
            <option value="pending">대기중</option>
            <option value="in_progress">진행중</option>
            <option value="completed">완료</option>
          </select>
        </div>
        
        <div class="ml-auto flex items-center space-x-3">
          ${(state.user?.role === 'admin' || state.user?.role === 'production' || state.user?.role === 'logistics') ? `
            <button onclick="downloadExcelTemplate()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-download mr-2"></i>템플릿 다운로드
            </button>
            <button onclick="showFileUploadModal()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              <i class="fas fa-file-upload mr-2"></i>파일 업로드
            </button>
            <button onclick="showCreateTaskModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <i class="fas fa-plus mr-2"></i>새 작업
            </button>
          ` : ''}
        </div>
      </div>
    </div>
    
    <!-- Tasks List -->
    <div class="grid grid-cols-1 gap-4">
      ${state.tasks.map(task => `
        <div class="card p-6 cursor-pointer hover:shadow-lg transition"
          onclick="viewTaskDetail(${task.id})">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-bold text-gray-800">${task.name}</h3>
                ${renderStatusBadge(task.status)}
                ${renderTeamBadge(task.team)}
              </div>
              <p class="text-gray-600 text-sm">${task.description || '설명 없음'}</p>
            </div>
            <div class="text-right">
              <div class="priority-${task.priority >= 8 ? 'high' : task.priority >= 5 ? 'medium' : 'low'}">
                <i class="fas fa-flag"></i>
                <span class="text-sm ml-1">우선순위 ${task.priority}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-600">
            <div class="flex items-center space-x-4">
              <span>
                <i class="far fa-user mr-1"></i>
                ${task.assigned_to_name || '미배정'}
              </span>
              <span>
                <i class="far fa-calendar mr-1"></i>
                ${formatDate(task.expected_completion)}
              </span>
            </div>
            <div class="text-xs text-gray-500">
              ${formatDateTime(task.updated_at)}
            </div>
          </div>
        </div>
      `).join('')}
      
      ${state.tasks.length === 0 ? `
        <div class="card p-12 text-center">
          <i class="fas fa-tasks text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">작업이 없습니다</p>
        </div>
      ` : ''}
    </div>
  `
  
  // Attach filter handlers
  document.getElementById('filterTeam').value = state.filters.team
  document.getElementById('filterStatus').value = state.filters.status
  
  document.getElementById('filterTeam').addEventListener('change', (e) => {
    state.filters.team = e.target.value
    loadTasks().then(renderTasksList)
  })
  
  document.getElementById('filterStatus').addEventListener('change', (e) => {
    state.filters.status = e.target.value
    loadTasks().then(renderTasksList)
  })
}

async function viewTaskDetail(taskId) {
  try {
    const response = await api.get(`/tasks/${taskId}`)
    const { task, comments } = response.data
    
    showModal(`
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">${task.name}</h2>
          <div class="flex space-x-2">
            ${renderStatusBadge(task.status)}
            ${renderTeamBadge(task.team)}
          </div>
        </div>
        <p class="text-gray-600">${task.description || '설명 없음'}</p>
      </div>
      
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">담당자</label>
          <p class="text-gray-800">${task.assigned_to_name || '미배정'}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
          <p class="text-gray-800">${task.priority}/10</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">예상 완료일</label>
          <p class="text-gray-800">${formatDate(task.expected_completion)}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">실제 완료일</label>
          <p class="text-gray-800">${task.actual_completion ? formatDate(task.actual_completion) : '미완료'}</p>
        </div>
      </div>
      
      <!-- Comments -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          <i class="fas fa-comments mr-2"></i>댓글 (${comments.length})
        </h3>
        <div class="space-y-3 mb-4 max-h-64 overflow-y-auto">
          ${comments.map(comment => `
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-800">${comment.user_name}</span>
                <span class="text-xs text-gray-500">${formatDateTime(comment.created_at)}</span>
              </div>
              <p class="text-gray-600 text-sm">${comment.content}</p>
            </div>
          `).join('')}
          ${comments.length === 0 ? '<p class="text-gray-500 text-center py-4">댓글이 없습니다</p>' : ''}
        </div>
        
        <div class="flex space-x-2">
          <input type="text" id="newComment" placeholder="댓글 입력..."
            class="form-input flex-1">
          <button onclick="addComment(${taskId})"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="border-t pt-6 mt-6 flex justify-between">
        <button onclick="showEditTaskModal(${taskId})"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          <i class="fas fa-edit mr-2"></i>수정
        </button>
        ${state.user?.role === 'admin' ? `
          <button onclick="deleteTask(${taskId})"
            class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
            <i class="fas fa-trash mr-2"></i>삭제
          </button>
        ` : ''}
      </div>
    `)
  } catch (error) {
    showNotification('작업 정보를 불러올 수 없습니다', 'error')
  }
}

async function addComment(taskId) {
  const input = document.getElementById('newComment')
  const content = input.value.trim()
  
  if (!content) return
  
  try {
    await api.post(`/tasks/${taskId}/comments`, { content })
    showNotification('댓글이 추가되었습니다', 'success')
    viewTaskDetail(taskId) // Refresh
  } catch (error) {
    showNotification('댓글 추가 실패', 'error')
  }
}

function showCreateTaskModal() {
  const teamOptions = state.user?.role === 'admin' 
    ? '<option value="production">생산팀</option><option value="logistics">물류팀</option>'
    : `<option value="${state.user?.role}">${getTeamLabel(state.user?.role)}</option>`
  
  const userOptions = state.users
    .filter(u => state.user?.role === 'admin' || u.role === state.user?.role)
    .map(u => `<option value="${u.id}">${u.name} (${getRoleLabel(u.role)})</option>`)
    .join('')
  
  showModal(`
    <h2 class="text-2xl font-bold text-gray-800 mb-6">새 작업 생성</h2>
    <form id="createTaskForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">작업명 *</label>
        <input type="text" name="name" required class="form-input w-full">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
        <textarea name="description" rows="3" class="form-input w-full"></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">팀 *</label>
          <select name="team" required class="form-input w-full">
            ${teamOptions}
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">담당자</label>
          <select name="assigned_to" class="form-input w-full">
            <option value="">미배정</option>
            ${userOptions}
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">예상 완료일 *</label>
          <input type="date" name="expected_completion" required class="form-input w-full">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">우선순위 (1-10)</label>
          <input type="number" name="priority" min="1" max="10" value="5" class="form-input w-full">
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <button type="button" onclick="closeModal()"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          취소
        </button>
        <button type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          <i class="fas fa-plus mr-2"></i>생성
        </button>
      </div>
    </form>
  `)
  
  document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    try {
      await api.post('/tasks', data)
      showNotification('작업이 생성되었습니다', 'success')
      closeModal()
      loadTasks().then(renderTasksList)
    } catch (error) {
      showNotification('작업 생성 실패: ' + (error.response?.data?.error || '서버 오류'), 'error')
    }
  })
}

async function showEditTaskModal(taskId) {
  try {
    const response = await api.get(`/tasks/${taskId}`)
    const task = response.data.task
    
    closeModal()
    
    showModal(`
      <h2 class="text-2xl font-bold text-gray-800 mb-6">작업 수정</h2>
      <form id="editTaskForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">작업명 *</label>
          <input type="text" name="name" value="${task.name}" required class="form-input w-full">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">설명</label>
          <textarea name="description" rows="3" class="form-input w-full">${task.description || ''}</textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select name="status" class="form-input w-full">
              <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>대기중</option>
              <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>진행중</option>
              <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>완료</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
            <input type="number" name="priority" min="1" max="10" value="${task.priority}" class="form-input w-full">
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">예상 완료일</label>
            <input type="date" name="expected_completion" value="${task.expected_completion}" class="form-input w-full">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">실제 완료일</label>
            <input type="date" name="actual_completion" value="${task.actual_completion || ''}" class="form-input w-full">
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" onclick="closeModal()"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            취소
          </button>
          <button type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            <i class="fas fa-save mr-2"></i>저장
          </button>
        </div>
      </form>
    `)
    
    document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData)
      
      // Remove empty fields
      Object.keys(data).forEach(key => {
        if (data[key] === '') delete data[key]
      })
      
      try {
        await api.put(`/tasks/${taskId}`, data)
        showNotification('작업이 수정되었습니다', 'success')
        closeModal()
        loadTasks().then(renderTasksList)
      } catch (error) {
        showNotification('작업 수정 실패: ' + (error.response?.data?.error || '서버 오류'), 'error')
      }
    })
  } catch (error) {
    showNotification('작업 정보를 불러올 수 없습니다', 'error')
  }
}

async function deleteTask(taskId) {
  if (!confirm('정말 이 작업을 삭제하시겠습니까?')) return
  
  try {
    await api.delete(`/tasks/${taskId}`)
    showNotification('작업이 삭제되었습니다', 'success')
    closeModal()
    loadTasks().then(renderTasksList)
  } catch (error) {
    showNotification('작업 삭제 실패', 'error')
  }
}

async function loadDiagramView() {
  document.getElementById('viewTitle').textContent = '프로세스 다이어그램'
  await loadTasks()
  
  const content = document.getElementById('mainContent')
  
  // Group tasks by team
  const productionTasks = state.tasks.filter(t => t.team === 'production').sort((a, b) => a.id - b.id)
  const logisticsTasks = state.tasks.filter(t => t.team === 'logistics').sort((a, b) => a.id - b.id)
  
  content.innerHTML = `
    <div class="card p-8">
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">생산-물류 프로세스 흐름도</h2>
        <p class="text-gray-600">전체 워크플로우를 한눈에 확인하세요</p>
      </div>
      
      <!-- Production Team -->
      <div class="mb-12">
        <h3 class="text-xl font-bold text-blue-600 mb-6 flex items-center">
          <i class="fas fa-industry mr-2"></i>생산팀 프로세스
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-${Math.min(productionTasks.length, 5)} gap-4">
          ${productionTasks.map((task, index) => `
            <div class="relative">
              <div class="process-node card p-4 text-center cursor-pointer"
                onclick="viewTaskDetail(${task.id})">
                <div class="mb-2">
                  ${getStatusIcon(task.status)}
                </div>
                <h4 class="font-bold text-gray-800 text-sm mb-1">${task.name}</h4>
                ${renderStatusBadge(task.status)}
                <p class="text-xs text-gray-600 mt-2">
                  ${task.assigned_to_name || '미배정'}
                </p>
              </div>
              ${index < productionTasks.length - 1 ? `
                <div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <i class="fas fa-arrow-right text-gray-400 text-2xl"></i>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Connection Arrow -->
      <div class="flex justify-center mb-12">
        <div class="text-center">
          <i class="fas fa-arrow-down text-4xl text-gray-400 mb-2"></i>
          <p class="text-sm text-gray-600 font-medium">프로세스 전환</p>
        </div>
      </div>
      
      <!-- Logistics Team -->
      <div>
        <h3 class="text-xl font-bold text-green-600 mb-6 flex items-center">
          <i class="fas fa-truck mr-2"></i>물류팀 프로세스
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-${Math.min(logisticsTasks.length, 5)} gap-4">
          ${logisticsTasks.map((task, index) => `
            <div class="relative">
              <div class="process-node card p-4 text-center cursor-pointer"
                onclick="viewTaskDetail(${task.id})">
                <div class="mb-2">
                  ${getStatusIcon(task.status)}
                </div>
                <h4 class="font-bold text-gray-800 text-sm mb-1">${task.name}</h4>
                ${renderStatusBadge(task.status)}
                <p class="text-xs text-gray-600 mt-2">
                  ${task.assigned_to_name || '미배정'}
                </p>
              </div>
              ${index < logisticsTasks.length - 1 ? `
                <div class="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <i class="fas fa-arrow-right text-gray-400 text-2xl"></i>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Legend -->
      <div class="mt-12 pt-8 border-t">
        <h4 class="font-bold text-gray-800 mb-4">상태 범례</h4>
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center">
            <span class="text-2xl mr-2">⏳</span>
            <span class="text-sm text-gray-600">대기중</span>
          </div>
          <div class="flex items-center">
            <span class="text-2xl mr-2">🔄</span>
            <span class="text-sm text-gray-600">진행중</span>
          </div>
          <div class="flex items-center">
            <span class="text-2xl mr-2">✅</span>
            <span class="text-sm text-gray-600">완료</span>
          </div>
        </div>
      </div>
    </div>
  `
}

async function loadSettingsView() {
  document.getElementById('viewTitle').textContent = '설정'
  await loadUsers()
  
  const content = document.getElementById('mainContent')
  
  content.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Management -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800">
            <i class="fas fa-users mr-2"></i>사용자 관리
          </h3>
          <button onclick="showCreateUserModal()"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <i class="fas fa-user-plus mr-2"></i>추가
          </button>
        </div>
        
        <div class="space-y-3 max-h-96 overflow-y-auto">
          ${state.users.map(user => `
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    ${user.name.charAt(0)}
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">${user.name}</p>
                    <p class="text-sm text-gray-600">${user.email}</p>
                  </div>
                </div>
                ${renderRoleBadge(user.role)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- System Info -->
      <div class="card p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-6">
          <i class="fas fa-info-circle mr-2"></i>시스템 정보
        </h3>
        
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700 font-medium mb-1">버전</p>
            <p class="text-lg font-bold text-blue-600">1.0.0</p>
          </div>
          
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-700 font-medium mb-1">총 작업 수</p>
            <p class="text-lg font-bold text-green-600">${state.tasks.length}</p>
          </div>
          
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-700 font-medium mb-1">총 사용자 수</p>
            <p class="text-lg font-bold text-purple-600">${state.users.length}</p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-700 font-medium mb-1">실시간 업데이트</p>
            <p class="text-sm text-gray-600">5초마다 자동 새로고침</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function showCreateUserModal() {
  showModal(`
    <h2 class="text-2xl font-bold text-gray-800 mb-6">새 사용자 추가</h2>
    <form id="createUserForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
        <input type="text" name="name" required class="form-input w-full">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
        <input type="email" name="email" required class="form-input w-full">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
        <input type="password" name="password" required class="form-input w-full">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">역할 *</label>
        <select name="role" required class="form-input w-full">
          <option value="production">생산팀</option>
          <option value="logistics">물류팀</option>
          <option value="admin">관리자</option>
        </select>
      </div>
      
      <div class="flex justify-end space-x-3 pt-4">
        <button type="button" onclick="closeModal()"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          취소
        </button>
        <button type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          <i class="fas fa-user-plus mr-2"></i>추가
        </button>
      </div>
    </form>
  `)
  
  document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    try {
      await api.post('/users', data)
      showNotification('사용자가 추가되었습니다', 'success')
      closeModal()
      loadUsers()
      loadSettingsView()
    } catch (error) {
      showNotification('사용자 추가 실패: ' + (error.response?.data?.error || '서버 오류'), 'error')
    }
  })
}

// ======================
// Notifications
// ======================

function toggleNotifications() {
  const panel = document.getElementById('notificationsPanel')
  panel.classList.toggle('hidden')
  
  if (!panel.classList.contains('hidden')) {
    renderNotifications()
  }
}

function renderNotifications() {
  const list = document.getElementById('notificationsList')
  
  list.innerHTML = `
    <div class="p-4">
      ${state.notifications.length > 0 ? `
        <button onclick="markAllAsRead()"
          class="text-sm text-blue-600 hover:text-blue-700 mb-4">
          <i class="fas fa-check-double mr-1"></i>모두 읽음으로 표시
        </button>
        <div class="space-y-2">
          ${state.notifications.map(notif => `
            <div class="p-3 rounded-lg cursor-pointer transition ${
              notif.is_read ? 'bg-gray-50' : 'bg-blue-50'
            }" onclick="markAsRead(${notif.id}, ${notif.task_id})">
              <div class="flex items-start justify-between mb-1">
                <span class="text-sm font-medium text-gray-800">
                  ${getNotificationIcon(notif.type)} ${notif.message}
                </span>
                ${!notif.is_read ? '<span class="w-2 h-2 bg-blue-600 rounded-full"></span>' : ''}
              </div>
              <span class="text-xs text-gray-500">${formatDateTime(notif.created_at)}</span>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="text-center py-12">
          <i class="fas fa-bell-slash text-5xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">알림이 없습니다</p>
        </div>
      `}
    </div>
  `
}

function updateNotificationBadge() {
  const unreadCount = state.notifications.filter(n => !n.is_read).length
  // Update badge in main layout
  const badge = document.querySelector('.notification-badge')
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount
      badge.style.display = 'flex'
    } else {
      badge.style.display = 'none'
    }
  }
}

async function markAsRead(notificationId, taskId) {
  try {
    await api.put(`/notifications/${notificationId}/read`)
    await loadNotifications()
    renderNotifications()
    
    if (taskId) {
      toggleNotifications()
      viewTaskDetail(taskId)
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

async function markAllAsRead() {
  try {
    await api.put('/notifications/read-all')
    await loadNotifications()
    renderNotifications()
    showNotification('모든 알림을 읽음으로 표시했습니다', 'success')
  } catch (error) {
    showNotification('알림 업데이트 실패', 'error')
  }
}

// ======================
// UI Helpers
// ======================

function showModal(content) {
  const modal = document.createElement('div')
  modal.id = 'modal'
  modal.className = 'modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4'
  modal.innerHTML = `
    <div class="modal-content card p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
      ${content}
    </div>
  `
  
  document.body.appendChild(modal)
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })
}

function closeModal() {
  const modal = document.getElementById('modal')
  if (modal) modal.remove()
}

function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }
  
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.opacity = '0'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

function renderStatusBadge(status) {
  const labels = {
    pending: '대기중',
    in_progress: '진행중',
    completed: '완료'
  }
  return `<span class="badge-${status} px-3 py-1 rounded-full text-xs font-medium">${labels[status]}</span>`
}

function renderTeamBadge(team) {
  const labels = {
    production: '생산팀',
    logistics: '물류팀'
  }
  return `<span class="badge-${team} px-3 py-1 rounded-full text-xs font-medium">${labels[team]}</span>`
}

function renderRoleBadge(role) {
  const labels = {
    admin: '관리자',
    production: '생산팀',
    logistics: '물류팀'
  }
  const colors = {
    admin: 'bg-purple-100 text-purple-800',
    production: 'bg-blue-100 text-blue-800',
    logistics: 'bg-green-100 text-green-800'
  }
  return `<span class="${colors[role]} px-3 py-1 rounded-full text-xs font-medium">${labels[role]}</span>`
}

function getStatusIcon(status) {
  const icons = {
    pending: '<span class="text-3xl">⏳</span>',
    in_progress: '<span class="text-3xl">🔄</span>',
    completed: '<span class="text-3xl">✅</span>'
  }
  return icons[status]
}

function getNotificationIcon(type) {
  const icons = {
    task_update: '<i class="fas fa-info-circle text-blue-600"></i>',
    deadline_warning: '<i class="fas fa-exclamation-triangle text-yellow-600"></i>',
    assignment: '<i class="fas fa-user-check text-green-600"></i>'
  }
  return icons[type] || '<i class="fas fa-bell"></i>'
}

function getRoleLabel(role) {
  const labels = {
    admin: '관리자',
    production: '생산팀',
    logistics: '물류팀'
  }
  return labels[role] || role
}

function getTeamLabel(team) {
  const labels = {
    production: '생산팀',
    logistics: '물류팀'
  }
  return labels[team] || team
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// ======================
// File Upload Functions
// ======================

/**
 * Download Excel template for bulk task upload
 */
function downloadExcelTemplate() {
  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Sample data with instructions
  const data = [
    ['작업명', '설명', '팀', '담당자', '예상완료일', '우선순위', '상태'],
    ['제품 A 제조', '제품 A의 제조 공정', 'production', 'John Park', '2025-11-20', '8', 'pending'],
    ['원자재 검수', '입고된 원자재 품질 검사', 'logistics', 'Sarah Kim', '2025-11-15', '9', 'pending'],
    ['포장 작업', '완제품 포장 및 라벨링', 'production', '미배정', '2025-11-25', '5', 'pending']
  ]
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data)
  
  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // 작업명
    { wch: 30 }, // 설명
    { wch: 12 }, // 팀
    { wch: 15 }, // 담당자
    { wch: 12 }, // 예상완료일
    { wch: 10 }, // 우선순위
    { wch: 12 }  // 상태
  ]
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, '작업 목록')
  
  // Create instructions sheet
  const instructions = [
    ['📋 작업 일괄 업로드 템플릿 - 사용 방법'],
    [''],
    ['1. 필수 항목'],
    ['   - 작업명: 작업의 이름 (필수)'],
    ['   - 팀: production (생산팀) 또는 logistics (물류팀) (필수)'],
    ['   - 예상완료일: YYYY-MM-DD 형식 (예: 2025-11-20) (필수)'],
    [''],
    ['2. 선택 항목'],
    ['   - 설명: 작업에 대한 상세 설명'],
    ['   - 담당자: 사용자 이름 또는 이메일 (시스템에 등록된 사용자)'],
    ['   - 우선순위: 1~10 사이의 숫자 (기본값: 5)'],
    ['   - 상태: pending (대기중), in_progress (진행중), completed (완료)'],
    [''],
    ['3. 업로드 방법'],
    ['   - "작업 목록" 시트에 데이터 입력'],
    ['   - 파일 저장 (.xlsx, .xls, .csv 형식)'],
    ['   - 시스템에서 "파일 업로드" 버튼 클릭'],
    ['   - 파일 선택 후 업로드'],
    [''],
    ['4. 주의사항'],
    ['   - 첫 번째 행(헤더)은 수정하지 마세요'],
    ['   - 팀 이름은 정확히 입력하세요 (production/logistics)'],
    ['   - 날짜 형식을 정확히 지켜주세요 (YYYY-MM-DD)'],
    ['   - 담당자 이름은 시스템에 등록된 사용자여야 합니다'],
    [''],
    ['5. 업데이트 모드'],
    ['   - 기존 작업을 수정하려면 첫 번째 열에 "작업ID" 추가'],
    ['   - 작업ID가 있으면 해당 작업이 업데이트됩니다'],
    ['   - 작업ID가 없으면 새로운 작업이 생성됩니다']
  ]
  
  const wsInstructions = XLSX.utils.aoa_to_sheet(instructions)
  wsInstructions['!cols'] = [{ wch: 80 }]
  XLSX.utils.book_append_sheet(wb, wsInstructions, '사용 방법')
  
  // Download file
  const today = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `작업목록_템플릿_${today}.xlsx`)
  
  showNotification('템플릿이 다운로드되었습니다', 'success')
}

/**
 * Show file upload modal
 */
function showFileUploadModal() {
  showModal(`
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      <i class="fas fa-file-upload mr-2"></i>파일 업로드
    </h2>
    
    <div class="mb-6">
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <i class="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 mb-4">엑셀 파일을 선택하거나 드래그하세요</p>
        <input type="file" id="fileInput" accept=".xlsx,.xls,.csv" class="hidden">
        <button onclick="document.getElementById('fileInput').click()"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          <i class="fas fa-folder-open mr-2"></i>파일 선택
        </button>
      </div>
    </div>
    
    <div class="mb-6">
      <label class="flex items-center space-x-2">
        <input type="radio" name="uploadMode" value="create" checked class="form-radio">
        <span>새 작업 생성</span>
      </label>
      <label class="flex items-center space-x-2 mt-2">
        <input type="radio" name="uploadMode" value="update" class="form-radio">
        <span>기존 작업 업데이트 (파일에 작업ID 필요)</span>
      </label>
    </div>
    
    <div id="previewSection" class="hidden mb-6">
      <h3 class="font-bold text-gray-800 mb-3">
        <i class="fas fa-eye mr-2"></i>미리보기
      </h3>
      <div id="previewContent" class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto"></div>
    </div>
    
    <div id="uploadResults" class="hidden mb-6">
      <h3 class="font-bold text-gray-800 mb-3">
        <i class="fas fa-check-circle mr-2"></i>업로드 결과
      </h3>
      <div id="resultsContent" class="bg-gray-50 rounded-lg p-4"></div>
    </div>
    
    <div class="flex justify-between">
      <button onclick="closeModal()"
        class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">
        취소
      </button>
      <button id="uploadButton" onclick="processBulkUpload()" disabled
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fas fa-upload mr-2"></i>업로드
      </button>
    </div>
  `)
  
  // Attach file input handler
  document.getElementById('fileInput').addEventListener('change', handleFileSelect)
}

let uploadedTasks = []

/**
 * Handle file selection
 */
async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    showNotification('파일을 읽는 중...', 'info')
    
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        if (jsonData.length < 2) {
          showNotification('파일에 데이터가 없습니다', 'error')
          return
        }
        
        // Parse tasks
        const headers = jsonData[0]
        uploadedTasks = []
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (!row || row.length === 0) continue
          
          const task = {}
          headers.forEach((header, index) => {
            const value = row[index]
            
            // Map Korean headers to English keys
            switch (header) {
              case '작업ID':
              case 'ID':
                task.id = value
                break
              case '작업명':
              case 'name':
                task.name = value
                break
              case '설명':
              case 'description':
                task.description = value
                break
              case '팀':
              case 'team':
                task.team = value
                break
              case '담당자':
              case 'assigned_to':
                task.assigned_to = value
                break
              case '예상완료일':
              case 'expected_completion':
                // Convert Excel date to YYYY-MM-DD
                if (typeof value === 'number') {
                  const date = XLSX.SSF.parse_date_code(value)
                  task.expected_completion = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
                } else {
                  task.expected_completion = value
                }
                break
              case '우선순위':
              case 'priority':
                task.priority = value
                break
              case '상태':
              case 'status':
                // Map Korean status to English
                if (value === '대기중') task.status = 'pending'
                else if (value === '진행중') task.status = 'in_progress'
                else if (value === '완료') task.status = 'completed'
                else task.status = value
                break
            }
          })
          
          if (task.name) {
            uploadedTasks.push(task)
          }
        }
        
        if (uploadedTasks.length === 0) {
          showNotification('유효한 작업 데이터가 없습니다', 'error')
          return
        }
        
        // Show preview
        showFilePreview(uploadedTasks)
        document.getElementById('uploadButton').disabled = false
        showNotification(`${uploadedTasks.length}개 작업을 확인했습니다`, 'success')
      } catch (error) {
        console.error('File parsing error:', error)
        showNotification('파일 파싱 중 오류가 발생했습니다: ' + error.message, 'error')
      }
    }
    
    reader.readAsArrayBuffer(file)
  } catch (error) {
    console.error('File read error:', error)
    showNotification('파일을 읽을 수 없습니다', 'error')
  }
}

/**
 * Show file preview
 */
function showFilePreview(tasks) {
  const previewSection = document.getElementById('previewSection')
  const previewContent = document.getElementById('previewContent')
  
  previewSection.classList.remove('hidden')
  
  previewContent.innerHTML = `
    <div class="text-sm">
      <p class="font-medium mb-3">총 ${tasks.length}개 작업</p>
      <div class="space-y-2">
        ${tasks.slice(0, 5).map(task => `
          <div class="p-2 bg-white rounded border">
            <div class="font-medium">${task.name}</div>
            <div class="text-xs text-gray-600 mt-1">
              ${task.team === 'production' ? '생산팀' : task.team === 'logistics' ? '물류팀' : task.team} | 
              ${task.expected_completion} | 
              우선순위 ${task.priority || 5}
            </div>
          </div>
        `).join('')}
        ${tasks.length > 5 ? `<p class="text-gray-500 text-center pt-2">... 외 ${tasks.length - 5}개</p>` : ''}
      </div>
    </div>
  `
}

/**
 * Process bulk upload
 */
async function processBulkUpload() {
  if (uploadedTasks.length === 0) {
    showNotification('업로드할 데이터가 없습니다', 'error')
    return
  }
  
  const uploadMode = document.querySelector('input[name="uploadMode"]:checked').value
  const uploadButton = document.getElementById('uploadButton')
  
  try {
    uploadButton.disabled = true
    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>업로드 중...'
    
    const endpoint = uploadMode === 'create' ? '/tasks/bulk' : '/tasks/bulk'
    const method = uploadMode === 'create' ? 'post' : 'put'
    
    const response = await api[method](endpoint, { tasks: uploadedTasks })
    const { results } = response.data
    
    // Show results
    showUploadResults(results)
    
    // Reload tasks
    await loadTasks()
    
    showNotification(
      `업로드 완료: ${results.success.length}개 성공, ${results.failed.length}개 실패`,
      results.failed.length === 0 ? 'success' : 'warning'
    )
    
    uploadButton.innerHTML = '<i class="fas fa-check mr-2"></i>완료'
    
  } catch (error) {
    console.error('Bulk upload error:', error)
    showNotification('업로드 중 오류가 발생했습니다', 'error')
    uploadButton.disabled = false
    uploadButton.innerHTML = '<i class="fas fa-upload mr-2"></i>업로드'
  }
}

/**
 * Show upload results
 */
function showUploadResults(results) {
  const resultsSection = document.getElementById('uploadResults')
  const resultsContent = document.getElementById('resultsContent')
  
  resultsSection.classList.remove('hidden')
  
  resultsContent.innerHTML = `
    <div class="space-y-4">
      <!-- Success -->
      ${results.success.length > 0 ? `
        <div>
          <h4 class="font-medium text-green-600 mb-2">
            <i class="fas fa-check-circle mr-2"></i>성공 (${results.success.length}개)
          </h4>
          <div class="space-y-1 text-sm">
            ${results.success.slice(0, 10).map(item => `
              <div class="text-gray-600">
                행 ${item.row}: ${item.task} (ID: ${item.id})
              </div>
            `).join('')}
            ${results.success.length > 10 ? `<div class="text-gray-500">... 외 ${results.success.length - 10}개</div>` : ''}
          </div>
        </div>
      ` : ''}
      
      <!-- Failed -->
      ${results.failed.length > 0 ? `
        <div>
          <h4 class="font-medium text-red-600 mb-2">
            <i class="fas fa-exclamation-circle mr-2"></i>실패 (${results.failed.length}개)
          </h4>
          <div class="space-y-1 text-sm">
            ${results.failed.map(item => `
              <div class="text-red-600">
                행 ${item.row}: ${item.task} - ${item.error}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `
}

// ======================
// Event Handlers
// ======================

function attachLoginHandlers() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    await login(email, password)
  })
}

function attachMainHandlers() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      const view = e.currentTarget.dataset.view
      
      // Update active state
      document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('bg-blue-50', 'text-blue-600')
      })
      e.currentTarget.classList.add('bg-blue-50', 'text-blue-600')
      
      showView(view)
    })
  })
  
  // Set initial active nav
  document.querySelector(`[data-view="${state.currentView}"]`)?.classList.add('bg-blue-50', 'text-blue-600')
}

// ======================
// Initialize
// ======================

async function init() {
  const isAuthenticated = await checkAuth()
  
  if (isAuthenticated) {
    await loadNotifications()
    showView('dashboard')
  } else {
    showView('login')
  }
}

// Start the application
init()
