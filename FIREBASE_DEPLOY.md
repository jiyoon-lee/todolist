# Firebase 배포 가이드

## Firestore 보안 규칙 배포하기

1. Firebase CLI 설치 (이미 설치되어 있다면 생략)
```bash
npm install -g firebase-tools
```

2. Firebase 로그인
```bash
firebase login
```

3. Firebase 프로젝트 초기화 (이미 초기화되어 있다면 생략)
```bash
firebase init firestore
```

4. Firestore 보안 규칙 배포
```bash
firebase deploy --only firestore:rules
```

## 보안 규칙 설명

생성된 `firestore.rules` 파일은 다음과 같은 보안을 제공합니다:

- 사용자는 자신의 `users` 문서만 읽고 쓸 수 있습니다
- 사용자는 자신이 생성한 `todos`만 접근할 수 있습니다
- 인증되지 않은 사용자는 어떤 데이터에도 접근할 수 없습니다

## 테스트하기

1. 브라우저에서 애플리케이션 실행
2. 회원가입/로그인
3. 할 일 생성, 수정, 삭제 테스트
4. 다른 사용자 계정으로 로그인해서 데이터 격리 확인
