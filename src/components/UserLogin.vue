<template><!--로그인-->
  <div class="container">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <div class="login-container">
      <h2>로그인</h2>
      <form @submit.prevent="submitForm" id="login-form">
        <div><!--이메일 란-->
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" placeholder="이메일을 입력하세요.">
        </div>
        <div><!--비밀번호 란-->
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" placeholder="비밀번호를 입력하세요.">
        </div>
        <div class="button-group">
          <button type="submit" class="login-button">로그인</button>
          <button type="button" class="signup-button" @click="goToSignUp">회원가입</button>
        </div>
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
      this.$router.push('/signup'); // 회원가입 페이지로 이동
    },
    login() {// 로그인 요청
      const loginData = {
        id: this.email,
        password: this.password,
      };

      axios.post('http://localhost:3000/login', loginData)
        .then(response => {
          alert(response.data.message);
          if (response.data.user) {// 로그인 성공 시 사용자 정보 저장
            console.log('로그인된 사용자:', response.data.user);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));// 로컬 스토리지에 사용자 정보 저장
            window.dispatchEvent(new Event('storage'));
            this.$router.push('/');
          }
        })
        .catch(error => {
          console.error('로그인 오류:', error);
          alert('로그인 실패! 아이디와 비밀번호를 확인하세요.');
        });
    }
  },
}

 </script>
 
 <style>
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

.login-container {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-container h2 {
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

.button-group {/*로그인 회원가입 버튼 그룹 */
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.login-button{
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

.login-button:hover{
  background-color: #357ABD;
}
.signup-button{
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

.signup-button:hover{
  background-color: #357ABD;
}


 </style>