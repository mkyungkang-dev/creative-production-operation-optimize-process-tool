# 👥 팀 협업 가이드 (GitHub + 프로젝트)

## 🎯 목표
팀원들을 GitHub 리포지토리에 초대하고, 함께 프로젝트를 개발할 수 있도록 설정하기

---

## 📦 GitHub 리포지토리 정보

**리포지토리 URL:**
```
https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool
```

**프로젝트명:** 생산-물류 관리 시스템  
**소유자:** mkyungkang-dev

---

## 1️⃣ GitHub 팀원 초대하기

### 방법 A: GitHub 웹사이트에서 초대 (추천)

1. **리포지토리 페이지 이동**
   ```
   https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool
   ```

2. **Settings 탭 클릭**
   - 리포지토리 상단 메뉴에서 "Settings" 클릭
   - ⚠️ Settings가 안 보이면 리포지토리 소유자 권한이 필요합니다

3. **Collaborators 메뉴 이동**
   - 왼쪽 사이드바에서 "Collaborators and teams" 클릭
   - 또는 직접 URL: `https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool/settings/access`

4. **팀원 추가**
   - **"Add people"** 버튼 클릭
   - 팀원의 GitHub 유저네임 또는 이메일 입력
   - 권한 레벨 선택:
     - **Admin** - 모든 권한 (설정 변경 가능)
     - **Write** - 코드 Push 가능 (추천)
     - **Read** - 코드만 읽기 가능

5. **초대 전송**
   - **"Add [username] to this repository"** 클릭
   - 팀원의 이메일로 초대장이 전송됨

6. **팀원의 수락**
   - 팀원이 GitHub 이메일 확인
   - 초대 수락 클릭
   - 리포지토리 접근 가능!

---

### 방법 B: GitHub CLI로 초대

```bash
# GitHub CLI로 협력자 추가
gh api repos/mkyungkang-dev/creative-production-operation-optimize-process-tool/collaborators/USERNAME \
  --method PUT \
  -f permission=push
```

---

## 2️⃣ 팀원이 프로젝트 시작하기

### 팀원을 위한 안내서

**새로운 팀원이 이 메시지를 받으면:**

#### Step 1: GitHub 초대 수락
1. GitHub 이메일 확인
2. 초대 수락 링크 클릭
3. 리포지토리 접근 확인

#### Step 2: 프로젝트 클론
```bash
# 리포지토리 클론
git clone https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool.git

# 프로젝트 폴더로 이동
cd creative-production-operation-optimize-process-tool
```

#### Step 3: 의존성 설치
```bash
# Node.js 패키지 설치
npm install
```

#### Step 4: 데이터베이스 초기화
```bash
# 로컬 데이터베이스 생성 및 시드 데이터 추가
npm run db:reset
```

#### Step 5: 개발 서버 시작
```bash
# 프로젝트 빌드
npm run build

# PM2로 서버 시작 (로컬 개발)
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

#### Step 6: 확인
```bash
# 브라우저에서 http://localhost:3000 접속
# 로그인: admin@company.com / password123
```

---

## 3️⃣ 협업 워크플로우

### 기본 Git 워크플로우

#### 1. 최신 코드 받기
```bash
# 항상 작업 시작 전에!
git pull origin main
```

#### 2. 새 브랜치 만들기 (권장)
```bash
# 기능별로 브랜치 생성
git checkout -b feature/add-new-feature

# 또는 버그 수정
git checkout -b fix/bug-description
```

#### 3. 코드 작성 및 테스트
```bash
# 파일 수정...
# 로컬 테스트...
```

#### 4. 변경사항 커밋
```bash
# 변경된 파일 확인
git status

# 파일 추가
git add .

