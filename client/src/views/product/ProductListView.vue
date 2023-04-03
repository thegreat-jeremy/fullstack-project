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
        <button class="btn btn-success me-1" @click="goToCreate">Create</button>
        <button
          class="btn btn-secondary me-1"
          @click="downloadExcel"
          :disabled="productList.length === 0"
        >
          Excel
        </button>
      </div>
    </div>
    <table class="table table-striped table-bordered mt-2">
      <thead>
        <tr>
          <th>ID</th>
          <th>Product Name</th>
          <th>Product No</th>
          <th>Status</th>
          <th>Original Price</th>
          <th>Category</th>
          <th>Supplier</th>
          <th>Photo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr :key="product.product_id" v-for="product in productList">
          <td>{{ product.product_id }}</td>
          <td>
            <a class="link-primary" @click="goToDetail(product.product_id)">{{
              product.product_name
            }}</a>
          </td>
          <td>{{ product.product_no }}</td>
          <td>{{ $convertNumberFormat(product.original_price, '#,###') }}원</td>
          <td>{{ product.status === 0 ? '판매중지' : '판매중' }}</td>
          <td>{{ product.category_name }}</td>
          <td>{{ product.supplier_name }}</td>
          <td>
            <img
              :src="`${serverUrl}/static/images/${product.img1}`"
              alt=""
              style="height: 50px; width: auto"
            />
          </td>
          <td>
            <button
              class="btn btn-primary btn-sm me-1"
              @click="goToEdit(product.product_id)"
            >
              수정
            </button>
            <button
              class="btn btn-danger btn-sm me-1"
              @click="doDelete(product.product_id)"
            >
              삭제
            </button>
            <button
              class="btn btn-info btn-sm"
              @click="changeStatus(product.product_id, product.status)"
            >
              {{ product.status === 0 ? '판매시작' : '판매중지' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      headers: [
        { title: 'ID', key: 'product_id' },
        { title: 'Name', key: 'product_name' },
        { title: 'Product No', key: 'product_no' },
        { title: 'Category ID', key: 'product_category_id' },
        { title: 'Category Name', key: 'category_name' },
        { title: 'Supplier ID', key: 'supplier_id' },
        { title: 'Supplier Name', key: 'supplier_name' },
        { title: 'Original Price', key: 'original_price' },
        { title: 'Sales Price', key: 'sales_price' },
        { title: 'Stock', key: 'stock' }
      ],
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
      const r = await this.$post('/api/product/search', {
        where: `and t1.product_name like "%${this.searchName}%"`
      })

      console.log(r)

      if (r.status === 200) {
        this.productList = r.data
      }

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
    downloadExcel() {
      this.$excelFromTable(this.headers, this.productList, 'productList', {})
    }
  }
}
</script>
