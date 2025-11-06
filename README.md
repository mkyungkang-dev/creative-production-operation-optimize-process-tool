# 생산-물류 관리 시스템 (Production-Logistics Management System)

## 📋 프로젝트 개요

실시간으로 생산팀과 물류팀의 작업을 추적하고 관리할 수 있는 웹 기반 워크플로우 관리 시스템입니다.

### 주요 기능

✅ **완료된 기능**
- 🔐 JWT 기반 인증 시스템 (역할별 접근 제어)
- 📊 대시보드 (통계, 차트, 내 작업 한눈에 보기)
- ✏️ 작업 관리 (생성, 수정, 삭제, 필터링)
- 💬 댓글 시스템 (작업별 커뮤니케이션)
- 🔔 알림 시스템 (작업 배정, 상태 변경, 마감일 경고)
- 📈 프로세스 다이어그램 (워크플로우 시각화)
- 🔄 실시간 업데이트 (5초마다 자동 폴링)
- 👥 사용자 관리 (관리자 전용)
- 🎨 반응형 디자인 (모바일/태블릿/데스크톱 지원)

## 🌐 URL

- **개발 서버**: https://3000-ikt840v0sn38orwf825jj-ad490db5.sandbox.novita.ai
- **GitHub**: https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool
- **Cloudflare Pages**: (배포 대기 - [배포 가이드](CLOUDFLARE_DEPLOY_GUIDE.md) 참조)

## 📚 문서 가이드

- 📖 **[사용자 가이드](USAGE_GUIDE.md)** - 시스템 사용 방법 상세 설명
- 🔌 **[API 문서](API_DOCUMENTATION.md)** - 전체 API 엔드포인트 레퍼런스
- ☁️ **[Cloudflare 배포 가이드](CLOUDFLARE_DEPLOY_GUIDE.md)** - 프로덕션 배포 방법
- 👥 **[팀 협업 가이드](TEAM_COLLABORATION_GUIDE.md)** - GitHub 협업 워크플로우
- 🚀 **[GitHub 배포 가이드](GITHUB_DEPLOY_GUIDE.md)** - GitHub 수동 배포 방법

## 🧪 테스트 계정

| 역할 | 이메일 | 비밀번호 | 권한 |
|------|--------|----------|------|
| 관리자 | admin@company.com | password123 | 모든 기능 접근 |
| 생산팀 | production1@company.com | password123 | 생산팀 작업만 |
| 물류팀 | logistics1@company.com | password123 | 물류팀 작업만 |

## 🏗️ 데이터 아키텍처

### 데이터 모델

**Users (사용자)**
- id, email, password, name, role (admin/production/logistics)

**Tasks (작업)**
- id, name, description, team, status, assigned_to
- expected_completion, actual_completion, priority, dependencies

**Comments (댓글)**
- id, task_id, user_id, content

**Notifications (알림)**
- id, user_id, task_id, message, type, is_read

### 스토리지 서비스

- **Cloudflare D1**: SQLite 기반 관계형 데이터베이스
  - 로컬 개발: `.wrangler/state/v3/d1` (자동 생성)
  - 프로덕션: Cloudflare D1 (글로벌 분산)

## 📱 주요 기능 URI

### 인증 API
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 작업 관리 API
- `GET /api/tasks` - 작업 목록 (필터링 지원)
  - Query params: `team`, `status`, `assigned_to`
- `GET /api/tasks/:id` - 작업 상세 정보
- `POST /api/tasks` - 새 작업 생성
- `PUT /api/tasks/:id` - 작업 수정
- `DELETE /api/tasks/:id` - 작업 삭제 (관리자만)

### 댓글 API
- `POST /api/tasks/:id/comments` - 댓글 추가

### 알림 API
- `GET /api/notifications` - 내 알림 목록
- `PUT /api/notifications/:id/read` - 알림 읽음 표시
- `PUT /api/notifications/read-all` - 모든 알림 읽음 표시

### 사용자 관리 API (관리자만)
- `GET /api/users` - 사용자 목록
- `POST /api/users` - 새 사용자 생성

### 대시보드 API
- `GET /api/dashboard/stats` - 통계 데이터

## 🚀 로컬 개발 가이드

### 1. 프로젝트 설치

```bash
cd /home/user/webapp
npm install
```

### 2. 데이터베이스 초기화

```bash
# 데이터베이스 마이그레이션 적용
npm run db:migrate:local

# 테스트 데이터 삽입
npm run db:seed

# 또는 한번에 리셋
npm run db:reset
```

### 3. 개발 서버 시작

```bash
# 빌드
npm run build

# PM2로 서버 시작
pm2 start ecosystem.config.cjs

# 또는 직접 실행
npm run dev:sandbox
```

### 4. 서버 확인

```bash
# 서버 상태 확인
pm2 list

# 로그 확인
pm2 logs webapp --nostream

# 서버 재시작
pm2 restart webapp

# 서버 중지
pm2 stop webapp
```

## 🛠️ 기술 스택

### Backend
- **Hono**: 경량 웹 프레임워크
- **Cloudflare Workers**: Edge 런타임
- **Cloudflare D1**: SQLite 기반 데이터베이스
- **JWT**: 인증 토큰

