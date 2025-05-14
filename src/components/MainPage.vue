<template>
  <div class="container-fluid px-5">
    <!-- 최상단 타이틀 및 우측 버튼 -->
    <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
      <h1 class="fw-bold fs-3 text-primary d-flex align-items-center mb-0">
        <img src="@/assets/logotitle.png" alt="Logo" class="logo me-2" />
        RADIYA
      </h1>
      <div class="category-nav d-flex justify-content-center gap-4 my-4"><!--검색, 장바구니, 좋아요 영역-->
        <!-- 검색창 -->
        <div class="input-group rounded" style="width: 300px;">
          <input type="text" v-model="searchKeyword" class="form-control" placeholder="검색어를 입력하세요" aria-label="검색"
            aria-describedby="search-button" />
          <button @click="searchPosts" class="btn btn-outline-secondary" id="search-button">
            <i class="bi bi-search"></i>
          </button>
        </div>

        <button @click="goToCart" class="btn btn-outline-dark">🛒</button>
        <button @click="goToLike" class="btn btn-outline-danger">❤️</button>
      </div>
    </div>

    <!-- 회원가입/로그인 -->
    <div class="d-flex justify-content-end mt-2 gap-2 mb-4">
      <button v-if="!isLoggedIn" class="btn btn-outline-primary btn-sm" @click="goToLogin">로그인</button>
      <button v-if="!isLoggedIn" class="btn btn-outline-secondary btn-sm" @click="goToSignup">회원가입</button>
      <button v-else class="btn btn-outline-secondary btn-sm" @click="logout">로그아웃</button>
    </div>

    <!-- 카테고리 -->
    <div class="d-flex gap-4 mb-4">
      <button class="category-btn" @click="goToCategory('/men')">mens</button>
      <button class="category-btn" @click="goToCategory('/women')">womens</button>
      <button class="category-btn" @click="goToCategory('/jewelery')">jewelery</button>
      <button class="category-btn" @click="goToCategory('/electronics')">electronics</button>
    </div>

    <!-- Week Best 상품 -->
    <section class="best-products">
      <h2 class="fw-bold text-sm-center fs-4">WEEK BEST</h2>
      <ProductList :products="products" /><!--상품 목록 리스트 productlist-->
      <router-link to="/products" class="d-block text-end mt-3 text-decoration-none text-primary fw-bold">
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
      isLoggedIn: true,//로그인 여부
      searchKeyword: '',
    };
  },
  methods: {
    goToLogin() {//로그인
      this.$router.push('/login');
    },
    logout() {//로그아웃
      localStorage.removeItem('currentUser');
      this.isLoggedIn = false;
      alert('로그아웃 되었습니다.');
    },
    goToSignup() {//회원가입
      this.$router.push('/signup');
    },
    goToCategory(path) {//카테고리
      this.$router.push(path);
    },
    goToCart() {//장바구니
      this.$router.push('/cart');
    },
    goToLike() {//좋아요
      this.$router.push('/like');
    },
    async searchPosts() {//검색
      if (!this.searchKeyword.trim()) {
        alert("검색어를 입력해주세요.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/products/search", {
          params: { query: this.searchKeyword.trim() },
        });
        this.products = response.data.map(p => ({// // 검색 결과에 좋아요 관련 필드 기본값 추가
          ...p,
          liked: false,
          likesCount: 0
        }));
      } catch (error) {
        console.error("검색 실패:", error.response?.data?.message || error.message);
        alert("검색 중 오류가 발생했습니다.");
      }
    },
    getRandomProducts(products, count) {//상품 배열에서 무작위 10개 추출
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
  },
  async mounted() {
    try {
      const productRes = await axios.get('http://localhost:3000/products');// 전체 상품 조회
      const productList = productRes.data;

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));// 로그인 사용자 정보 확인

      if (currentUser && currentUser.email) {// 로그인한 경우 -> 좋아요 정보 요청
        const likeRes = await axios.get(// 좋아요 정보 axios 요청
          `http://localhost:3000/like?user_email=${currentUser.email}`
        );

        if (Array.isArray(likeRes.data)) {//배열인지 확인하고 좋아요 상품 id 추출
          const likedProductIds = likeRes.data.map((item) => item.product_id);
          productList.forEach((product) => {// 상품 데이터에 liked 속성 추가
            product.liked = likedProductIds.includes(product.id);
          });
        } else {
          console.error("likeRes.data is not an array:", likeRes.data);
        }
      }
      //상품별 좋아요 개수 요청
      const countPromises = productList.map((product) =>
        axios.get(`http://localhost:3000/likes/${product.id}`)
      );

      const likeCounts = await Promise.allSettled(countPromises);// 모든 좋아요 개수 요청 처리
      likeCounts.forEach((res, idx) => {
        if (res.status === "fulfilled") {
          productList[idx].likesCount = res.value.data.likesCount || 0;
        } else {
          productList[idx].likesCount = 0;
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
.logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  display: inline-block;
}

.category-bar {
  justify-content: center;
}

.category-btn {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  color: #222;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 20px;
  /* transition: color 0.2s, background 0.2s; */
  cursor: pointer;
}

.category-btn:hover,
.category-btn:focus {
  color: #1976d2;
  background: #f3f6fa;
  outline: none;
}

.category-nav { 
  margin-bottom: 2rem; /* 중앙 정렬, 충분한 간격 */
}

.category-link {
  border: none;
  background: none;
  color: #222;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 2px 18px 4px 18px;
  border-radius: 0;
  transition: color 0.18s;
  letter-spacing: 0.04em;
  cursor: pointer;
  outline: none;
}

.category-link:hover,
.category-link:focus {
  color: #1976d2;
  background: none;
  text-decoration: underline;
  outline: none;
}
</style>
