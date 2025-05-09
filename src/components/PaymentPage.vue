<template>
  <div class="payment-container">
    <h2>결제하기</h2>
    <form @submit.prevent="handleSubmit" class="payment-form">
    <label> 카드사 선택:
      <select v-model="card.company">
        <option value="shinhan">신한카드</option>
        <option value="kb">국민카드</option>
        <option value="samsung">삼성카드</option>
        <option value="nonghyup">농협카드</option>
        <option value="woori">우리카드</option>
        <option value="kakaopay">카카오페이</option>
        <option value="tosspay">토스페이</option>
      </select>
    </label>
    <label>
        카드번호:
        <input v-model="card.number" type="text" placeholder="1234-5678-9012-3456" required />
      </label>

      <label>
        CVC:
        <input v-model="card.cvc" type="text" placeholder="123" required />
      </label>

      <label>
        결제 비밀번호:
        <input v-model="card.password" type="password" placeholder="****" required />
      </label>

      <button @click="submitEvent" class="payment-button">결제</button>
    </form>
  </div>
</template>

<script>
export default{
  name: 'PaymentPage',
  data() {
    return {
      card: {
        company: '',
        number: '',
        cvc: '',
        password: ''
      },
    };
  },
  methods: {
    submitEvent() {
      alert('결제가 완료되었습니다!');
      this.$router.push('/');
    },

  }
}
</script>

<style scoped>
.payment-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
label {
  display: block;
  margin-bottom: 15px;
}
input, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}
button {
  width: 100%;
  padding: 10px;
  font-weight: bold;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 5px;
}
.payment-button {
  flex: 1;
  padding: 12px;
  background-color: #4A90E2;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
} 
.payment-button:hover{
  background-color: #357ABD;
}
</style>