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
    <h2 class="fw-bold mt-2">🛒 장바구니</h2>

    <div v-if="cartItems.length === 0" class="mt-4 fs-5 text-muted">장바구니가 비었습니다.</div>
    <ul v-else class="list-group mt-4">
      <li v-for="(item, index) in cartItems" :key="index" class="list-group-item d-flex align-items-center justify-content-between flex-wrap"><!-- 장바구니에 담긴 각 아이템을 반복 출력 -->
        <div class="d-flex align-items-center gap-4"><!-- 상품 이미지와 정보 -->
          <img :src="item.image" alt="item.name" width="100" class="img-thumbnail" />
          <div>
            <h5 class="mb-1">{{ item.name }}</h5>
            <p class="text-primary fw-bold mb-2">{{ formatPrice(item.price).toLocaleString() }}원</p>
          </div>
        </div>
        <button class="btn btn-outline-danger btn-sm" @click="removeFromCart(index)">삭제</button>
      </li>
    </ul>

    <div v-if="cartItems.length > 0" class="d-flex flex-column align-items-center mt-4"><!-- 장바구니에 상품이 있을 경우 총 금액 및 결제 버튼 표시 -->
      <div class="d-flex gap-5 fs-5 mb-3">
        <p>총 수량: <strong>{{ totalcount }}</strong>개</p>
        <p>총 금액: <strong>{{ formatPrice(totalPrice).toLocaleString() }}</strong>원</p>
      <button class="btn btn-primary px-5" @click="Payments(payment)">결제하기</button>
    </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartPage',
  data() {
    return {
      cartItems: [],//장바구니에 상품 정보 저장하는 배열임
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + item.price, 0);
    },
    totalcount() {
      return this.cartItems.length;//상품 개수 배열로 카운트하여 계산
    }
  },
  mounted() {
    const storedCart = localStorage.getItem('cart');//장바구니에 담긴 상품 정보가 로컬 스토리지에 저장되어 있는지 확인
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];//로컬 스토리지에 있다면 cartItems에 저장
  },
  methods: {
    formatPrice(dollar) {//달러를 원화로 변환시킴
      const won = dollar * 1300;
      return `${won.toLocaleString()}`;
    },
    removeFromCart(index) {
      this.cartItems.splice(index, 1);//배열에서 해당 인덱스(상품) 제거
      localStorage.setItem('cart', JSON.stringify(this.cartItems));//제거하면 로컬 스토리지에 다시 저장
    },
    Payments() {
      this.$router.push('/payment');
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
.img-thumbnail {/* 장바구니 안의 상품 이미지 썸네일 스타일 */
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
