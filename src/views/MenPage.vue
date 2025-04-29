<template>
  <div class="men-page">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>남성 의류</h2>
    <div v-if="products.length === 0">상품이 없습니다.</div>
    <ul>
  <li v-for="product in products" :key="product.id">
    <img :src="product.image" :alt="product.name" width="100" />
    <p>{{ product.name }}</p>
    <p>{{ product.price }}원</p>
  </li>
</ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MenPage',
  data() {
    return {
      products: []
    };
  },
  async mounted() {
    try {
      const response = await axios.get(
        `http://localhost:3000/products/category/${encodeURIComponent('men clothing')}`
      );
      this.products = response.data;
    } catch (error) {
      console.error('남성 의류 상품 조회 실패:', error);
    }
  },


}
</script>

<style scoped>
.men-page {
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
