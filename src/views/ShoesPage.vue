<template>
  <div class="shoes-page">
    <router-link to='/' class="shoppingmall-title">RADIYA</router-link>
    <h2>신발 카테고리 페이지</h2>

    <!-- 드롭다운 정렬 메뉴 -->
    <div class="dropdown" @click="toggleDropdown">
      <button class="dropdown-toggle">
        {{ selectedSortLabel }} <span :class="{ rotate: showDropdown }">▴</span>
      </button>
      <ul v-if="showDropdown" class="dropdown-menu">
        <li
          v-for="option in sortOptions"
          :key="option.value"
          :class="{ active: sortOrder === option.value }"
          @click.stop="sortBy(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>

    <ProductList :products="sortedProducts" />
  </div>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import AllProducts from '@/data/products.js'

export default {
  name: 'ShoesPage',
  components: { ProductList },
  data() {
    return {
      shoesProducts: AllProducts.filter(p => p.image.startsWith('3-')),
      sortOrder: 'high',
      showDropdown: false,
      sortOptions: [
        { value: 'high', label: '높은 가격순' },
        { value: 'low', label: '낮은 가격순' }
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
        return [...this.shoesProducts].sort((a, b) => a.price - b.price);
      } else if (this.sortOrder === 'high') {
        return [...this.shoesProducts].sort((a, b) => b.price - a.price);
      }
      return this.shoesProducts;
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
}
.shoes-page {
  padding: 20px;
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
