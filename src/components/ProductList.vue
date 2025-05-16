<!--상품 리스트 페이지-->
<!--전체 상품 보기 전용 페이지, 목록만 담당하는 컴포넌트 역할-->
<!--views폴더와 컴포넌트의 상품 조회 리스트들은 ProductList.vue로 전달-->
<template>
  <div class="row g-4 px-3"><!--row 줄, col 각각의 칸-->
    <div v-for="product in localProducts" :key="product.id" class="col-6 col-md-4 col-lg-3">
      <div class="card h-100 shadow-sm">
        <img :src="product.image" class="card-img-top p-3" :alt="product.name" style="height: 200px; object-fit: contain;">
        <div class="card-body d-flex flex-column"><!--카드 내부 정보-->
          <h5 class="card-title ">{{ product.name }}</h5>
          <p class="text-primary fw-bold mb-2">{{ formatPrice(product.price).toLocaleString() }}원</p>
          <div class="mt-auto d-flex justify-content-between"><!--하단 카드 버튼-->
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
  props: {// 부모 컴포넌트에서 전달된 상품 목록
    products: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localProducts: []// props로 받은 상품 목록을 로컬 상태로 복사하여 가공(좋아요 상태 등 추가)
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
    async toggleLike(product) {//좋아요 토글 추가, 취소
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user || !user.email) return;

      try {
        const response = await axios.post('http://localhost:3000/likes', {
          product_id: product.id,
          user_email: user.email,
        });

        const msg = response?.data?.message || "";
        if (typeof product.likesCount !== 'number') product.likesCount = 0;

        if (msg.includes("추가")) {//응답 메시지에 따라 상태 변경
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
  async mounted() {// props로 전달된 상품 리스트를 로컬 복제본에 저장
    this.localProducts = this.products.map(p => ({ ...p }));

    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));

      if (user && user.email) {
        const likeStatusPromises = this.localProducts.map(product =>
          axios.get(`http://localhost:3000/likes/${product.id}?user_email=${user.email}`)
        );//좋아요 상태 요청 이메일했을때
        const responses = await Promise.all(likeStatusPromises);

        responses.forEach((res, index) => {
          this.localProducts[index].liked = res.data.isLiked;
          this.localProducts[index].likesCount = res.data.likesCount;
        });

      } else {//로그인 안되어있을때 좋아요 수만 표시
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
  },
  watch: { // props.products가 바뀌면 로컬 상태도 동기화
    products: {
      immediate: true,//컴포넌트가 처음 생성될 때에도 실행됨
      handler(newProducts) {//products가 변경될 때마다 로컬 상태를 업데이트
        this.localProducts = newProducts.map(p => ({ ...p }));// 새로운 products를 localProducts에 복사
      }
    }
  }

};
</script>

<style scoped>

</style>