# 커밋 (명확한 메시지 작성!)
git commit -m "feat: 새로운 리포트 기능 추가"
```

#### 5. GitHub에 푸시
```bash
# 브랜치를 GitHub에 푸시
git push origin feature/add-new-feature
```

#### 6. Pull Request 생성
1. GitHub 리포지토리 페이지 방문
2. **"Compare & pull request"** 버튼 클릭
3. PR 제목과 설명 작성
4. 리뷰어 지정 (팀원)
5. **"Create pull request"** 클릭

#### 7. 코드 리뷰 및 머지
- 팀원이 코드 리뷰
- 피드백 반영
- 승인 후 **"Merge pull request"**

---

## 4️⃣ 커밋 메시지 규칙

### 추천 포맷
```
<type>: <subject>

<body> (optional)
```

### Type 종류:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드/설정 변경

### 예시:
```bash
git commit -m "feat: 작업 우선순위 정렬 기능 추가"
git commit -m "fix: 로그인 시 토큰 만료 오류 수정"
git commit -m "docs: API 문서 업데이트"
```

---

## 5️⃣ 브랜치 전략

### 추천 브랜치 구조

```
main (프로덕션)
  ↓
develop (개발)
  ↓
feature/new-feature (기능 개발)
fix/bug-fix (버그 수정)
```

### 브랜치 네이밍 규칙
- `feature/기능명` - 새 기능
- `fix/버그명` - 버그 수정
- `docs/문서명` - 문서 작업
- `refactor/코드명` - 리팩토링

---

## 6️⃣ GitHub Issues 활용

### 이슈 생성하기

1. **Issues 탭 클릭**
2. **"New issue"** 버튼
3. 제목과 설명 작성:
   ```markdown
   ## 문제 설명
   로그인 후 대시보드가 로딩되지 않음
   
   ## 재현 방법
   1. admin@company.com으로 로그인
   2. 대시보드 페이지 접속
   3. 흰 화면만 표시됨
   
   ## 예상 동작
   대시보드 통계와 차트가 표시되어야 함
   
   ## 환경
   - 브라우저: Chrome 120
   - OS: Windows 11
   ```

4. **Labels 추가** (bug, enhancement, documentation 등)
5. **Assignees 지정** (담당자)
6. **Create issue** 클릭

### 이슈 연결하기
커밋 메시지에 이슈 번호 포함:
```bash
git commit -m "fix: 대시보드 로딩 오류 수정 (#12)"
```

---

## 7️⃣ 프로젝트 보드 사용

### GitHub Projects 설정

1. **Projects 탭 클릭**
2. **"New project"** 생성
3. 템플릿 선택:
   - Board (칸반 보드)
   - Table (표 형식)
   - Roadmap (타임라인)

4. **컬럼 구성 예시:**
   - 📋 To Do (할 일)
   - 🏗️ In Progress (진행 중)
   - 👀 Review (리뷰 중)
   - ✅ Done (완료)

5. **이슈를 보드에 추가**
   - 드래그 앤 드롭으로 이동
   - 진행 상황 시각화

---

## 8️⃣ 코드 리뷰 가이드

### 리뷰어를 위한 체크리스트

**기능 확인:**
- [ ] 코드가 의도한 대로 작동하는가?
- [ ] 에러 처리가 적절한가?
- [ ] 테스트가 포함되어 있는가?

**코드 품질:**
- [ ] 코드가 읽기 쉬운가?
- [ ] 주석이 적절한가?
- [ ] 변수명이 명확한가?
- [ ] 중복 코드가 없는가?

**보안:**
- [ ] 민감한 정보가 노출되지 않는가?
- [ ] 입력 검증이 있는가?
- [ ] SQL Injection 방지가 되어 있는가?

### PR 리뷰 남기기
```markdown
## 👍 잘된 점
- 에러 처리가 깔끔합니다
- 코드 구조가 명확합니다

## 🤔 개선 제안
- `getUserData` 함수를 별도 파일로 분리하면 좋을 것 같습니다
- 에러 메시지를 더 구체적으로 작성해주세요

