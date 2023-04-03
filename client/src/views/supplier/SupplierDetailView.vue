<template>
  <div class="mt-3">
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Supplier ID</label>
      <div class="col-sm-10">
        {{ supplier.supplier_id }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Supplier Name</label>
      <div class="col-sm-10">
        {{ supplier.supplier_name }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Business No</label>
      <div class="col-sm-10">
        {{ supplier.business_no }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Representative</label>
      <div class="col-sm-10">
        {{ supplier.representative_name }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-10">
        {{ supplier.email }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Phone</label>
      <div class="col-sm-10">
        {{ supplier.phone }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Address</label>
      <div class="col-sm-10">
        {{ supplier.address }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Contact Name</label>
      <div class="col-sm-10">
        {{ supplier.contact_name }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Contact Phone</label>
      <div class="col-sm-10">
        {{ supplier.contact_phone }}
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-sm-2 col-form-label">Contact Email</label>
      <div class="col-sm-10">
        {{ supplier.contact_email }}
      </div>
    </div>
    <button class="btn btn-secondary me-1" @click="goToList">List</button>
    <button class="btn btn-primary" @click="goToEdit">Edit</button>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      supplier_id: '',
      supplier: {}
    }
  },
  setup() {},
  created() {
    // console.log(this.$route.query.id)
    this.supplier_id = this.$route.query.supplier_id
    // console.log(this.$route.params)
    // this.id = this.$route.params.id
  },
  mounted() {
    this.getSupplier()
  },
  unmounted() {},
  methods: {
    async getSupplier() {
      this.supplier = await this.$get(`/api/supplier/${this.supplier_id}`)
    },
    goToList() {
      this.$router.push({ path: '/supplier/list' })
    },
    goToEdit() {
      this.$router.push({
        name: 'SupplierEditView',
        params: { supplier_id: this.supplier_id }
      })
    }
  }
}
</script>
