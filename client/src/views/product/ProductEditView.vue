<template>
  <div class="mt-3">
    <div class="row mb-3">
      <label for="productName" class="col-sm-2 col-form-label"
        >Product Name</label
      >
      <div class="col-sm-10">
        <input
          type="text"
          name=""
          id="productName"
          class="form-control"
          v-model.trim="product.product_name"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="productNo" class="col-sm-2 col-form-label">Product No</label>
      <div class="col-sm-10">
        <input
          type="text"
          name=""
          id="productNo"
          class="form-control"
          v-model.trim="product.product_no"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="category" class="col-sm-2 col-form-label">Category</label>
      <div class="col-sm-10">
        <select
          name=""
          id="category"
          class="form-select"
          v-model="product.product_category_id"
        >
          <option
            :value="category.product_category_id"
            :key="category.product_category_id"
            v-for="category in categoryList"
          >
            {{ category.category_name }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <label for="supplier" class="col-sm-2 col-form-label">Supplier</label>
      <div class="col-sm-10">
        <select
          name=""
          id="supplier"
          class="form-select"
          v-model="product.supplier_id"
        >
          <option
            :value="supplier.supplier_id"
            :key="supplier.supplier_id"
            v-for="supplier in supplierList"
          >
            {{ supplier.supplier_name }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mb-3">
      <label for="originalPrice" class="col-sm-2 col-form-label"
        >Original Price</label
      >
      <div class="col-sm-10">
        <input
          type="number"
          name=""
          id="originalPrice"
          class="form-control"
          v-model.number="product.original_price"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="salesPrice" class="col-sm-2 col-form-label"
        >Sales Price</label
      >
      <div class="col-sm-10">
        <input
          type="number"
          name=""
          id="salesPrice"
          class="form-control"
          v-model.number="product.sales_price"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="stock" class="col-sm-2 col-form-label">Stock</label>
      <div class="col-sm-10">
        <input
          type="number"
          name=""
          id="stock"
          class="form-control"
          v-model.number="product.stock"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="stock" class="col-sm-2 col-form-label">Photo</label>
      <div class="col-sm-10">
        <button class="btn btn-danger" @click="$refs.file.click()">
          이미지 업로드
        </button>
        <input
          type="file"
          name=""
          id=""
          ref="file"
          accept="image/png, image/jpeg"
          style="display: none"
          @change="uploadImage($event.target.files, 1)"
        />
        <img
          :src="imgSrc"
          alt="product image"
          style="width: 200px; height: auto"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="stock" class="col-sm-2 col-form-label">Photo Detail</label>
      <div class="col-sm-10">
        <button class="btn btn-danger" @click="$refs.file2.click()">
          이미지 업로드
        </button>
        <input
          type="file"
          name=""
          id=""
          ref="file2"
          accept="image/png, image/jpeg"
          style="display: none"
          @change="uploadImage($event.target.files, 2)"
        />
        <img
          :src="imgSrc2"
          alt="product image"
          style="width: 200px; height: auto"
        />
      </div>
    </div>
    <button class="btn btn-secondary me-1" @click="goToList">Cancel</button>
    <button class="btn btn-primary" @click="doSave">Save</button>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      product: {
        product_no: '',
        product_name: '',
        product_category_id: -1,
        supplier_id: -1,
        original_price: 0,
        sales_price: 0,
        stock: 0,
        img1: '',
        img2: '',
        discount_type: 'P',
        discount: 0
      },
      categoryList: [],
      supplierList: [],
      imgSrc: '',
      imgSrc2: ''
    }
  },
  setup() {},
  created() {
    this.product_id = this.$route.query.product_id
    this.getCategoryList()
    this.getSupplierList()
  },
  mounted() {
    this.getProduct()
  },
  unmounted() {},
  methods: {
    async getProduct() {
      this.product = await this.$get(`/api/product/${this.product_id}`)
      this.imgSrc = `${this.serverUrl}/static/images/${this.product.img1}`
      this.imgSrc2 = `${this.serverUrl}/static/images/${this.product.img2}`
    },
    async getCategoryList() {
      this.categoryList = await this.$get('/api/category')
    },
    async getSupplierList() {
      this.supplierList = await this.$get('/api/supplier')
    },
    async uploadImage(files, type) {
      const r = await this.$upload('/api/upload/image', files[0])
      console.log(r)
      if (type === 1) {
        this.imgSrc = `${this.serverUrl}/static/images/${r.data.filename}`
      } else {
        this.imgSrc2 = `${this.serverUrl}/static/images/${r.data.filename}`
      }

      this.product[`img${type}`] = r.data.filename
    },
    async doSave() {
      if (this.product.product_name === '') {
        return this.$swal(
          'Product Name을 입력하세요',
          'Product Name은 필수 입력값입니다',
          'info'
        )
      }

      if (this.product.product_no === '') {
        return this.$swal(
          'Product No를 입력하세요',
          'Product No는 필수 입력값입니다',
          'info'
        )
      }

      if (this.product.product_category_id === -1) {
        return this.$swal(
          'Product Category를 선택하세요',
          'Product Category는 필수 입력값입니다',
          'info'
        )
      }

      if (this.product.supplier_id === -1) {
        return this.$swal(
          'Supplier를 선택하세요',
          'Supplier는 필수 입력값입니다',
          'info'
        )
      }

      if (this.product.original_price === '') {
        return this.$swal(
          'Phone을 입력하세요',
          'Phone은 필수 입력값입니다',
          'info'
        )
      }

      if (this.product.img1 === '') {
        return this.$swal(
          'Photo를 업로드 하세요',
          'Photo는 필수 입력값입니다',
          'info'
        )
      }

      if (this.product.img2 === '') {
        return this.$swal(
          'Photo Detail를 업로드 하세요',
          'Photo Detail는 필수 입력값입니다',
          'info'
        )
      }

      this.$swal({
        title: '제품을 수정 하시겠습니까?',
        // text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '수정',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 저장 로직 구현
          const loader = this.$loading.show()

          const product = { ...this.product }
          delete product.product_id
          delete product.category_name
          delete product.supplier_name

          const r = await this.$put(`/api/product/${this.product_id}`, {
            param: product
          })
          console.log(r)

          loader.hide()

          if (r.status === 200) {
            this.$swal(
              '저장 되었습니다.',
              '제품이 정상적으로 수정 되었습니다',
              'success'
            )
            this.goToList()
          }
        }
      })
    },
    goToList() {
      this.$router.push({ path: '/product/list' })
    }
  }
}
</script>
