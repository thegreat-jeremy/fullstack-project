export const basket = {
  // 중앙 데이터 저장소
  namespaced: true,
  state() {
    return {
      baskets: []
    }
  },
  // Store를 위한 computed라고 생각하면 됨.
  getters: {
    basketCount(state) {
      return state.baskets.length
    }
  },
  // 상태(state)를 변경시킬 수 있는 유일한 방법(함수)
  mutations: {
    add(state, item) {
      if (
        state.baskets.filter((b) => b.product_id === item.product_id).length > 0
      ) {
        state.baskets.filter(
          (b) => b.product_id === item.product_id
        )[0].order_qty = item.order_qty
      } else {
        state.baskets.push(item)
      }
    },
    remove(state, id) {
      state.baskets = state.baskets.filter((b) => b.product_id !== id)
    },
    removeAll(state) {
      state.baskets = []
    }
  }
}
