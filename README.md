<<<<<<< HEAD
# 🛍️ Radiya Shopping Mall

Vue.js 기반 쇼핑몰 웹사이트입니다.  
상품 목록, 카테고리 필터, 장바구니, 좋아요, 상세 페이지 등 전자상거래 핵심 기능을 구현했습니다.  
백엔드는 Node.js + Express + MySQL을 사용했습니다.

---

## 🧩 기술 스택

**Frontend:** Vue.js, Vue Router, Axios, Bootstrap  
**Backend:** Node.js, Express  
**Database:** MySQL, PostgreSQL  
**Deploy:** Vercel / Render  
**Tools:** Git, GitHub, VSCode, DBeaver, Docker

---

## 📦 주요 기능

1. 상품 목록 조회  
2. 카테고리별 필터  
3. 상품 상세 페이지  
4. 장바구니 추가 및 목록 조회  
5. 좋아요 등록 및 좋아요 페이지  
6. 로그인 / 회원가입

---

## 🚀 실행 방법

```bash
npm install
npm run serve
# 빌드
npm run build


---
📁 폴더 구조
```
radiya-shoppingmall/
├── src/
│ ├── components/
│ │ ├── MainPage.vue
│ │ ├── ProductList.vue
│ │ ├── ProductDetail.vue
│ │ ├── CartPage.vue
│ │ ├── LikePage.vue
│ │ ├── UserLogin.vue
│ │ ├── SignUp.vue
│ │ └── PaymentPage.vue
│ ├── router/
│ │ └── index.js
│ ├── views/
│ │ ├── MenPage.vue
│ │ ├── WomenPage.vue
│ │ ├── JewelryPage.vue
│ │ └── ElectronicsPage.vue
│ ├── App.vue
│ └── main.js
├── public/
│ └── images/
├── server/
│ └── app.js
├── package.json
├── .env
└── README.md
```

---
이슈 & 해결
상품 리스트 필터링 문제
AllProducts.vue를 컴포넌트에서 데이터로 분리하여 products.js에서 관리

이미지 출력 문제
동적 바인딩 적용으로 해결
:src="product.image" :alt="product.title"

props 변경 시 UI 갱신 문제
watch 메서드로 동기화 처리
watch: {
products(newVal) {
this.localProducts = [...newVal];
}
}
---
=======
# Radiya Shopping Mall

README 정리 예정.
>>>>>>> d76b197ddc05adaf413e3236c14a85920611aee9
