<template><!--장바구니 페이지-->
  <div class='cart-page'>
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>장바구니</h2>
   

    <ul class="cart-list">
      <li v-for="(item, index) in cartItems" :key="index" class="cart-item">
        <img :src="item.image" alt="item.name" />
        <div class="cart-info">
         <p>{{ item.name }}</p>
         <p>{{ formatPrice(item.price) }}원</p>
        </div>
        <button class="btn btn-outline-danger" @click="removeFromCart(index)">삭제</button>
      </li>
    </ul>
    <div v-if="cartItems.length > 0" class='cart-summary'>
      <p><strong>수량: {{ count }} 개</strong></p>
      <p><strong>총 금액: {{ formatPrice(totalPrice) }}원</strong></p>
      <button @click="Payments(payment)">결제</button>
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
    Payments(){
      this.$router.push('/payment')
    },
    formatPrice(dollar) {
      const won = dollar * 1300;
    return `${won.toLocaleString()}`;
    },
    removeFromCart(index) {
      this.cartItems.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }
}
</script>

<style scoped>
.cart-page{
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

.cart-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.cart-item img {
  width: 100px;
  height: auto;
  border-radius: 4px;
}

.cart-info {
  flex: 1;
}

.cart-info p {
  margin: 4px 0;
}

.cart-summary {
  display: flex;
  gap: 100px;
  margin-top: 40px;
  text-align: center;
  justify-content: center;
}

.cart-summary p {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.cart-summary button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cart-summary button:hover {
  background-color: #357ABD;
}
</style>