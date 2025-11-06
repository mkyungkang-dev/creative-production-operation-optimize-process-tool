# 🎯 Slack 앱 설정 단계별 가이드

## 🚨 중요 공지

**"봇 사용자가 없습니다" 오류를 방지하려면:**
- ✅ **반드시 Step 4 (봇 사용자 추가)를 먼저 완료하세요!**
- ✅ OAuth & Permissions에서 `commands` scope 추가 필수
- ✅ 봇 권한 없이 설치하면 오류가 발생합니다

---

## ⚡ 빠른 가이드 (5분 완료)

**이미 오류가 발생했나요?** → [트러블슈팅 섹션](#문제-해결)으로 바로 이동

**처음 설정하시나요?** 다음 순서대로 진행하세요:
1. Slack API에서 앱 생성 (Step 1-3)
2. **⭐ 봇 사용자 추가 (Step 4) - 필수!**
3. 슬래시 명령어 추가 (Step 5)
4. 앱 설치 (Step 7)
5. 테스트 (Step 8)

---

## 📋 준비물

- ✅ Slack 워크스페이스 (없으면 무료로 생성: https://slack.com)
- ✅ 워크스페이스 관리자 권한 (또는 앱 설치 권한)
- ✅ 개발 서버 URL (아래 참조)

**현재 사용 가능한 URL:**
```
https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai/api/slack/command
```

---

## 🚀 Step 1: Slack API 페이지 접속

### 1-1. 브라우저에서 접속
```
https://api.slack.com/apps
```

### 1-2. Slack 계정 로그인
- 이미 로그인되어 있다면 자동으로 넘어갑니다
- 로그인 안 되어 있다면 Slack 계정으로 로그인

### 1-3. "Create New App" 버튼 클릭
- 우측 상단 또는 중앙에 초록색 버튼이 있습니다

---

## 📱 Step 2: 앱 생성 방법 선택

### 2-1. "From scratch" 선택
두 가지 옵션이 나옵니다:
- **"From scratch"** ← 이걸 선택하세요! ✅
- "From an app manifest" (고급 사용자용)

### 2-2. 클릭!
"From scratch" 카드를 클릭하세요

---

## 🏷️ Step 3: 앱 정보 입력

### 3-1. App Name 입력
```
생산물류관리
```
또는 영어로:
```
Production Logistics Manager
```
또는 원하는 이름:
```
Task Bot
Work Manager
팀작업관리
```

### 3-2. Workspace 선택
드롭다운에서 본인의 워크스페이스를 선택하세요
- 예: "MK의 워크스페이스"
- 예: "회사명 Workspace"

### 3-3. "Create App" 버튼 클릭
초록색 버튼을 클릭!

---

## 🤖 Step 4: 봇 사용자 추가 (필수!)

### 4-1. 왼쪽 메뉴에서 "OAuth & Permissions" 클릭
- 왼쪽 사이드바에 "Features" 섹션이 있습니다
- 그 아래 "OAuth & Permissions" 클릭

### 4-2. "Scopes" 섹션으로 스크롤
페이지를 아래로 내리면 "Scopes" 섹션이 있습니다

### 4-3. "Bot Token Scopes" 찾기
두 가지 섹션이 있습니다:
- User Token Scopes (건너뜁니다)
- **Bot Token Scopes** ← 여기에 추가!

### 4-4. "Add an OAuth Scope" 버튼 클릭
"Bot Token Scopes" 섹션의 버튼을 클릭하세요

### 4-5. 다음 권한들을 하나씩 추가

**추가할 권한 (Scopes):**

1️⃣ **commands**
```
commands
```
- 설명: Add shortcuts and/or slash commands that people can use
- 필수! 슬래시 커맨드를 사용하려면 꼭 필요합니다

2️⃣ **chat:write** (선택사항이지만 권장)
```
chat:write
```
- 설명: Send messages as the bot
- 나중에 봇이 메시지를 보낼 수 있게 합니다

각 권한을 추가할 때마다:
1. "Add an OAuth Scope" 버튼 클릭
2. 드롭다운에서 권한 이름 검색 (예: `commands`)
3. 해당 권한 클릭하여 추가

### 4-6. 완료 확인
"Bot Token Scopes" 섹션에 다음과 같이 표시되어야 합니다:
- ✅ commands
- ✅ chat:write (추가했다면)

---

## ⚙️ Step 5: 슬래시 명령어 추가

### 5-1. 왼쪽 메뉴에서 "Slash Commands" 클릭
- 왼쪽 사이드바에 "Features" 섹션이 있습니다
- 그 아래 "Slash Commands" 클릭

### 5-2. "Create New Command" 버튼 클릭
우측 상단의 버튼을 클릭하세요

### 5-3. 명령어 정보 입력

**Command (명령어):**
```
/task
```
⚠️ 슬래시(/)는 자동으로 들어갑니다. `task`만 입력하세요!

**Request URL (요청 URL):**
```
https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai/api/slack/command
```

⚠️ **중요!** 위 URL을 정확히 복사해서 붙여넣으세요!

**Short Description (간단한 설명):**
```
생산-물류 작업 관리
```
또는:
```
작업 생성 및 관리
```

**Usage Hint (사용 힌트):**
```
create 생산팀 작업명 2025-11-20
```

### 5-4. "Save" 버튼 클릭
모든 정보를 입력했으면 아래 "Save" 버튼 클릭!

---

## 🎨 Step 6: 앱 아이콘 설정 (선택사항)

### 6-1. "Basic Information" 클릭
왼쪽 메뉴의 "Settings" → "Basic Information"

### 6-2. "Display Information" 섹션
스크롤을 아래로 내리면 있습니다

### 6-3. 아이콘 업로드
- "App Icon & Preview" 섹션
- 512x512 PNG 이미지 업로드
- 또는 기본 아이콘 사용

**추천 이모지:**
- 📦 (상자)
- ✅ (체크)
- 🚀 (로켓)
- 📊 (차트)

### 6-4. "Save Changes" 클릭

---

## 🔧 Step 7: 워크스페이스에 앱 설치

⚠️ **중요!** Step 4에서 Bot Token Scopes를 추가하셨나요? 
- **추가 안 했다면** → Step 4로 돌아가세요!
- **추가 했다면** → 계속 진행하세요!

### 7-1. "Install App" 클릭
왼쪽 메뉴의 "Settings" → "Install App"

### 7-2. "Install to Workspace" 버튼 클릭
큰 초록색 버튼이 있습니다

### 7-3. 권한 승인 페이지
Slack이 새 창/탭을 열고 권한 요청 페이지가 나타납니다

다음 권한을 요청합니다:
- ✅ `commands` - Add shortcuts and/or slash commands
- ✅ `chat:write` - Send messages as @생산물류관리 (추가했다면)

### 7-4. "Allow" 버튼 클릭
초록색 "Allow" 버튼을 클릭하세요!

### 7-5. 설치 완료!
"Your app was installed to [워크스페이스명]" 메시지가 나타나면 성공입니다! 🎉

---

## 🎉 Step 8: 테스트하기!

### 8-1. Slack 워크스페이스 열기
- 브라우저: https://app.slack.com
- 또는 Slack 앱 실행

### 8-2. 아무 채널 선택
- #general
- #test
- 또는 본인의 DM (Direct Message to yourself)

### 8-3. 명령어 입력
메시지 입력창에 다음을 입력:
```
/task create 생산팀 테스트작업 2025-11-20
```

### 8-4. Enter 키 누르기!

### 8-5. 응답 확인
몇 초 후 다음과 같은 응답이 나타납니다:
```
✅ 작업이 생성되었습니다!

작업 ID: 11
작업명: 테스트작업
팀: 생산팀
마감일: 2025-11-20
우선순위: 5
```

---

## ✅ Step 9: 웹사이트에서 확인

### 9-1. 브라우저에서 웹사이트 열기
```
https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai
```

### 9-2. 로그인
- 이메일: `admin@company.com`
- 비밀번호: `password123`

### 9-3. "작업 관리" 메뉴 클릭
왼쪽 사이드바에서 "작업 관리" 클릭

### 9-4. 방금 만든 작업 확인!
"테스트작업"이라는 작업이 목록에 나타납니다! 🎉

---

## 👥 Step 10: 팀원 온보딩

### 10-1. Slack 채널에 공지하기
팀 채널(예: #general)에 다음 메시지를 공유하세요:

```
📢 새로운 작업 관리 봇이 추가되었습니다! 🎉

이제 Slack에서 직접 작업을 만들고 관리할 수 있습니다.

✅ 사용법:
/task create 생산팀 작업명 2025-11-20
/task complete [작업ID]
/task status [작업ID] 진행중
/task comment [작업ID] 댓글내용

📚 자세한 사용법:
https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool/blob/main/SLACK_INTEGRATION_GUIDE.md
```

### 10-2. 팀원들에게 테스트 요청
각자 테스트 작업을 만들어보도록 안내하세요!

---

## 🎓 Step 11: 추가 명령어 테스트

이제 다른 명령어들도 테스트해보세요:

### 작업 완료 처리
```
/task complete 11
```

### 작업 상태 변경
```
/task status 11 진행중
```

### 댓글 추가
```
/task comment 11 작업을 시작했습니다
```

---

## 🔍 문제 해결

### ❌ "dispatch_failed" 오류

**증상:**
```
We had some trouble connecting...
dispatch_failed
```

**원인:**
- Request URL이 잘못되었거나
- 서버가 응답하지 않음

**해결방법:**

1. **URL 재확인**
   ```
   올바른 URL:
   https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai/api/slack/command
   
   잘못된 예:
   http://localhost:3000/api/slack/command (로컬만 가능)
   https://example.com/slack (잘못된 도메인)
   ```

2. **서버 상태 확인**
   브라우저에서 직접 접속해보세요:
   ```
   https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai/api/slack/help
   ```
   
   JSON 응답이 나와야 정상입니다:
   ```json
   {
     "commands": [...]
   }
   ```

3. **Slash Commands 설정 다시 확인**
   - Slack API → Your App → Slash Commands
   - Request URL 재입력 및 Save

---

### ❌ "앱에 설치할 봇 사용자가 없습니다" 오류

**증상:**
```
생산물류관리 앱에 설치할 봇 사용자가 없습니다.
이 앱은 워크스페이스에 봇을 설치할 권한을 요청하지만 
현재는 봇으로 구성되어 있지 않습니다.
```

**원인:**
Bot Token Scopes를 추가하지 않고 설치하려고 했습니다.

**해결방법:**

1. **OAuth & Permissions 페이지로 이동**
   - Slack API → Your App → OAuth & Permissions

2. **"Bot Token Scopes" 섹션 찾기**
   - 페이지를 스크롤 다운

3. **"Add an OAuth Scope" 클릭**
   - `commands` 추가 (필수!)
   - `chat:write` 추가 (권장)

4. **앱 재설치**
   - Install App 페이지로 이동
   - "Reinstall to Workspace" 버튼 클릭
   - 권한 승인

5. **완료!**
   - 이제 봇이 정상적으로 설치됩니다 ✅

⚠️ **예방:** 항상 **Step 4 (봇 사용자 추가)**를 먼저 완료한 후 설치하세요!

---

### ❌ 명령어 형식 오류

**증상:**
```
❌ 올바른 명령어 형식이 아닙니다.
```

**원인:**
명령어 문법이 잘못됨

**해결방법:**

✅ **올바른 형식:**
```
/task create 생산팀 작업명 2025-11-20
/task complete 5
/task status 3 진행중
/task comment 2 댓글내용
```

❌ **잘못된 형식:**
```
/task 생산팀 작업명 2025-11-20          (create 누락)
/task create 작업명 2025-11-20           (팀 누락)
/task create 생산팀 작업명 11-20         (날짜 형식 오류)
/task create 영업팀 작업명 2025-11-20    (존재하지 않는 팀)
```

---

### ❌ 작업이 웹사이트에 안 보여요

**원인:**
- 데이터베이스 동기화 문제
- 새로고침 필요

**해결방법:**

1. **웹사이트 새로고침**
   - F5 또는 Ctrl+R (Windows)
   - Cmd+R (Mac)

2. **5초 대기**
   - 자동 폴링이 5초마다 실행됩니다
   - 잠시 기다리면 자동으로 나타납니다

3. **작업 ID 확인**
   - Slack 응답에서 "작업 ID: 11" 확인
   - 웹사이트에서 해당 ID 검색

---

### ❌ 담당자가 배정 안 돼요

**원인:**
Slack 유저네임이 DB 사용자와 매칭 안 됨

**해결방법:**

1. **정확한 이름 사용**
   ```
   /task create 생산팀 작업 2025-11-20 @john
   ```
   
   DB에 다음 중 하나가 있어야 합니다:
   - 이름: "John", "john", "John Smith"
   - 이메일: "john@company.com"

2. **웹사이트에서 수동 배정**
   - 작업 생성 후 웹사이트에서 클릭
   - "수정" 버튼
   - 담당자 선택

3. **사용자 추가**
   - 관리자 계정으로 로그인
   - 설정 → 사용자 관리
   - 새 사용자 추가

---

## 🎨 Step 12: 고급 설정 (선택사항)

### 12-1. 앱 이름 및 설명 개선

**"Basic Information"** 페이지:

**App Name:**
```
생산물류 Task Manager
```

**Short Description:**
```
슬랙에서 생산-물류 작업을 쉽게 관리하세요
```

**Long Description:**
```
생산팀과 물류팀의 작업을 Slack에서 직접 생성하고 관리할 수 있습니다.
/task 명령어로 작업 생성, 완료 처리, 상태 변경, 댓글 추가가 가능합니다.
```

### 12-2. Background Color 설정
앱 색상 커스터마이징:
- Primary Color: `#3B82F6` (파란색)
- 또는 `#10B981` (초록색)

---

## 🔒 Step 13: 보안 설정 (프로덕션용)

### 13-1. Signing Secret 확인
"Basic Information" → "App Credentials" 섹션:
- **Signing Secret** 값 확인
- "Show" 버튼 클릭하여 복사

### 13-2. 환경 변수 설정 (배포 후)
```bash
npx wrangler pages secret put SLACK_SIGNING_SECRET --project-name webapp
```

입력 프롬프트에서 Signing Secret 붙여넣기

이렇게 하면 요청 검증이 활성화됩니다!

---

## 📊 Step 14: 사용량 모니터링

### 12-1. Analytics 확인
"Your Apps" → 앱 선택 → "Analytics"

확인 가능한 정보:
- 명령어 사용 횟수
- 활성 사용자 수
- 오류 발생 빈도

### 12-2. Event Logs 확인
"OAuth & Permissions" → "Event Subscriptions"

실시간 로그 확인:
- 요청 URL
- 응답 시간
- 성공/실패 여부

---

## ✅ 완료 체크리스트

설정이 모두 완료되었는지 확인하세요:

### 필수 단계
- [ ] Step 1-3: Slack API에서 앱 생성
- [ ] Step 4: **봇 사용자 추가** (OAuth & Permissions에서 Bot Token Scopes 추가) ⭐ 중요!
  - [ ] `commands` scope 추가
  - [ ] `chat:write` scope 추가 (권장)
- [ ] Step 5: 슬래시 명령어 `/task` 추가
- [ ] Step 5: Request URL 정확히 입력
- [ ] Step 7: 워크스페이스에 앱 설치 (봇 권한 승인)
- [ ] Step 8: Slack에서 명령어 테스트
- [ ] Step 9: 웹사이트에서 작업 확인
- [ ] Step 10: 팀원들에게 사용법 공유

### 선택 단계
- [ ] Step 6: 앱 아이콘 설정
- [ ] Step 12: 고급 설정 (앱 이름, 색상)
- [ ] Step 13: 보안 설정 (Signing Secret)
- [ ] Step 14: 사용량 모니터링

---

## 🎉 축하합니다!

Slack 통합이 완료되었습니다! 🚀

이제 팀원들과 함께:
- 💬 Slack에서 편하게 작업 생성
- ⚡ 빠른 상태 업데이트
- 👀 모두가 볼 수 있는 투명한 작업 관리
- 🔔 자동 알림으로 놓치지 않는 작업

**즐거운 협업 되세요!** 🎊

---

## 🆘 추가 도움말

### 공식 문서
- Slack API: https://api.slack.com/docs
- Slash Commands: https://api.slack.com/interactivity/slash-commands

### 프로젝트 문서
- [SLACK_INTEGRATION_GUIDE.md](SLACK_INTEGRATION_GUIDE.md) - 상세 가이드
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API 레퍼런스
- [USAGE_GUIDE.md](USAGE_GUIDE.md) - 사용자 매뉴얼

### 문의
- GitHub Issues
- Slack 워크스페이스 #support

---

**마지막 업데이트:** 2025-11-06
**작성자:** MK (Alicia Minkyung)
