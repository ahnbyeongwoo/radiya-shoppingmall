<template>
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow" style="max-width: 400px; width: 100%;">
      <router-link to="/" class="text-decoration-none text-primary fs-3 fw-bold text-center mb-3 d-block">
        RADIYA
      </router-link>

      <form class="login-form" @submit.prevent="login"><!--로그인 폼-->
        <h2 class="login-title">로그인,</h2>

        <div class="form-group mb-4"><!--이메일 란-->
          <input
            type="email"
            v-model="email"
            class="form-control-line form-control"
            placeholder="EMAIL"
            autocomplete="off"
            required
          />
        </div>

        <div class="form-group mb-4"><!--비밀번호 란-->
          <input
            type="password"
            v-model="password"
            class="form-control-line form-control"
            placeholder="PASSWORD"
            autocomplete="off"
            required
          />
        </div>

        <button type="submit" class="btn-signin mb-3">로그인</button>
        <button type="button" class="btn-signin mb-3" @click="goToSignUp">회원가입</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    goToSignUp() {
      this.$router.push('/signup');
    },
    login() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      axios.post('http://localhost:3000/login', loginData)
        .then(response => {
          alert(response.data.message);
          if (response.data.user) { // 로그인 성공 시 사용자 정보 저장 및 홈으로 이동
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('storage'));
            this.$router.push('/');
          }
        })
        .catch(error => {
          console.error('로그인 오류:', error);
          alert('로그인 실패! 아이디와 비밀번호를 확인하세요.');
        });
    }
  }
}
</script>

<style scoped>
.login-bg {/* 로그인 전체 배경 */
  min-height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {/*로그인 폼 */
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.login-title {
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
.btn-signin {
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
.btn-signin:hover {
  background: #b39c6a;
}
</style>
