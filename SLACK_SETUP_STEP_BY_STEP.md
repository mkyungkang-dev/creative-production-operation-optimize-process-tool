# 🎯 Slack 앱 설정 단계별 가이드

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

## ⚙️ Step 4: 슬래시 명령어 추가

### 4-1. 왼쪽 메뉴에서 "Slash Commands" 클릭
- 왼쪽 사이드바에 "Features" 섹션이 있습니다
- 그 아래 "Slash Commands" 클릭

### 4-2. "Create New Command" 버튼 클릭
우측 상단의 버튼을 클릭하세요

### 4-3. 명령어 정보 입력

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

### 4-4. "Save" 버튼 클릭
모든 정보를 입력했으면 아래 "Save" 버튼 클릭!

---

## 🎨 Step 5: 앱 아이콘 설정 (선택사항)

### 5-1. "Basic Information" 클릭
왼쪽 메뉴의 "Settings" → "Basic Information"

### 5-2. "Display Information" 섹션
스크롤을 아래로 내리면 있습니다

### 5-3. 아이콘 업로드
- "App Icon & Preview" 섹션
- 512x512 PNG 이미지 업로드
- 또는 기본 아이콘 사용

**추천 이모지:**
- 📦 (상자)
- ✅ (체크)
- 🚀 (로켓)
- 📊 (차트)

### 5-4. "Save Changes" 클릭

---

## 🔧 Step 6: 워크스페이스에 앱 설치

### 6-1. "Install App" 클릭
왼쪽 메뉴의 "Settings" → "Install App"

### 6-2. "Install to Workspace" 버튼 클릭
큰 버튼이 있습니다

### 6-3. 권한 승인 페이지
Slack이 새 창/탭을 엽니다

다음 권한을 요청합니다:
- ✅ `commands` - Add shortcuts and/or slash commands

### 6-4. "Allow" 버튼 클릭
초록색 "Allow" 버튼을 클릭하세요!

---

## 🎉 Step 7: 테스트하기!

### 7-1. Slack 워크스페이스 열기
- 브라우저: https://app.slack.com
- 또는 Slack 앱 실행

### 7-2. 아무 채널 선택
- #general
- #test
- 또는 본인의 DM (Direct Message to yourself)

### 7-3. 명령어 입력
메시지 입력창에 다음을 입력:
```
/task create 생산팀 테스트작업 2025-11-20
```

### 7-4. Enter 키 누르기!

### 7-5. 응답 확인
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

## ✅ Step 8: 웹사이트에서 확인

### 8-1. 브라우저에서 웹사이트 열기
```
https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai
```

### 8-2. 로그인
- 이메일: `admin@company.com`
- 비밀번호: `password123`

### 8-3. "작업 관리" 메뉴 클릭
왼쪽 사이드바에서 "작업 관리" 클릭

### 8-4. 방금 만든 작업 확인!
"테스트작업"이라는 작업이 목록에 나타납니다! 🎉

---

## 🎓 추가 명령어 테스트

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

## 📱 Step 9: 팀원들에게 공유

### 9-1. Slack 채널에 공지
```
🎉 새로운 기능: Slack에서 작업 관리!

이제 Slack에서 /task 명령어로 작업을 관리할 수 있습니다!

📝 작업 생성:
/task create 생산팀 작업명 2025-11-20

✅ 작업 완료:
/task complete 작업ID

🔄 상태 변경:
/task status 작업ID 진행중

💬 댓글 추가:
/task comment 작업ID 댓글내용

자세한 사용법은 여기서:
https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool/blob/main/SLACK_INTEGRATION_GUIDE.md
```

### 9-2. 명령어 치트시트 핀 고정
위 메시지를 채널에 핀(Pin)으로 고정하세요:
- 메시지에 마우스 오버
- "..." (More actions) 클릭
- "Pin to channel" 선택

---

## 🎨 Step 10: 고급 설정 (선택사항)

### 10-1. 앱 이름 및 설명 개선

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

### 10-2. Background Color 설정
앱 색상 커스터마이징:
- Primary Color: `#3B82F6` (파란색)
- 또는 `#10B981` (초록색)

---

## 🔒 Step 11: 보안 설정 (프로덕션용)

### 11-1. Signing Secret 확인
"Basic Information" → "App Credentials" 섹션:
- **Signing Secret** 값 확인
- "Show" 버튼 클릭하여 복사

### 11-2. 환경 변수 설정 (배포 후)
```bash
npx wrangler pages secret put SLACK_SIGNING_SECRET --project-name webapp
```

입력 프롬프트에서 Signing Secret 붙여넣기

이렇게 하면 요청 검증이 활성화됩니다!

---

## 📊 Step 12: 사용량 모니터링

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

- [ ] Slack API에서 앱 생성
- [ ] 슬래시 명령어 `/task` 추가
- [ ] Request URL 정확히 입력
- [ ] 워크스페이스에 앱 설치
- [ ] Slack에서 명령어 테스트
- [ ] 웹사이트에서 작업 확인
- [ ] 팀원들에게 사용법 공유
- [ ] 채널에 공지 및 핀 고정

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
