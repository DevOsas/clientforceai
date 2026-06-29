<template>
  <div class="add-contacts-step">
   

    <!-- Upload Options -->
    <div class="upload-options">
      <div 
        class="upload-card" 
        :class="{ selected: selectedUploadMethod === 'device' }"
        @click="handleUploadFromDevice"
      >
        <div class="upload-icon">
          <SvgIcon name="upload" size="lg"   />
        </div>
        <h4 class="upload-title">Upload from device</h4>
        <p class="upload-subtitle">CSV import</p>
      </div>

      <div 
        class="upload-card" 
        :class="{ selected: selectedUploadMethod === 'list' }"
        @click="handleAddFromList"
      >
        <div class="upload-icon plus-icon">
          <SvgIcon name="plus-alt-gray" size="lg"   />
        </div>
        <h4 class="upload-title">Add From List</h4>
        <p class="upload-subtitle">Quick - Add from contacts</p>
      </div>

      <div 
        class="upload-card" 
        :class="{ selected: selectedUploadMethod === 'manual' }"
        @click="handleManualAdd"
      >
        <div class="upload-icon plus-icon">
          <SvgIcon name="plus-alt-gray" size="lg"   />
        </div>
        <h4 class="upload-title">Manual Add</h4>
        <p class="upload-subtitle">Quick - Add individual contacts</p>
      </div>
    </div>

    <!-- Contacts Table -->
    <div class="contacts-section">
      <h3 class="section-title">Contacts</h3>

      <div class="contacts-table-wrapper">
        <table class="contacts-table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <b-form-checkbox v-model="selectAll" @change="toggleSelectAll" />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Website</th>
              <th class="action-col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in contacts" :key="contact.id" :class="{ selected: contact.selected }">
              <td class="checkbox-col">
                <b-form-checkbox :checked="contact.selected" @change="onContactChecked(contact.id, $event)" />
              </td>
              <td>{{ contact.name }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ contact.company }}</td>
              <td>
                <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="contact-link">
                  {{ contact.phone }}
                </a>
              </td>
              <td>
                <a v-if="contact.website" :href="contact.website" target="_blank" class="contact-link">
                  {{ contact.website }}
                </a>
              </td>
              <td class="action-col">
                <b-button variant="link" class="delete-btn" @click="deleteContact(contact.id)">
                  <SvgIcon name="trash" />
                </b-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <LeadCsvImportModal @complete="handleImportComplete" />
    
    <LeadFormModal @saved="handleLeadSaved" />

    <AddFromListModal @confirm="handleAddFromListConfirm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ALL_LEADS_QUERY } from '~/graphql/lead/queries'
import LeadCsvImportModal from '~/components/Lead/LeadCsvImportModal'
import LeadFormModal from '~/components/Lead/LeadFormModal'
import AddFromListModal from '~/components/CampaignV2/AddFromListModal'

