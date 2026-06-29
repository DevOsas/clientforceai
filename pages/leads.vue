<template>
  <div class="leads-page">
    <b-container>
      <div
        v-if="!listId && $apollo.queries.result.loading"
        class="leads-loading"
      >
        <b-spinner variant="primary" />
      </div>
      <div v-else-if="!listId && result.leads.length < 1" class="empty-lead">
        <LeadsIl class="illustration" />
        <h2 class="title">Track major leads</h2>
        <div class="description">
          Add contacts that you would like to get in touch with. You can import
          contacts via a CSV file or add them manually.
        </div>
        <b-button
          v-if="limitBalance.leads > 0 || limitBalance.leads == 'unlimited'"
          variant="primary"
          size="lg"
          class="text-uppercase px-5"
          @click="$bvModal.show('NewLeadModal')"
        >
          Add Leads
        </b-button>
        <template v-else>
          <h5
            v-if="limitBalance.currentPlan?.limits?.leads !== '0'"
            class="text-error text-centered"
          >
            You have exceeded your lead limit
          </h5>
          <h5
            v-else-if="limitBalance.currentPlan"
            class="text-error text-centered"
          >
            Your current plan do not include leads
          </h5>
          <h5 v-else class="text-error text-centered">
            You currently do not have a plan
          </h5>
          <b-button
            variant="primary"
            size="lg"
            class="text-uppercase px-5"
            to="settings/Billing"
          >
            {{ limitBalance.currentPlan ? `upgrade` : `View plans` }}
          </b-button>
        </template>
      </div>
      <div v-else class="leads-page-content">
        <!-- Page Header -->
        <div class="page-header">
          <h1 class="page-title">Leads</h1>
          <div class="header-actions">
            <b-button
              v-if="limitBalance && limitBalance.leads > 0"
              variant="dark"
              class="add-lead-btn"
              @click="$bvModal.show('NewLeadModal')"
            >
              <SvgIcon name="plus" class="mr-2" />
              Add New
            </b-button>
            <b-button
              v-else
              variant="primary"
              class="upgrade-btn"
              to="settings/Billing"
            >
              <SvgIcon name="plus" class="mr-2" />
              Upgrade
            </b-button>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="filters-section">
          <div class="search-wrapper">
            <SvgIcon name="search" class="search-icon" />
            <input 
              v-model="searchQuery" 
              type="text" 
              class="search-input" 
              placeholder="Search leads..."
            />
          </div>

          <div class="filter-actions">
            <div class="d-flex align-self-center">
              <CheckboxDropdown
                :checked="isAllChecked"
                :items="[
                  {
                    value: 'all',
                    label: 'All',
                  },
                  {
                    value: 'none',
                    label: 'None',
                  },
                ]"
                @itemClick="handleDropdownItemClick"
                @change="toggleCheckAll"
              />

              <div v-if="selected.length" class="lead-actions">
                <AddLeadToCampaignDropdown
                  v-b-tooltip.hover
                  title="Add to campaign"
                  variant="outline-dark"
                  class="mr-1"
                  @change="handleAddLeadsToCampaign"
                >
                  <SvgIcon name="paper-plane" />
                </AddLeadToCampaignDropdown>

                <MoveLeadToListDropdown
                  v-b-tooltip.hover
                  title="Move to list"
                  variant="outline-dark"
                  class="mr-1"
                  :selected="selectedLeads"
                  @change="handleMoveLeadsToList"
                >
                  <SvgIcon name="text-align-left" />
                </MoveLeadToListDropdown>

                <b-button
                  v-b-tooltip.hover
                  title="Validate email"
                  variant="outline-dark"
                  class="mr-1"
                  @click="showValidateLeadEmailModal"
                >
                  <SvgIcon name="verified" />
                </b-button>

                <CampaignMembershipStatusesDropdown
                  v-b-tooltip.hover
                  title="Change status"
                  variant="outline-dark"
                  class="mr-1"
                  @change="handleSetLeadStatuses"
                >
                  <SvgIcon name="check-circle" />
                </CampaignMembershipStatusesDropdown>

                <b-button
                  v-b-tooltip.hover
                  title="Delete"
                  variant="outline-dark"
                  @click="$bvModal.show('DeleteLeadsWarningModal')"
                >
                  <SvgIcon name="delete" />
                </b-button>
              </div>
            </div>

            <div class="d-flex">
              <b-button
                v-if="$auth.user.hasJVZooIntegration"
                variant="danger"
                class="create-btn shadow mr-2"
                @click="$bvModal.show('ImportJVZooLeadsModal')"
              >
                <SvgIcon name="plus" class="mr-1" />
                Import From JVZoo
              </b-button>
            </div>
          </div>
        </div>

        <!-- Sidebar and Table -->
        <div class="leads-content-row">
          <div class="leads-sidebar">
            <InstallChromeExtensionButton
              class="mb-3"
              :to="{ name: 'chrome-extension' }"
            >
              Install Extension
            </InstallChromeExtensionButton>

            <LeadSidebarLists
              :loading="$apollo.queries.lists.loading"
              :lists="lists"
              :active="listId"
              @select="handleListSelect"
              @removed="handleListRemoved"
            />
          </div>

          <div class="leads-table-container">
            <div v-if="result.leads.length" class="table-wrapper">
              <div class="leads-table">
                <!-- Table Header -->
                <div class="table-header">
                  <div class="table-row">
                    <div class="table-cell checkbox-cell"></div>
                    <div class="table-cell">Name</div>
                    <div class="table-cell">Email</div>
                    <div class="table-cell">Domain</div>
                    <div class="table-cell">Title</div>
                    <div class="table-cell">Campaigns</div>
                    <div class="table-cell">Phone</div>
                    <!-- Custom Fields Headers -->
                    <div 
                      v-for="customField in customFields" 
                      :key="customField.id" 
                      class="table-cell"
                    >
                      {{ customField.title }}
                    </div>
                  </div>
                </div>

                <!-- Table Body -->
                <div class="table-body">
                  <div
                    v-for="(lead, index) in result.leads"
                    :key="lead.id"
                    class="table-row"
                    :class="{ 'alternate': index % 2 === 1, 'selected': selected.includes(lead.id) }"
                    @click="editLead(lead)"
                  >
                    <div class="table-cell checkbox-cell" @click.stop>
                      <input type="checkbox" v-model="selected" :value="lead.id" />
                    </div>
                    <div class="table-cell name-cell">
                      {{ `${lead.firstName} ${lead.lastName}` }}
                    </div>
                    <div class="table-cell">
                      <span>{{ lead.email }}</span>
                      <SvgIcon
                        v-show="lead.emailValidatedAt"
                        name="verified"
                        class="icon-sm success text-success ml-1"
                      />
                    </div>
                    <div class="table-cell">{{ lead.domain }}</div>
                    <div class="table-cell">{{ lead.title }}</div>
                    <div class="table-cell campaigns-cell">
                      <template v-if="lead.firstCampaignMembership">
                        <div class="campaign-info">
                          <div class="text-truncate">
                            {{ lead.firstCampaignMembership.campaign.title }}
                          </div>
                          <LeadStatuses
                            :statuses="lead.firstCampaignMembership.statuses"
                            :max="2"
                          />
                        </div>
                        <LeadCampaignMembershipsCol
                          v-if="lead.firstCampaignMembership"
                          :lead="lead"
                          @open="showMemberships(lead)"
                        />
                      </template>
                    </div>
                    <div class="table-cell">{{ lead.phone }}</div>
                    <!-- Custom Fields Values -->
                    <div 
                      v-for="customField in customFields" 
                      :key="customField.id" 
                      class="table-cell"
                    >
                      {{ getCustomFieldValue(lead, customField.id) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="$apollo.queries.result.loading" class="leads-loading">
              <b-spinner variant="primary" />
            </div>
            <div v-else class="empty-lead-list">
              <LeadsIl class="illustration" />

              <div class="description">
                This list contains no contacts yet. You can add contacts from All
                contacts or import new contacts to this list
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-container>

    <b-modal id="DeleteLeadsWarningModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isDeleting" class="leads-deleting">
          <b-spinner variant="primary" />
        </div>
        <div v-else class="text-center p-4">
          <h4>Are you sure?</h4>
          <p>
            Selected contact{{ selected.length > 1 ? 's' : '' }} will be removed
            from your account
          </p>

          <div class="mt-4">
            <b-button
              variant="link"
              class="text-dark px-4 mr-1"
              pill
              @click="hide"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4 mr-1"
              pill
              @click="handleDeleteSelected"
            >
              Delete
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>

    <b-modal id="ValidateLeadEmailModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isValidating" class="leads-deleting">
          <b-spinner variant="primary" />
        </div>
        <div v-else class="text-center p-4">
          <h4>Validate leads email?</h4>
          <p>
            The selected leads will be validated at
            <strong
              >{{ setting.values.leadEnrichment }} lead validation units</strong
            >
            per email. Do you want to continue?
          </p>

          <div class="mt-4">
            <b-button
              variant="link"
              class="text-dark px-4 mr-1"
              pill
              @click="hide"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4 mr-1"
              pill
              @click="handleValidateSelected"
            >
              Validate
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>

    <NewLeadModal />
    <LeadCsvImportModal
      :lists="lists"
      @complete="$apollo.queries.result.refetch()"
    />
    <LeadFormModal
      :lead="leadForEdit"
      @saved="handleLeadSaved"
      @deleted="removeDeletedFromList([$event])"
      @closed="handleLeadFormClosed"
    />

    <ImportJVZooLeadsModal
      v-if="$auth.user.hasJVZooIntegration"
      @imported="handleJVZooImported"
    />
  </div>
</template>

<script>
import CheckboxDropdown from '~/components/General/CheckboxDropdown'
import InstallChromeExtensionButton from '~/components/General/InstallChromeExtensionButton'

import LeadSidebarLists from '~/components/Lead/LeadSidebarLists'
import AddLeadToCampaignDropdown from '~/components/Lead/AddLeadToCampaignDropdown'
import MoveLeadToListDropdown from '~/components/Lead/MoveLeadToListDropdown'
import CampaignMembershipStatusesDropdown from '~/components/Lead/CampaignMembershipStatusesDropdown'
import ImportJVZooLeadsModal from '~/components/UserIntegration/ImportJVZooLeadsModal.vue'
import NewLeadModal from '~/components/Lead/NewLeadModal'
import LeadStatuses from '~/components/Lead/LeadStatuses'
import LeadCsvImportModal from '~/components/Lead/LeadCsvImportModal'
import LeadCampaignMembershipsCol from '~/components/Lead/LeadCampaignMembershipsCol'
import LeadFormModal from '~/components/Lead/LeadFormModal'

import { ALL_LEAD_LISTS_QUERY, ALL_LEADS_QUERY, ALL_CUSTOM_FIELDS_QUERY } from '~/graphql/lead/queries'

import {
  DELETE_LEADS_MUTATION,
  MOVE_LEADS_TO_LISTS_MUTATION,
  ADD_LEADS_TO_CAMPAIGN_MUTATION,
  SET_LEADS_MEMBERSHIPS_STATUS_MUTATION,
  VALIDATE_LEAD_EMAIL_MUTATION,
} from '~/graphql/lead/mutations'

import LeadsIl from '~/assets/illustrations/leads.svg?inline'
import {
  GET_LIMIT_BALANCE_QUERY,
  SETTINGS_QUERY,
} from '~/graphql/subscription/queries'

export default {
  middleware: ['auth', 'setup'],

  components: {
    CheckboxDropdown,
    InstallChromeExtensionButton,
    LeadSidebarLists,
    AddLeadToCampaignDropdown,
    MoveLeadToListDropdown,
    CampaignMembershipStatusesDropdown,
    NewLeadModal,
    LeadStatuses,
    LeadCsvImportModal,
    LeadFormModal,
    LeadCampaignMembershipsCol,
    LeadsIl,
    ImportJVZooLeadsModal,
  },

  data() {
    return {
      selected: [],
      result: {
        leads: [],
      },
      lists: [],
      customFields: [],
      limit: 50,
      limitBalance: {},
      leadForEdit: null,
      listId: 0,

      isDeleting: false,

      selectedLeads: [],

      isValidating: false,

      setting: {},
      searchQuery: '',
    }
  },

  apollo: {
    lists: {
      query: ALL_LEAD_LISTS_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    result: {
      query: ALL_LEADS_QUERY,
      variables() {
        return {
          listId: this.listId,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    customFields: {
      query: ALL_CUSTOM_FIELDS_QUERY,
      update(data) {
        console.log('Custom fields loaded:', data.customFields)
        return data.customFields || []
      },
      error(error) {
        console.error('Error loading custom fields:', error)
        // Prevent the page from crashing on error
        return false
      },
    },

    getSetting: {
      query: SETTINGS_QUERY,
      variables: {
        tag: 'unitSetting',
      },
      result({ data }) {
        this.setting = data ? JSON.parse(data.getSetting.options) : {}
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
  },

  computed: {
    isAllChecked() {
      return !!(
        this.selected.length &&
        this.selected.length === this.result.leads.length
      )
    },
  },

  watch: {
    selected(selected) {
      this.$nextTick(() => {
        this.selectedLeads = this.result.leads.filter((l) =>
          selected.includes(l.id)
        )
      })
    },
  },

  methods: {
    getCustomFieldValue(lead, customFieldId) {
      if (!lead.customFields || !lead.customFields.length) {
        return '-'
      }
      
      const customFieldValue = lead.customFields.find(
        (field) => field.id === customFieldId || field.fieldId === customFieldId
      )
      
      return customFieldValue ? customFieldValue.value || '-' : '-'
    },

    showValidateLeadEmailModal() {
      this.$bvModal.show('ValidateLeadEmailModal')
    },

    selectAll() {
      this.selected = this.result.leads.map((t) => t.id)
    },

    selectNone() {
      this.selected = []
    },

    handleDropdownItemClick(item) {
      if (item.value === 'all') {
        this.selectAll()
      } else if (item.value === 'none') {
        this.selectNone()
      }
    },

    toggleCheckAll() {
      if (!this.isAllChecked) {
        this.selectAll()
      } else {
        this.selectNone()
      }
    },

    handleListSelect(list) {
      // First, de-select all
      this.selected = []

      this.listId = list.id
    },

    handleListRemoved(listId) {
      if (this.listId === listId) {
        this.listId = 0
      }
    },

    editLead(lead) {
      this.leadForEdit = lead
      this.selectNone()
      this.selected.push(lead.id)

      this.$bvModal.show('LeadFormModal')
    },

    showMemberships(lead) {
      this.$router.push({ query: { showCampaigns: true } })

      this.editLead(lead)
    },

    handleLeadFormClosed() {
      if (this.leadForEdit) {
        this.leadForEdit = null
      }
    },

    handleLeadSaved(lead) {
      const client = this.$apollo.getClient()

      try {
        const data = client.readQuery({
          query: ALL_LEADS_QUERY,
          variables: {
            listId: 0,
          },
        })

        const leadIndex = data.result.leads.findIndex((leadItem) => {
          return leadItem.id === lead.id
        })

        if (leadIndex !== -1) {
          // Replace the updated lead in place
          data.result.leads = [
            ...data.result.leads.slice(0, leadIndex),
            lead,
            ...data.result.leads.slice(leadIndex + 1),
          ]
        } else {
          // Add the newly added lead on top of the list
          data.result.leads.unshift(lead)
        }

        // Write the leads data back to cache.
        client.writeQuery({
          query: ALL_LEADS_QUERY,
          variables: {
            listId: 0,
          },
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    handleAddLeadsToCampaign(campaign) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: ADD_LEADS_TO_CAMPAIGN_MUTATION,
          variables: { leadIds: this.selected, campaignId: parseInt(campaign.id, 10) },
        })
        .then(({ data }) => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: `Lead${
              this.selected.length > 1 ? 's' : ''
            } successfully added to campaign`,
          })

          this.selected = []
          this.$apollo.queries.result.refetch()

          this.$nuxt.$loading.finish()
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          this.$nuxt.$loading.finish()

          if (errors && errors.length) {
            const validationErrors = errors.filter(
              (error) => error.extensions.category === 'Validation'
            )

            validationErrors.forEach((e) => {
              this.$notify({
                group: 'main',
                type: 'native-error',
                title: `Unable to add lead${
                  this.selected.length > 1 ? 's' : ''
                } to campaign`,
                text: e.message,
              })
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'native-error',
              title: `Unable to add lead${
                this.selected.length > 1 ? 's' : ''
              } to campaign`,
              text: 'An error occurred while processing your request',
            })
          }
        })
    },

    handleMoveLeadsToList(listIds) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: MOVE_LEADS_TO_LISTS_MUTATION,
          variables: { leadListIds: listIds, leadIds: this.selected },
        })
        .then(({ data }) => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: `Lead${
              this.selected.length > 1 ? 's' : ''
            } successfully moved to list${listIds.length > 1 ? 's' : ''}`,
          })

          this.selected = []
          this.$apollo.queries.result.refetch()

          this.$nuxt.$loading.finish()
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          this.$nuxt.$loading.finish()

          if (errors && errors.length) {
            const validationErrors = errors.filter(
              (error) => error.extensions.category === 'Validation'
            )

            validationErrors.forEach((e) => {
              this.$notify({
                group: 'main',
                type: 'native-error',
                title: `Unable to move lead${
                  this.selected.length > 1 ? 's' : ''
                } tolist${listIds.length > 1 ? 's' : ''}`,
                text: e.message,
              })
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'native-error',
              title: `Unable to move lead${
                this.selected.length > 1 ? 's' : ''
              } to list${listIds.length > 1 ? 's' : ''}`,
              text: 'An error occurred while processing your request',
            })
          }
        })
    },

    handleSetLeadStatuses({ status, action }) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: SET_LEADS_MEMBERSHIPS_STATUS_MUTATION,
          variables: { ids: this.selected, status, action },
        })
        .then(({ data }) => {
          this.selected = []
          this.$apollo.queries.result.refetch()

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: 'Lead campaign status set successfully',
          })

          this.$nuxt.$loading.finish()
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          this.$nuxt.$loading.finish()

          if (errors && errors.length) {
            const validationErrors = errors.filter(
              (error) => error.extensions.category === 'Validation'
            )

            validationErrors.forEach((e) => {
              this.$notify({
                group: 'main',
                type: 'native-error',
                title: 'Unable to set status',
                text: e.message,
              })
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'native-error',
              title: 'Unable to set status',
              text: 'An error occurred while processing your request',
            })
          }
        })
    },

    handleDeleteSelected() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_LEADS_MUTATION,
          variables: {
            ids: this.selected,
          },
          update: (store) => {
            this.removeDeletedFromList(this.selected)
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: `${this.selected.length} contact${
              this.selected.length > 1 ? 's' : ''
            } deleted successfully`,
          })

          this.selected = []
          this.isDeleting = false
          this.$bvModal.hide('DeleteLeadsWarningModal')
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to delete',
            text: 'An error occurred while processing your request.',
          })

          this.isDeleting = false
          this.$bvModal.hide('DeleteLeadsWarningModal')
        })
    },

    handleValidateSelected() {
      this.isValidating = true

      this.$apollo
        .mutate({
          mutation: VALIDATE_LEAD_EMAIL_MUTATION,
          variables: {
            ids: this.selected,
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: `${this.selected.length} contact${
              this.selected.length > 1 ? 's' : ''
            } validated successfully`,
          })
          this.$apollo.queries.result.refetch()

          this.selected = []
          this.isValidating = false
          this.$bvModal.hide('ValidateLeadEmailModal')
          this.$bvModal.hide('LeadFormModal')
        })
        .catch(({ graphQLErrors: errors }) => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to validate email',
            text: errors[0].message,
          })

          this.isValidating = false
          this.$bvModal.hide('ValidateLeadEmailModal')
        })
    },

    removeDeletedFromList(ids) {
      const store = this.$apollo.getClient()
      try {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: ALL_LEADS_QUERY,
          variables: {
            listId: 0,
          },
        })

        // Update leads
        data.result.leads = data.result.leads.filter(
          (leadItem) => !ids.includes(leadItem.id)
        )

        // Write the leads data back to the cache.
        store.writeQuery({
          query: ALL_LEADS_QUERY,
          variables: {
            listId: 0,
          },
          data,
        })
      } catch (err) {
        // Catch errors
      }
    },

    handleJVZooImported(imported) {
      this.$apollo.queries.result.refetch()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.leads-deleting {
  min-height: 200px;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .spinner-border {
    height: 3rem;
    width: 3rem;
    border-width: 0.4rem;
  }
}

.leads-page {
  padding-top: 30px;
  margin-bottom: 50px;
  min-height: 80vh;

  .leads-loading {
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.4rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .illustration {
    width: 426px;
  }

  .empty-lead {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 655px;
    width: 90%;
    padding: 40px;
    margin: auto;
    background: #ededed;
    border-radius: 20px;

    .title {
      font-weight: bold;
      font-size: 30px;
      margin-bottom: 20px;
      margin-top: -40px;
    }

    .description {
      width: 650px;
      text-align: center;
      margin-bottom: 25px;
      font-size: 20px;
      line-height: 129.3%;
      color: $gray-600;
    }
  }

  .empty-lead-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    background-color: $gray-100;
    margin-top: 30px;
    border-radius: 10px;
    padding: 40px 0 70px;

    .illustration {
      height: 350px;
    }

    .description {
      width: 50%;
      margin: auto;
      margin-top: -35px;
      font-size: 1.1rem;
      text-align: center;
    }
  }

  .lead-actions {
    align-self: center;
    margin-left: 1.5rem;
  }

  .create-btn {
    padding: 5px 15px;
    font-weight: bold;
    font-size: 1.2rem;
    align-self: center;
  }

  .leads-page-content {
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      .page-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #000;
        margin: 0;
      }

      .header-actions {
        display: flex;
        gap: 12px;

        .add-lead-btn,
        .upgrade-btn {
          padding: 10px 20px;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
          display: flex;
          align-items: center;
          color: #000;

          .icon {
            font-size: 1rem;
          }
        }
      }
    }

    .filters-section {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 24px;
      gap: 20px;

      .search-wrapper {
        position: relative;
        width: 250px;

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1.1rem;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 44px;
          padding-left: 48px;
          padding-right: 16px;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
          }

          &::placeholder {
            color: #9ca3af;
          }
        }
      }

      .filter-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }

    .leads-content-row {
      display: flex;
      gap: 24px;

      .leads-sidebar {
        width: 240px;
        flex-shrink: 0;
      }

      .leads-table-container {
        flex: 1;
        min-width: 0;

        .table-wrapper {
          overflow-x: auto;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          background: #fff;

          &::-webkit-scrollbar {
            height: 8px;
          }

          &::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 4px;
          }

          &::-webkit-scrollbar-thumb {
            background: #d0d0d0;
            border-radius: 4px;

            &:hover {
              background: #b0b0b0;
            }
          }
        }

        .leads-table {
          width: 100%;
          min-width: 1200px;

          .checkbox-cell {
            display: flex;
            justify-content: center;
            align-items: center;

            input[type="checkbox"] {
              width: 19px;
              height: 19px;
              cursor: pointer;
              appearance: none;
              border: 2px solid #d1d5db;
              border-radius: 5px;
              position: relative;
              transition: all 0.2s ease;

              &:checked {
                background: $primary;
                border-color: $primary;

                &::after {
                  content: '';
                  position: absolute;
                  left: 5px;
                  top: 2px;
                  width: 4px;
                  height: 8px;
                  border: solid #000;
                  border-width: 0 2px 2px 0;
                  transform: rotate(45deg);
                }
              }

              &:hover {
                border-color: $primary;
              }
            }
          }

          .table-header {
            background: #fff;

            .table-row {
              display: flex;
              align-items: center;
              padding: 0;
              border-bottom: 1.5px solid #e5e5e5;
              min-width: max-content;

              .table-cell {
                padding: 16px 12px;
                font-size: 0.85rem;
                font-weight: 600;
                color: #000;
                border-right: 1px solid #f0f0f0;
                flex-shrink: 0;

                &:last-child {
                  border-right: none;
                }

                &.checkbox-cell {
                  width: 50px;
                }

                &:nth-child(2) { width: 180px; } // Name
                &:nth-child(3) { width: 220px; } // Email
                &:nth-child(4) { width: 150px; } // Domain
                &:nth-child(5) { width: 150px; } // Title
                &:nth-child(6) { width: 200px; } // Campaigns
                &:nth-child(7) { width: 140px; } // Phone
                &:nth-child(n+8) { width: 120px; } // Custom fields
              }
            }
          }

          .table-body {
            .table-row {
              display: flex;
              align-items: center;
              padding: 0;
              border-bottom: 1px solid #f5f5f5;
              cursor: pointer;
              transition: all 0.2s ease;
              min-width: max-content;

              &:hover {
                background: #f9fafb;
              }

              &.alternate {
                background: #fafafa;

                &:hover {
                  background: #f5f5f5;
                }
              }

              &.selected {
                background: #eff6ff;

                &:hover {
                  background: #dbeafe;
                }
              }

              .table-cell {
                padding: 16px 12px;
                font-size: 0.9rem;
                color: #374151;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex-shrink: 0;

                &:last-child {
                  border-right: none;
                }

                &.checkbox-cell {
                  width: 50px;
                }

                &.name-cell {
                  width: 180px;
                  font-weight: 700;
                  color: #000;
                }

                &:nth-child(3) { width: 220px; } // Email
                &:nth-child(4) { width: 150px; } // Domain
                &:nth-child(5) { width: 150px; } // Title
                
                &.campaigns-cell {
                  width: 200px;
                  
                  .campaign-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                  }
                }

                &:nth-child(7) { width: 140px; } // Phone
                &:nth-child(n+8) { width: 140px; } // Custom fields
              }
            }
          }
        }
      }
    }
  }

  .lead-actions {
    align-self: center;
    margin-left: 1.5rem;
  }

  // Legacy styles - removed, using modern grid layout above
}
</style>
