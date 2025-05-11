<template>
  <div v-if="product" class="container py-5 d-flex justify-content-center">
    <router-link to="/" class="text-decoration-none text-primary fs-3 fw-bold mb-3">RADIYA</router-link>
    <div class="card p-4 shadow" style="max-width: 400px; width: 100%;">
      <!-- 상품 이미지 -->
      <img
        :src="product.image"
        :alt="product.name"
        class="card-img-top mb-4"
        style="max-height: 400px; object-fit: contain;"
      />

      <!-- 상품 정보 -->
      <div class="card-body text-center">
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
    const id = this.$route.params.id;
    try {
      const res = await axios.get(`http://localhost:3000/products/${id}`);
      this.product = res.data;
    } catch (err) {
      this.error = '상품 정보를 불러오지 못했습니다.';
      console.error('상품 불러오기 실패:', err);
    }
  },
  methods: {
    addToCart(product) {
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
</style>
