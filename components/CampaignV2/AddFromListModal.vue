<template>
  <b-modal id="AddFromListModal" hide-header hide-footer centered size="xl" dialog-class="afl-modal-dialog">
    <div class="afl-modal">
      <div class="afl-header">
        <h2 class="afl-title">Add Contacts From Lists</h2>
        <b-button variant="link" class="afl-close" @click="$bvModal.hide('AddFromListModal')">
          <SvgIcon name="close-alt-2" />

        </b-button>
      </div>

      <div class="afl-body">
        <label class="afl-label">Lists</label>
        <b-form-input
          v-model="query"
          placeholder="Search lists"
          class="afl-search"
        />

        <div class="afl-cards">
          <label
            v-for="l in filteredLists"
            :key="l.id"
            class="afl-card"
            :class="{ selected: selectedListIds.includes(l.id) }"
          >
            <b-form-checkbox :value="l.id" v-model="selectedListIds" class="afl-checkbox">
              {{ l.title }}
            </b-form-checkbox>
          </label>
        </div>
      </div>

      <div class="afl-footer">
        <b-button variant="outline-dark" class="afl-back" @click="$bvModal.hide('AddFromListModal')">Back</b-button>
        <b-button
          variant="primary"
          class="afl-confirm"
          :disabled="selectedListIds.length === 0"
          @click="confirm"
        >
          Add Leads
          <span class="arrow">→</span>
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { ALL_LEAD_LISTS_QUERY } from '~/graphql/lead/queries'

export default {
  name: 'AddFromListModal',
  data() {
    return {
      selectedListIds: [],
      lists: [],
      query: '',
    }
  },
  apollo: {
    lists: {
      query: ALL_LEAD_LISTS_QUERY,
      update: (data) => data.lists || [],
      fetchPolicy: 'network-only',
    },
  },
  computed: {
    filteredLists() {
      const q = this.query.trim().toLowerCase()
      if (!q) return this.lists
      return this.lists.filter((l) => (l.title || '').toLowerCase().includes(q))
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.selectedListIds)
      this.selectedListIds = []
      this.query = ''
      this.$bvModal.hide('AddFromListModal')
    },
  },
}
</script>

<style lang="scss" >
@import '@/assets/scss/variables.scss';

.afl-modal {
  padding: 12px 4px 24px 4px;
}

.afl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 16px 12px;
}

.afl-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.afl-close {
  color: #6b7280;
}

.afl-body {
  padding: 0 12px;
}

.afl-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

.afl-search {
  margin-bottom: 16px;
  padding: 20px;
}
.afl-search:focus {
      border-color: $primary !important;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

.afl-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
  margin-top: 3rem;
  margin-bottom: 4rem !important;
}

.afl-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  background: #fff;
}

.afl-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.afl-card.selected {
  border-color: #10b981;
  // box-shadow: 0 2px 10px rgba(16, 185, 129, 0.15);
}

.afl-checkbox {
  margin: 0;
  font-weight: 600;
}

.afl-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 12px 0 12px;
}

// .afl-back {
//   color: #6b7280;
// }

.afl-confirm {
  background: $primary;
  border: 1px solid $primary;
  color: #2f2f41 !important;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 8px;
}

.afl-confirm:disabled {
  opacity: 0.6;
}

.arrow {
  display: inline-block;
  margin-left: 8px;
}
</style>

<style lang="scss">
/* Global modal sizing: the modal dialog lives under <body>, so scoped styles won't reach it */
.afl-modal-dialog {
  max-width: 860px !important;
  margin: 1.75rem auto !important;
}
</style>
