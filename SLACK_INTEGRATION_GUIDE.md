# 🚀 Slack 통합 가이드

## 📋 개요

슬랙에서 `/task` 명령어만으로 생산-물류 작업을 관리할 수 있습니다!

```
/task create 생산팀 제품A제조 2025-11-20 @john 우선순위:8
→ ✅ 작업이 생성되었습니다!
```

---

## 🎯 사용 가능한 명령어

### 1. 작업 생성 📝

```
/task create [팀] [작업명] [마감일] [@담당자] [우선순위:숫자]
```

**예시:**
```
/task create 생산팀 원자재구매 2025-11-15
/task create 생산팀 제품A제조 2025-11-20 @john
/task create 물류팀 배송준비 2025-11-18 @mike 우선순위:10
/task create 생산팀 품질검사 완료 2025-11-16 @sarah 우선순위:9
```

**파라미터:**
- `팀`: `생산팀` 또는 `물류팀` (필수)
- `작업명`: 작업 이름 (필수)
- `마감일`: YYYY-MM-DD 형식 (필수)
- `@담당자`: 담당자 이름 (선택)
- `우선순위:숫자`: 1-10 사이의 숫자 (선택, 기본값: 5)

---

### 2. 작업 완료 ✅

```
/task complete [작업ID]
```

**예시:**
```
/task complete 5
/task complete 12
```

---

### 3. 작업 상태 변경 🔄

```
/task status [작업ID] [상태]
```

**상태 옵션:**
- `대기중` / `pending`
- `진행중` / `in_progress`
- `완료` / `completed`

**예시:**
```
/task status 3 진행중
/task status 7 완료
/task status 2 대기중
```

---

### 4. 댓글 추가 💬

```
/task comment [작업ID] [댓글내용]
```

**예시:**
```
/task comment 2 품질 검사 완료했습니다
/task comment 5 원자재 배송이 지연되고 있습니다
/task comment 8 내일 오전에 완료 예정입니다
```

---

## 🔧 Slack 앱 설정 방법

### Step 1: Slack 앱 만들기

1. **Slack API 페이지 접속**
   - https://api.slack.com/apps

2. **"Create New App" 클릭**

3. **"From scratch" 선택**

4. **앱 정보 입력:**
   - App Name: `생산물류관리` 또는 `Task Manager`
   - Workspace: 본인의 워크스페이스 선택
   - **"Create App"** 클릭

---

### Step 2: 슬래시 명령어 추가

1. **왼쪽 메뉴에서 "Slash Commands" 클릭**

2. **"Create New Command" 클릭**

3. **명령어 정보 입력:**
   ```
   Command: /task
   Request URL: https://your-app.pages.dev/api/slack/command
   Short Description: 생산-물류 작업 관리
   Usage Hint: create 생산팀 작업명 2025-11-20
   ```

   ⚠️ **중요:** `Request URL`을 본인의 배포된 URL로 변경하세요!
   - 로컬: `http://localhost:3000/api/slack/command`
   - Cloudflare: `https://webapp.pages.dev/api/slack/command`
   - 개발 서버: `https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai/api/slack/command`

4. **"Save" 클릭**

---

### Step 3: 워크스페이스에 앱 설치

1. **왼쪽 메뉴에서 "Install App" 클릭**

2. **"Install to Workspace" 클릭**

3. **권한 승인:**
   - `commands` - 슬래시 명령어 사용
   - 필요한 권한 모두 승인

4. **"Allow" 클릭**

---

### Step 4: 테스트하기

1. **Slack 워크스페이스 열기**

2. **아무 채널에서 명령어 입력:**
   ```
   /task create 생산팀 테스트작업 2025-11-20
   ```

3. **응답 확인:**
   ```
   ✅ 작업이 생성되었습니다!
   작업 ID: 11
   작업명: 테스트작업
   팀: 생산팀
   마감일: 2025-11-20
   우선순위: 5
   ```

4. **웹사이트에서 확인:**
   - 브라우저에서 웹사이트 접속
   - 로그인
   - 작업 목록에서 새 작업 확인!

---

## 🎨 고급 설정 (선택)

### 1. Interactive Components 설정

더 풍부한 UI를 원하시면:

1. **"Interactivity & Shortcuts" 클릭**
2. **Interactivity 활성화**
3. **Request URL 입력:** `https://your-app.pages.dev/api/slack/interactive`
4. **"Save Changes"**

