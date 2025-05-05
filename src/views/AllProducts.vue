<template><!--전체 상품 목록 페이지-->
  <div class="all-products">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>전체 상품 목록</h2>
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.name" class="product-image" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price.toLocaleString() }}$</p>
        <!-- 좋아요 버튼 -->
      <button @click="toggleLike(product)" class="like-button">
        <span :class="{ liked: product.liked }">
          {{ product.liked ? '❤️' : '🤍' }}
        </span>
        {{ product.likesCount || 0 }} <!--좋아요 카운트-->
      </button>
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
  methods:{
    async toggleLike(product) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user.email) { return; }

      try {
        const response = await axios.post('http://localhost:3000/likes', {
          product_id: product.id,
          user_email: user.email,
        });
        // 서버 응답의 liked 값을 반영
        //  product.liked = response.data.liked;
        // 응답 메시지로 토글 판단
        const msg = response?.data?.message || "";
        if(typeof product.likesCount !== 'number') {
          product.likesCount = 0;
        }
        if (msg.includes("추가")) {
          product.liked = true;
          product.likesCount = (product.likesCount || 0) + 1;
        } else if (msg.includes("취소")) {
          product.liked = false;
          product.likesCount = Math.max((product.likesCount || 1) - 1, 0);
        }

      } catch (err) {
        console.error('좋아요 요청 실패:', err);
      }
    }
  },
  async mounted() {
  try {
    const response = await axios.get('http://localhost:3000/products');
    const products = response.data;

    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user && user.email) {
      // 각 상품에 대해 좋아요 상태 + 카운트 가져오기
      const statusPromises = products.map(product =>
        axios.get(`http://localhost:3000/likes/${product.id}?user_email=${user.email}`)
      );

      const results = await Promise.all(statusPromises);

      results.forEach((res, index) => {
        products[index].liked = res.data.isLiked;
        products[index].likesCount = res.data.likesCount;
      });
    } else {
      // 비로그인 사용자도 likesCount는 보여줄 수 있도록 처리
      const countPromises = products.map(product =>
        axios.get(`http://localhost:3000/likes/${product.id}`)
      );

      const results = await Promise.all(countPromises);

      results.forEach((res, index) => {
        products[index].likesCount = res.data.likesCount;
        products[index].liked = false; // 비로그인 시 liked 상태는 false
      });
    }

    this.products = products;
  } catch (error) {
    console.error("전체 상품 조회 실패:", error);
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
.like-button {
  margin-top: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}

.like-button span.liked {
  color: red;
}
</style>