export default {
  name: 'AddContactsStep',
  
  components: {
    LeadCsvImportModal,
    LeadFormModal,
    AddFromListModal,
  },
  
  data() {
    return {
      selectAll: false,
      selectedUploadMethod: null,
    }
  },

  computed: {
    ...mapState('campaignV2', {
      campaign: (state) => state.campaign,
    }),

    contacts() {
      return this.campaign.contacts || []
    },

    hasContacts() {
      return this.contacts.length > 0
    },
  },
  methods: {
    toggleSelectAll() {
      const updated = this.contacts.map((c) => ({ ...c, selected: this.selectAll }))
      this.$store.dispatch('campaignV2/updateCampaign', { contacts: updated })
    },

    onContactChecked(id, evt) {
      const checked = typeof evt === 'boolean' ? evt : !!(evt && evt.target ? evt.target.checked : evt)
      const updated = this.contacts.map((c) => (c.id === id ? { ...c, selected: checked } : c))
      this.$store.dispatch('campaignV2/updateCampaign', { contacts: updated })
    },

    handleUploadFromDevice() {
      this.selectedUploadMethod = 'device'
      this.$bvModal.show('LeadCsvImportModal')
    },

    handleAddFromList() {
      this.selectedUploadMethod = 'list'
      this.$bvModal.show('AddFromListModal')
    },

    handleManualAdd() {
      this.selectedUploadMethod = 'manual'
      this.$bvModal.show('LeadFormModal')
    },

    async handleAddFromListConfirm(listIds) {
      if (!Array.isArray(listIds) || listIds.length === 0) return

      this.$nuxt.$loading.start()

      try {
        const seen = new Set(this.contacts.map((c) => c.id))
        const fetched = []

        for (const listId of listIds) {
          let offset = 0
          const limit = 200
          let hasMore = true

          // paginate through all leads in the selected list(s)
          while (hasMore) {
            const { data } = await this.$apollo.query({
              query: ALL_LEADS_QUERY,
              variables: { listId, limit, offset },
              fetchPolicy: 'network-only',
            })

            const result = data && data.result ? data.result : null
            const pageLeads = (result && result.leads) || []
            hasMore = !!(result && result.hasMore)
            offset += limit

            for (const lead of pageLeads) {
              if (lead && !seen.has(lead.id)) {
                seen.add(lead.id)
                fetched.push(lead)
              }
            }

            // Safety cap to avoid massive loads
            if (fetched.length > 5000) {
              hasMore = false
            }
          }
        }

        const newContacts = fetched.map((lead) => ({
          id: lead.id,
          selected: false,
          name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.company || 'N/A',
          email: lead.email || 'N/A',
          company: lead.company || 'N/A',
          phone: lead.phone || 'N/A',
          website: lead.website || 'N/A',
        }))

        const merged = [...this.contacts, ...newContacts]
        await this.$store.dispatch('campaignV2/updateCampaign', { contacts: merged })

        this.$notify({
          group: 'main',
          type: 'success',
          text: `${newContacts.length} contact(s) added from list${listIds.length > 1 ? 's' : ''}.`,
        })
      } catch (e) {
        this.$notify({
          group: 'main',
          type: 'error',
          text: 'Failed to add contacts from list. Please try again.',
        })
      } finally {
        this.$nuxt.$loading.finish()
      }
    },

    handleImportComplete(importedLeads) {
      // Add imported leads from CSV to contacts table (persist in Vuex)
      if (importedLeads && importedLeads.length > 0) {
        const newContacts = importedLeads.map(lead => ({
          id: lead.id,
          selected: false,
          name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.company || 'N/A',
          email: lead.email || 'N/A',
          company: lead.company || 'N/A',
          phone: lead.phone || 'N/A',
          website: lead.website || 'N/A',
        }))
        const merged = [...this.contacts, ...newContacts]
        this.$store.dispatch('campaignV2/updateCampaign', { contacts: merged })
        this.$notify({
          group: 'main',
          type: 'success',
          text: `${importedLeads.length} contact(s) imported successfully!`,
        })
      }
    },

    handleLeadSaved(lead) {
      // Add manually created lead to contacts table (persist in Vuex)
      if (lead) {
        const newContact = {
          id: lead.id,
          selected: false,
          name: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.company || 'N/A',
          email: lead.email || 'N/A',
          company: lead.company || 'N/A',
          phone: lead.phone || 'N/A',
          website: lead.website || 'N/A',
        }
        const merged = [...this.contacts, newContact]
        this.$store.dispatch('campaignV2/updateCampaign', { contacts: merged })
        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Contact added successfully!',
        })
      }
    },

    deleteContact(id) {
      const remaining = this.contacts.filter(c => c.id !== id)
      this.$store.dispatch('campaignV2/updateCampaign', { contacts: remaining })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.add-contacts-step {
  background: $white;

  .upload-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 40px;

    .upload-card {
      background: $white;
      border: 2px solid #e5e5e5;
      border-radius: 12px;
      padding: 32px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;

      &:hover {
        border-color: $gray-400;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      &.selected {
        border-color: $primary;
        background: rgba($primary, 0.02);

        &::after {
          content: '';
          position: absolute;
          top: 12px;
          left: 12px;
          width: 24px;
          height: 24px;
          background: $primary;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &::before {
          content: '✓';
          position: absolute;
          top: 12px;
          left: 12px;
          width: 24px;
          height: 24px;
          color: $white;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
      }

      .upload-icon {
        width: 56px;
        height: 56px;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        // background: #f5f5f5;
        border-radius: 50%;

        &.plus-icon {
          background: $white;
          // border: 2px solid #e5e5e5;
          width: 56px;
          height: 56px;
        }
      }

      .upload-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: $gray-900;
        margin-bottom: 4px;
      }

      .upload-subtitle {
        font-size: 0.85rem;
        color: $gray-600;
        margin: 0;
      }
    }
  }

  // SVG styles - completely flattened to avoid all specificity conflicts
  /* stylelint-disable no-descending-specificity */
  .upload-options .upload-card .upload-icon svg {
    width: 38px;
    height: 38px;
    color: $gray-700;
  }

  .upload-options .upload-card .upload-icon.plus-icon svg {
    width: 38px;
    height: 38px;
    color: $gray-600;
  }

  .contacts-section .contacts-table table tbody tr td .delete-btn svg {
    width: 24px;
    height: 24px;
    color: $gray-700;
  }
  /* stylelint-enable no-descending-specificity */

  .contacts-section {
    margin-bottom: 40px;

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: $gray-900;
      margin-bottom: 20px;
    }

    .contacts-table-wrapper {
      background: $white;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      overflow-x: auto;
      overflow-y: hidden;

      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 0 0 12px 12px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d0d0d0;
        border-radius: 4px;

        &:hover {
          background: #b0b0b0;
        }
      }
    }

    .contacts-table {
      width: 100%;
      min-width: 900px;
      border-collapse: collapse;

      thead {
        background: #fafafa;
        border-bottom: 1px solid #e5e5e5;

        th {
          padding: 14px 16px;
          text-align: left;
          font-size: 0.85rem;
          font-weight: 600;
          color: $gray-700;
          letter-spacing: 0.5px;
          white-space: nowrap;

          &.checkbox-col {
            width: 50px;
            padding-left: 20px;
          }

          &.action-col {
            width: 80px;
            text-align: center;
          }
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s ease;

          &:hover {
            background: #fafafa;
          }

          &.selected {
            background: #f0f9ff;
          }

          &:last-child {
            border-bottom: none;
          }

          td {
            padding: 16px;
            font-size: 0.9rem;
            color: $gray-800;
            white-space: nowrap;

            &.checkbox-col {
              padding-left: 20px;
            }

            &.action-col {
              text-align: center;
            }

            .contact-link {
              color: #0ea5e9;
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }

            .delete-btn {
              padding: 6px;
              color: $gray-500;

              &:hover {
                color: #ef4444;
              }
            }
          }
        }
      }
    }
  }

}
</style>
