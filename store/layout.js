// state
export const state = () => ({
  showFooter: true,
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_SHOW_FOOTER(state, showFooter) {
    state.showFooter = showFooter
  },
}

// actions
export const actions = {
  updateShowFooter({ commit }, showFooter) {
    commit('UPDATE_SHOW_FOOTER', showFooter)
  },

  showFooter({ dispatch }) {
    dispatch('updateShowFooter', true)
  },

  hideFooter({ dispatch }) {
    dispatch('updateShowFooter', false)
  },
}
