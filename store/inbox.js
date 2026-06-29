// state
export const state = () => ({
  categories: [],
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_CATEGORIES(state, categories) {
    state.categories = categories
  },
}

// actions
export const actions = {
  updateCategories({ commit }, categories) {
    commit('UPDATE_CATEGORIES', categories)
  },
}
