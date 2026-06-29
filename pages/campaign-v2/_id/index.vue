<template>
  <div class="campaign-dashboard-page">
    <!-- Top Navigation Bar -->
    <div class="campaign-nav-bar">
      <h1 class="campaign-title">{{ campaignTitle || 'Agent Campaign' }}</h1>
      
      <!-- Navigation Tabs -->
      <div class="campaign-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- Header Actions -->
      <div class="header-actions">
        <b-dropdown variant="outline-secondary" class="action-dropdown">
          <template #button-content>
            <SvgIcon name="calendar" class="dropdown-icon" />
            {{ rangeLabel }}
          </template>
          <b-dropdown-item @click="setRange('7days')">Last 7 Days</b-dropdown-item>
          <b-dropdown-item @click="setRange('30days')">Last 30 Days</b-dropdown-item>
          <b-dropdown-item @click="setRange('90days')">Last 90 Days</b-dropdown-item>
        </b-dropdown>

        <b-dropdown variant="outline-secondary" class="action-dropdown">
          <template #button-content>
            Status
          </template>
          <b-dropdown-item @click="changeStatus('active')">Active</b-dropdown-item>
          <b-dropdown-item @click="changeStatus('paused')">Paused</b-dropdown-item>
          <b-dropdown-item @click="changeStatus('archived')">Completed</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

    <!-- Tab Content - Dynamic Component Loading -->
    <div class="tab-content-area">
      <component :is="currentTabComponent" :campaign-id="campaignId" :range="activeRange" />
    </div>
  </div>
</template>

<script>
import OverviewTab from '@/components/CampaignV2Tabs/OverviewTab.vue'
import InboxTab from '@/components/CampaignV2Tabs/InboxTab.vue'
import SequencesTab from '@/components/CampaignV2Tabs/SequencesTab.vue'
import CallsTab from '@/components/CampaignV2Tabs/CallsTab.vue'
import LeadsTab from '@/components/CampaignV2Tabs/LeadsTab.vue'
import SettingsTab from '@/components/CampaignV2Tabs/SettingsTab.vue'
import { CAMPAIGN_BY_ID_QUERY } from '~/graphql/campaign/queries'
import { UPDATE_CAMPAIGN_STATUS_MUTATION, SAVE_CAMPAIGN_TITLE_MUTATION } from '~/graphql/campaign/mutations'
import { mapState } from 'vuex'

export default {
  name: 'CampaignDashboard',
  
  middleware: ['auth', 'setup'],

  components: {
    OverviewTab,
    InboxTab,
    SequencesTab,
    CallsTab,
    LeadsTab,
    SettingsTab
  },

  data() {
    return {
      activeTab: 'overview',
      activeRange: '30days',
      tabs: [
        { id: 'overview', label: 'Overview', component: 'OverviewTab' },
        { id: 'inbox', label: 'Inbox', component: 'InboxTab' },
        { id: 'sequences', label: 'Sequences', component: 'SequencesTab' },
        { id: 'calls', label: 'Calls', component: 'CallsTab' },
        { id: 'leads', label: 'Leads', component: 'LeadsTab' },
        { id: 'settings', label: 'Settings', component: 'SettingsTab' }
      ]
    }
  },

  computed: {
    ...mapState('campaign', {
      viewingCampaign: (state) => state.viewing || {},
    }),
    campaignId() {
      return parseInt(this.$route.params.id)
    },
    campaignTitle() {
      return this.viewingCampaign && this.viewingCampaign.title
    },
    activeTabLabel() {
      const tab = this.tabs.find(t => t.id === this.activeTab)
      return tab ? tab.label : ''
    },

    currentTabComponent() {
      const tab = this.tabs.find(t => t.id === this.activeTab)
      return tab ? tab.component : 'OverviewTab'
    },
    rangeLabel() {
      switch (this.activeRange) {
        case '7days': return 'Last 7 Days'
        case '90days': return 'Last 90 Days'
        default: return 'Last 30 Days'
      }
    }
  },

  async asyncData({ app, store, params }) {
    const { apolloProvider: { defaultClient } } = app
    await defaultClient.query({
      query: CAMPAIGN_BY_ID_QUERY,
      variables: { id: parseInt(params.id) },
      fetchPolicy: 'network-only',
    }).then(({ data }) => {
      if (data && data.campaign) {
        store.dispatch('campaign/updateViewing', data.campaign)
      }
    })
  },

  mounted() {
    const campaignId = this.$route.params.id
    console.log('Campaign ID:', campaignId)
  }
  ,
  methods: {
    setRange(key) {
      this.activeRange = key
    },
    async changeStatus(status) {
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_CAMPAIGN_STATUS_MUTATION,
          variables: { id: this.campaignId, status },
        })
        this.$store.dispatch('campaign/updateViewing', { ...this.viewingCampaign, status, isActive: status === 'active' })
        this.$notify({ group: 'main', type: 'success', text: `Status updated to ${status}` })
      } catch (e) {
        this.$notify({ group: 'main', type: 'error', text: 'Failed to update status' })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.campaign-dashboard-page {
  background: #f7f6f9;
  min-height: 100vh;

  .campaign-nav-bar {
    position: fixed;
    top: 55px; // Below main navbar
    left: 0;
    right: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    padding: 20px 40px;
    padding-top: 35px;
    border-bottom: 1px solid #e5e5e5;
    gap: 30px;
    background: #f7f6f9;

    .campaign-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin: 0;
      flex: 1;
    }

    .campaign-tabs {
      display: flex;
      gap: 0;
      flex: 1;
      align-items: center;
      background: #fff;
      justify-content: center;

      .tab-item {
        padding: 12px 20px;
        font-size: 0.95rem;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        border-bottom: 3px solid transparent;

        &:hover {
          color: #000;
        }

        &.active {
          color: $primary;
          border-bottom-color: $primary;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
      flex: 1;
      justify-content: flex-end;

      .action-dropdown {
        ::v-deep .btn {
          padding: 8px 16px;
          font-size: 0.9rem;
          border-radius: 6px;
          border: 1px solid #e5e5e5;
          color: #2f2f41;
          font-weight: 500;
          display: flex;
          align-items: center;
          background: #fff;
          gap: 8px;

          &:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }

          &:focus {
            box-shadow: none;
          }
        }

        .dropdown-icon {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .tab-content-area {
    padding: 30px 40px;
    margin-top: 90px; // Height of campaign nav bar (to push content below fixed nav)
  }
}
</style>
