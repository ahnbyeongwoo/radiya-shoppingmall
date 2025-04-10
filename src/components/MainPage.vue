<template>
  <div class="main-container">
    <header class="main-header">
      <h1 class="shoppingmall-title">RADIYA</h1>
      <div class="auth-buttons">
        <button @click="onSearchClick">검색</button>
        <button @click="goToLogin">로그인</button>
        <button @click="goToSignup">회원가입</button>
        <button @click="goToCart">🛒</button>
      </div>
    </header>

    <ul class="categories">
      <li><button @click="goToCategory('/top')">top</button></li>
      <li><button @click="goToCategory('/bottoms')">pants</button></li>
      <li><button @click="goToCategory('/shoes')">shoes</button></li>
      <li><button @click="goToCategory('/bag')">bag</button></li>
    </ul>

    <section class="best-products">
      <h2>🔥 Best 상품</h2>
      <ProductList :products="bestProducts" />
      <router-link to="/products" class="view-all">+ 전체 상품 보기</router-link>
    </section>
  </div>
</template>

<script>
import ProductList from '@/components/ProductList.vue'

export default {
  name: 'MainShoppingmallPage',
  components: {
    ProductList
  },
  data() {
    return {
      allProducts: [//임시 best 상품
        { id: 1, name: '화이트 셔츠', price: 32000, image: '1-4.jpg' },
        { id: 2, name: '블랙 팬츠', price: 41000, image: '2-4.jpg' },
        { id: 3, name: '운동화', price: 55000, image: '3-4.jpg' },
        { id: 4, name: '청바지', price: 46000, image: '2-5.jpg' },
        { id: 5, name: '코트', price: 88000, image: '1-5.jpg' }
      ]
    };
  },
  computed: {
    bestProducts() {
      return this.allProducts.slice(0, 4);
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    goToSignup() {
      this.$router.push('/signup');
    },
    onSearchClick() {
      console.log('검색 버튼 클릭');
    },
  
    goToCategory(path) {
      this.$router.push(path);
    },
    goToCart() {
      console.log('장바구니 이동');
    }
  }
}
</script>

<style scoped>
.main-container {/* 전체 컨테이너 */
  padding-top: 100px; /* header 고정 공간 확보 */
  background-color: #ffffff;
}

.main-header {/* 상단 고정 헤더 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;/*세로 방향 정렬, 수직 가운데 정렬 */
  padding: 20px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.shoppingmall-title {/* 타이틀 */
  font-size: 2.5em;
  font-weight: bold;
  margin: 0;
  color: #333;
  position: absolute;
    left: 45%;
}

.auth-buttons {
  position: absolute;
  top: 20px;
  right: 100px;
  display: flex;
  gap: 10px;/*버튼 간격 */
}

.auth-buttons button {
  padding: 6px 2px;/* 상하 6px 좌우 12px*/
  border: none;
  background-color: #eee;
  border-radius: 5px;
  cursor: pointer;
}
.auth-button:hover {
  background-color: #f0f0f0;
}

.categories {
  list-style: none; /* 리스트 마커(● 등)를 제거 */
  padding: 5px 5px; /* 위아래 안쪽 여백 추가 */
  padding-left: 20px; /* 왼쪽에 여백을 조금 줘서 너무 붙지 않게 */
  margin-top: 10px; /* 위쪽 바깥 여백 */
  display: flex; /* 가로 정렬을 위한 flexbox 사용 */
  justify-content: flex-start; /* 항목들 사이 동일한 간격으로 분산 정렬 */
  align-items: center; /* 세로 정렬을 가운데로 맞춤 */
  gap: 50px; /* 항목 사이 간격 */
  border-radius: 8px; /* 둥근 모서리 */
}

.categories li button {
  padding: 10px 20px; /* 버튼 안쪽 여백 (상하 10px, 좌우 20px) */
  font-size: 14px; /* 글자 크기 설정 */
  background-color: white; /* 버튼 배경을 흰색으로 설정 */
  border: 1px solid #ccc; /* 테두리 색과 두께 설정 */
  border-radius: 8px; /* 버튼 모서리를 둥글게 만듦 */
}
.view-all{
  display: block;
  text-align: right;
  margin: 10px 40px 30px 0;
  color: #4A90E2;
  text-decoration: none;
}
</style>
