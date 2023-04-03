<template>
  <div class="mt-3">
    <table class="table table-striped table-bordered mt-2">
      <thead>
        <tr>
          <th>Order No</th>
          <th>Product</th>
          <th>Shipper</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="order.order_id" v-for="order in orders">
          <td>
            <a class="link-primary" @click="goToDetail(order.order_id)">{{
              order.order_id
            }}</a>
          </td>
          <td>{{ order.product_count }}</td>
          <td>{{ order.shipper_name }}</td>
          <td>{{ order.created_datetime }}</td>
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
      orders: [],
      customerId: 4,
      searchName: ''
    }
  },
  setup() {},
  created() {},
  mounted() {
    this.doSearch()
  },
  unmounted() {},
  methods: {
    async doSearch() {
      const loader = this.$loading.show()
      this.orders = await this.$get(`/api/order/${this.customerId}`)
      console.log(this.orders)

      loader.hide()
    },
    goToDetail(orderId) {
      this.$router.push({
        path: '/order/detail',
        query: { order_id: orderId }
      })
    }
  }
}
</script>