### Frontend
- **Vanilla JavaScript**: 순수 자바스크립트
- **TailwindCSS**: 스타일링 (CDN)
- **Chart.js**: 데이터 시각화
- **Axios**: HTTP 클라이언트
- **Font Awesome**: 아이콘

### DevOps
- **Wrangler**: Cloudflare 개발 도구
- **PM2**: 프로세스 관리 (로컬 개발)
- **Vite**: 빌드 도구

## 📂 프로젝트 구조

```
webapp/
├── src/
│   ├── index.tsx              # 메인 애플리케이션 (API 라우트)
│   ├── utils/
│   │   └── auth.ts            # JWT 인증 유틸리티
│   └── middleware/
│       └── auth.ts            # 인증 미들웨어
├── public/
│   └── static/
│       ├── app.js             # 프론트엔드 로직
│       └── styles.css         # 커스텀 스타일
├── migrations/
│   └── 0001_initial_schema.sql # 데이터베이스 스키마
├── seed.sql                    # 테스트 데이터
├── ecosystem.config.cjs        # PM2 설정
├── wrangler.jsonc             # Cloudflare 설정
├── package.json
└── README.md
```

## 🎯 다음 개발 계획

### 예정된 기능
- 📊 고급 분석 및 리포트 (Excel/PDF 내보내기)
- 📧 이메일 알림 (SendGrid 연동)
- 🔍 전체 검색 기능
- 📅 캘린더 뷰
- 🏷️ 태그 시스템
- 📎 파일 첨부 (Cloudflare R2)
- 🌍 다국어 지원 (i18n)

### 성능 개선
- 무한 스크롤/페이지네이션
- 오프라인 모드 (Service Worker)
- 푸시 알림 (Web Push API)

## 🔧 배포 가이드

### Cloudflare Pages 배포

```bash
# 1. Cloudflare 인증 설정
npm run cf-typegen

# 2. 프로덕션 D1 데이터베이스 생성
npx wrangler d1 create webapp-production

# 3. wrangler.jsonc에 database_id 업데이트

# 4. 프로덕션 마이그레이션 적용
npm run db:migrate:prod

# 5. 배포
npm run deploy:prod
```

## 📊 현재 상태

- **배포 상태**: 🟡 로컬 개발 환경
- **기술 스택**: Hono + Cloudflare D1 + Vanilla JS
- **마지막 업데이트**: 2025-11-06
- **버전**: 1.0.0

## 👥 역할별 기능

### 관리자 (Admin)
- ✅ 모든 작업 조회/생성/수정/삭제
- ✅ 사용자 관리 (생성/조회)
- ✅ 전체 통계 확인
- ✅ 모든 팀의 작업 접근

### 생산팀 (Production)
- ✅ 생산팀 작업만 조회
- ✅ 생산팀 작업 생성/수정
- ✅ 댓글 작성
- ✅ 알림 수신

### 물류팀 (Logistics)
- ✅ 물류팀 작업만 조회
- ✅ 물류팀 작업 생성/수정
- ✅ 댓글 작성
- ✅ 알림 수신

## 🐛 알려진 제약사항

1. **WebSocket 미지원**: Cloudflare Workers는 WebSocket 서버를 지원하지 않아 폴링(5초) 방식 사용
2. **이메일 알림 없음**: 브라우저 내 알림만 지원 (외부 API 연동 필요)
3. **파일 업로드 미구현**: Cloudflare R2 연동 예정

## 🚀 빠른 시작 (팀원용)

### 신규 팀원 온보딩

1. **GitHub 초대 수락**
   - 이메일에서 리포지토리 초대 수락

2. **프로젝트 클론**
   ```bash
   git clone https://github.com/mkyungkang-dev/creative-production-operation-optimize-process-tool.git
   cd creative-production-operation-optimize-process-tool
   ```

3. **설치 및 실행**
   ```bash
   npm install
   npm run db:reset
   npm run build
   pm2 start ecosystem.config.cjs
   ```

4. **브라우저에서 확인**
   - http://localhost:3000
   - 로그인: admin@company.com / password123

자세한 내용은 **[팀 협업 가이드](TEAM_COLLABORATION_GUIDE.md)** 참조

---

## 👥 팀원 초대 방법

1. GitHub 리포지토리 → **Settings** → **Collaborators**
2. **Add people** 클릭
3. 팀원의 GitHub 유저네임 입력
4. 권한 선택: **Write** (추천)
5. 초대 전송!

자세한 가이드: **[팀 협업 가이드](TEAM_COLLABORATION_GUIDE.md)**

---

## ☁️ Cloudflare 배포 방법

### 필요한 것
- Cloudflare 계정 (무료)
- API 토큰

### 배포 단계
1. Cloudflare API 토큰 생성
2. **Deploy 탭**에서 API 키 설정
3. 또는 수동 배포: **[Cloudflare 배포 가이드](CLOUDFLARE_DEPLOY_GUIDE.md)** 참조

---

## 📝 라이선스

MIT License

## 👨‍💻 개발자

Created by MK (Alicia Minkyung) - 2025

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

자세한 협업 가이드: **[팀 협업 가이드](TEAM_COLLABORATION_GUIDE.md)**
