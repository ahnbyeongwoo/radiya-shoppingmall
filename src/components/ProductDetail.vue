<template>
  <div class="container py-4">
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
  </div>
 
  <div v-if="product" class="container py-4 d-flex justify-content-center">
    <div class="card p-4 shadow mt-4" style="max-width: 400px; width: 100%;"><!--상품 카드-->
      <img :src="product.image" :alt="product.name" class="card-img-top mb-4" style="max-height: 400px; object-fit: contain;" />

      <div class="card-body text-center"><!--상품 정보-->
        <h4 class="fw-bold mb-3">{{ product.name }}</h4>
        <p class="fs-5 mb-1"><strong>가격:</strong> ${{ product.price }}</p>
        <p class="fs-6 mb-1"><strong>카테고리:</strong> {{ product.category }}</p>
        <p class="fs-6 text-start mb-4">
          <strong>설명:</strong> {{ product.description }}
        </p>
        <button class="btn btn-success w-100" @click="addToCart(product)">
          🛒 장바구니 추가
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
      error: null
    };
  },
  async mounted() {
    const id = this.$route.params.id;// URL에서 상품 ID 가져오기
    try {
      const res = await axios.get(`http://localhost:3000/products/${id}`);// 상품 ID로 상품 정보 요청
      this.product = res.data;
    } catch (err) {
      this.error = '상품 정보를 불러오지 못했습니다.';
      console.error('상품 불러오기 실패:', err);
    }
  },
  methods: {
    addToCart(product) {//장바구니 메서드
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('장바구니에 추가되었습니다!');
    }
  }
};
</script>

<style scoped>
.card-img-top {
  border-radius: 12px;
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
