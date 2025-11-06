# ☁️ Cloudflare Pages 배포 가이드

## 🎯 목표
이 프로젝트를 Cloudflare Pages에 배포하여 **전세계 어디서나 접속 가능한 웹사이트**를 만들기

예상 결과: `https://production-logistics.pages.dev`

---

## 📋 준비물

### 1. Cloudflare 계정 (무료)
아직 없으시다면:
1. https://dash.cloudflare.com/sign-up 접속
2. 이메일 인증
3. 무료 플랜 선택

### 2. API 토큰 생성

**단계별 가이드:**

1. **Cloudflare 대시보드 로그인**
   - https://dash.cloudflare.com

2. **프로필 설정으로 이동**
   - 우측 상단 프로필 아이콘 클릭
   - **"My Profile"** 선택

3. **API Tokens 페이지 이동**
   - 왼쪽 메뉴에서 **"API Tokens"** 클릭
   - https://dash.cloudflare.com/profile/api-tokens

4. **새 토큰 생성**
   - **"Create Token"** 버튼 클릭
   - **"Edit Cloudflare Workers"** 템플릿 선택
   - 또는 **"Create Custom Token"** 선택

5. **권한 설정** (Custom Token인 경우)
   ```
   Account:
   - Account Settings: Read
   - D1: Edit
   - Workers Scripts: Edit
   
   Zone:
   - Workers Routes: Edit
   ```

6. **토큰 생성 및 복사**
   - **"Continue to summary"** 클릭
   - **"Create Token"** 클릭
   - ⚠️ **토큰을 안전하게 복사하여 저장하세요!**
   - (다시 볼 수 없습니다!)

---

## 🚀 배포 방법

### 방법 1: Deploy 탭에서 설정 (가장 쉬움!)

1. **왼쪽 사이드바에서 "Deploy" 탭 클릭**
2. **Cloudflare API 키 입력**
   - 위에서 생성한 토큰 붙여넣기
3. **저장**
4. **자동 배포 시작!**

---

### 방법 2: 수동 명령어로 배포

API 키를 받으셨다면 아래 명령어로 배포 가능합니다:

#### Step 1: Cloudflare 인증

```bash
cd /home/user/webapp

# 환경 변수로 API 키 설정 (YOUR_API_TOKEN을 실제 토큰으로 교체!)
export CLOUDFLARE_API_TOKEN="YOUR_API_TOKEN"

# 인증 확인
npx wrangler whoami
```

성공하면 계정 정보가 표시됩니다!

#### Step 2: D1 데이터베이스 생성

```bash
# 프로덕션 데이터베이스 생성
npx wrangler d1 create webapp-production
```

출력 예시:
```
✅ Successfully created DB 'webapp-production'

[[d1_databases]]
binding = "DB"
database_name = "webapp-production"
database_id = "xxxxxxxxxxxxxxxxxxxx"
```

⚠️ **중요!** `database_id`를 복사하세요!

#### Step 3: wrangler.jsonc 업데이트

`wrangler.jsonc` 파일을 열고 `database_id`를 업데이트:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "webapp",
  "compatibility_date": "2025-11-06",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "여기에_복사한_database_id_붙여넣기"
    }
  ]
}
```

#### Step 4: 데이터베이스 마이그레이션

```bash
# 프로덕션 데이터베이스에 스키마 적용
npm run db:migrate:prod

# (선택) 테스트 데이터 삽입
npx wrangler d1 execute webapp-production --file=./seed.sql
```

#### Step 5: Cloudflare Pages 프로젝트 생성

```bash
# 프로젝트 생성
npx wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2025-11-06
```

#### Step 6: 빌드 및 배포

```bash
# 프로젝트 빌드
npm run build

# Cloudflare Pages에 배포
npm run deploy:prod
```

또는 한 번에:
```bash
npm run deploy:prod
```

#### Step 7: 배포 확인

배포가 완료되면 URL이 표시됩니다:
```
✨ Deployment complete!
🌎 Your site is now live at:
   https://webapp.pages.dev
   https://main.webapp.pages.dev
