<template>
  <div class="main-container">
    <h1 class="title">RADIYA</h1>
    <p>다양한 상품 이미지 출력</p>
    <ul class="categories">
      <li>
        <button onclick="top">상의</button>
      </li>
      <li>
        <button onclick="bottoms">하의</button>
      </li>
      <li>
        <button onclick="shoes">신발</button>
      </li>
      <li>
        <button onclick="bag">가방</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default{
  name: 'MainComponent',
  data() {
    return {
      // 여기에 필요한 데이터 추가
    };
  },
  methods: {
    // 여기에 필요한 메소드 추가
  },
  mounted() {
    // 컴포넌트가 마운트된 후 실행할 코드
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
}
.categories {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}
.title {
  font-size: 2em;
  color: #333;
  text-align: center;
  margin-top: 20px;
}
</style>