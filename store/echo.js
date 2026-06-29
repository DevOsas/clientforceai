// state
export const state = () => ({
  notificationRegistered: false,
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_NOTIFICATION_REG(state, notificationRegistered) {
    state.notificationRegistered = notificationRegistered
  },
}

// actions
export const actions = {
  notificationRegistered({ commit }) {
    commit('UPDATE_NOTIFICATION_REG', true)
  },
}
