# 🚀 GitHub 수동 배포 가이드

## 방법 1: GitHub 웹 인터페이스 사용 (가장 쉬움!)

### 1단계: GitHub에 새 리포지토리 만들기

1. https://github.com 접속 및 로그인
2. 우측 상단 **"+"** 클릭 → **"New repository"** 선택
3. 리포지토리 정보 입력:
   - **Repository name**: `production-logistics-system`
   - **Description**: `생산-물류 관리 시스템 - Production & Logistics Management System`
   - **Public** 또는 **Private** 선택
   - ⚠️ **"Initialize this repository with a README" 체크 해제!**
4. **"Create repository"** 클릭

### 2단계: 코드 업로드

**옵션 A: ZIP 파일로 업로드** (가장 간단!)

1. 이 프로젝트를 ZIP으로 다운로드:
   ```bash
   cd /home/user
   tar -czf webapp-backup.tar.gz webapp/
   ```

2. GitHub 리포지토리 페이지에서:
   - **"uploading an existing file"** 링크 클릭
   - 파일을 드래그 앤 드롭
   - 커밋 메시지 작성
   - **"Commit changes"** 클릭

**옵션 B: Git 명령어 사용**

리포지토리 생성 후 표시되는 명령어를 복사하여 실행:

```bash
cd /home/user/webapp

# 기존 리모트 확인
git remote -v

# 리모트 추가 (YOUR_USERNAME와 YOUR_REPO를 실제 값으로 변경!)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

⚠️ **GitHub 인증 필요 시:**
- Personal Access Token 생성 필요
- Settings → Developer settings → Personal access tokens → Generate new token
- `repo` 권한 체크
- 생성된 토큰을 비밀번호 대신 사용

---

## 방법 2: 프로젝트 백업 다운로드

GitHub 업로드가 어려우시면, 프로젝트를 백업 파일로 다운로드하세요:

### 백업 파일 생성

```bash
cd /home/user
tar -czf webapp-$(date +%Y%m%d).tar.gz webapp/
```

이 파일을 다운로드하여:
1. 로컬 컴퓨터에 저장
2. GitHub Desktop 사용
3. 또는 나중에 업로드

---

## 방법 3: GitHub CLI 사용

GitHub CLI가 설치되어 있다면:

```bash
cd /home/user/webapp

# GitHub 로그인
gh auth login

# 새 리포지토리 생성 및 푸시
gh repo create production-logistics-system --public --source=. --push
```

---

## 🎯 프로젝트 파일 구조

업로드할 파일들:

```
webapp/
├── src/                    # 백엔드 소스 코드
├── public/                 # 프론트엔드 정적 파일
├── migrations/             # 데이터베이스 마이그레이션
├── dist/                   # 빌드 결과물
├── .gitignore             # Git 제외 파일
├── README.md              # 프로젝트 문서
├── USAGE_GUIDE.md         # 사용자 가이드
├── API_DOCUMENTATION.md   # API 문서
├── package.json           # 의존성 관리
├── wrangler.jsonc         # Cloudflare 설정
└── 기타 설정 파일들
```

---

## ✅ 업로드 후 확인사항

GitHub에 업로드하면:

1. **README.md 자동 표시** ✅
   - 프로젝트 설명
   - 설치 방법
   - 사용 가이드

2. **코드 버전 관리** ✅
   - 변경 이력 추적
   - 이전 버전으로 되돌리기
   - 협업 가능

3. **이슈 트래킹** ✅
   - 버그 리포트
   - 기능 요청
   - 팀 협업

4. **프로젝트 공유** ✅
   - 팀원 초대
   - 공개/비공개 설정
   - URL로 쉽게 공유

---

## 🔐 민감 정보 보호

업로드 전 확인:
- ✅ `.gitignore`에 포함됨:
  - `node_modules/`
  - `.env`
  - `.wrangler/`
  - 개인 키/비밀번호

⚠️ **절대 업로드하지 말 것:**
- API 키
- 비밀번호
- 개인 토큰
- `.env` 파일

---

## 💡 추가 팁

### GitHub Pages로 문서 호스팅
1. Settings → Pages
2. Source를 `main` 브랜치로 설정
3. README.md가 자동으로 웹페이지로 표시됨

### GitHub Actions로 자동 배포
나중에 Cloudflare 배포를 자동화할 수 있습니다!

---

## 🆘 도움이 필요하신가요?

- GitHub 인증 문제: https://docs.github.com/en/authentication
- Git 기초 사용법: https://git-scm.com/book/ko/v2
- GitHub Desktop: https://desktop.github.com/

---

**준비되셨으면 위 방법 중 하나를 선택하여 진행하세요!** 🚀
