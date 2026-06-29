const initialCampaign = {
  id: 0,
  title: '',
  steps: [],
}

// state
export const state = () => ({
  template: null,
  viewing: null,
  setup: initialCampaign,
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_VIEWING(state, viewing) {
    state.viewing = viewing
  },
  TEMPLATE(state, template) {
    state.template = template
  },
  UPDATE_SETUP_CAMPAIGN(state, setup) {
    state.setup = { ...state.setup, ...setup }
  },
}

// actions
export const actions = {
  updateTemplate({ commit }, template) {
    commit('TEMPLATE', template)
  },

  updateViewing({ commit }, viewing) {
    commit('UPDATE_VIEWING', viewing)
  },

  updateSetup({ commit }, campaign) {
    commit('UPDATE_SETUP_CAMPAIGN', campaign)
  },

  resetSetup({ commit }) {
    commit('UPDATE_SETUP_CAMPAIGN', initialCampaign)
  },
}
