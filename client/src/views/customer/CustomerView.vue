<template>
  <div class="mt-3">
    <div class="row gx-3 gy-2 align-items-center">
      <div class="col-sm-3">
        <label class="visually-hidden" for="searchCustomerName">Name</label>
        <input
          type="text"
          class="form-control"
          id="searchCustomerName"
          placeholder="Customer Name"
          v-model="searchName"
          @keyup.enter="doSearch"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary me-1" @click="doSearch">Search</button>
        <button
          class="btn btn-success me-1"
          data-bs-toggle="modal"
          data-bs-target="#customerModal"
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
          <th>Email</th>
          <th>Address</th>
          <th>Employee</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr :key="customer.customer_id" v-for="customer in customerList">
          <td>{{ customer.customer_id }}</td>
          <td>{{ customer.customer_name }}</td>
          <td>{{ customer.phone }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.address }}</td>
          <td>{{ customer.employee_name }}</td>
          <td>
            <button
              class="btn btn-success me-1"
              data-bs-toggle="modal"
              data-bs-target="#customerModal"
              @click="openModal(customer.customer_id)"
            >
              수정
            </button>
            <button
              class="btn btn-danger me-1"
              @click="doDelete(customer.customer_id)"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <slot-modal modalId="customerModal">
      <template v-slot:title>Customer</template>
      <template v-slot:body>
        <div class="row mb-3">
          <label for="customerName" class="col-sm-4 col-form-label">Name</label>
          <div class="col-sm-8">
            <input
              type="text"
              name=""
              id="customerName"
              class="form-control"
              v-model="customer.customer_name"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="customerPhone" class="col-sm-4 col-form-label"
            >Phone</label
          >
          <div class="col-sm-8">
            <input
              type="tel"
              name=""
              id="customerPhone"
              class="form-control"
              v-model="customer.phone"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="customerEmail" class="col-sm-4 col-form-label"
            >Email</label
          >
          <div class="col-sm-8">
            <input
              type="tel"
              name=""
              id="customerEmail"
              class="form-control"
              v-model="customer.email"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="customerAddress" class="col-sm-4 col-form-label"
            >Address</label
          >
          <div class="col-sm-8">
            <input
              type="tel"
              name=""
              id="customerAddress"
              class="form-control"
              v-model="customer.address"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="customerEmployeeId" class="col-sm-4 col-form-label"
            >Employee</label
          >
          <div class="col-sm-8">
            <select
              id="customerEmployeeId"
              class="form-select"
              v-model="customer.employee_id"
            >
              <option
                :value="employee.employee_id"
                :key="employee.employee_id"
                v-for="employee in employeeList"
              >
                {{ employee.name }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-secondary me-1"
          data-bs-dismiss="modal"
          ref="btnClose"
          @click="clearCustomer"
        >
          Cancel
        </button>
        <button
          class="btn btn-danger"
          @click="doCreate"
          v-if="customer.customer_id === -1"
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
        { title: 'Customer ID', key: 'customer_id' },
        { title: 'Customer Name', key: 'customer_name' },
        { title: 'Phone', key: 'phone' },
        { title: 'Email', key: 'email' },
        { title: 'Address', key: 'address' },
        { title: 'Delivery YN', key: 'delivery_yn' },
        { title: 'Active YN', key: 'active_yn' }
      ],
      customerList: [],
      customer: {
        customer_id: -1,
        customer_name: '',
        phone: '',
        email: '',
        address: '',
        employee_id: -1
      },
      searchName: '',
      employeeList: []
    }
  },
  setup() {},
  created() {
    this.getEmployeeList()
  },
  mounted() {},
  unmounted() {},
  methods: {
    async getEmployeeList() {
      this.employeeList = await this.$get('/api/employee')
    },
    async doSearch() {
      const loader = this.$loading.show()
      const r = await this.$post('/api/customer2/search', {
        where: `t1.employee_id=t2.employee_id and t1.customer_name like "%${this.searchName}%"`
      })

      if (r.status === 200) {
        this.customerList = r.data
      }
      loader.hide()
    },
    openModal(id) {
      if (id === undefined) {
        this.customer = {
          customer_id: -1,
          customer_name: '',
          phone: '',
          email: '',
          address: '',
          employee_id: -1
        }
      } else {
        this.customer = {
          ...this.customerList.filter(
            (customer) => customer.customer_id === id
          )[0]
        }
      }
    },
    async doCreate() {
      if (this.customer.customer_name === '') {
        return this.$swal('고객명은 필수입니다.')
      }

      if (this.customer.email === '') {
        return this.$swal('이메일 필수입니다.')
      }

      // 정규식 - 이메일, 전화번호 체크 로직 추가
      const regexpTel = /^010-\d{4}-\d{4}$/
      const regexpEmail =
        /^([a-z]+\d*)+(\.?[a-z]+\d*)+@([a-z]+\d*)+(\.[a-z]{2,3})+$/

      if (!regexpTel.test(this.customer.phone)) {
        return this.$swal(
          'Phone을 올바른 형식으로 입력하세요',
          '010-0000-0000 과 같은 형식입니다',
          'info'
        )
      }

      if (!regexpEmail.test(this.customer.email)) {
        return this.$swal(
          'Email을 올바른 형식으로 입력하세요',
          '이메일은 @를 포함해야합니다',
          'info'
        )
      }

      this.$swal({
        title: '고객을 생성 하시겠습니까?',
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

          const customer = { ...this.customer }
          delete customer.customer_id

          const r = await this.$post('/api/customer2', {
            param: customer
          })

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '생성 되었습니다.',
              '신규 고객이 생성 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doSave() {
      this.$swal({
        title: '고객 정보를 수정 하시겠습니까?',
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

          const customer = { ...this.customer }
          delete customer.customer_id
          delete customer.created_datetime
          delete customer.employee_name

          const r = await this.$put(
            `/api/customer2/${this.customer.customer_id}`,
            {
              param: customer
            }
          )

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '수정 되었습니다.',
              '고객 정보가 저장 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doDelete(id) {
      this.$swal({
        title: '선택한 고객을 정말 삭제 하시겠습니까?',
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

          const r = await this.$delete(`/api/customer2/${id}`)

          loader.hide()

          if (r.status === 200) {
            this.$swal('삭제 되었습니다.', '고객이 삭제 되었습니다', 'success')

            this.doSearch()
          } else if (r.status === 501) {
            this.$swal(
              `삭제하려는 고객이 주문한 ${r.count}건의 주문이 존재합니다.`,
              '고객이 삭제 되지않았습니다',
              'success'
            )
          }
        }
      })
    },
    clearCustomer() {
      this.customer = {
        customer_id: -1,
        customer_name: '',
        phone: '',
        email: '',
        address: '',
        employee_id: -1
      }
    },
    downloadExcel() {
      this.$excelFromTable(this.headers, this.customerList, 'customerList', {})
    }
  }
}
</script>
