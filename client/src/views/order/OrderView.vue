<template>
  <div>
    <div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Customer Name</label>
        <div class="col-sm-10">
          {{ customer.customer_name }}
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Phone</label>
        <div class="col-sm-10">
          {{ customer.phone }}
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label">Address</label>
        <div class="col-sm-10">
          {{ customer.address }}
        </div>
      </div>
      <div class="row mb-3">
        <label class="col-sm-2 col-form-label" for="shipper">Shipper</label>
        <div class="col-sm-10">
          <select name="" id="shipper" class="form-select" v-model="shipperId">
            <option
              :value="shipper.shipper_id"
              :key="shipper.shipper_id"
              v-for="shipper in shipperList"
            >
              {{ shipper.shipper_name }}
            </option>
          </select>
        </div>
      </div>
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
      <button class="btn btn-danger" @click="doOrder">주문</button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      customerId: 4,
      shipperId: -1,
      customer: {},
      productList: [],
      shipperList: []
    }
  },
  computed: {
    baskets() {
      return this.$store.state.basket.baskets
    }
  },
  setup() {},
  created() {
    this.getCustomer()
    this.getShipperList()
    this.getProductList()
  },
  mounted() {},
  unmounted() {},
  methods: {
    async getCustomer() {
      this.customer = await this.$get(`/api/customer2/${this.customerId}`)
    },
    async getShipperList() {
      this.shipperList = await this.$get('/api/shipper')
    },
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
    doOrder() {
      if (this.shipperId === -1) {
        return this.$swal('배송처를 선택하세요.')
      }
      this.$swal({
        title: '주문을 진행 하시겠습니까?',
        // text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '주문',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const loader = this.$loading.show()

          //   const items = []
          //   this.productList.forEach((product) => {
          //     items.push({
          //       product_id: product.product_id,
          //       order_qty: product.order_qty
          //     })
          //   })

          const r = await this.$post('/api/order', {
            header: {
              customer_id: this.customerId,
              shipper_id: this.shipperId
            },
            items: this.productList,
            email: this.customer.email
          })

          loader.hide()

          console.log(r)

          if (r.status === 200) {
            this.$swal(
              '주문 되었습니다.',
              '주문이 정상적으로 접수 되었습니다',
              'success'
            )

            this.$store.commit('basket/removeAll')
            this.$router.push({
              path: '/order/detail',
              query: { order_id: r.data.insertId }
            })

            // this.doSearch()
          } else if (r.status === 500) {
            this.$swal(
              '주문이 생성되지 않았습니다.',
              '다시 시도하세요',
              'error'
            )
          }
        }
      })
    }
  }
}
</script>
