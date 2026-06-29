<template>
  <div class="view-campagin-people-page">
    <b-container>
      <div class="campaign-leads-page-row">
        <div class="campaign-leads-page-sidebar">
          <div class="campaign-leads-steps-box">
            <div class="steps-box-header">
              <h4>HISTORY</h4>
            </div>

            <ul class="steps-box-list">
              <li :class="{ active: stepFilter === null }">
                <a href="#" @click.prevent="stepFilter = null">All steps</a>
              </li>
              <li
                v-for="step in campaign.steps"
                :key="step.number"
                :class="{ active: stepFilter === step.number }"
              >
                <a href="#" @click.prevent="stepFilter = step.number">
                  Step {{ step.number }}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="campaign-leads-page-main">
          <div class="d-flex justify-content-between">
            <div class="d-flex align-self-center">
              <CheckboxDropdown
                v-if="campaignMembers.members.length > 0"
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
                @change="handleCheckAll"
              />

              <div v-if="selected.length" class="campaign-lead-actions">
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
                  title="Remove from camapign"
                  variant="outline-dark"
                  class="mr-1"
                  @click="$bvModal.show('RemoveLeadsWarningModal')"
                >
                  <SvgIcon name="remove-user" />
                </b-button>
              </div>
            </div>

            <b-button
              variant="primary"
              class="create-btn shadow"
              @click="$bvModal.show('CampaignAddLeadModal')"
            >
              <SvgIcon name="plus" class="mr-1" />
              Add New
            </b-button>
          </div>
          <div
            v-if="$apollo.queries.campaignMembers.loading"
            class="campaign-leads-loading"
          >
            <b-spinner variant="primary" />
          </div>
          <div
            v-else-if="campaignMembers.members.length < 1"
            class="empty-leads"
          >
            <AddPeopleIl class="illustration" />

            <div class="empty-leads-description">
              Right now there is no history for this Step. <br />
              Once emails are sent, you will be able to access Contact
              information here.
            </div>
          </div>
          <div
            v-else-if="campaignMembers.members.length"
            class="campaign-leads-list"
          >
            <div class="campaign-leads-thead">
              <div class="campaign-leads-list-row">
                <div class="campaign-leads-list-col"></div>
                <div class="campaign-leads-list-col">Name</div>
                <div class="campaign-leads-list-col">Email</div>
                <div class="campaign-leads-list-col statuses-col">Status</div>
                <div class="campaign-leads-list-col">Delivered</div>
                <div class="campaign-leads-list-col">Opens</div>
                <div class="campaign-leads-list-col">Views</div>
                <div class="campaign-leads-list-col">Replied</div>
                <div class="campaign-leads-list-col">Current Step</div>
              </div>
            </div>

            <div class="campaign-leads-tbody">
              <div
                v-for="member in campaignMembers.members"
                :key="member.id"
                class="campaign-leads-list-row"
                :class="{ selected: selected.includes(member.id) }"
                @click="editLead(member.lead)"
              >
                <div class="campaign-leads-list-col" @click.stop>
                  <b-form-checkbox v-model="selected" :value="member.id" />
                </div>
                <div class="campaign-leads-list-col">
                  {{ `${member.lead.firstName} ${member.lead.lastName}` }}
                </div>
                <div class="campaign-leads-list-col">
                  {{ member.lead.email }}
                </div>
                <div class="campaign-leads-list-col statuses-col">
                  <div>
                    <LeadStatuses :statuses="member.statuses" :max="2" />

                    <div class="member-statuses-wrap">
                      <LeadStatuses :statuses="member.statuses" />
                    </div>
                  </div>
                </div>
                <div class="campaign-leads-list-col">
                  <div
                    v-if="member.delivered > 0"
                    class="member-stat delivered"
                  >
                    {{ member.delivered }}
                  </div>
                </div>
                <div class="campaign-leads-list-col">
                  <div v-if="member.opens > 0" class="member-stat opens">
                    {{ member.opens }}
                  </div>
                </div>
                <div class="campaign-leads-list-col">
                  <div v-if="member.views > 0" class="member-stat views">
                    {{ member.views }}
                  </div>
                </div>
                <div class="campaign-leads-list-col">
                  <div v-if="member.replied > 0" class="member-stat replied">
                    {{ member.replied }}
                  </div>
                </div>
                <div class="campaign-leads-list-col">
                  {{ member.step ? `Step ${member.step.number}` : null }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-container>

    <CampaignAddLeadModal @add-via="addLeadsVia" />
    <LeadFormModal
      :lead="leadForEdit"
      :campaign-id="campaign.id"
      @saved="handleLeadSaved"
      @deleted="handleLeadDeleted"
      @closed="handleLeadFormClosed"
    />
    <LeadCsvImportModal
      :campaign-id="campaign.id"
      :lists="lists"
      @complete="$apollo.queries.campaignMembers.refetch()"
    />
    <CampaignExistingLeadsModal
      :campaign-id="campaign.id"
      @added="handleAddExistingLeads"
    />

    <b-modal id="RemoveLeadsWarningModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isRemoving" class="leads-deleting">
          <b-spinner variant="primary" />
        </div>
        <div v-else class="text-center p-4">
          <h4>
            Remove{{
              selected.length > 1 ? ` ${selected.length}` : ''
            }}
            contact{{ selected.length > 1 ? 's' : '' }}?
          </h4>
          <p>
            Selected contact{{ selected.length > 1 ? 's' : '' }} will be removed
            from the current campaign
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
              @click="handleRemoveLeads"
            >
              Remove
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CheckboxDropdown from '~/components/General/CheckboxDropdown'
import AddLeadToCampaignDropdown from '~/components/Lead/AddLeadToCampaignDropdown'
import MoveLeadToListDropdown from '~/components/Lead/MoveLeadToListDropdown'
import CampaignMembershipStatusesDropdown from '~/components/Lead/CampaignMembershipStatusesDropdown'
import CampaignAddLeadModal from '~/components/Campaign/CampaignAddLeadModal'
import LeadStatuses from '~/components/Lead/LeadStatuses'
import LeadFormModal from '~/components/Lead/LeadFormModal'
import LeadCsvImportModal from '~/components/Lead/LeadCsvImportModal'
import CampaignExistingLeadsModal from '~/components/Campaign/CampaignExistingLeadsModal'

import { CAMPAIGN_MEMBERS_QUERY } from '~/graphql/campaign/queries'

import { ALL_LEAD_LISTS_QUERY } from '~/graphql/lead/queries'
import {
  REMOVE_MEMBERS_FROM_CAMPAIGN,
  MOVE_LEADS_TO_LISTS_MUTATION,
  ADD_LEADS_TO_CAMPAIGN_MUTATION,
  SET_CAMPAIGN_MEMBERSHIPS_STATUS_MUTATION,
} from '~/graphql/lead/mutations'

import AddPeopleIl from '~/assets/illustrations/add-people.svg?inline'

export default {
  components: {
    CheckboxDropdown,
    AddLeadToCampaignDropdown,
    MoveLeadToListDropdown,
    CampaignMembershipStatusesDropdown,
    CampaignAddLeadModal,
    LeadFormModal,
    LeadStatuses,
    LeadCsvImportModal,
    CampaignExistingLeadsModal,
    AddPeopleIl,
  },

  data() {
    return {
      campaignMembers: {
        members: [],
        total: 0,
        hasMore: false,
      },
      selected: [],
      leadForEdit: {},
      lists: [],
      stepFilter: null,
      isRemoving: false,

      selectedLeads: [],
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

    campaignMembers: {
      query: CAMPAIGN_MEMBERS_QUERY,
      variables() {
        return {
          campaignId: parseInt(this.$route.params.id),
          offset: 0,
          step: this.stepFilter,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.viewing,
    }),

    queryFilters() {
      return [
        {
          property: 'campaign',
          value: String(this.campaign.id),
          condition: '',
        },
      ]
    },

    isAllChecked() {
      return !!(
        this.selected.length &&
        this.selected.length === this.campaignMembers.members.length
      )
    },
  },

  watch: {
    selected(selected) {
      this.$nextTick(() => {
        this.selectedLeads = this.campaignMembers.members
          .filter((member) => selected.includes(member.id))
          .map((m) => m.lead)
      })
    },
  },

  mounted() {
    if (this.$route.query.addLeadsVia) {
      this.addLeadsVia(this.$route.query.addLeadsVia)
    }
  },

  methods: {
    selectAll() {
      this.selected = this.campaignMembers.members.map((m) => m.id)
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

    handleCheckAll() {
      if (!this.isAllChecked) {
        this.selectAll()
      } else {
        this.selectNone()
      }
    },

    addLeadsVia(via) {
      if (via === 'csv') {
        this.$bvModal.hide('CampaignAddLeadModal')
        this.$bvModal.show('LeadCsvImportModal')
      } else if (via === 'manual') {
        this.$bvModal.hide('CampaignAddLeadModal')
        this.$bvModal.show('LeadFormModal')
      } else if (via === 'existing') {
        this.$bvModal.hide('CampaignAddLeadModal')
        this.$bvModal.show('CampaignExistingLeadsModal')
      }
    },

    editLead(lead) {
      this.leadForEdit = lead

      this.$bvModal.show('LeadFormModal')
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
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: parseInt(this.$route.params.id, 10),
            offset: 0,
            step: this.stepFilter,
          },
        })

        const memberIndex = data.campaignMembers.members.findIndex((member) => {
          return member.lead.id === lead.id
        })

        if (memberIndex !== -1) {
          // Replace the updated lead in place
          data.campaignMembers.members = [
            ...data.campaignMembers.members.slice(0, memberIndex),
            { ...data.campaignMembers.members[memberIndex], lead },
            ...data.campaignMembers.members.slice(memberIndex + 1),
          ]

          // Write the members data back to cache.
          client.writeQuery({
            query: CAMPAIGN_MEMBERS_QUERY,
            variables: {
              campaignId: parseInt(this.$route.params.id, 10),
              offset: 0,
              step: this.stepFilter,
            },
            data,
          })
        } else {
          // Add the newly added lead on top of the list
          this.$apollo.queries.campaignMembers.refetch()
        }
      } catch (err) {
        // Handle error
      }
    },

    handleAddExistingLeads(members) {
      this.$apollo.queries.campaignMembers.refetch()
    },

    handleRemoveLeads() {
      if (this.selected.length < 1) {
        return
      }
      this.isRemoving = true
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: REMOVE_MEMBERS_FROM_CAMPAIGN,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            ids: this.selected,
          },
          update: this.updateMembers,
        })
        .then(({ data }) => {
          this.selected = []

          this.$bvModal.hide('RemoveLeadsWarningModal')
          this.isRemoving = false
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to remove',
            text: 'An error occurred while processing your request.',
          })

          this.$bvModal.hide('RemoveLeadsWarningModal')
          this.$nuxt.$loading.finish()
          this.isRemoving = false
        })
    },

    updateMembers(store, { data: { removeLeadsFromCampaign } }) {
      try {
        const data = store.readQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: parseInt(this.$route.params.id, 10),
            offset: 0,
            step: this.stepFilter,
          },
        })

        data.campaignMembers.members = data.campaignMembers.members.filter(
          (m) => !this.selected.includes(m.id)
        )

        // Write the leads data back to cache.
        store.writeQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: parseInt(this.$route.params.id, 10),
            offset: 0,
            step: this.stepFilter,
          },
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    handleLeadDeleted(id) {
      const store = this.$apollo.getClient()

      try {
        const data = store.readQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: this.$route.params.id,
            offset: 0,
            step: this.stepFilter,
          },
        })

        data.campaignMembers.members = data.campaignMembers.members.filter(
          (m) => m.lead.id !== id
        )

        // Write the leads data back to cache.
        store.writeQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: this.$route.params.id,
            offset: 0,
            step: this.stepFilter,
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
          variables: {
            leadIds: this.selectedLeads.map((l) => l.id),
            campaignId: parseInt(campaign.id, 10),
          },
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
          this.$apollo.queries.campaignMembers.refetch()

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
          variables: {
            leadListIds: listIds,
            leadIds: this.selectedLeads.map((l) => l.id),
          },
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
          this.$apollo.queries.campaignMembers.refetch()

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
          mutation: SET_CAMPAIGN_MEMBERSHIPS_STATUS_MUTATION,
          variables: { ids: this.selected, status, action },
          update: (store, { data: { setCampaignMembershipStatus } }) => {
            this.$apollo.queries.campaignMembers.refetch()
          },
        })
        .then(({ data }) => {
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
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.view-campagin-people-page {
  margin-top: 30px;
  .campaign-leads-page-row {
    display: flex;

    .campaign-leads-page-sidebar {
      width: 150px;
      margin-right: 30px;
      flex-shrink: 0;

      .campaign-leads-steps-box {
        background: #ebffe9;
        border: 1px solid #d8d8d8;
        border-radius: 10px;

        .steps-box-header {
          padding: 30px 40px 10px;

          h4 {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 0;
            color: #646464;
          }
        }

        .steps-box-list {
          list-style: none;
          padding: 0;
          margin: 0;
          padding-bottom: 20px;

          & > li {
            & > a {
              display: block;
              padding: 7px 40px;
              color: #8f8f8f;
              text-decoration: none;
            }

            &.active {
              & > a {
                color: $primary;
              }
            }
          }
        }
      }
    }

    .campaign-leads-page-main {
      flex-grow: 1;
      width: 80%;

      .campaign-lead-actions {
        align-self: center;
        margin-left: 1.5rem;
      }

      .campaign-leads-loading {
        min-height: 55vh;
        display: flex;
        justify-content: center;
        align-items: center;

        .spinner-border {
          border-width: 0.5rem;
          height: 5rem;
          width: 5rem;
        }
      }

      .empty-leads {
        text-align: center;

        .illustration {
          width: 350px;
          height: 350px;
        }

        .empty-leads-description {
          text-align: center;
          margin-top: -30px;
          font-size: 17px;
          line-height: 1.3;
        }
      }

      .campaign-leads-list {
        margin-top: 30px;

        .campaign-leads-list-row {
          display: flex;
          align-items: center;
          cursor: pointer;

          .campaign-leads-list-col {
            font-size: 14px;
            line-height: 21px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            .member-stat {
              padding-left: 15px;
              position: relative;

              &::before {
                content: '';
                position: absolute;
                left: 0;
                height: 10px;
                width: 10px;
                margin-top: 5px;
                border-radius: 2px;
                background-color: $primary;
              }

              &.delivered {
                &::before {
                  background-color: $blue;
                }
              }
              &.opens {
                &::before {
                  background-color: #6bd1f2;
                }
              }
              &.views {
                &::before {
                  background-color: #6bd1f2;
                }
              }
              &.replied {
                &::before {
                  background-color: $primary;
                }
              }
            }

            .lead-statuses {
              margin-top: 7px;
              // flex-wrap: nowrap;
            }

            &.statuses-col {
              position: relative;
              overflow: visible;
              margin-right: 20px;
              width: 150px;

              .member-statuses-wrap {
                background-color: $white;
                padding: 10px 20px;
                position: absolute;
                width: 300px;
                left: -10px;
                top: -4px;
                z-index: 1;
                box-shadow: 0 10px 25px 0 rgba($gray-500, 0.5);
                display: none;
              }

              &:hover {
                .member-statuses-wrap {
                  display: block;
                }
              }
            }

            &:nth-child(1) {
              width: 40px;
              overflow: initial;

              .custom-control-input {
                &:not(:checked) {
                  ~ .custom-control-label {
                    &::before {
                      background-color: transparent;
                    }
                  }
                }
              }
            }

            &:nth-child(2) {
              width: 115px;
            }
            &:nth-child(3) {
              width: 180px;
            }
            &:nth-child(5) {
              width: 100px;
            }
            &:nth-child(6) {
              width: 100px;
            }
            &:nth-child(7) {
              width: 100px;
            }
            &:nth-child(8) {
              width: 100px;
            }
          }
        }

        .campaign-leads-thead {
          .campaign-leads-list-row {
            margin-bottom: 15px;
            padding: 0 25px;

            .campaign-leads-list-col {
              text-transform: uppercase;
            }
          }
        }

        .campaign-leads-tbody {
          .campaign-leads-list-row {
            background-color: #f4f4f4;
            border-radius: 5px;
            margin-bottom: 15px;
            padding: 10px 25px;
            transition: all 0.3s ease-in;

            &.selected {
              background-color: #84fd74;
            }
          }
        }
      }
    }
  }
}
</style>
