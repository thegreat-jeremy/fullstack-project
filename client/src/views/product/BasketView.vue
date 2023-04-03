<template>
  <div>
    <div class="mt-3">
      <button class="btn btn-danger me-2" @click="removeAll">
        장바구니 비우기
      </button>
    </div>
    <table class="table table-striped table-bordered mt-2">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Product No</th>
          <th>Price</th>
          <th>Order Qty</th>
          <th>Category</th>
          <th>Supplier</th>
          <th>Photo</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="product.product_id" v-for="product in productList">
          <td>
            {{ product.product_name }}
          </td>
          <td>{{ product.product_no }}</td>
          <td>{{ $convertNumberFormat(product.original_price, '#,###') }}원</td>
          <td>
            <input
              type="number"
              class="form-control"
              v-model="product.order_qty"
            />
          </td>
          <td>{{ product.category_name }}</td>
          <td>{{ product.supplier_name }}</td>
          <td>
            <img
              :src="`${serverUrl}/static/images/${product.img1}`"
              alt=""
              style="height: 50px; width: auto"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-grid">
      <button class="btn btn-danger" @click="goToOrder">주문하기</button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      productList: []
    }
  },
  computed: {
    baskets() {
      return this.$store.state.basket.baskets
    }
  },
  setup() {},
  created() {
    if (this.baskets.length > 0) {
      this.getProductList()
    }
  },
  mounted() {},
  unmounted() {},
  methods: {
    async getProductList() {
      const ids = []
      const orderQtyByProductId = {}

      this.baskets.forEach((product) => {
        ids.push(product.product_id)
        orderQtyByProductId[product.product_id] = product.order_qty
      })

      const loader = this.$loading.show()
      const r = await this.$post('/api/product/search', {
        where: `and product_id in (${ids.join(',')})`
      })

      // select * from table_name where product_id in ('P0001','P0002')

      console.log(r)

      if (r.status === 200) {
        const productList = r.data
        productList.forEach((product) => {
          product.order_qty = orderQtyByProductId[product.product_id]
        })

        this.productList = productList
      }

      console.log(this.productList)

      loader.hide()
    },
    removeAll() {
      this.$store.commit('basket/removeAll')
    },
    goToOrder() {
      this.$router.push({ path: '/order' })
    }
  }
}
</script>
