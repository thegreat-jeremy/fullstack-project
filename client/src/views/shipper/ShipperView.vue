<template>
  <div class="mt-3">
    <div class="row gx-3 gy-2 align-items-center">
      <div class="col-sm-3">
        <label class="visually-hidden" for="searchShipperName">Name</label>
        <input
          type="text"
          class="form-control"
          id="searchShipperName"
          placeholder="Shipper Name"
          v-model="searchName"
          @keyup.enter="doSearch"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary me-1" @click="doSearch">Search</button>
        <button
          class="btn btn-success me-1"
          data-bs-toggle="modal"
          data-bs-target="#shipperModal"
          @click="openModal()"
        >
          Create
        </button>
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
          <th>Address</th>
          <th>Delivery YN</th>
          <th>Active YN</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr :key="shipper.shipper_id" v-for="shipper in shipperList">
          <td>{{ shipper.shipper_id }}</td>
          <td>{{ shipper.shipper_name }}</td>
          <td>{{ shipper.phone }}</td>
          <td>{{ shipper.address }}</td>
          <td>{{ shipper.delivery_yn === 'Y' ? '배송가능' : '배송중지' }}</td>
          <td>{{ shipper.active_yn === 'Y' ? '거래중' : '거래중지' }}</td>
          <td>
            <button
              class="btn btn-success me-1"
              data-bs-toggle="modal"
              data-bs-target="#shipperModal"
              @click="openModal(shipper.shipper_id)"
            >
              수정
            </button>
            <button
              class="btn btn-danger me-1"
              @click="doDelete(shipper.shipper_id)"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <slot-modal modalId="shipperModal">
      <template v-slot:title>Shipper</template>
      <template v-slot:body>
        <div class="row mb-3">
          <label for="shipperName" class="col-sm-4 col-form-label">Name</label>
          <div class="col-sm-8">
            <input
              type="text"
              name=""
              id="shipperName"
              class="form-control"
              v-model="shipper.shipper_name"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="shipperPhone" class="col-sm-4 col-form-label"
            >Phone</label
          >
          <div class="col-sm-8">
            <input
              type="tel"
              name=""
              id="shipperPhone"
              class="form-control"
              v-model="shipper.phone"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="shipperAddress" class="col-sm-4 col-form-label"
            >Address</label
          >
          <div class="col-sm-8">
            <input
              type="tel"
              name=""
              id="shipperAddress"
              class="form-control"
              v-model="shipper.address"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="deliveryYN" class="col-sm-4 col-form-label"
            >Delivery YN</label
          >
          <div class="col-sm-8">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                v-model="shipper.delivery_yn"
                id="deliveryY"
                value="Y"
              />
              <label class="form-check-label" for="deliveryY">배송가능</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                v-model="shipper.delivery_yn"
                id="deliveryN"
                value="N"
              />
              <label class="form-check-label" for="deliveryN">배송중지</label>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label for="activeYN" class="col-sm-4 col-form-label"
            >Active YN</label
          >
          <div class="col-sm-8">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                v-model="shipper.active_yn"
                id="activeY"
                value="Y"
              />
              <label class="form-check-label" for="activeY">거래중</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                v-model="shipper.active_yn"
                id="activeN"
                value="N"
              />
              <label class="form-check-label" for="activeN">거래중지</label>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-secondary me-1"
          data-bs-dismiss="modal"
          ref="btnClose"
          @click="clearShipper"
        >
          Cancel
        </button>
        <button
          class="btn btn-danger"
          @click="doCreate"
          v-if="shipper.shipper_id === -1"
        >
          Create
        </button>
        <button class="btn btn-danger" @click="doSave" v-else>Save</button>
      </template>
    </slot-modal>
  </div>
</template>
<script>
import SlotModal from '@/components/fragments/SlotModal.vue'
export default {
  components: { 'slot-modal': SlotModal },
  data() {
    return {
      headers: [
        { title: 'Shipper ID', key: 'shipper_id' },
        { title: 'Shipper Name', key: 'shipper_name' },
        { title: 'Phone', key: 'phone' },
        { title: 'Address', key: 'address' },
        { title: 'Delivery YN', key: 'delivery_yn' },
        { title: 'Active YN', key: 'active_yn' }
      ],
      shipperList: [],
      shipper: {
        shipper_id: -1,
        shipper_name: '',
        phone: '',
        address: '',
        delivery_yn: 'Y',
        active_yn: 'Y'
      },
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
      const r = await this.$post('/api/shipper/search', {
        where: `shipper_name like "%${this.searchName}%"`
      })

      if (r.status === 200) {
        this.shipperList = r.data
      }
      loader.hide()
    },
    openModal(id) {
      if (id === undefined) {
        this.shipper = {
          shipper_id: -1,
          shipper_name: '',
          phone: '',
          address: '',
          delivery_yn: 'Y',
          active_yn: 'Y'
        }
      } else {
        this.shipper = {
          ...this.shipperList.filter((shipper) => shipper.shipper_id === id)[0]
        }
      }
    },
    async doCreate() {
      this.$swal({
        title: '배송처를 생성 하시겠습니까?',
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

          const shipper = { ...this.shipper }
          delete shipper.shipper_id

          const r = await this.$post('/api/shipper', {
            param: shipper
          })

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '생성 되었습니다.',
              '신규 배송처가 생성 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doSave() {
      this.$swal({
        title: '배송처 정보를 수정 하시겠습니까?',
        // text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '저장',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 저장 로직 구현
          const loader = this.$loading.show()

          const shipper = { ...this.shipper }
          delete shipper.shipper_id

          const r = await this.$put(`/api/shipper/${this.shipper.shipper_id}`, {
            param: shipper
          })

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '수정 되었습니다.',
              '배송처 정보가 저장 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doDelete(id) {
      this.$swal({
        title: '선택한 배송처를 정말 삭제 하시겠습니까?',
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

          const r = await this.$delete(`/api/shipper/${id}`)

          loader.hide()

          if (r.status === 200) {
            this.$swal(
              '삭제 되었습니다.',
              '배송처가 삭제 되었습니다',
              'success'
            )

            this.doSearch()
          } else if (r.status === 501) {
            this.$swal(
              `삭제하려는 배송처를 사용해서 배송중인 주문이 ${r.count}건 존재합니다.`,
              '배송처가 삭제 되지않았습니다',
              'success'
            )
          }
        }
      })
    },
    async changeStatus(id, status) {
      let title = '카테고리 사용을 중지하시겠습니까?'
      if (status === 'Y') {
        title = '카테고리를 다시 사용하시겠습니까?'
      }

      this.$swal({
        title: title,
        // text: '삭제된 데이터는 복구할 수 없습니다!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '저장',
        cancelButtonText: '취소'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // 저장 로직 구현
          const loader = this.$loading.show()

          const r = await this.$put(`/api/category/${id}`, {
            param: {
              use_yn: status
            }
          })

          loader.hide()

          if (r.status === 200) {
            this.$swal(
              '상태가 변경 되었습니다.',
              '카테고리 정보가 저장 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    clearShipper() {
      this.shipper = {
        shipper_id: -1,
        shipper_name: '',
        phone: '',
        address: '',
        delivery_yn: 'Y',
        active_yn: 'Y'
      }
    },
    downloadExcel() {
      this.$excelFromTable(this.headers, this.shipperList, 'shipperList', {})
    }
  }
}
</script>
