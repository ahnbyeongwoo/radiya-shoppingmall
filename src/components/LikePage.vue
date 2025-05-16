<template>
  <div class="container py-4">
    <router-link
      to="/"
      class="d-flex align-items-center gap-2 mb-3 text-decoration-none fs-3 fw-bold text-primary"
      style="height: 60px;"
    >
      <img
        src="@/assets/wix.png"
        alt="Logo"
        class="logo me-2 logo-hover"
      />
    </router-link>
    <h2 class="fw-bold mt-2 ">좋아요 목록 페이지</h2>
    <ul v-if="likedProducts.length > 0" class="list-group mt-4">
      <li v-for="(item, index) in likedProducts" :key="index" 
      class="list-group-item d-flex align-items-center justify-content-between flex-wrap"> <!-- 좋아요한 각 상품 반복 렌더링 -->
      <div class="d-flex align-items-center gap-4">
          <img :src="item.image" alt="item.name" width="100" class="img-thumbnail" />
        <div>
          <h5 class="mb-1">{{ item.name }}</h5>
          <p class="text-primary fw-bold mb-2">{{ formatPrice(item.price) }}원</p>
        </div>
        </div>
        <button class="btn btn-outline-danger btn-sm" @click="removeFromLike(index)">삭제</button>
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
      likedProducts: [],// 좋아요한 상품 목록
      currentUser: null,// 현재 로그인 사용자
    };
  },
  async mounted() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));//현재 사용자 로그인 기준
    if (!this.currentUser) {
      alert("로그인이 필요합니다.");
      return this.$router.push("/login");
    }

    try {// 좋아요한 상품 목록 조회
      const res = await axios.get(`http://localhost:3000/like?user_email=${this.currentUser.email}`);
      const likedIds = res.data.map((item) => item.product_id);// 좋아요한 상품 ID 배열 추출

      if (likedIds.length === 0) return;

       // 전체 상품 목록 요청
      const productRes = await axios.get("http://localhost:3000/products");
      const allProducts = productRes.data;

      this.likedProducts = allProducts.filter((p) => likedIds.includes(p.id));// 좋아요한 상품 ID로 필터링
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
      const product = this.likedProducts[index];//좋아요 삭제할 상품 정보
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
.logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  margin-top: 12px; /* 살짝 밑으로 */
  transition: transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s, filter 0.3s;
}
.img-thumbnail {
  width: 90px;
  height: 90px;
  object-fit: contain;
  background: #fff;
  border: none;
  padding: 0;
}

.list-group-item {
  border-bottom: 1px solid #eee;
  background: #fff;
}
</style>
