/**
 * Slack Command Parser
 * 슬랙 명령어를 파싱하여 작업 데이터로 변환
 */

export interface SlackCommand {
  command: string
  text: string
  user_name: string
  user_id: string
  channel_name: string
}

export interface ParsedTask {
  action: 'create' | 'update' | 'complete' | 'comment' | 'status'
  team?: 'production' | 'logistics'
  name?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
  taskId?: number
  assignedTo?: string
  expectedCompletion?: string
  priority?: number
  comment?: string
}

/**
 * 슬랙 명령어 파싱
 * 
 * 지원 명령어:
 * /task create [팀] [작업명] [마감일] [@담당자] [우선순위:숫자]
 * /task complete [작업ID]
 * /task status [작업ID] [상태]
 * /task comment [작업ID] [댓글내용]
 */
export function parseSlackCommand(cmd: SlackCommand): ParsedTask | null {
  const text = cmd.text.trim()
  const parts = text.split(' ')

  if (parts.length === 0) {
    return null
  }

  const action = parts[0].toLowerCase()

  switch (action) {
    case 'create':
    case '생성':
      return parseCreateCommand(parts.slice(1))
    
    case 'complete':
    case '완료':
      return parseCompleteCommand(parts.slice(1))
    
    case 'status':
    case '상태':
      return parseStatusCommand(parts.slice(1))
    
    case 'comment':
    case '댓글':
      return parseCommentCommand(parts.slice(1))
    
    default:
      return null
  }
}

/**
 * 작업 생성 명령어 파싱
 * 형식: create [팀] [작업명] [마감일] [@담당자] [우선순위:숫자]
 * 예시: create 생산팀 제품A제조 2025-11-20 @john 우선순위:8
 */
function parseCreateCommand(parts: string[]): ParsedTask | null {
  if (parts.length < 3) {
    return null
  }

  const result: ParsedTask = {
    action: 'create',
    priority: 5
  }

  // 팀 파싱
  const teamText = parts[0].toLowerCase()
  if (teamText.includes('생산') || teamText === 'production') {
    result.team = 'production'
  } else if (teamText.includes('물류') || teamText === 'logistics') {
    result.team = 'logistics'
  } else {
    return null
  }

  // 작업명 파싱 (마감일이나 @ 전까지)
  let nameEndIndex = 1
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].match(/^\d{4}-\d{2}-\d{2}$/) || parts[i].startsWith('@')) {
      nameEndIndex = i
      break
    }
    if (i === parts.length - 1) {
      nameEndIndex = parts.length
    }
  }
  result.name = parts.slice(1, nameEndIndex).join(' ')

  // 나머지 파라미터 파싱
  for (let i = nameEndIndex; i < parts.length; i++) {
    const part = parts[i]

    // 마감일 파싱 (YYYY-MM-DD)
    if (part.match(/^\d{4}-\d{2}-\d{2}$/)) {
      result.expectedCompletion = part
    }
    // 담당자 파싱 (@username)
    else if (part.startsWith('@')) {
      result.assignedTo = part.substring(1)
    }
    // 우선순위 파싱 (우선순위:8 or priority:8)
    else if (part.includes(':')) {
      const [key, value] = part.split(':')
      if (key === '우선순위' || key === 'priority') {
        const priority = parseInt(value)
        if (priority >= 1 && priority <= 10) {
          result.priority = priority
        }
      }
    }
  }

  // 필수 필드 체크
  if (!result.name || !result.expectedCompletion) {
    return null
  }

  return result
}

/**
 * 작업 완료 명령어 파싱
 * 형식: complete [작업ID]
 * 예시: complete 5
 */
function parseCompleteCommand(parts: string[]): ParsedTask | null {
  if (parts.length === 0) {
    return null
  }

  const taskId = parseInt(parts[0])
  if (isNaN(taskId)) {
    return null
  }

  return {
    action: 'complete',
    taskId,
    status: 'completed'
  }
}

/**
 * 작업 상태 변경 명령어 파싱
 * 형식: status [작업ID] [상태]
 * 예시: status 3 진행중
 */
function parseStatusCommand(parts: string[]): ParsedTask | null {
  if (parts.length < 2) {
    return null
  }

  const taskId = parseInt(parts[0])
  if (isNaN(taskId)) {
    return null
  }

  const statusText = parts[1].toLowerCase()
  let status: 'pending' | 'in_progress' | 'completed' | undefined

  if (statusText.includes('대기') || statusText === 'pending') {
    status = 'pending'
  } else if (statusText.includes('진행') || statusText === 'in_progress') {
    status = 'in_progress'
  } else if (statusText.includes('완료') || statusText === 'completed') {
    status = 'completed'
  }

  if (!status) {
    return null
  }

  return {
    action: 'status',
    taskId,
    status
  }
}

/**
 * 댓글 추가 명령어 파싱
 * 형식: comment [작업ID] [댓글내용]
 * 예시: comment 2 품질 검사 완료했습니다
 */
function parseCommentCommand(parts: string[]): ParsedTask | null {
  if (parts.length < 2) {
    return null
  }

  const taskId = parseInt(parts[0])
  if (isNaN(taskId)) {
    return null
  }

  const comment = parts.slice(1).join(' ')

  return {
    action: 'comment',
    taskId,
    comment
  }
}

/**
 * Slack 응답 메시지 생성
 */
export function createSlackResponse(success: boolean, message: string, data?: any): any {
  return {
    response_type: 'in_channel', // 채널에 공개
    text: success ? `✅ ${message}` : `❌ ${message}`,
    attachments: data ? [{
      color: success ? 'good' : 'danger',
      fields: Object.entries(data).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      }))
    }] : []
  }
}
