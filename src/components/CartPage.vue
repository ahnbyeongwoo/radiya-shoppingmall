<template>
  <div class="container py-4">
    <router-link to="/" class="text-decoration-none text-primary fs-3 fw-bold">RADIYA</router-link>
    <h2 class="fw-bold mt-2">🛒 장바구니</h2>
    <div v-if="cartItems.length === 0" class="mt-4 fs-5 text-muted">장바구니가 비었습니다.</div>
    <ul v-else class="list-group mt-4">
      <li v-for="(item, index) in cartItems" :key="index"
        class="list-group-item d-flex align-items-center justify-content-between flex-wrap">
        <div class="d-flex align-items-center gap-4">
          <img :src="item.image" alt="item.name" width="100" class="img-thumbnail" />
          <div>
            <h5 class="mb-1">{{ item.name }}</h5>
            <p class="text-primary fw-bold mb-2">{{ formatPrice(item.price).toLocaleString() }}원</p>
          </div>
        </div>
        <button class="btn btn-outline-danger" @click="removeFromCart(index)">삭제</button>
      </li>
    </ul>
    <div v-if="cartItems.length > 0" class="d-flex flex-column align-items-center mt-4">
      <div class="d-flex gap-5 fs-5 mb-3">
        <p>총 수량: <strong>{{ count }}</strong>개</p>
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
      cartItems: [],
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + item.price, 0);
    },
    count() {
      return this.cartItems.length;
    }
  },
  mounted() {
    const storedCart = localStorage.getItem('cart');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];
  },
  methods: {
    formatPrice(dollar) {
      const won = dollar * 1300;
      return `${won.toLocaleString()}`;
    },
    removeFromCart(index) {
      this.cartItems.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
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
</style>
