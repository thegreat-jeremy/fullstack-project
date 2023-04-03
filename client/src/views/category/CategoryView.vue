<template>
  <div class="mt-3">
    <div class="row gx-3 gy-2 align-items-center">
      <div class="col-sm-3">
        <label class="visually-hidden" for="searchCategoryName">Name</label>
        <input
          type="text"
          class="form-control"
          id="searchCategoryName"
          placeholder="Category Name"
          v-model="searchName"
          @keyup.enter="doSearch"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary me-1" @click="doSearch">Search</button>
        <button
          class="btn btn-success me-1"
          data-bs-toggle="modal"
          data-bs-target="#categoryModal"
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
          <th>Description</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr :key="category.product_category_id" v-for="category in categories">
          <td>{{ category.product_category_id }}</td>
          <td>{{ category.category_name }}</td>
          <td>{{ category.category_description }}</td>
          <td>{{ category.use_yn === 'Y' ? '사용중' : '사용중지' }}</td>
          <td>
            <button
              class="btn btn-success me-1"
              data-bs-toggle="modal"
              data-bs-target="#categoryModal"
              @click="openModal(category.product_category_id)"
            >
              수정
            </button>
            <button
              class="btn btn-danger me-1"
              @click="doDelete(category.product_category_id)"
            >
              삭제
            </button>
            <button
              class="btn btn-warning"
              @click="
                changeStatus(
                  category.product_category_id,
                  category.use_yn === 'Y' ? 'N' : 'Y'
                )
              "
            >
              {{ category.use_yn === 'Y' ? '사용중지' : '사용' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <slot-modal modalId="categoryModal">
      <template v-slot:title>Category</template>
      <template v-slot:body>
        <div class="row mb-3">
          <label for="categoryName" class="col-sm-4 col-form-label">Name</label>
          <div class="col-sm-8">
            <input
              type="text"
              name=""
              id="categoryName"
              class="form-control"
              v-model="category.category_name"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label for="categoryDescription" class="col-sm-4 col-form-label"
            >Description</label
          >
          <div class="col-sm-8">
            <input
              type="text"
              name=""
              id="categoryDescription"
              class="form-control"
              v-model="category.category_description"
            />
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-secondary me-1"
          data-bs-dismiss="modal"
          ref="btnClose"
          @click="clearCategory"
        >
          Cancel
        </button>
        <button
          class="btn btn-danger"
          @click="doCreate"
          v-if="category.product_category_id === -1"
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
        { title: 'Category ID', key: 'product_category_id' },
        { title: 'Category Name', key: 'category_name' },
        { title: 'Category Description', key: 'category_description' },
        { title: 'Status', key: 'use_yn' }
      ],
      categories: [],
      category: {
        product_category_id: -1,
        category_name: '',
        category_description: ''
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
      //   this.categories = await this.$get('/api/category')
      const r = await this.$post('/api/category/search', {
        where: `category_name like "%${this.searchName}%"`
      })

      if (r.status === 200) {
        this.categories = r.data
      }
      loader.hide()
    },
    openModal(id) {
      if (id === undefined) {
        this.category = {
          product_category_id: -1,
          category_name: '',
          category_description: ''
        }
      } else {
        this.category = {
          ...this.categories.filter(
            (category) => category.product_category_id === id
          )[0]
        }
      }
    },
    async doCreate() {
      this.$swal({
        title: '카테고리를 생성 하시겠습니까?',
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

          const r = await this.$post('/api/category', {
            param: {
              category_name: this.category.category_name,
              category_description: this.category.category_description
            }
          })

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '생성 되었습니다.',
              '신규 카테고리가 생성 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doSave() {
      this.$swal({
        title: '카테고리 정보를 수정 하시겠습니까?',
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

          const r = await this.$put(
            `/api/category/${this.category.product_category_id}`,
            {
              param: {
                category_name: this.category.category_name,
                category_description: this.category.category_description
              }
            }
          )

          loader.hide()

          if (r.status === 200) {
            this.$refs.btnClose.click()
            this.$swal(
              '수정 되었습니다.',
              '카테고리 정보가 저장 되었습니다',
              'success'
            )

            this.doSearch()
          }
        }
      })
    },
    async doDelete(id) {
      this.$swal({
        title: '선택한 카테고리를 정말 삭제 하시겠습니까?',
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

          const r = await this.$delete(`/api/category/${id}`)

          loader.hide()

          if (r.status === 200) {
            this.$swal(
              '삭제 되었습니다.',
              '카테고리가 삭제 되었습니다',
              'success'
            )

            this.doSearch()
          } else if (r.status === 501) {
            this.$swal(
              `삭제하려는 카테고리를 사용하는 제품이 ${r.count}건 존재합니다.`,
              '카테고리가 삭제 되지않았습니다',
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
    clearCategory() {
      this.category = {
        product_category_id: -1,
        category_name: '',
        category_description: ''
      }
      console.log(this.category)
    },
    downloadExcel() {
      this.$excelFromTable(this.headers, this.categories, 'categories', {})
    }
  }
}
</script>
