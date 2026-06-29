<template>
  <div class="add-campaign-people-page">
    <b-container>
      <div
        v-if="$apollo.queries.campaignMembers.loading"
        class="added-leads-loading"
      >
        <b-spinner variant="primary" />
      </div>
      <div v-else-if="campaignMembers.members.length < 1" class="empty-people">
        <AddPeopleIl class="illustration" />

        <div class="empty-people-description">
          Add people to the campaign. <br />
          You can skip this step and do it later as well.
        </div>

        <b-button
          variant="outline-primary"
          size="lg"
          @click="$bvModal.show('CampaignAddLeadModal')"
        >
          <SvgIcon name="plus-colored" />
          Add People
        </b-button>
      </div>
      <div v-else-if="campaignMembers.members.length" class="added-leads-list">
        <div class="d-flex justify-content-between mb-4">
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
              @change="handleCheckAll"
            />

            <div v-if="selectedMembers.length" class="added-leads-actions">
              <b-button variant="outline-dark" @click="handleRemoveMembers">
                Remove
              </b-button>
            </div>
          </div>

          <b-button
            variant="primary"
            class="add-leads-btn"
            @click="$bvModal.show('CampaignAddLeadModal')"
          >
            <SvgIcon name="plus" />
            Add People
          </b-button>
        </div>

        <div class="leads-thead">
          <div class="added-leads-list-row">
            <div class="added-leads-list-col"></div>
            <div class="added-leads-list-col">Name</div>
            <div class="added-leads-list-col">Email</div>
            <div class="added-leads-list-col">Company</div>
            <div class="added-leads-list-col">Domain</div>
          </div>
        </div>

        <div class="leads-tbody">
          <div
            v-for="member in campaignMembers.members"
            :key="member.id"
            class="added-leads-list-row"
            :class="{ selected: selectedMembers.includes(member.id) }"
            @click="editLead(member.lead)"
          >
            <div class="added-leads-list-col" @click.stop>
              <b-form-checkbox v-model="selectedMembers" :value="member.id" />
            </div>
            <div class="added-leads-list-col">
              {{ `${member.lead.firstName} ${member.lead.lastName}` }}
            </div>
            <div class="added-leads-list-col">
              {{ member.lead.email }}
            </div>
            <div class="added-leads-list-col">{{ member.lead.company }}</div>
            <div class="added-leads-list-col">{{ member.lead.domain }}</div>
          </div>
        </div>
      </div>
    </b-container>

    <AddCampaignFooter>
      <b-button
        :to="{
          name: 'campaign-id-setup-schedule',
          params: { id: $route.params.id },
        }"
        variant="link"
        class="text-muted px-3 mr-2"
      >
        Back
      </b-button>
      <b-button
        :to="{
          name: 'campaign-id-setup-settings',
          params: { id: $route.params.id },
        }"
        variant="outline-gray"
        class="px-4 mr-2"
        pill
      >
        Skip
      </b-button>
      <b-button
        variant="primary"
        class="px-4"
        pill
        :disabled="
          campaignMembers.members && campaignMembers.members.length < 1
        "
        @click="handleContinue"
      >
        Continue
      </b-button>
    </AddCampaignFooter>

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
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CheckboxDropdown from '~/components/General/CheckboxDropdown'
import AddCampaignFooter from '~/components/Campaign/AddCampaignFooter'
import CampaignAddLeadModal from '~/components/Campaign/CampaignAddLeadModal'
import LeadFormModal from '~/components/Lead/LeadFormModal'
import LeadCsvImportModal from '~/components/Lead/LeadCsvImportModal'
import CampaignExistingLeadsModal from '~/components/Campaign/CampaignExistingLeadsModal'

import { ALL_LEAD_LISTS_QUERY } from '~/graphql/lead/queries'
import { REMOVE_MEMBERS_FROM_CAMPAIGN } from '~/graphql/lead/mutations'
import { CAMPAIGN_MEMBERS_QUERY } from '~/graphql/campaign/queries'

import AddPeopleIl from '~/assets/illustrations/add-people.svg?inline'

