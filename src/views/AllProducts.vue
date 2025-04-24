<template><!--전체 상품 목록 페이지-->
  <div class="all-products">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>전체 상품 목록</h2>
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.name" class="product-image" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price.toLocaleString() }}원</p>
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
      products: []
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/products');
      this.products = response.data;
    } catch (error) {
      console.error('전체 상품 조회 실패:', error);
    }
  }
}
</script>

<style scoped>
.shoppingmall-title {
  font-size: 32px;
  font-weight: bold;
  color: #4A90E2;
  text-decoration: none;
  margin-bottom: 20px;
}
.all-products {
  padding: 40px;
}
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.product-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
.product-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>
