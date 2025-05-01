<template><!--좋아요 페이지-->
  <div class="like-page">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>좋아요 목록 페이지</h2>
    <div v-if="likedProducts && likedProducts.length === 0">좋아요한 상품이 없습니다.</div>
    <ul v-else>
      <li v-for="product in likedProducts" :key="product.id">
    <img :src="product.image" alt="product.name" width="100" />
    <p>{{ product.name }}</p>
    <p>{{ product.price }}$</p>
  </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LikePage',
  data() {
    return {
      likedProducts: [],
    };
  },
  async mounted() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      alert("로그인이 필요합니다.");
      this.likedProducts = [];
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/likes/${user.email}`);
      this.likedProducts = response.data;
    } catch (error) {
      console.error("좋아요 상품 조회 실패:", error);
      this.likedProducts = [];
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
</style>