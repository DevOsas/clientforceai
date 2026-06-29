import forms from '~/utils/emailAccountForms'

// state
export const state = () => ({
  current: null,
  platform: null,
  form: forms.other,
})

const isEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email)
}

// getters
export const getters = {
  hasInvalidImapSettings: (state) => {
    const { imapSettings } = state.form

    return (
      !imapSettings.username ||
      !imapSettings.host ||
      !imapSettings.port ||
      !imapSettings.password
    )
  },

  hasInvalidSmtpSettings: (state) => {
    const { smtpSettings } = state.form

    return (
      !smtpSettings.email ||
      !smtpSettings.senderName ||
      !smtpSettings.host ||
      !smtpSettings.port ||
      !smtpSettings.password ||
      !isEmail(smtpSettings.email)
    )
  },
}

// mutations
export const mutations = {
  UPDATE_CURRENT(state, current) {
    state.current = current
  },
  UPDATE_PLATFORM(state, platform) {
    state.platform = platform
  },
  UPDATE_FORM(state, form) {
    // Normalize ports to numbers
    const normalizedForm = { ...form }
    
    if (normalizedForm.smtpSettings && normalizedForm.smtpSettings.port !== null && normalizedForm.smtpSettings.port !== undefined && normalizedForm.smtpSettings.port !== '') {
      normalizedForm.smtpSettings = {
        ...normalizedForm.smtpSettings,
        port: Number(normalizedForm.smtpSettings.port)
      }
    }
    
    if (normalizedForm.imapSettings && normalizedForm.imapSettings.port !== null && normalizedForm.imapSettings.port !== undefined && normalizedForm.imapSettings.port !== '') {
      normalizedForm.imapSettings = {
        ...normalizedForm.imapSettings,
        port: Number(normalizedForm.imapSettings.port)
      }
    }
    
    state.form = normalizedForm
  },
}

// actions
export const actions = {
  updateCurrent({ commit }, current) {
    commit('UPDATE_CURRENT', current)
  },

  updatePlatform({ commit }, platform) {
    commit('UPDATE_PLATFORM', platform)

    const params = forms[platform] || forms.other

    commit('UPDATE_FORM', params)
  },

  updateForm({ commit }, form) {
    commit('UPDATE_FORM', form)
  },
}
