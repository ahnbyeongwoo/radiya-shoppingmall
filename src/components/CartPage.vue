<template><!--장바구니 페이지-->
  <div class='cart-page'>
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>장바구니</h2>
    <div v-if='cartItems.length === 0'>장바구니가 비었습니다.</div>
    <ul v-else>
      <li v-for="(item, index) in cartItems" :key="index">
        <img :src="item.image" alt="item.name" width="80" />
        <p>{{ item.name }}</p>
        <p>{{ item.price }} $</p>
        <button @click="removeFromCart(index)">삭제</button>
      </li>
    </ul>
    <div v-if="cartItems.length > 0" class='totalPrice'>
      <p><strong>수량: {{ count }} 개</strong></p>
      <p><strong>총 금액: {{ totalPrice }} $</strong></p>
    </div>
  </div>
</template>

<script>
export default{
  name: 'CartPage',
  data(){
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
    removeFromCart(index) {
      this.cartItems.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
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
.totalPrice{
  display: flex;
  gap: 50px;
  margin: 20px;
  font-size: 20px;
  font-weight: bold;

}
</style>