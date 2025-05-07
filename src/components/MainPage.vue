<template>
  <div class="main-container">
    <header class="main-header">
      <h1 class="shoppingmall-title">RADIYA</h1>
      <div class="auth-buttons">
        <!-- 검색창 영역 -->
        <form @submit.prevent="searchPosts" class="search-container">
          <input type="text" v-model="searchKeyword" placeholder="검색어를 입력하세요" class="search-input" />
          <button type="submit" class="common-button">검색</button>
        </form>

        <!-- 로그인, 장바구니, 좋아요 버튼 -->
        <button v-if="!isLoggedIn" @click="goToLogin" class="common-button">로그인</button>
        <button v-else @click="logout" class="common-button">로그아웃</button>
        <button v-if="!isLoggedIn" @click="goToSignup" class="common-button">회원가입</button>
        <button @click="goToCart" class="common-button">장바구니</button>
        <button @click="goToLike" class="common-button">좋아요</button>
      </div>
    </header>

    <ul class="categories">
      <li><button @click="goToCategory('/men')">남성 의류</button></li>
      <li><button @click="goToCategory('/women')">여성 의류</button></li>
      <li><button @click="goToCategory('/jewelery')">쥬얼리</button></li>
      <li><button @click="goToCategory('/electronics')">전자 제품</button></li>
    </ul>

    <section class="best-products">
      <h2>🔥 Best 상품</h2>
      <ProductList :products="products" />
      <router-link to="/products" class="view-all">+ 전체 상품 보기</router-link>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import ProductList from '@/components/ProductList.vue'


export default {
  name: 'MainShoppingmallPage',
  components: { ProductList },
  data() {
    return {
      products: [],
      isLoggedIn: true,
      searchKeyword: '',
    };
  },

  computed: {

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
    goToCategory(path) {
      this.$router.push(path);
    },
    goToCart() {
      this.$router.push('/cart');
    },
    goToLike() {
      this.$router.push('/like');
    },
    async searchPosts() {
      if (!this.searchKeyword.trim()) {
        alert("검색어를 입력해주세요.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/products/search", {
          params: { query: this.searchKeyword.trim() },
        });
        this.products = response.data.map(p => ({
          ...p,
          liked: false,
          likesCount: 0
        }));
      } catch (error) {
        console.error("검색 실패:", error.response?.data?.message || error.message);
        alert("검색 중 오류가 발생했습니다.");
      }
    },
    getRandomProducts(products, count) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
  },
  async mounted() {
    try {
      // 전체 상품 불러오기
      const productRes = await axios.get('http://localhost:3000/products');
      const productList = productRes.data;

      // 로그인한 사용자 정보 가져오기
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      // 로그인한 경우 -> 좋아요 정보 요청
      if (currentUser && currentUser.email) {
        const likeRes = await axios.get(
          `http://localhost:3000/like?user_email=${currentUser.email}`
        );

        //배열인지 확인하고 map 실행
        if (Array.isArray(likeRes.data)) {
          const likedProductIds = likeRes.data.map((item) => item.product_id);
          productList.forEach((product) => {
            product.liked = likedProductIds.includes(product.id);
          });
        } else {
          console.error("likeRes.data is not an array:", likeRes.data);
        }
      }

      // 전체 좋아요 수 가져오기 (로그인 여부 관계없이)
      const countPromises = productList.map((product) =>
        axios.get(`http://localhost:3000/likes/${product.id}`)
      );

      const likeCounts = await Promise.allSettled(countPromises);
      likeCounts.forEach((res, idx) => {
        if (res.status === "fulfilled") {
          productList[idx].likesCount = res.value.data.likesCount || 0;
        } else {
          productList[idx].likesCount = 0; // 실패한 경우 기본값
        }
      });

      this.products = this.getRandomProducts(productList, 10); // 랜덤으로 10개 상품만 표시
    } catch (err) {
      console.error('상품 또는 좋아요 조회 실패:', err);
    }

  }
}
</script>

<style scoped>
.main-container {
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
  margin-left: auto;
  padding: 6px 12px;
  background-color: #f1f1f1;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.auth-buttons:hover {
  background-color: #eaeaea;
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
  padding: 0 14px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  background-color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;
}

.common-button:hover {
  background-color: #4A90E2;
  color: white;
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

.view-all {
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
  padding: 0 10px;
  /* 좌우만 패딩 */
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  vertical-align: middle;
  margin: 0;
  /* 여기 margin: 7px 제거!! */
  box-sizing: border-box;
}
</style>
