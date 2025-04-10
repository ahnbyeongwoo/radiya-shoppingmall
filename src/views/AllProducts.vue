<template><!--/products 라우터용 컴포넌트, 전체 상품-->
<!--전체 상품 페이지, 실제 상품 데이터(배열)를 가지고 ProductList에 넘기는 페이지 컴포넌트--->
  <div>
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>전체 상품</h2>
    <ProductList :products="allProducts" />
  </div>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import AllProducts from '@/data/products.js'
export default {
  name: 'AllProducts',
  components: { ProductList },
  data() {
    return {
      allProducts: AllProducts,
      // allProducts: [
      //   { id: 1, name: '화이트 셔츠', price: 32000, image: 'shirt.jpg' },
      //   { id: 2, name: '블랙 팬츠', price: 41000, image: 'pants.jpg' },
      //   { id: 3, name: '운동화', price: 55000, image: 'shoes.jpg' },
      //   { id: 4, name: '청바지', price: 46000, image: 'jeans.jpg' },
      //   { id: 5, name: '코트', price: 88000, image: 'coat.jpg' }
      // ]
    };
  }
}
</script>

<style scoped>
.shoppingmall-title {
  font-size: 32px;
  font-weight: bold;
  color: #4A90E2;
  text-decoration: none;
  margin-bottom: 20px;
  position: absolute;
  left: 45%;
}
</style>
