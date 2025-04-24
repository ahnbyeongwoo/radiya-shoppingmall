<template>
  <div class="main-container">
    <header class="main-header">
      <h1 class="shoppingmall-title">RADIYA</h1>
      <div class="auth-buttons">
        <!--검색창 영역-->
        <form @submit.prevent="searchPosts" class="search-container">
          <input type="text" v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
          <button type="submit" class="common-button">검색</button>
        </form>
        <!--검색, 로그인, 장바구니 영역-->
        <button v-if="!isLoggedIn" @click="goToLogin" class="common-button">로그인</button>
        <button v-else @click="logout" class="common-button">로그아웃</button>
        <button v-if="!isLoggedIn" @click="goToSignup" class="common-button">회원가입</button>
        <button @click="goToCart" class="common-button">장바구니</button>
      </div>
    </header>


    <ul class="categories">
      <li><button @click="goToCategory('/men')">Men</button></li>
      <li><button @click="goToCategory('/women')">Women</button></li>
      <li><button @click="goToCategory('/jewelery')">Jewelery</button></li>
      <li><button @click="goToCategory('/electronics')">Electronics</button></li>
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
      ],
      isLoggedIn: false,
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
    logout() {
      localStorage.removeItem('currentUser');
      this.isLoggedIn = false;
      alert('로그아웃 되었습니다.');
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
  },
  mounted(){
    const user= JSON.parse(localStorage.getItem('currentUser'));
    if(user){
      // this.userName=user.name;
      console.log("현재 로그인된 사용자",user);
    }
    this.isLoggedIn= !!localStorage.getItem('currentUser');//로그인 상태 확인
  }
}
</script>

<style scoped>
.main-container {/* 전체 컨테이너 */
  /* padding-top: 0px;  */
  /* header 고정 공간 확보 */
  background-color: #ffffff;
}
.main-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 40px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.shoppingmall-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.2em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;        /* 🔥 오른쪽으로 정렬 */
  min-width: 360px;
  white-space: nowrap;
}
.search-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-input {
  height: 36px;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

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
  list-style: none;
  padding: 5px 20px;
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  /* background-color: #f0f0f0; */
  border-radius: 8px;
  flex-wrap: wrap;
  justify-content: space-around;
}

.categories li button {
  padding: 10px 20px;
  font-size: 14px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
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