### 2. Bot User 추가

알림을 보내고 싶으시면:

1. **"OAuth & Permissions" 클릭**
2. **Scopes 추가:**
   - `chat:write` - 메시지 전송
   - `users:read` - 사용자 정보 읽기
3. **앱 재설치**

---

## 🔐 보안 설정

### Slack 서명 검증 (권장)

프로덕션에서는 Slack 서명을 검증하세요:

1. **"Basic Information" 페이지**
2. **"Signing Secret" 복사**
3. **환경 변수로 설정:**
   ```bash
   npx wrangler pages secret put SLACK_SIGNING_SECRET --project-name webapp
   ```

---

## 💡 사용 팁

### 팁 1: 빠른 작업 생성
```
/task create 생산팀 긴급_품질검사 2025-11-07 우선순위:10
```
간단하게 작업명만 언더스코어로 연결!

### 팁 2: 담당자 자동 매핑
Slack 유저네임이 시스템 사용자명과 일치하면 자동 매핑됩니다:
```
/task create 생산팀 작업 2025-11-20 @john
→ DB의 "John Smith" 또는 "john@company.com"에 자동 배정
```

### 팁 3: 한글/영어 혼용 가능
```
/task create production 작업명 2025-11-20
/task status 5 in_progress
```
팀명과 상태는 한글/영어 모두 지원!

### 팁 4: 채널에서 공유
명령어를 실행하면 채널에 공개되어 팀 전체가 볼 수 있습니다!

---

## 🐛 문제 해결

### 1. "dispatch_failed" 오류
**원인:** Request URL이 잘못되었거나 서버가 응답하지 않음

**해결:**
- Request URL 확인
- 서버가 실행 중인지 확인
- 방화벽/CORS 설정 확인

### 2. "작업이 생성되지 않음"
**원인:** 명령어 형식이 잘못됨

**해결:**
```
올바른 형식:
/task create 생산팀 작업명 2025-11-20

잘못된 형식:
/task 생산팀 작업명 2025-11-20  ❌ (create 누락)
/task create 작업명 2025-11-20   ❌ (팀 누락)
```

### 3. "담당자가 배정되지 않음"
**원인:** 담당자 이름이 DB와 일치하지 않음

**해결:**
- 정확한 사용자명 사용
- 또는 웹사이트에서 수동으로 배정

### 4. "Internal server error"
**원인:** 데이터베이스 연결 오류

**해결:**
- 서버 로그 확인
- D1 데이터베이스 연결 상태 확인

---

## 📊 명령어 참고표

| 명령어 | 기능 | 예시 |
|--------|------|------|
| `create` | 작업 생성 | `/task create 생산팀 작업 2025-11-20` |
| `complete` | 작업 완료 | `/task complete 5` |
| `status` | 상태 변경 | `/task status 3 진행중` |
| `comment` | 댓글 추가 | `/task comment 2 완료했습니다` |

---

## 🎓 다음 단계

### 1. 알림 기능 추가
작업이 배정되면 Slack DM으로 알림 받기

### 2. 작업 조회 기능
```
/task list
/task show 5
```

### 3. 대시보드 요약
```
/task summary
```

### 4. 파일 첨부
Slack 파일을 작업에 첨부

---

## 🆘 도움말

### Slack에서 도움말 보기
```
/task help
```

### API 도움말 확인
```
GET /api/slack/help
```

### 문의
- GitHub Issues
- Slack 워크스페이스 #support 채널

---

## ✅ 체크리스트

설치 전:
- [ ] Slack 워크스페이스 관리자 권한 확인
- [ ] 배포된 웹사이트 URL 준비
- [ ] Slack API 계정 생성

설치 후:
- [ ] 슬래시 명령어 테스트
- [ ] 웹사이트에서 작업 확인
- [ ] 팀원에게 사용법 공유

---

## 🎉 완료!

이제 Slack에서 `/task` 명령어로 작업을 쉽게 관리할 수 있습니다!

**팀원들에게 공유하세요:**
```
🎉 이제 Slack에서 작업 관리가 가능합니다!

명령어:
• /task create 생산팀 작업명 2025-11-20
• /task complete 작업ID
• /task status 작업ID 진행중
• /task comment 작업ID 댓글

자세한 내용: SLACK_INTEGRATION_GUIDE.md
```

**Happy Slacking!** 🚀
