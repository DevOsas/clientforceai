// state
export const state = () => ({
  submissionsCount: 0,
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_SUBMISSIONS_COUNT(state, count) {
    state.submissionsCount = count
  },
}

// actions
export const actions = {
  updateSubmissionsCount({ commit }, count) {
    commit('UPDATE_SUBMISSIONS_COUNT', count)
  },
}
