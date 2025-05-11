<template>
  <div class="container py-4">
    <router-link to="/" class="text-decoration-none text-primary fs-3 fw-bold">RADIYA</router-link>
    <h2 class="fw-bold mt-2 ">좋아요 목록 페이지</h2>
    <ul v-if="likedProducts.length > 0" class="list-group mt-4">
      <li v-for="(item, index) in likedProducts" :key="index" 
      class="list-group-item d-flex align-items-center justify-content-between flex-wrap">
      <div class="d-flex align-items-center gap-4">
          <img :src="item.image" alt="item.name" width="100" class="img-thumbnail" />
        <div>
          <h5 class="mb-1">{{ item.name }}</h5>
          <p class="text-primary fw-bold mb-2">{{ formatPrice(item.price) }}원</p>
        </div>
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
img {
  object-fit: contain;
}

</style>