```

---

## 🎉 배포 성공!

### 확인할 것들:

1. **웹사이트 접속**
   ```
   https://webapp.pages.dev
   ```

2. **로그인 테스트**
   - 이메일: admin@company.com
   - 비밀번호: password123

3. **API 테스트**
   ```bash
   curl https://webapp.pages.dev/api/tasks
   ```

---

## 🔧 추가 설정

### 환경 변수 설정 (필요시)

```bash
# JWT Secret 등 환경 변수 추가
npx wrangler pages secret put JWT_SECRET --project-name webapp
```

### 커스텀 도메인 연결

1. Cloudflare 대시보드 → Workers & Pages
2. 해당 프로젝트 선택
3. Custom domains → Add domain
4. 본인의 도메인 입력

---

## 📊 배포 후 관리

### Cloudflare 대시보드에서:

1. **배포 히스토리 확인**
   - Workers & Pages → webapp → Deployments

2. **로그 확인**
   - 실시간 로그 모니터링
   - 에러 추적

3. **분석 데이터**
   - 방문자 수
   - 요청 수
   - 성능 지표

4. **롤백**
   - 이전 배포로 되돌리기
   - 버전 관리

---

## 🔄 업데이트 배포

코드를 수정한 후:

```bash
# 1. Git에 커밋
git add .
git commit -m "Update: 새로운 기능 추가"
git push origin main

# 2. 재배포
npm run deploy:prod
```

---

## 🐛 문제 해결

### 1. 인증 실패
```bash
# 토큰 재설정
export CLOUDFLARE_API_TOKEN="새_토큰"
npx wrangler whoami
```

### 2. 데이터베이스 연결 오류
```bash
# 데이터베이스 ID 확인
npx wrangler d1 list

# wrangler.jsonc의 database_id 재확인
```

### 3. 빌드 실패
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 다시 빌드
npm run build
```

### 4. 배포 실패
```bash
# 로그 확인
npx wrangler pages deployment tail

# 강제 재배포
npm run build
npx wrangler pages deploy dist --project-name webapp --commit-dirty=true
```

---

## 💡 유용한 명령어

```bash
# 배포 목록 보기
npx wrangler pages deployment list --project-name webapp

# 로그 실시간 확인
npx wrangler pages deployment tail

# 프로젝트 정보
npx wrangler pages project list

# D1 데이터베이스 쿼리 실행
npx wrangler d1 execute webapp-production --command="SELECT * FROM users"

# 로컬 프리뷰
npm run build
npx wrangler pages dev dist
```

---

## 📈 성능 최적화

### 1. Caching 설정
Cloudflare가 자동으로 처리하지만, 추가 설정 가능

### 2. 이미지 최적화
Cloudflare Images 사용 (유료)

### 3. CDN 활용
전세계 Edge 네트워크에 자동 배포됨!

---

## 🔒 보안 설정

### 1. Access 정책
Cloudflare Access로 로그인 보호

### 2. Rate Limiting
API 요청 제한 설정

### 3. WAF 규칙
웹 방화벽 설정

---

## 📱 Progressive Web App (PWA) 만들기

나중에 추가 가능:
- 오프라인 모드
- 설치 가능한 앱
- 푸시 알림

---

## 🆘 도움말

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler
- **D1 Database**: https://developers.cloudflare.com/d1
- **Community Forum**: https://community.cloudflare.com

---

## ✅ 체크리스트

배포 전 확인:
- [ ] Cloudflare 계정 생성
- [ ] API 토큰 생성
- [ ] Deploy 탭에서 API 키 설정
- [ ] 또는 수동 명령어로 배포 진행

배포 후 확인:
- [ ] 웹사이트 접속 테스트
- [ ] 로그인 기능 확인
- [ ] API 동작 확인
- [ ] 데이터베이스 연결 확인

---

**준비되셨으면 Deploy 탭으로 가서 API 키를 입력하세요!** 🚀

또는 API 키를 알려주시면 제가 직접 배포해드릴 수 있습니다! 😊