export default {
  components: {
    CheckboxDropdown,
    AddCampaignFooter,
    CampaignAddLeadModal,
    LeadFormModal,
    LeadCsvImportModal,
    CampaignExistingLeadsModal,
    AddPeopleIl,
  },

  data() {
    return {
      campaignMembers: {},
      selectedMembers: [],

      leadForEdit: {},

      offset: 0,
      limit: 50,
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
          campaignId: parseInt(this.campaign.id, 10),
          offset: 0,
        }
      },
      update: (data) => data.campaignMembers,

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.setup,
    }),

    isAllChecked() {
      return !!(
        this.selectedMembers.length &&
        this.selectedMembers.length === this.campaignMembers.members.length
      )
    },
  },

  methods: {
    selectAll() {
      this.selectedMembers = this.campaignMembers.members.map((t) => t.id)
    },

    selectNone() {
      this.selectedMembers = []
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

    editLead(lead) {
      this.leadForEdit = lead

      this.$bvModal.show('LeadFormModal')
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

    handleLeadFormClosed() {
      if (this.leadForEdit) {
        this.leadForEdit = null
      }
    },

    handleLeadSaved(lead) {
      this.$apollo.queries.campaignMembers.refetch()
    },

    handleLeadDeleted(id) {
      const store = this.$apollo.getClient()

      try {
        const data = store.readQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            offset: 0,
          },
        })

        data.campaignMembers.members = data.campaignMembers.members.filter(
          (m) => m.lead.id !== id
        )

        // Write the leads data back to cache.
        store.writeQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            offset: 0,
          },
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    handleAddExistingLeads(leads) {
      this.$store.dispatch('campaign/updateSetup', {
        ...this.campaign,
        leadsCount: this.campaign.leadsCount + leads.length,
      })

      this.$apollo.queries.campaignMembers.refetch()
    },

    handleRemoveMembers() {
      if (this.selectedMembers.length < 1) {
        return
      }
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: REMOVE_MEMBERS_FROM_CAMPAIGN,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            ids: this.selectedMembers,
          },
          update: this.updateMembersCache,
        })
        .then(({ data }) => {
          this.$store.dispatch('campaign/updateSetup', {
            ...this.campaign,
            leadsCount: this.campaign.leadsCount - this.selectedMembers.length,
          })

          this.selectedMembers = []
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to remove',
            text: 'An error occurred while processing your request.',
          })
          this.$nuxt.$loading.finish()
        })
    },

    updateMembersCache(store, { data: { removeLeadsFromCampaign } }) {
      try {
        const data = store.readQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            offset: 0,
          },
        })

        data.campaignMembers.members = data.campaignMembers.members.filter(
          (l) => !this.selectedMembers.includes(l.id)
        )

        // Write the leads data back to cache.
        store.writeQuery({
          query: CAMPAIGN_MEMBERS_QUERY,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            offset: 0,
          },
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    handleContinue() {
      this.$router.push({
        name: 'campaign-id-setup-settings',
        params: { id: this.$route.params.id },
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-campaign-people-page {
  margin-top: 50px;

  .added-leads-loading {
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

  .empty-people {
    text-align: center;
    width: 476px;
    margin: auto;

    .illustration {
      width: 350px;
      height: 350px;
    }

    .empty-people-description {
      text-align: center;
      margin-top: -30px;
      font-size: 19px;
      line-height: 1.3;
    }

    .btn-outline-primary {
      margin-top: 30px;
      padding: 5px 50px;
      color: $dark;
      border-width: 2px;

      .icon {
        margin-right: 7px;
        font-size: 25px;
        line-height: 0;
        margin-top: 5px;
      }

      &:hover {
        color: $white;
      }
    }
  }

  .added-leads-list {
    .add-leads-btn {
      padding: 5px 15px;
      font-weight: bold;
      font-size: 1.2rem;
      align-self: center;
    }

    .added-leads-actions {
      align-self: center;
      margin-left: 1.5rem;
    }

    .added-leads-list-row {
      display: flex;
      align-items: center;

      .added-leads-list-col {
        font-size: 14px;
        line-height: 21px;
        // flex-grow: 1;

        &:nth-child(1) {
          width: 50px;
        }

        &:nth-child(2) {
          width: 220px;
        }

        &:nth-child(3) {
          width: 220px;
        }

        &:nth-child(4) {
          width: 220px;
        }

        &:nth-child(5) {
          width: 220px;
          padding: 0 20px;
        }
      }
    }

    .leads-thead {
      .added-leads-list-row {
        margin-bottom: 20px;
        padding: 0 25px;

        .added-leads-list-col {
          text-transform: uppercase;
        }
      }
    }

    .leads-tbody {
      .added-leads-list-row {
        background-color: #f4f4f4;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 15px 25px;

        &.selected {
          background-color: #d8ffd2;
        }
      }
    }
  }
}
</style>
