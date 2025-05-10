<template>
  <div class="like-page">
    <router-link to="/" class="shoppingmall-title">RADIYA</router-link>
    <h2 class="fw-bold fs-4 ">좋아요 목록 페이지</h2>
    <ul v-if="likedProducts.length > 0" class="like-list">
      <li v-for="(item, index) in likedProducts" :key="index" class="like-item">
        <img :src="item.image" alt="item.name" width="100" />
        <div class="like-info">
          <p>{{ item.name }}</p>
          <p>{{ formatPrice(item.price) }}원</p>
        </div>
        <button class="btn btn-outline-danger" @click="removeFromLike(index)">삭제</button>
      </li>
    </ul>

    <div v-else>
      <p>좋아요한 상품이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LikePage",
  data() {
    return {
      likedProducts: [],
      currentUser: null,
    };
  },
  async mounted() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!this.currentUser) {
      alert("로그인이 필요합니다.");
      return this.$router.push("/login");
    }

    try {
      const res = await axios.get(`http://localhost:3000/like?user_email=${this.currentUser.email}`);
      const likedIds = res.data.map((item) => item.product_id);

      if (likedIds.length === 0) return;

      const productRes = await axios.get("http://localhost:3000/products");
      const allProducts = productRes.data;

      this.likedProducts = allProducts.filter((p) => likedIds.includes(p.id));
    } catch (err) {
      console.error("좋아요 상품 조회 실패:", err);
    }
  },
  methods: {
    formatPrice(dollar) {
      const won = dollar * 1300;
    return `${won.toLocaleString()}`;
    },
    async removeFromLike(index) {
      const product = this.likedProducts[index];
      try {
        // 좋아요 삭제 요청
        await axios.post("http://localhost:3000/likes", {
          product_id: product.id,
          user_email: this.currentUser.email,
        });

        // 로컬 리스트에서 제거
        this.likedProducts.splice(index, 1);
      } catch (err) {
        console.error("좋아요 삭제 실패:", err);
        alert("좋아요 삭제 중 오류가 발생했습니다.");
      }
    }
  }
};
</script>

<style scoped>
.like-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.shoppingmall-title {
  font-size: 32px;
  font-weight: bold;
  color: #4A90E2;
  text-decoration: none;
  margin-bottom: 20px;
}
.like-list {
  list-style: none;
  padding: 0;
}

.like-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.like-item img {
  width: 100px;
  height: auto;
  border-radius: 4px;
}

.like-info {
  flex: 1;
}

.like-info p {
  margin: 4px 0;
}
</style>
