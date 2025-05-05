<template>
  <div class="men-page">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>남성 의류</h2>
    <div v-if="products.length === 0">상품이 없습니다.</div>

    <!-- 드롭다운 정렬 메뉴 -->
    <div class="dropdown" @click="toggleDropdown">
      <button class="dropdown-toggle">
        {{ selectedSortLabel }} <span :class="{ rotate: showDropdown }">▴</span>
      </button>
      <ul v-if="showDropdown" class="dropdown-menu">
        <li v-for="option in sortOptions" :key="option.value" :class="{ active: sortOrder === option.value }"
          @click.stop="sortBy(option.value)">
          {{ option.label }}
        </li>
      </ul>
    </div>

    <!-- 정렬된 상품 출력 -->
    <ProductList :products="sortedProducts" />
  </div>
</template>

<script>
import axios from 'axios';
import ProductList from '@/components/ProductList.vue';

export default {
  name: 'MenPage',
  components: {
    ProductList
  },
  data() {
    return {
      products: [],
      sortOrder: 'high',
      showDropdown: false,
      sortOptions: [
        { value: 'random', label: '랜덤순' },
        { value: 'high', label: '높은 가격순' },
        { value: 'low', label: '낮은 가격순' },
      ]
    };
  },
  computed: {
    selectedSortLabel() {
      const found = this.sortOptions.find(opt => opt.value === this.sortOrder);
      return found ? found.label : '정렬';
    },
    sortedProducts() {
      if (this.sortOrder === 'low') {
        return [...this.products].sort((a, b) => a.price - b.price);
      } else if (this.sortOrder === 'high') {
        return [...this.products].sort((a, b) => b.price - a.price);
      } else if (this.sortOrder === 'random') {
        return [...this.products].sort(() => Math.random() - 0.5);
      }
      return this.products;
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    sortBy(order) {
      this.sortOrder = order;
      this.showDropdown = false;
    }
  },
  async mounted() {
    try {
      // 1. 상품 불러오기
      const response = await axios.get(
        `http://localhost:3000/products/category/${encodeURIComponent('men clothing')}`
      );
      const productList = response.data;

      // 2. 로그인된 사용자 정보 확인
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      // 3. 로그인된 경우 → 좋아요 상태 정보 불러오기
      if (currentUser && currentUser.email) {
        const likeRes = await axios.get(
          `http://localhost:3000/like?user_email=${currentUser.email}`
        );

        if (Array.isArray(likeRes.data)) {
          const likedProductIds = likeRes.data.map((item) => item.product_id);
          productList.forEach((product) => {
            product.liked = likedProductIds.includes(product.id);
          });
        }
      }

      // 4. 모든 상품의 좋아요 수 불러오기
      const countPromises = productList.map((product) =>
        axios.get(`http://localhost:3000/likes/${product.id}`)
      );
      const likeCounts = await Promise.allSettled(countPromises);

      likeCounts.forEach((res, idx) => {
        if (res.status === "fulfilled") {
          productList[idx].likesCount = res.value.data.likesCount || 0;
        } else {
          productList[idx].likesCount = 0;
        }
      });

      // 5. 반영된 상품 목록 저장
      this.products = productList;

    } catch (error) {
      console.error('남성 의류 상품 조회 실패:', error);
    }
  }

}
</script>

<style scoped>
.men-page {
  padding: 40px;
}

.shoppingmall-title {
  font-size: 32px;
  font-weight: bold;
  color: #4A90E2;
  text-decoration: none;
  margin-bottom: 20px;
}

/* 드롭다운 스타일 */
.dropdown {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.dropdown-toggle {
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  width: 130px;
  text-align: left;
}

.dropdown-toggle .rotate {
  display: inline-block;
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 130px;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 10;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 10px 14px;
  cursor: pointer;
}

.dropdown-menu li:hover,
.dropdown-menu li.active {
  background-color: black;
  color: white;
}
</style>