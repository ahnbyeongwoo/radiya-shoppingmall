<template>
  <div class="main-container">
    <header class="d-flex justify-content-between align-items-center bg-light px-4 py-3 shadow-sm">
      <h1 class="m-0 text-center flex-grow-1">RADIYA</h1>

      <form @submit.prevent="searchPosts" class="d-flex align-items-center gap-2 me-4" role="search">
        <input v-model="searchKeyword" type="text" class="form-control" placeholder="검색어 입력" />
        <button type="submit" class="btn btn-outline-primary">검색</button>
      </form>


      <div class="d-flex gap-2">
        <button v-if="!isLoggedIn" class="btn btn-outline-primary me-2" @click="goToLogin">로그인</button>
        <button v-else class="btn btn-outline-secondary" @click="logout">로그아웃</button>
        <button v-if="!isLoggedIn" class="btn btn-outline-secondary" @click="goToSignup">회원가입</button>
        <button class="btn btn-outline-dark position-relative" @click="goToCart">🛒</button>
        <button class="btn btn-outline-danger btn-sm" @click="goToLike">좋아요</button>
      </div>
    </header>


    <ul class="nav justify-content-center my-4 flex-wrap gap-2">
      <li><button class="btn btn-outline-primary" @click="goToCategory('/men')">남성 의류</button></li>
      <li><button class="btn btn-outline-primary" @click="goToCategory('/women')">여성 의류</button></li>
      <li><button class="btn btn-outline-primary" @click="goToCategory('/jewelery')">쥬얼리</button></li>
      <li><button class="btn btn-outline-primary" @click="goToCategory('/electronics')">전자 제품</button></li>
    </ul>


    <section class="best-products">
      <h2>🔥 Best 상품</h2>
      <ProductList :products="products" />
      <router-link to="/products" class="d-block text-end me-4 mt-3 text-decoration-none text-primary fw-bold">
        + 전체 상품 보기
      </router-link>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import ProductList from '@/components/ProductList.vue'
import 'bootstrap/dist/css/bootstrap.min.css'

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
      console.log("검색어:", this.searchKeyword);
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
</style>