## 📝 질문
- 이 함수가 null을 반환할 수 있나요?
```

---

## 9️⃣ 팀 커뮤니케이션

### GitHub Discussions 활용
1. **Discussions 탭** 활성화
2. 카테고리:
   - 💡 Ideas (아이디어)
   - 🙏 Q&A (질문)
   - 📣 Announcements (공지)
   - 🗳️ Polls (투표)

### 외부 도구 연동
- **Slack**: GitHub 알림 연동
- **Discord**: 커밋/PR 알림
- **Email**: 자동 알림

---

## 🔟 권한 관리

### 팀원 역할

**Admin (관리자)**
- 리포지토리 설정 변경
- 팀원 추가/제거
- 브랜치 보호 규칙 설정

**Write (개발자)** - 추천!
- 코드 Push
- PR 생성/머지
- Issue 관리

**Read (읽기 전용)**
- 코드 보기
- Issue 댓글
- Fork 가능

---

## 🛡️ 브랜치 보호 규칙

### main 브랜치 보호 (권장)

1. **Settings** → **Branches**
2. **Add rule** 클릭
3. Branch name pattern: `main`
4. 설정:
   - ✅ Require pull request before merging
   - ✅ Require approvals (1명 이상)
   - ✅ Dismiss stale pull request approvals
   - ✅ Require status checks to pass

이렇게 하면 main에 직접 Push 불가, PR 필수!

---

## 📚 학습 자료

### Git 기초
- Git Book (한글): https://git-scm.com/book/ko/v2
- Git 치트시트: https://education.github.com/git-cheat-sheet-education.pdf

### GitHub 가이드
- GitHub Docs: https://docs.github.com/ko
- GitHub Skills: https://skills.github.com/

### 협업 베스트 프랙티스
- 작은 단위로 자주 커밋
- 명확한 커밋 메시지
- 코드 리뷰 문화
- 브랜치 전략 준수

---

## 🆘 문제 해결

### 충돌 (Conflict) 해결
```bash
# 1. 최신 코드 받기
git pull origin main

# 2. 충돌 파일 수동 수정
# (<<<<<<, ======, >>>>>> 표시 부분)

# 3. 수정 완료 후
git add .
git commit -m "fix: 충돌 해결"
git push
```

### 실수로 잘못 커밋한 경우
```bash
# 마지막 커밋 취소 (로컬에서만)
git reset --soft HEAD~1

# 강제 푸시 (⚠️ 주의!)
git push --force
```

### 다른 팀원의 브랜치 가져오기
```bash
# 모든 브랜치 확인
git fetch --all

# 특정 브랜치로 전환
git checkout feature/other-feature
```

---

## ✅ 팀 온보딩 체크리스트

**관리자 (MK):**
- [ ] GitHub에 팀원 초대
- [ ] 권한 부여 (Write 권장)
- [ ] Slack/Discord 채널 초대
- [ ] 프로젝트 가이드 공유

**팀원:**
- [ ] GitHub 초대 수락
- [ ] 리포지토리 클론
- [ ] 개발 환경 설정
- [ ] 테스트 계정으로 로그인 확인
- [ ] 첫 브랜치 생성 및 Push 테스트

---

## 🎓 협업 팁

### DO ✅
- 작업 시작 전 `git pull`
- 명확한 커밋 메시지
- 작은 단위로 자주 커밋
- 코드 리뷰 요청
- 질문은 빠르게

### DON'T ❌
- main에 직접 Push
- 큰 파일 커밋 (이미지, 동영상)
- `.env` 파일 커밋
- API 키/비밀번호 커밋
- 테스트 없이 머지

---

## 📞 연락처

**프로젝트 관리자:** MK (Alicia Minkyung)  
**GitHub:** @mkyungkang-dev  
**리포지토리:** https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool

---

**함께 멋진 프로젝트를 만들어봅시다!** 🚀👥
