<template><!--회원가입 페이지-->
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow" style="max-width: 400px; width: 100%;">
      <router-link to="/" class="text-decoration-none text-primary fs-3 fw-bold text-center mb-3 d-block">
        RADIYA
      </router-link>

      <form class="signup-form" @submit.prevent="submitForm">
        <h2 class="signup-title">회원가입,</h2>

        <label for="name">닉네임</label><!--닉네임란-->
        <div class="form-group mb-4">
          <input
            type="text"
            v-model="name"
            class="form-control-line form-control"
            placeholder="name"
            autocomplete="off"
            required
          />
        </div>

        <label for="email">이메일</label><!--이메일란-->
        <div class="form-group mb-4">
          <input
            type="email"
            v-model="email"
            class="form-control-line form-control"
            placeholder="email"
            autocomplete="off"
            required
          />
        </div>

        <label for="password">비밀번호</label><!--비밀번호 란-->
        <div class="form-group mb-4">
          <input
            type="password"
            v-model="password"
            class="form-control-line form-control"
            placeholder="password"
            autocomplete="off"
            required
          />
        </div>

        <label for="passwordConfirm">비밀번호 확인</label><!--비밀번호 확인 란-->
        <div class="form-group mb-4">
          <input
            type="password"
            v-model="passwordConfirm"
            class="form-control-line form-control"
            placeholder="passwordConfirm"
            autocomplete="off"
            required
          />
        </div>
        <button type="submit" class="btn-signUp mb-3">회원가입</button>
      </form>
    </div>





  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    };
  },
  methods: {
    submitForm() {// 비밀번호 확인 검증
      if (this.password !== this.passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
        return;
      }
      const userData = {// 서버로 전송할 데이터 준비
        email: this.email,
        name: this.name,
        password: this.password,
      };

      axios.post(`${process.env.VUE_APP_API_URL}/signup`, userData)// Axios로 서버에 POST 요청 보내기
        .then((response) => {// 서버 응답이 성공일 경우 처리
          alert(response.data.message);
          this.$router.push('/'); // 메인 페이지로 이동
        })
        .catch((error) => {
          // 서버 응답이 실패일 경우 처리
          console.error('회원가입 오류:', error);
          alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        });
    },
  }

}

</script>

<style scoped>
.signup-bg {
  min-height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.signup-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.signup-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 36px;
  text-align: left;
  margin-top: 0;
  letter-spacing: -1px;
}
.form-control-line {
  border: none;
  border-bottom: 2px solid #bbb;
  border-radius: 0;
  padding: 14px 0 8px 0;
  font-size: 1rem;
  background: transparent;
  outline: none;
  color: #222;
  font-weight: 500;
  letter-spacing: 1px;
  box-shadow: none;
}
.form-control-line:focus {
  border-bottom: 2px solid #b39c6a;
  background: transparent;
  outline: none;
  box-shadow: none;
}
.form-control-line::placeholder {
  color: #ccc;
  font-weight: 500;
  letter-spacing: 1px;
}
.btn-signUp {
  width: 100%;
  background: #c6b288;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 13px 0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 18px;
  margin-top: 6px;
  cursor: pointer;
}
.btn-signUp:hover {
  background: #b39c6a;
}
</style>