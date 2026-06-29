// Onboarding state management
export const state = () => ({
  completedSteps: [],
  currentStep: null,
  isOnboardingActive: false,
  onboardingData: {
    // Store data from each modal
    businessName: '',
    goals: '',
    selectedAgent: '',
    agentData: null,
    channel: '',
    provider: '',
    providerData: null
    // Add more fields as you add more modals
  },
  onboardingSteps: [
    {
      id: 'create-campaign',
      name: 'Create Campaign',
      component: 'NewCampaignV2Modal',
      completed: false,
      required: true
    },
    {
      id: 'choose-agent',
      name: 'Choose Agent',
      component: 'ChooseAgentModal',
      completed: false,
      required: true
    },
    {
      id: 'connect-channels',
      name: 'Connect Channels',
      component: 'ConnectChannelsModal',
      completed: false,
      required: true
    }
    // Add more steps as needed
  ]
})

export const mutations = {
  SET_COMPLETED_STEPS(state, steps) {
    state.completedSteps = steps
  },

  COMPLETE_STEP(state, stepId) {
    if (!state.completedSteps.includes(stepId)) {
      state.completedSteps.push(stepId)
    }
    
    // Update the step in onboardingSteps
    const step = state.onboardingSteps.find(s => s.id === stepId)
    if (step) {
      step.completed = true
    }
  },

  SET_CURRENT_STEP(state, stepId) {
    state.currentStep = stepId
  },

  SET_ONBOARDING_ACTIVE(state, isActive) {
    state.isOnboardingActive = isActive
  },

  SET_ONBOARDING_DATA(state, data) {
    state.onboardingData = { ...state.onboardingData, ...data }
  },

  RESET_ONBOARDING(state) {
    state.completedSteps = []
    state.currentStep = null
    state.isOnboardingActive = false
    state.onboardingData = {
      businessName: '',
      goals: '',
      selectedAgent: '',
      agentData: null,
      channel: '',
      provider: '',
      providerData: null
    }
    state.onboardingSteps.forEach(step => {
      step.completed = false
    })
  }
}

export const actions = {
  // Load onboarding state from localStorage or API
  async loadOnboardingState({ commit }) {
    try {
      // Option 1: From localStorage
      const savedSteps = localStorage.getItem('onboarding_completed_steps')
      if (savedSteps) {
        const steps = JSON.parse(savedSteps)
        commit('SET_COMPLETED_STEPS', steps)
      }

      // Option 2: From API (if you store in backend)
      // const { data } = await this.$apollo.query({
      //   query: GET_USER_ONBOARDING_STATUS
      // })
      // commit('SET_COMPLETED_STEPS', data.completedSteps)
    } catch (error) {
      console.error('Failed to load onboarding state:', error)
    }
  },

  // Save onboarding state
  async saveOnboardingState({ state }) {
    try {
      // Option 1: To localStorage
      localStorage.setItem(
        'onboarding_completed_steps',
        JSON.stringify(state.completedSteps)
      )

      // Option 2: To API (if you want to store in backend)
      // await this.$apollo.mutate({
      //   mutation: UPDATE_USER_ONBOARDING_STATUS,
      //   variables: {
      //     completedSteps: state.completedSteps
      //   }
      // })
    } catch (error) {
      console.error('Failed to save onboarding state:', error)
    }
  },

  // Mark a step as completed
  async completeStep({ commit, dispatch }, { stepId, data }) {
    // Save the data from this step
    if (data) {
      commit('SET_ONBOARDING_DATA', data)
    }
    
    commit('COMPLETE_STEP', stepId)
    await dispatch('saveOnboardingState')
    await dispatch('moveToNextStep')
  },

  // Start onboarding flow
  async startOnboarding({ commit, state, dispatch }) {
    await dispatch('loadOnboardingState')
    
    // Find first incomplete step
    const nextStep = state.onboardingSteps.find(
      step => step.required && !state.completedSteps.includes(step.id)
    )

    if (nextStep) {
      commit('SET_CURRENT_STEP', nextStep.id)
      commit('SET_ONBOARDING_ACTIVE', true)
    } else {
      commit('SET_ONBOARDING_ACTIVE', false)
    }
  },

  // Move to next incomplete step
  async moveToNextStep({ commit, state }) {
    const nextStep = state.onboardingSteps.find(
      step => step.required && !state.completedSteps.includes(step.id)
    )

    if (nextStep) {
      commit('SET_CURRENT_STEP', nextStep.id)
    } else {
      // All steps completed
      commit('SET_ONBOARDING_ACTIVE', false)
      commit('SET_CURRENT_STEP', null)
    }
  },

  // Skip current step (but don't mark as completed)
  skipStep({ dispatch }) {
    // Just close the modal, it will reappear next time
    dispatch('closeOnboarding')
  },

  // Close onboarding (temporarily)
  closeOnboarding({ commit }) {
    commit('SET_ONBOARDING_ACTIVE', false)
  },

  // Reset onboarding (for testing or re-onboarding)
  async resetOnboarding({ commit }) {
    commit('RESET_ONBOARDING')
    localStorage.removeItem('onboarding_completed_steps')
  }
}

export const getters = {
  isOnboardingComplete: (state) => {
    const requiredSteps = state.onboardingSteps.filter(s => s.required)
    return requiredSteps.every(step => state.completedSteps.includes(step.id))
  },

  currentStepData: (state) => {
    return state.onboardingSteps.find(s => s.id === state.currentStep)
  },

  progressPercentage: (state) => {
    const requiredSteps = state.onboardingSteps.filter(s => s.required)
    const completed = requiredSteps.filter(s => 
      state.completedSteps.includes(s.id)
    ).length
    return Math.round((completed / requiredSteps.length) * 100)
  }
}
