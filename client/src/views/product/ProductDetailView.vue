<template>
  <div class="mt-3" v-if="product.product_id">
    <div class="row">
      <div class="col-md-6">
        <div
          id="carouselProductIndicators"
          class="carousel slide"
          data-bs-ride="true"
        >
          <div class="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselProductIndicators"
              data-bs-slide-to="0"
              class="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                :src="`${serverUrl}/static/images/${product.img1}`"
                class="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselProductIndicators"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselProductIndicators"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">{{ product.product_name }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              {{ product.category_name }} | {{ product.supplier_name }}
            </h6>
            <h5 class="card-title">
              {{ $convertNumberFormat(product.original_price, '#,###') }}원
            </h5>
            <div class="row mb-2">
              <label for="orderQty" class="col-sm-4 col-form-label"
                >주문수량</label
              >
              <div class="col-sm-8">
                <input
                  type="number"
                  name=""
                  id="orderQty"
                  class="form-control"
                  v-model="orderQty"
                />
              </div>
            </div>

            <a href="#" class="card-link btn btn-success" @click="addBasket"
              >장바구니</a
            >
            <a href="#" class="card-link btn btn-danger">주문</a>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <img :src="`${serverUrl}/static/images/${product.img2}`" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      product_id: '',
      product: {},
      orderQty: 1
    }
  },
  setup() {},
  created() {
    this.product_id = this.$route.query.product_id
  },
  mounted() {
    this.getProduct()
  },
  unmounted() {},
  methods: {
    async getProduct() {
      this.product = await this.$get(`/api/product/${this.product_id}`)
    },
    goToList() {
      this.$router.push({ path: '/supplier/list' })
    },
    goToEdit() {
      this.$router.push({
        name: 'SupplierEditView',
        params: { supplier_id: this.supplier_id }
      })
    },
    addBasket() {
      // this.product_id, this.orderQty
      this.$store.commit('basket/add', {
        product_id: this.product_id,
        order_qty: this.orderQty
      })

      this.$swal({
        title: '장바구니로 이동 하시겠습니까?',
        // text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '이동',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$router.push({ path: '/basket' })
        }
      })
    }
  }
}
</script>
