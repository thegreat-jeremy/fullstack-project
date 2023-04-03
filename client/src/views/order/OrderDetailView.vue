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
        <div class="col-sm-10">{{ header.shipper_name }}</div>
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
        <tr :key="product.product_id" v-for="product in detail">
          <td>
            {{ product.product_name }}
          </td>
          <td>{{ product.product_no }}</td>
          <td>{{ $convertNumberFormat(product.original_price, '#,###') }}원</td>
          <td>
            {{ product.order_qty }}
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
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      orderId: -1,
      customerId: 4,
      customer: {},
      header: {},
      detail: []
    }
  },
  setup() {},
  created() {
    this.orderId = this.$route.query.order_id
    this.getCustomer()
    this.getOrder()
  },
  mounted() {},
  unmounted() {},
  methods: {
    async getCustomer() {
      this.customer = await this.$get(`/api/customer2/${this.customerId}`)
    },
    async getOrder() {
      const result = await this.$get(`/api/order/detail/${this.orderId}`)
      this.header = result.header
      this.detail = result.detail

      console.log(this.header)
      console.log(this.detail)
    }
  }
}
</script>
