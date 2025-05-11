<template>
  <router-link to="/" class="text-decoration-none text-primary fs-3 fw-bold mb-3">RADIYA</router-link>
  <div class="login-bg">
    <form class="login-form" @submit.prevent="login">
      <h2 class="login-title">로그인,</h2>
      <div class="form-group mb-4">
        <input
          type="email"
          v-model="email"
          class="form-control-line"
          placeholder="EMAIL"
          autocomplete="off"
        />
      </div>
      <div class="form-group mb-4">
        <input
          type="password"
          v-model="password"
          class="form-control-line"
          placeholder="PASSWORD"
          autocomplete="off"
        />
      </div>
      <button type="submit" class="btn-signin mb-3">SIGN IN</button>
      <button type="submit" class="btn-signin mb-3" @click="goToSignUp">회원가입</button>

    </form>
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
      this.$router.push('/signup'); // 회원가입 페이지로 이동
    },

    login() {
      const loginData = {
        email: this.email,
        password: this.password,
      };

      axios.post('http://localhost:3000/login', loginData)
        .then(response => {
          alert(response.data.message);
          if (response.data.user) {
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
.login-bg {
  min-height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 340px;
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
.forgot-row {
  margin-top: -12px;
  margin-bottom: 28px;
}
.forgot-password {
  color: #bbb;
  font-size: 0.95rem;
  cursor: pointer;
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
  transition: background 0.2s;
}
.btn-signin:hover {
  background: #b39c6a;
}
.btn-facebook {
  width: 100%;
  background: transparent;
  color: #555;
  border: 2px solid #e2e2e2;
  border-radius: 25px;
  padding: 13px 0;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: border 0.2s;
}
.btn-facebook:hover {
  border: 2px solid #aab8d9;
}
.facebook-text {
  color: #3b5998;
  font-weight: 600;
}
</style>
