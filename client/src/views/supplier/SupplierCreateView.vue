<template>
  <div class="mt-3">
    <div class="row mb-3">
      <label for="supplierName" class="col-sm-2 col-form-label"
        >Supplier Name</label
      >
      <div class="col-sm-10">
        <input
          type="text"
          name=""
          id="supplierName"
          class="form-control"
          v-model.trim="supplier.supplier_name"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="businessNo" class="col-sm-2 col-form-label"
        >Business No</label
      >
      <div class="col-sm-10">
        <input
          type="text"
          name=""
          id="businessNo"
          class="form-control"
          v-model.trim="supplier.business_no"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="representative" class="col-sm-2 col-form-label"
        >Representative</label
      >
      <div class="col-sm-10">
        <input
          type="text"
          name=""
          id="representative"
          class="form-control"
          v-model.trim="supplier.representative_name"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="supplierEmail" class="col-sm-2 col-form-label">Email</label>
      <div class="col-sm-10">
        <input
          type="email"
          name=""
          id="supplierEmail"
          class="form-control"
          v-model.trim="supplier.email"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="supplierPhone" class="col-sm-2 col-form-label">Phone</label>
      <div class="col-sm-10">
        <input
          type="tel"
          name=""
          id="supplierPhone"
          class="form-control"
          v-model.trim="supplier.phone"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="supplierAddress" class="col-sm-2 col-form-label"
        >Address</label
      >
      <div class="col-sm-10">
        <input
          type="text"
          class="form-control"
          id="supplierAddress"
          v-model.trim="supplier.address"
          placeholder="주소"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="contactName" class="col-sm-2 col-form-label"
        >Contact Name</label
      >
      <div class="col-sm-10">
        <input
          type="text"
          name=""
          id="contactName"
          class="form-control"
          v-model.trim="supplier.contact_name"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="contactPhone" class="col-sm-2 col-form-label"
        >Contact Phone</label
      >
      <div class="col-sm-10">
        <input
          type="tel"
          name=""
          id="contactPhone"
          class="form-control"
          v-model.trim="supplier.contact_phone"
        />
      </div>
    </div>
    <div class="row mb-3">
      <label for="contactEmail" class="col-sm-2 col-form-label"
        >Contact Email</label
      >
      <div class="col-sm-10">
        <input
          type="email"
          name=""
          id="contactEmail"
          class="form-control"
          v-model.trim="supplier.contact_email"
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
      supplier: {
        supplier_name: '',
        email: '',
        phone: '',
        address: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        business_no: '',
        representative_name: ''
      }
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    async doSave() {
      if (this.supplier.supplier_name === '') {
        return this.$swal(
          'Supplier Name을 입력하세요',
          'Supplier Name은 필수 입력값입니다',
          'info'
        )
      }

      if (this.supplier.business_no === '') {
        return this.$swal(
          'Business No를 입력하세요',
          'Business No는 필수 입력값입니다',
          'info'
        )
      }

      if (this.supplier.email === '') {
        return this.$swal(
          'Email을 입력하세요',
          'Email은 필수 입력값입니다',
          'info'
        )
      }

      if (this.supplier.phone === '') {
        return this.$swal(
          'Phone을 입력하세요',
          'Phone은 필수 입력값입니다',
          'info'
        )
      }

      if (this.supplier.address === '') {
        return this.$swal(
          'Address을 입력하세요',
          'Address은 필수 입력값입니다',
          'info'
        )
      }

      // 정규식 - 이메일, 전화번호 체크 로직 추가
      const regexpTel = /^010-\d{4}-\d{4}$/
      const regexpEmail =
        /^([a-z]+\d*)+(\.?[a-z]+\d*)+@([a-z]+\d*)+(\.[a-z]{2,3})+$/

      if (!regexpTel.test(this.supplier.phone)) {
        return this.$swal(
          'Phone을 올바른 형식으로 입력하세요',
          '010-0000-0000 과 같은 형식입니다',
          'info'
        )
      }

      if (!regexpEmail.test(this.supplier.email)) {
        return this.$swal(
          'Email을 올바른 형식으로 입력하세요',
          '이메일은 @를 포함해야합니다',
          'info'
        )
      }

      this.$swal({
        title: '신규 공급자를 생성 하시겠습니까?',
        // text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '생성',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 저장 로직 구현
          const loader = this.$loading.show()

          const r = await this.$post('/api/supplier', { param: this.supplier })
          console.log(r)

          loader.hide()

          if (r.status === 200) {
            this.$swal(
              '생성 되었습니다.',
              '신규 공급자가 생성 되었습니다',
              'success'
            )
            this.goToList()
          }
        }
      })
    },
    goToList() {
      this.$router.push({ path: '/supplier/list' })
    }
  }
}
</script>
