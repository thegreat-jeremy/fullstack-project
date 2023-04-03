<template>
  <div class="mt-3">
    <div class="row gx-3 gy-2 align-items-center">
      <div class="col-sm-3">
        <label class="visually-hidden" for="supplierName">Name</label>
        <input
          type="text"
          class="form-control"
          id="supplierName"
          placeholder="Supplier Name"
          v-model="searchName"
          @keyup.enter="doSearch"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary me-1" @click="doSearch">Search</button>
        <button class="btn btn-success me-1" @click="goToCreate">Create</button>
        <button class="btn btn-secondary me-1" @click="downloadExcel">
          Excel
        </button>
      </div>
    </div>
    <table class="table table-striped table-bordered mt-2">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Address</th>
          <th>Contact Name</th>
        </tr>
      </thead>
      <tbody>
        <tr :key="supplier.supplier_id" v-for="supplier in suppliers">
          <td>{{ supplier.supplier_id }}</td>
          <td>
            <a class="link-primary" @click="goToDetail(supplier.supplier_id)">{{
              supplier.supplier_name
            }}</a>
          </td>
          <td>{{ supplier.phone }}</td>
          <td>{{ supplier.email }}</td>
          <td>{{ supplier.address }}</td>
          <td>{{ supplier.contact_name }}</td>
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
        { title: 'ID', key: 'supplier_id' },
        { title: 'Name', key: 'supplier_name' },
        { title: 'Business No', key: 'business_no' },
        { title: 'Representative', key: 'representative_name' },
        { title: 'Email', key: 'email' },
        { title: 'Phone', key: 'phone' },
        { title: 'Address', key: 'address' },
        { title: 'Contact Name', key: 'contact_name' },
        { title: 'Contact Phone', key: 'contact_phone' },
        { title: 'Contact Email', key: 'contact_email' }
      ],
      suppliers: [],
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
      const r = await this.$post('/api/supplier/search', {
        where: `supplier_name like "%${this.searchName}%"`
      })

      if (r.status === 200) {
        this.suppliers = r.data
      }

      loader.hide()
    },
    goToDetail(supplierId) {
      this.$router.push({
        path: '/supplier/detail',
        query: { supplier_id: supplierId }
      })
    },
    goToCreate() {
      this.$router.push({ path: '/supplier/create' })
    },
    downloadExcel() {
      this.$excelFromTable(this.headers, this.suppliers, 'suppliers', {})
    }
  }
}
</script>
