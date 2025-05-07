<!--상품 리스트 페이지-->
<!--전체 상품 보기 전용 페이지, 목록만 담당하는 컴포넌트 역할-->
<!--views폴더의 상품 조회 리스트들은 ProductList.vue로 전달-->
<template>
  <div class="product-grid">
    <div class="product-card" v-for="product in localProducts" :key="product.id">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <p class="product-name">{{ product.name }}</p>
      <p class="product-price">{{ product.price }}$</p>

      <button @click.stop="goToDetail(product.id)" class="detail-button">🔍</button>
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
  data() {
    return {
      localProducts: []
    };
  },
  methods: {
    addToCart(product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('장바구니에 추가되었습니다!');
    },
    goToDetail(productId){
      this.$router.push(`/product/${productId}`);
    },
    async toggleLike(product) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user.email) return;

      try {
        const response = await axios.post('http://localhost:3000/likes', {
          product_id: product.id,
          user_email: user.email,
        });

        const msg = response?.data?.message || "";
        if (typeof product.likesCount !== 'number') product.likesCount = 0;

        if (msg.includes("추가")) {
          product.liked = true;
          product.likesCount += 1;
        } else if (msg.includes("취소")) {
          product.liked = false;
          product.likesCount = Math.max(product.likesCount - 1, 0);
        }

      } catch (err) {
        console.error('좋아요 요청 실패:', err);
      }
    }
  },
  async mounted() {
    // props.products를 로컬로 복제
    this.localProducts = this.products.map(p => ({ ...p }));

    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));

      if (user && user.email) {
        const likeStatusPromises = this.localProducts.map(product =>
          axios.get(`http://localhost:3000/likes/${product.id}?user_email=${user.email}`)
        );
        const responses = await Promise.all(likeStatusPromises);

        responses.forEach((res, index) => {
          this.localProducts[index].liked = res.data.isLiked;
          this.localProducts[index].likesCount = res.data.likesCount;
        });

      } else {
        const countPromises = this.localProducts.map(product =>
          axios.get(`http://localhost:3000/likes/${product.id}`)
        );
        const responses = await Promise.all(countPromises);

        responses.forEach((res, index) => {
          this.localProducts[index].liked = false;
          this.localProducts[index].likesCount = res.data.likesCount;
        });
      }
    } catch (err) {
      console.error("좋아요 상태 조회 실패:", err);
    }
    // console.log("최종 productList 상태:", this.products);

  },
  watch: {
  products: {
    immediate: true,
    handler(newProducts) {
      this.localProducts = newProducts.map(p => ({ ...p }));
    }
  }
}

};
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
.detail-button {
  margin-top: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}

</style>