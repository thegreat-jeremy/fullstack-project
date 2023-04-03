<template>
  <div class="mt-3">
    <div class="row gx-3 gy-2 align-items-center">
      <div class="col-sm-3">
        <label class="visually-hidden" for="productName">Name</label>
        <input
          type="text"
          class="form-control"
          id="productName"
          placeholder="Product Name"
          v-model="searchName"
          @keyup.enter="doSearch"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary me-1" @click="doSearch">Search</button>
      </div>
    </div>
    <div class="row gap-2 mt-2">
      <div
        class="col-xl-3 col-lg-3 col-md-6"
        :key="product.product_id"
        v-for="product in productList"
      >
        <div class="card" style="width: 18rem">
          <img
            :src="`${serverUrl}/static/images/${product.img1}`"
            class="card-img-top"
            style="height: 180px; width: auto"
            :alt="product.product_name"
          />
          <div class="card-body">
            <h5 class="card-title" @click="goToDetail(product.product_id)">
              {{ product.product_name }}
            </h5>
            <p class="card-text">
              {{ $convertNumberFormat(product.original_price, '#,###') }}원 |
              {{ product.category_name }} | {{ product.supplier_name }}
            </p>
            <a
              href="#"
              class="btn btn-primary me-1"
              @click="goToDetail(product.product_id)"
              >상세보기</a
            >
            <a
              href="#"
              class="btn btn-success"
              @click="addBasket(product.product_id)"
              >장바구니</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      productList: [],
      searchName: ''
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    async doSearch() {
      const loader = this.$loading.show()
      this.productList = await this.$get('/api/product/searchByName', {
        params: {
          name: this.searchName
        }
      })

      loader.hide()
    },
    async changeStatus(productId, status) {
      let title = '판매를 시작하시겠습니까?'
      if (status === 1) {
        title = '판매를 중지하시겠습니까?'
      }

      this.$swal({
        title: title,
        // text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '변경',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 저장 로직 구현
          const loader = this.$loading.show()

          const r = await this.$put(`/api/product/${productId}`, {
            param: { status: status === 0 ? 1 : 0 }
          })

          loader.hide()

          if (r.status === 200) {
            this.$swal(
              '변경 되었습니다.',
              '제품 상태가 변경 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doDelete(productId) {
      this.$swal({
        title: '선택한 제품을 정말 삭제 하시겠습니까?',
        text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 저장 로직 구현
          const loader = this.$loading.show()

          const r = await this.$delete(`/api/product/${productId}`)

          loader.hide()

          if (r.status === 200) {
            this.$swal('삭제 되었습니다.', '제품이 삭제 되었습니다', 'success')

            this.doSearch()
          } else if (r.status === 501) {
            this.$swal(
              `삭제하려는 제품에 대한 주문이 ${r.count}건 존재합니다.`,
              '제품이 삭제 되지않았습니다',
              'success'
            )
          }
        }
      })
    },
    goToDetail(productId) {
      this.$router.push({
        path: '/product/detail',
        query: { product_id: productId }
      })
    },
    goToCreate() {
      this.$router.push({ path: '/product/create' })
    },
    goToEdit(productId) {
      this.$router.push({
        path: '/product/edit',
        query: { product_id: productId }
      })
    },
    addBasket(productId) {
      // this.product_id, this.orderQty
      this.$store.commit('basket/add', {
        product_id: productId,
        order_qty: 1
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
    },
    downloadExcel() {
      this.$excelFromTable(this.headers, this.productList, 'productList', {})
    }
  }
}
</script>
