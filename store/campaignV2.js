const initialCampaign = {
  id: 0,
  agentInstanceId: null,
  // From modal
  businessName: '',
  goals: '',
  // Step 1: Setup Agent
  agentName: '',
  agentAvatar: null, // URL or file object
  campaignName: '',
  agentTone: '',
  voicePersona: '',
  role: '',
  // Step 2: Choose starting point
  startingPoint: null,
  // Step 3: Conversational Wizard
  wizardAnswer1: '',
  wizardAnswer2: '',
  wizardAnswer3: '',
  wizardAnswer4: '',
  // Step 4: Knowledge Sources
  knowledgeFiles: [],
  knowledgeUrls: [],
  businessName: '',
  industry: '',
  businessDescription: '',
  brandLogo: null, // URL or file object
  // Step 5: Design Sequence
  // Step 6: Add Contacts
  // Step 7: Enable Lead Capture
  // Step 8: Guardrails & Account
  responseTimeLimit: 30,
  maxMessagesPerDay: 100,
  restrictedTopics: '',
  disclaimers: '',
  requireHumanApproval: false,
  enableContentFiltering: true,
  timezone: 'UTC',
  language: 'en',
  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  enableWeekendMessages: false,
  enableEmailNotifications: true,
  gdprCompliant: true,
  ccpaCompliant: true,
  canSpamCompliant: true,
  // Other
  channels: [],
  // Step: Add Contacts (persist staging contacts for the wizard)
  contacts: [],
}

// state
export const state = () => ({
  campaign: { ...initialCampaign },
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_CAMPAIGN(state, payload) {
    state.campaign = { ...state.campaign, ...payload }
  },

  RESET_CAMPAIGN(state) {
    state.campaign = { ...initialCampaign }
  },
}

// actions
export const actions = {
  updateCampaign({ commit }, data) {
    commit('UPDATE_CAMPAIGN', data)
  },

  resetCampaign({ commit }) {
    commit('RESET_CAMPAIGN')
  },
}
