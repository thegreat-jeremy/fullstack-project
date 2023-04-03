<template>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/databinding/string">String</router-link> |
    <router-link to="/databinding/html">Html</router-link>
  </nav> -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" @click="goToMenu('/')">개발자의품격</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/' }"
              aria-current="page"
              @click="goToMenu('/')"
              >Home</a
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              :class="{
                active:
                  $route.path.indexOf('/category/') > -1 ||
                  $route.path.indexOf('/supplier/') > -1 ||
                  $route.path.indexOf('/shipper/') > -1 ||
                  $route.path.indexOf('/employee/') > -1 ||
                  $route.path.indexOf('/customer/') > -1
              }"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Admin
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a class="dropdown-item" @click="goToMenu('/category/list')"
                  >Category</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="goToMenu('/supplier/list')"
                  >Supplier</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="goToMenu('/shipper/list')"
                  >Shipper</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="goToMenu('/employee/list')"
                  >Employee</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="goToMenu('/customer/list')"
                  >Customer</a
                >
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/order/list' }"
              aria-current="page"
              @click="goToMenu('/order/list')"
              >Order List</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/product/list' }"
              aria-current="page"
              @click="goToMenu('/product/list')"
              >Product List</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/products' }"
              aria-current="page"
              @click="goToMenu('/products')"
              >Products</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/basket' }"
              aria-current="page"
              @click="goToMenu('/basket')"
              >Basket</a
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              :class="{ active: $route.path.indexOf('/template/') > -1 }"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Template
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a
                  class="dropdown-item"
                  @click="goToMenu('/template/p1/single')"
                  >SingleViewEdit</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click="goToMenu('/template/p2/multiple')"
                  >MultipleEdit</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="goToMenu('/template/p3/list')"
                  >ListToDetail</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click="goToMenu('/template/p4/master')"
                  >MasterDetail</a
                >
              </li>
            </ul>
          </li>
          <!-- <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/template/p1/single' }"
              aria-current="page"
              @click="goToMenu('/template/p1/single')"
              >SingleViewEdit</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/template/p2/multiple' }"
              aria-current="page"
              @click="goToMenu('/template/p2/multiple')"
              >MultipleEdit</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/template/p3/list' }"
              aria-current="page"
              @click="goToMenu('/template/p3/list')"
              >ListToDetail</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: $route.path === '/template/p4/master' }"
              aria-current="page"
              @click="goToMenu('/template/p4/master')"
              >MasterDetail</a
            >
          </li> -->
        </ul>
        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  methods: {
    goToMenu(path) {
      this.$router.push({ path: path })
    }
  }
}
</script>
<style>
.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(128, 0, 0, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E") !important;
}
</style>
