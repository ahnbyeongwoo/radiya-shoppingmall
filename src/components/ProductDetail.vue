<template>
  <div v-if="product" class="product-detail">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>{{ product.name }}</h2>
    <img :src="product.image" :alt="product.name" class="product-image" />
    <p><strong>가격:</strong> ${{ product.price }}</p>
    <p><strong>카테고리:</strong> {{ product.category }}</p>
    <p><strong>설명:</strong> {{ product.description }}</p>
    <button class="btn btn-sm btn-outline-success" @click="addToCart(product)">장바구니에 담기</button>
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
  methods:{
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
.product-detail {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
.product-image {
  width: 100%;
  max-width: 300px;
  margin: 20px auto;
}
.shoppingmall-title {
  font-size: 32px;
  font-weight: bold;
  color: #4A90E2;
  text-decoration: none;
  margin-bottom: 20px;
}
</style>