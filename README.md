# 군산 성원상떼빌 랜딩페이지

모바일 최적화된 부동산 분양 상담 신청 랜딩페이지입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 설정
config.example.js 파일을 config.js로 복사하고 실제 값으로 변경하세요.

```bash
cp config.example.js config.js
```

config.js 파일에서 Google Apps Script URL을 설정하세요:
```javascript
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
};
```

### 3. 개발 서버 실행
```bash
npm run dev
```

서버 접속:
- PC: http://localhost:8000
- 모바일: http://192.168.0.23:8000 (네트워크 IP 확인 필요)

## 기능

- 📱 모바일 최적화 디자인 (최대 너비 800px)
- 📝 상담 신청 폼 (연령대, 이름, 연락처, 통화 가능 시간)
- 📊 Google Sheets 자동 저장
- 💬 카카오톡 오픈채팅 연동
- ✨ 스크롤 애니메이션 및 반응형 UI

## 기술 스택

- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript
- Vite (개발 서버)
- Google Apps Script (데이터 저장)

## 파일 구조

```
landing3/
├── index.html          # 메인 HTML
├── styles.css          # 스타일시트
├── script.js           # JavaScript 로직
├── config.js           # 환경 설정 (gitignore)
├── config.example.js   # 환경 설정 예시
├── public/             # 정적 파일 (이미지)
│   ├── 01.png          # 히어로 이미지
│   ├── 02-1.png        # 바디 이미지
│   └── product_kakaotalkconsult_logo_img.png
├── package.json        # npm 설정
└── README.md           # 프로젝트 문서

```

## 배포

민감한 정보(config.js)는 .gitignore에 포함되어 Git에 업로드되지 않습니다.
실제 배포 시에는 서버 환경변수나 안전한 방법으로 관리하세요.

## 라이선스

© 2026 군산 성원상떼빌. All rights reserved.
