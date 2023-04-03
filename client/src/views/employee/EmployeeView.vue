<template>
  <div class="mt-3">
    <div class="row gx-3 gy-2 align-items-center">
      <div class="col-sm-3">
        <label class="visually-hidden" for="searchEmployeeName">Name</label>
        <input
          type="text"
          class="form-control"
          id="searchEmployeeName"
          placeholder="Employee Name"
          v-model="searchName"
          @keyup.enter="doSearch"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary me-1" @click="doSearch">Search</button>
        <button
          class="btn btn-success me-1"
          data-bs-toggle="modal"
          data-bs-target="#employeeModal"
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
          <th>Salesperson YN</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr :key="employee.employee_id" v-for="employee in employeeList">
          <td>{{ employee.employee_id }}</td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.phone }}</td>
          <td>{{ employee.salesperson_yn }}</td>
          <td>
            <button
              class="btn btn-success me-1"
              data-bs-toggle="modal"
              data-bs-target="#employeeModal"
              @click="openModal(employee.employee_id)"
            >
              수정
            </button>
            <button
              class="btn btn-danger me-1"
              @click="doDelete(employee.employee_id)"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <slot-modal modalId="employeeModal">
      <template v-slot:title>Employee</template>
      <template v-slot:body>
        <div class="row mb-3">
          <label for="employeeName" class="col-sm-4 col-form-label">Name</label>
          <div class="col-sm-8">
            <input
              type="text"
              name=""
              id="employeeName"
              class="form-control"
              v-model="employee.name"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="employeePhone" class="col-sm-4 col-form-label"
            >Phone</label
          >
          <div class="col-sm-8">
            <input
              type="tel"
              name=""
              id="employeePhone"
              class="form-control"
              v-model="employee.phone"
            />
          </div>
        </div>

        <div class="row mb-3">
          <label for="salespersonYN" class="col-sm-4 col-form-label"
            >Salesperson YN</label
          >
          <div class="col-sm-8">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                v-model="employee.salesperson_yn"
                id="salespersonY"
                value="Y"
              />
              <label class="form-check-label" for="salespersonY">Y</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                v-model="employee.salesperson_yn"
                id="salespersonN"
                value="N"
              />
              <label class="form-check-label" for="salespersonN">N</label>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-secondary me-1"
          data-bs-dismiss="modal"
          ref="btnClose"
          @click="clearEmployee"
        >
          Cancel
        </button>
        <button
          class="btn btn-danger"
          @click="doCreate"
          v-if="employee.employee_id === -1"
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
        { title: 'Employee ID', key: 'employee_id' },
        { title: 'Employee Name', key: 'name' },
        { title: 'Phone', key: 'phone' },
        { title: 'Salesperson YN', key: 'salesperson_yn' }
      ],
      employeeList: [],
      employee: {
        employee_id: -1,
        name: '',
        phone: '',
        salesperson_yn: 'Y'
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
      this.employeeList = await this.$get('/api/employee/name', {
        params: { name: this.searchName }
      })
      loader.hide()
    },
    openModal(id) {
      if (id === undefined) {
        this.employee = {
          employee_id: -1,
          name: '',
          phone: '',
          salesperson_yn: 'Y'
        }
      } else {
        this.employee = {
          ...this.employeeList.filter(
            (employee) => employee.employee_id === id
          )[0]
        }
      }
    },
    async doCreate() {
      this.$swal({
        title: 'Employee를 생성 하시겠습니까?',
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

          const employee = { ...this.employee }
          delete employee.employee_id

          const r = await this.$post('/api/employee', {
            param: employee
          })

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '생성 되었습니다.',
              '신규 Employee가 생성 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doSave() {
      this.$swal({
        title: 'Employee 정보를 수정 하시겠습니까?',
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

          const employee = { ...this.employee }
          delete employee.employee_id
          delete employee.created_datetime

          const r = await this.$put(
            `/api/employee/${this.employee.employee_id}`,
            {
              param: employee
            }
          )

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '수정 되었습니다.',
              'Employee 정보가 저장 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doDelete(id) {
      this.$swal({
        title: '선택한 Employee를 정말 삭제 하시겠습니까?',
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

          const r = await this.$delete(`/api/employee/${id}`)

          loader.hide()

          if (r.status === 200) {
            this.$swal(
              '삭제 되었습니다.',
              'Employee가 삭제 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    clearEmployee() {
      this.employee = {
        employee_id: -1,
        name: '',
        phone: '',
        salesperson_yn: 'Y'
      }
    },
    downloadExcel() {
      this.$excelFromTable(this.headers, this.employeeList, 'employeeList', {})
    }
  }
}
</script>
