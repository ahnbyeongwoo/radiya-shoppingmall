<template><!--상품 전체 페이지-->
  <div class="container"><!--views폴더와 컴포넌트의 상품 조회 리스트들은 ProductList.vue로 전달-->
    <router-link
      to="/"
      class="d-flex align-items-center gap-2 mb-3 text-decoration-none fs-3 fw-bold text-primary"
      style="height: 60px;"
    >
      <img
        src="@/assets/wix.png"
        alt="Logo"
        class="logo me-2 logo-hover"
      />
    </router-link>
    <h2 class="fw-bold fs-4 text-sm-center">전체 상품 목록</h2>
    <!-- 검색창 -->
    <div class="input-group rounded " style="width: 300px; margin-left: 15px"><!--검색, 장바구니 영역-->
          <input type="text" v-model="searchKeyword" class="form-control" placeholder="검색어를 입력하세요" aria-label="검색"
            aria-describedby="search-button" />
          <button @click="searchPosts" class="btn btn-outline-secondary" id="search-button">
            <i class="bi bi-search"></i>
          </button>
        </div>
    <!--상품 목록 그리드-->
    <div class="row g-4 p-3">
      <div class="col-6 col-md-4 col-lg-3" v-for="(product, index) in products" :key="index">
        <div class="card h-100 shadow-sm">
          <img :src="product.image" class="card-img-top p-3" :alt="product.name"
            style="height: 200px; object-fit: contain;">
          <div class="card-body d-flex flex-column justify-content-between">
            <h6 class="card-title">{{ product.name }}</h6>
            <p class="text-primary fw-bold">{{ formatPrice(product.price).toLocaleString() }}원</p>
            <div class="mt-auto d-flex justify-content-between">

              <button class="btn btn-sm btn-outline-secondary me-1" @click="goToDetail(product.id)">
                🔍
              </button>
              <button class="btn btn-sm btn-outline-success" @click="addToCart(product)">
                장바구니
              </button>
              <button class="btn btn-sm btn-outline-danger" @click.stop="toggleLike(product)">
                {{ product.liked ? '❤️' : '🤍' }} {{ product.likesCount || 0 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AllProducts',
  data() {
    return {
      products: [],
      searchKeyword: '',
    };
  },
  async mounted() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    try {// 전체 상품 목록 불러옴
      const res = await axios.get(`${process.env.VUE_APP_API_URL}/products`);
      //상품 객체에 liked와 likesCount 속성 추가
      const products = res.data.map(p => ({
        ...p,
        liked: false,
        likesCount: 0,
      }));
      //로그인 했으면 좋아요 상품 체크
      if (currentUser) {
        const likedRes = await axios.get(`${process.env.VUE_APP_API_URL}/like?user_email=${currentUser.email}`);
        const likedIds = likedRes.data.map(l => l.product_id);
        products.forEach(p => p.liked = likedIds.includes(p.id));
      }
      //모든 상품의 좋아요 개수 불러옴
      const countPromises = products.map(p =>
        axios.get(`${process.env.VUE_APP_API_URL}/likes/${p.id}`)
      );//좋아요 수 불러옴

      const counts = await Promise.allSettled(countPromises);
      counts.forEach((res, i) => {
        products[i].likesCount = res.status === 'fulfilled' ? res.value.data.likesCount : 0;
      });

      this.products = products;//최종적으로 products에 반영함
    } catch (err) {
      console.error('전체 상품 불러오기 실패:', err);
    }
  },
  methods: {
    formatPrice(dollar) {
      const won = dollar * 1300;
      return `${won.toLocaleString()}`;
    },
    addToCart(product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('장바구니에 추가되었습니다!');
    },
    async searchPosts() {//메인페이지와 같이 검색된 상품 목록 업데이트
      if (!this.searchKeyword.trim()) {
        alert("검색어를 입력해주세요.");
        return;
      }
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/products/search`, {
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
    toggleLike(product) {//좋아요 토글
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) return;

      axios.post(`${process.env.VUE_APP_API_URL}/likes`, {
        product_id: product.id,
        user_email: user.email,
      }).then(res => {
        const { liked, likesCount } = res.data;
        product.liked = liked;
        product.likesCount = likesCount;
      }).catch(err => {
        console.error('좋아요 실패:', err);
      });
    },
    goToDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
  }
};
</script>

<style scoped>
.card-title {
  font-size: 0.95rem;
  height: 2.8em;
  overflow: hidden;
}
.logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  margin-top: 12px; /* 살짝 밑으로 */
  transition: transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s, filter 0.3s;
}
</style>
