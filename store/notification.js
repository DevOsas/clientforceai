// state
export const state = () => ({
  ringBell: false,
  showUnreadCount: true,
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_RING_BELL(state, ringBell) {
    state.ringBell = ringBell
  },
  UPDATE_SHOW_UNREAD_COUNT(state, isShow) {
    state.showUnreadCount = isShow
  },
}

// actions
export const actions = {
  updateRingBell({ commit }, isRingBell) {
    commit('UPDATE_RING_BELL', isRingBell)
  },
  updateShowUnreadCount({ commit }, isShow) {
    commit('UPDATE_SHOW_UNREAD_COUNT', isShow)
  },
}
