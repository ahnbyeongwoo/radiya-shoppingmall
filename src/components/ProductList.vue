<template><!--상품 리스트 페이지-->
<!--전체 상품 보기 전용 페이지, 목록만 담당하는 컴포넌트 역할-->
  <div class="product-list">
    <div v-for="item in products" :key="item.id" class="product-card">
      <img :src="`/images/${item.image}`" class="product-image" />
      <div class="product-info">
        <h3>{{ item.name }}</h3>
        <p>{{ item.price.toLocaleString() }} 원</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: {
    products: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.product-list {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px;
}

.product-card {
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 10px;
}
</style>