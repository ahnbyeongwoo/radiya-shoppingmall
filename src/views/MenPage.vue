<template>
  <div class="men-page">
    <router-link
      to="/"
      class="d-flex align-items-center gap-2 mb-3 text-decoration-none fs-3 fw-bold text-primary"
      style="height: 60px;"
    >
      <img
        src="@/assets/wix.png"
        alt="Logo"
        class="logo me-2 logo-hover"
      />
    </router-link>
    <!-- 드롭다운 정렬 메뉴 -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <h2 class="m-0 mb-4 fs-5 d-flex align-items-center">mens</h2>
      <div class="dropdown position-relative">
        <button class="btn btn-outline-secondary py-1 px-3" @click="toggleDropdown">
          {{ selectedSortLabel }} <span :class="{ rotate: showDropdown }">▴</span>
        </button>
        <ul class="dropdown-menu show" v-if="showDropdown">
          <li v-for="option in sortOptions" :key="option.value">
            <button class="dropdown-item" :class="{ active: sortOrder === option.value }" @click="sortBy(option.value)">
              {{ option.label }}
            </button>
          </li>
        </ul>
      </div>
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
      sortOptions: [//정렬 옵션 선택함
        { value: 'random', label: '랜덤순' },
        { value: 'high', label: '높은 가격순' },
        { value: 'low', label: '낮은 가격순' },
      ]
    };
  },
  computed: {
    selectedSortLabel() {// 드롭다운에서 선택된 정렬 옵션의 레이블을 반환
      const found = this.sortOptions.find(opt => opt.value === this.sortOrder);//선택된 정렬 옵션 찾기
      return found ? found.label : '정렬';
    },
    sortedProducts() {//상품 목록 정렬된 형태로 출력
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
      this.showDropdown = !this.showDropdown;//메뉴 열고 닫기
    },
    sortBy(order) {//정렬 옵션 선택하기
      this.sortOrder = order;
      this.showDropdown = false;
    }
  },
  async mounted() {
    try {
      const response = await axios.get(
        `${process.env.VUE_APP_API_URL}/products/category/${encodeURIComponent('men clothing')}`
      );
      const productList = response.data;

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (currentUser && currentUser.email) {
        const likeRes = await axios.get(
          `${process.env.VUE_APP_API_URL}/like?user_email=${currentUser.email}`
        );

        if (Array.isArray(likeRes.data)) {
          const likedProductIds = likeRes.data.map((item) => item.product_id);
          productList.forEach((product) => {
            product.liked = likedProductIds.includes(product.id);
          });
        }
      }

      const countPromises = productList.map((product) =>
        axios.get(`${process.env.VUE_APP_API_URL}/likes/${product.id}`)
      );
      const likeCounts = await Promise.allSettled(countPromises);

      likeCounts.forEach((res, idx) => {
        if (res.status === "fulfilled") {
          productList[idx].likesCount = res.value.data.likesCount || 0;
        } else {
          productList[idx].likesCount = 0;
        }
      });

      this.products = productList;

    } catch (error) {
      console.error('남성 의류 상품 조회 실패:', error);
    }
  }

}
</script>

<style scoped>
.men-page {
  padding: 20px;
}
.dropdown {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}
.logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  display: block;
  margin-top: 12px;
  transition: transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s, filter 0.3s;
}
</style>