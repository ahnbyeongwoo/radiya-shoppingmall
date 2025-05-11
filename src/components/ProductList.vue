<!--상품 리스트 페이지-->
<!--전체 상품 보기 전용 페이지, 목록만 담당하는 컴포넌트 역할-->
<!--views폴더의 상품 조회 리스트들은 ProductList.vue로 전달-->
<template>
  <div class="row g-4 px-3">
    <div v-for="product in localProducts" :key="product.id" class="col-6 col-md-4 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img :src="product.image" class="card-img-top p-3" :alt="product.name" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title ">{{ product.name }}</h5>
          <p class="text-primary fw-bold mb-2">{{ formatPrice(product.price).toLocaleString() }}원</p>
          <div class="mt-auto d-flex justify-content-between">

            <button class="btn btn-sm btn-outline-secondary me-1" @click="goToDetail(product.id)">
                🔍
              </button>
              <button class="btn btn-sm btn-outline-success" @click="addToCart(product)">
              장바구니
            </button>
            <button class="btn btn-sm btn-outline-danger" @click.stop="toggleLike(product)">
              {{ product.liked ? '❤️' : '🤍' }} {{ product.likesCount || 0 }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductList',
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localProducts: []
    };
  },
  methods: {
    formatPrice(dollar) {
      const won = dollar * 1300;
      return `${won.toLocaleString()}`;
    },
    addToCart(product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('장바구니에 추가되었습니다!');
    },
    goToDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
    async toggleLike(product) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user.email) return;

      try {
        const response = await axios.post('http://localhost:3000/likes', {
          product_id: product.id,
          user_email: user.email,
        });

        const msg = response?.data?.message || "";
        if (typeof product.likesCount !== 'number') product.likesCount = 0;

        if (msg.includes("추가")) {
          product.liked = true;
          product.likesCount += 1;
        } else if (msg.includes("취소")) {
          product.liked = false;
          product.likesCount = Math.max(product.likesCount - 1, 0);
        }

      } catch (err) {
        console.error('좋아요 요청 실패:', err);
      }
    }
  },
  async mounted() {
    // props.products를 로컬로 복제
    this.localProducts = this.products.map(p => ({ ...p }));

    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));

      if (user && user.email) {
        const likeStatusPromises = this.localProducts.map(product =>
          axios.get(`http://localhost:3000/likes/${product.id}?user_email=${user.email}`)
        );
        const responses = await Promise.all(likeStatusPromises);

        responses.forEach((res, index) => {
          this.localProducts[index].liked = res.data.isLiked;
          this.localProducts[index].likesCount = res.data.likesCount;
        });

      } else {
        const countPromises = this.localProducts.map(product =>
          axios.get(`http://localhost:3000/likes/${product.id}`)
        );
        const responses = await Promise.all(countPromises);

        responses.forEach((res, index) => {
          this.localProducts[index].liked = false;
          this.localProducts[index].likesCount = res.data.likesCount;
        });
      }
    } catch (err) {
      console.error("좋아요 상태 조회 실패:", err);
    }
    // console.log("최종 productList 상태:", this.products);

  },
  watch: {
    products: {
      immediate: true,
      handler(newProducts) {
        this.localProducts = newProducts.map(p => ({ ...p }));
      }
    }
  }

};
</script>

<style scoped>

</style>