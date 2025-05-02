<!--상품 리스트 페이지-->
<!--전체 상품 보기 전용 페이지, 목록만 담당하는 컴포넌트 역할-->
<!--views폴더의 상품 조회 리스트들은 ProductList.vue로 전달-->
<template>
  <div class="product-grid">
    <div class="product-card" v-for="product in products" :key="product.id">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <p class="product-name">{{ product.name }}</p>
      <p class="product-price">{{ product.price }}$</p>

      <button @click="addToCart(product)">장바구니 추가</button>

      <!-- 좋아요 버튼 -->
      <button @click="toggleLike(product)" class="like-button">
        <span :class="{ liked: product.liked }">
          {{ product.liked ? '❤️' : '🤍' }}
        </span>
        {{ product.likesCount || 0 }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductList',
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  methods: {
    addToCart(product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('장바구니에 추가되었습니다!');
    },

    async toggleLike(product) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user.email) { return; }

      try {
        const response = await axios.post('http://localhost:3000/likes', {
          product_id: product.id,
          user_email: user.email,
        });
        // 서버 응답의 liked 값을 반영
         product.liked = response.data.liked;
        // 응답 메시지로 토글 판단
        const msg = response?.data?.message || "";

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
  }
}
</script>

<style scoped>
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 20px;
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

.product-name {
  font-weight: bold;
  margin-top: 10px;
}

.product-price {
  margin-top: 6px;
  font-size: 1.5em;
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


<style scoped>
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 20px;
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

.product-name {
  font-weight: bold;
  margin-top: 10px;
}

.product-price {
  /* color: #4A90E2; */
  margin-top: 6px;
  font-size: 1.5em;
}
</style>
