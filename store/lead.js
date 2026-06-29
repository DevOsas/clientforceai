// state
export const state = () => ({
  importedRows: 0,
})

// getters
export const getters = {}

// mutations
export const mutations = {
  UPDATE_IMPORTED_ROWS(state, importedRows) {
    state.importedRows = importedRows
  },
}

// actions
export const actions = {
  updateImportedRows({ commit }, rows) {
    commit('UPDATE_IMPORTED_ROWS', rows)
  },
}
