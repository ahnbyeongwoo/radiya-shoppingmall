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
      <li><button @click="goToPostList">목록</button></li>
      <li><button @click="goToCategory('/top')">상의</button></li>
      <li><button @click="goToCategory('/bottoms')">하의</button></li>
      <li><button @click="goToCategory('/shoes')">신발</button></li>
      <li><button @click="goToCategory('/bag')">가방</button></li>
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
      allProducts: [
        { id: 1, name: '화이트 셔츠', price: 32000, image: 'shirt.jpg' },
        { id: 2, name: '블랙 팬츠', price: 41000, image: 'pants.jpg' },
        { id: 3, name: '운동화', price: 55000, image: 'shoes.jpg' },
        { id: 4, name: '청바지', price: 46000, image: 'jeans.jpg' },
        { id: 5, name: '코트', price: 88000, image: 'coat.jpg' }
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
      console.log('검색 버튼 클릭됨!');
    },
    goToPostList() {
      this.$router.push('/');
    },
    goToCategory(path) {
      this.$router.push(path);
    },
    goToCart() {
      console.log('장바구니 이동!');
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

.categories{
  list-style: none;
  padding: 0;
  margin-top: 10px;
  display: flex;
  justify-content: space-between; /* 또는 space-around / center 등도 가능 */
  align-items: center;
  gap: 20px; /* 버튼 간격 */
}

.category li button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.categories li button:hover {
  background-color: #f0f0f0;
}
.view-all{
  display: block;
  text-align: right;
  margin: 10px 40px 30px 0;
  color: #4A90E2;
  text-decoration: none;
}
</style>
