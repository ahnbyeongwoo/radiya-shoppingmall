<template><!--결제 페이지-->
  <div class="container mt-5"><!--상단 마진-->
    <div class="row justify-content-center">
      <div class="col-md-8"><!-- 카드 스타일 박스와 그림자 -->
        <div class="card shadow-sm">
          <div class="card-body p-5">
            <h2 class="card-title text-center mb-4">
              결제수단
            </h2>
            <form @submit.prevent="handleSubmit"><!--결제 폼-->
              <div class="mb-4">
                <label for="company" class="form-label fs-5">카드사 선택</label>
                <select id="company" v-model="card.company" class="form-select form-select-lg" required>
                  <option value="">-- 카드사 선택 --</option>
                  <option value="shinhan">신한카드</option>
                  <option value="kb">국민카드</option>
                  <option value="samsung">삼성카드</option>
                  <option value="nonghyup">농협카드</option>
                  <option value="woori">우리카드</option>
                  <option value="kakaopay">카카오페이</option>
                  <option value="tosspay">토스페이</option>
                </select>
              </div>

              <div class="mb-4"><!--카드번호 입력칸-->
                <label for="number" class="form-label fs-5">카드번호</label>
                <input id="number" v-model="card.number" type="text" class="form-control form-control-lg" placeholder="1234-5678-9012-3456" required />
              </div>

              <div class="row">
                <div class="col-md-6 mb-4">
                  <label for="cvc" class="form-label fs-5">CVC</label>
                  <input id="cvc" v-model="card.cvc" type="text" class="form-control form-control-lg" placeholder="123" required />
                </div>
                <div class="col-md-6 mb-4">
                  <label for="password" class="form-label fs-5">결제 비밀번호</label>
                  <input id="password" v-model="card.password" type="password" class="form-control form-control-lg" placeholder="****" required />
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-lg w-100">결제</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    handleSubmit() {
      alert('결제가 완료되었습니다!');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>

</style>
