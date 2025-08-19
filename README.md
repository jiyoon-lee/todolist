# Todo App

React + TypeScript + Firebase를 사용한 Todo 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 18, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Backend**: Firebase (Authentication, Firestore)
- **Linting**: ESLint

## 기능

- 사용자 인증 (이메일/비밀번호, Google)
- Todo CRUD 작업
- 실시간 데이터 동기화
- 반응형 디자인

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. Firebase 프로젝트 설정:
   - [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
   - Authentication과 Firestore 활성화
   - 프로젝트 설정에서 웹 앱 추가
   - `.env` 파일에 Firebase 설정 정보 입력

3. 개발 서버 실행:
```bash
npm run dev
```

4. 빌드:
```bash
npm run build
```

## 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 UI 컴포넌트
├── pages/         # 페이지 컴포넌트
├── contexts/      # React Context 제공자
├── hooks/         # 커스텀 React 훅
├── services/      # API 및 Firebase 서비스 함수
├── utils/         # 유틸리티 함수
├── types/         # TypeScript 인터페이스 및 타입
└── assets/        # 이미지, 아이콘 등
```

## 환경 변수

다음 환경 변수들을 `.env` 파일에 설정해야 합니다:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 라이센스

MIT
