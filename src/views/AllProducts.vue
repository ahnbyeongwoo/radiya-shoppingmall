<template>
  <div class="container">
    <router-link to="/" class="btn btn-link text-decoration-none fs-3 fw-bold text-primary">RADIYA</router-link>
    <h2 class="fw-bold fs-4 text-sm-center">전체 상품 목록</h2>
    <!-- 검색창 -->
    <div class="input-group rounded" style="width: 300px;">
          <input type="text" v-model="searchKeyword" class="form-control" placeholder="검색어를 입력하세요" aria-label="검색"
            aria-describedby="search-button" />
          <button @click="searchPosts" class="btn btn-outline-secondary" id="search-button">
            <i class="bi bi-search"></i>
          </button>
        </div>

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

    try {
      const res = await axios.get('http://localhost:3000/products');
      const products = res.data.map(p => ({
        ...p,
        liked: false,
        likesCount: 0,
      }));

      if (currentUser) {
        const likedRes = await axios.get(`http://localhost:3000/like?user_email=${currentUser.email}`);
        const likedIds = likedRes.data.map(l => l.product_id);
        products.forEach(p => p.liked = likedIds.includes(p.id));
      }

      const countPromises = products.map(p =>
        axios.get(`http://localhost:3000/likes/${p.id}`)
      );

      const counts = await Promise.allSettled(countPromises);
      counts.forEach((res, i) => {
        products[i].likesCount = res.status === 'fulfilled' ? res.value.data.likesCount : 0;
      });

      this.products = products;
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
    toggleLike(product) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) return;

      axios.post('http://localhost:3000/likes', {
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
    }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 0.95rem;
  height: 2.8em;
  overflow: hidden;
}
</style>
