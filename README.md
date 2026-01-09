# 🚗 MyCar Market (마이카 마켓)

**MyCar Market**은 사용자와 관리자를 위한 **프리미엄 개인 중고차 거래 플랫폼**입니다.  
직관적인 UI와 강력한 검색 기능을 통해 사용자는 원하는 차량을 쉽고 빠르게 찾을 수 있으며, 관리자는 효율적으로 매물을 관리할 수 있습니다. 또한, 커뮤니티 기능을 통해 사용자 간의 소통을 지원합니다.

---

## 🛠 Tech Stack

### Backend
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![JPA](https://img.shields.io/badge/Spring_Data_JPA-gray?style=for-the-badge&logo=spring&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-gray?style=for-the-badge)
![H2 Database](https://img.shields.io/badge/H2_Database-blue?style=for-the-badge)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

## ✨ Key Features (주요 기능)

### 1. 🔐 인증 & 인가 (Authentication)
*   **JWT 기반 로그인**: Access Token을 이용한 보안 로그인.
*   **권한 분리**:
    *   **관리자 (Admin)**: 차량 등록 및 관리 권한 보유.
    *   **사용자 (User)**: 차량 조회, 검색, 커뮤니티 게시글 작성 권한 보유.

### 2. 🚘 차량 관리 (Vehicle Management)
*   **매물 등록 (관리자 전용)**:
    *   차량 기본 정보(브랜드, 모델, 연식, 주행거리 등) 입력.
    *   **이미지 업로드**: 대표 이미지 및 갤러리 이미지 다중 등록 지원.
*   **차량 검색 (QueryDSL)**:
    *   브랜드, 모델명, 가격 범위, 연식 등 상세 필터링 조건 지원.
    *   동적 쿼리를 통한 빠르고 정확한 검색 결과.
*   **상세 페이지**:
    *   차량 상세 스펙 및 고화질 이미지 갤러리 제공.

### 3. 📝 커뮤니티 (Community)
*   **소통 공간**: 회원들이 자유롭게 정보를 공유할 수 있는 게시판.
*   **기능**: 게시글 목록 조회, 상세 조회, 새 글 작성(회원 전용).

---

## 📂 Folder Structure

이 프로젝트는 **Monorepo** 구조로, 백엔드와 프론트엔드가 하나의 리포지토리에서 관리됩니다.

```bash
MyCar-Market/
├── backend/          # Spring Boot Application
│   ├── src/main/java       # Source Code (Domain, Service, Controller)
│   ├── src/main/resources  # Config (application.yml), Static Resources
│   └── build.gradle        # Dependencies
│
├── frontend/         # Next.js Application
│   ├── src/app             # App Router (Pages)
│   ├── src/components      # UI Components (Features, Common)
│   ├── src/lib             # API Client, Utilities
│   └── tailwind.config.ts  # Styling Config
│
└── README.md         # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   **Java 21** 이상
*   **Node.js 18** 이상

### 1. Backend (Spring Boot)
백엔드 서버를 먼저 실행합니다. H2 데이터베이스는 메모리 모드로 실행됩니다.

```bash
cd backend

# Windows
./gradlew.bat bootRun

# Mac/Linux
./gradlew bootRun
```

> **관리자 초기 계정 정보**  
> *   **Email**: `admin@mycar.com`  
> *   **Password**: `admin1234`

### 2. Frontend (Next.js)
프론트엔드 개발 서버를 실행합니다.

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인합니다.

---

## 📸 Screenshots

| 메인 페이지 (Main) | 차량 상세 (Detail) |
| :---: | :---: |
| ![Main Page](placeholder-main.png) | ![Detail Page](placeholder-detail.png) |

| 커뮤니티 (Community) | 관리자 등록 (Admin) |
| :---: | :---: |
| ![Community](placeholder-community.png) | ![Admin Register](placeholder-admin.png) |
