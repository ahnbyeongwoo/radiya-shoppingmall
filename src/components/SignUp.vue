<template><!--회원가입-->
  <div class="container">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <div class="signup-container">
      <h2>회원가입</h2>
      <form @submit.prevent="submitForm" id="signup-form">
        <div><!--닉네임 란-->
          <label for="name">닉네임</label>
          <input type="text" id="name" v-model="name" placeholder="닉네임을 입력하세요.">
        </div><!--이메일 란-->
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" placeholder="이메일을 입력하세요.">
        <div><!--비밀번호 란-->
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" placeholder="비밀번호를 입력하세요.">
        </div>
        <div><!--비밀번호 확인 란-->
          <label for="passwordConfirm">비밀번호 확인</label>
          <input type="password" id="passwordConfirm" v-model="passwordConfirm" placeholder="비밀번호를 한번 더 입력하세요.">
        </div>
        <button type="submit" class="signUp-button">회원가입</button>
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
      email: '',
      name: '',
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

      axios.post('http://localhost:3000/signup', userData)// Axios로 서버에 POST 요청 보내기
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.shoppingmall-title {
  font-size: 32px;
  font-weight: bold;
  color: #4A90E2;
  text-decoration: none;
  margin-bottom: 20px;
}

.signup-container {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.signup-container h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

form label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #444;
}

form input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
}

form input:focus {
  border-color: #4A90E2;
  outline: none;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.4);
}

.signUp-button {
  width: 100%;
  padding: 12px;
  background-color: #4A90E2;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signUp-button:hover {
  background-color: #357ABD;
}
</style>
