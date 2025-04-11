<template>
  <div class="main-container">
    <header class="main-header">
      <h1 class="shoppingmall-title">RADIYA</h1>
      <div class="auth-buttons">
        
        <!-- 검색창 영역 -->
        <div class="search-container">
          <form @submit.prevent="searchPosts" class="search-container">
            <input type="text" v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
            <button type="submit" class="common-button">검색</button>
          </form>
        </div>

        <!-- 로그인/회원가입/장바구니 버튼 -->
        <button @click="goToLogin" class="common-button">로그인</button>
        <button @click="goToSignup" class="common-button">회원가입</button>
        <button @click="goToCart" class="common-button">장바구니</button>
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
import axios from 'axios'

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
    // onSearchClick() {
    //   console.log('검색 버튼 클릭');
    // },
    async searchPosts() {//검색 기능
      if (!this.searchKeyword.trim()) {
        alert("검색어를 입력해주세요.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/search", {
          params: {
            type: this.searchType,//검색 타입(제목 또는 작성자)
            keyword: this.searchKeyword.trim(),
          },
        });
        this.posts = response.data; // 검색 결과를 posts에 저장
        this.currentPage = 1; // 검색 후 첫 페이지로 초기화
      } catch (error) {
        console.error("검색 실패:", error.response?.data?.message || error.message);
        alert("검색 중 오류가 발생했습니다.");
      }
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
  padding: 30px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

}
.shoppingmall-title {/* 타이틀 */
  font-size: 2.5em;
  font-weight: bold;
  margin: 0;
  color: #333;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.auth-buttons {
  display: flex;
  align-items: center; /* end → center로 변경 */
  gap: 10px;
  margin-left: auto;
}

/*로그인, 회원가입, 장바구니 버튼 */
.common-button {
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  border: none;
  background-color: #eee;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
}

.common-button:hover {
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
.search-container {
  display: flex;
  align-items: center;
  gap: 5px;
  
}
.search-input {
  height: 36px;
  padding: 0 10px; /* 좌우만 패딩 */
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  vertical-align: middle;
  margin: 0; /* 여기 margin: 7px 제거!! */
  box-sizing: border-box;
}

</style>
