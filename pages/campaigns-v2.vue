<template>
  <div class="campaigns-v2-page">
    <div class="page-header">
      <h1 class="page-title">Agents - All Campaign</h1>
      <div class="header-actions">
        <b-button variant="outline-dark" class="add-agent-btn">
          <SvgIcon name="plus" class="mr-2" />
          Add Agent
        </b-button>
        <b-button variant="dark" class="export-btn">
          Export CSV
        </b-button>
      </div>
    </div>

    <div class="filters-section">
      <div class="search-wrapper">
        <SvgIcon name="search" class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          class="search-input" 
          placeholder="Search..."
        />
      </div>

      <div class="filter-dropdowns">
        <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Status">
          <b-dropdown-item @click="statusFilter = 'all'">All</b-dropdown-item>
          <b-dropdown-item @click="statusFilter = 'running'">Running</b-dropdown-item>
          <b-dropdown-item @click="statusFilter = 'paused'">Paused</b-dropdown-item>
        </b-dropdown>

        <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Channel">
          <b-dropdown-item @click="channelFilter = 'all'">All</b-dropdown-item>
          <b-dropdown-item @click="channelFilter = 'email'">Email</b-dropdown-item>
          <b-dropdown-item @click="channelFilter = 'voice'">Voice</b-dropdown-item>
        </b-dropdown>

        <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Owner">
          <b-dropdown-item>All</b-dropdown-item>
        </b-dropdown>

        <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Date">
          <b-dropdown-item>All Time</b-dropdown-item>
        </b-dropdown>

        <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Tags">
          <b-dropdown-item>All</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="campaigns-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="table-row">
            <div class="table-cell checkbox-cell">
              <input type="checkbox" @change="toggleSelectAll" />
            </div>
            <div class="table-cell agent-cell">Agents</div>
            <div class="table-cell">Status</div>
            <div class="table-cell">Channels</div>
            <div class="table-cell">Steps</div>
            <div class="table-cell">Audience</div>
            <div class="table-cell">Sends Today</div>
            <div class="table-cell">Replies</div>
            <div class="table-cell">Qualified Calls</div>
            <div class="table-cell">Bookings</div>
            <div class="table-cell">Payments</div>
            <div class="table-cell">Health</div>
            <div class="table-cell">Owner</div>
            <div class="table-cell actions-cell">Actions</div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div 
            v-for="(campaign, index) in filteredCampaigns" 
            :key="campaign.id"
            class="table-row"
            :class="{ 'alternate': index % 2 === 1 }"
          >
            <div class="table-cell checkbox-cell">
              <input type="checkbox" v-model="selectedCampaigns" :value="campaign.id" />
            </div>
            <div class="table-cell agent-cell">
              <div class="agent-info">
                <img :src="campaign.agentAvatar" alt="Agent" class="agent-avatar" />
                <div class="agent-details">
                  <div class="agent-name">{{ campaign.agentName }}</div>
                  <div class="agent-id">ID: {{ campaign.agentId }}</div>
                </div>
              </div>
            </div>
            <div class="table-cell">
              <span class="status-badge" :class="campaign.status.toLowerCase()">
                {{ campaign.status }}
              </span>
            </div>
            <div class="table-cell">{{ campaign.channels }}</div>
            <div class="table-cell">{{ campaign.steps }}</div>
            <div class="table-cell">{{ campaign.audience }}</div>
            <div class="table-cell">{{ campaign.sendsToday }}</div>
            <div class="table-cell">{{ campaign.replies }}</div>
            <div class="table-cell">{{ campaign.qualifiedCalls }}</div>
            <div class="table-cell">{{ campaign.bookings }}</div>
            <div class="table-cell">{{ campaign.payments }}</div>
            <div class="table-cell">
               <span class="owner-badge" :class="campaign.health.toLowerCase()">
                {{ campaign.health }}
              </span>
            </div>
            <div class="table-cell"> {{ campaign.owner }}</div>
            <div class="table-cell actions-cell">
              <b-button 
                variant="outline-dark" 
                size="sm" 
                class="action-btn"
                @click.stop="viewCampaign(campaign)"
              >
                View
              </b-button>
              <b-button 
                variant="outline-dark" 
                size="sm" 
                class="action-btn"
                @click.stop="pauseCampaign(campaign)"
              >
                Pause
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ALL_CAMPAIGNS_QUERY } from '~/graphql/campaign/queries'
export default {
  name: 'CampaignsV2Page',
  
  middleware: ['auth', 'setup'],

  apollo: {
    campaignResult: {
      query: ALL_CAMPAIGNS_QUERY,
      variables() {
        const status = this.statusFilter === 'running' ? 'active' : (this.statusFilter === 'paused' ? 'paused' : 'all')
        const keyword = this.searchQuery || null
        return { status, keyword, offset: 0 }
      },
      update(data) { return data.campaignResult || { campaigns: [], total: 0, hasMore: false } },
      fetchPolicy: 'network-only',
      error() { return false },
    }
  },

  data() {
    return {
      searchQuery: '',
      statusFilter: 'running',
      channelFilter: 'all',
      selectedCampaigns: [],
      campaignResult: { campaigns: [], total: 0, hasMore: false }
    }
  },

  computed: {
    mappedCampaigns() {
      const list = (this.campaignResult && Array.isArray(this.campaignResult.campaigns)) ? this.campaignResult.campaigns : []
      return list.map((c) => {
        const statusMap = { active: 'Running', paused: 'Paused', inactive: 'Inactive', archived: 'Archived' }
        const status = statusMap[(c.status || '').toLowerCase()] || (c.isActive ? 'Running' : 'Paused')
        const channels = (c.steps && c.steps.length > 0) ? 'Email' : ''
        const steps = (c.steps && c.steps.length) || 0
        const audience = (c.leadsCount != null ? c.leadsCount : 0).toLocaleString()
        const replies = (c.replyRate != null ? c.replyRate : 0)
        const avatarIdx = (c.id % 70) + 1
        return {
          id: c.id,
          agentName: c.title || `Agent ${c.id}`,
          agentId: `${c.id}`,
          agentAvatar: `https://i.pravatar.cc/40?img=${avatarIdx}`,
          status,
          channels,
          steps,
          audience,
          sendsToday: '0',
          replies,
          qualifiedCalls: 0,
          bookings: 0,
          payments: '$0',
          health: replies >= 10 ? 'Good' : 'Warn',
          owner: '',
          ownerStatus: replies >= 10 ? 'Good' : 'Warn',
        }
      })
    },
    filteredCampaigns() {
      let filtered = this.mappedCampaigns

      // Filter by search
      if (this.searchQuery) {
        filtered = filtered.filter(c => 
          c.agentName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          c.agentId.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      // Filter by status
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(c => 
          (this.statusFilter === 'running' ? c.status.toLowerCase() === 'running' : c.status.toLowerCase() === this.statusFilter)
        )
      }

      // Filter by channel
      if (this.channelFilter !== 'all') {
        filtered = filtered.filter(c => 
          c.channels.toLowerCase().includes(this.channelFilter)
        )
      }

      return filtered
    }
  },

  methods: {
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedCampaigns = this.filteredCampaigns.map(c => c.id)
      } else {
        this.selectedCampaigns = []
      }
    },

    viewCampaign(campaign) {
      // Navigate to campaign dashboard
      this.$router.push(`/campaign-v2/${campaign.id}`)
    },

    pauseCampaign(campaign) {
      // TODO: Implement pause functionality
      console.log('Pause campaign:', campaign.id)
    },

    openCampaign(campaign) {
      // Navigate to campaign dashboard when clicking row
      this.viewCampaign(campaign)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.campaigns-v2-page {
  padding: 30px 40px;
  background: #fff;
  min-height: 100vh;
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 1200px) {
    max-width: 1140px;
  }
  
  @media (min-width: 1400px) {
    max-width: 1520px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;

      .add-agent-btn,
      .export-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 8px;
        display: flex;
        align-items: center;
      }

      .export-btn {
        background: #000;
        border-color: #000;
        color: #fff;

        &:hover {
          background: #333;
          border-color: #333;
        }
      }
    }
  }

  .filters-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;

    .search-wrapper {
      position: relative;
      flex: 0 0 300px;

      .search-icon {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        color: #9ca3af;
      }

      .search-input {
        width: 100%;
        padding: 12px 15px 12px 45px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-size: 0.9rem;
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

    .filter-dropdowns {
      display: flex;
      gap: 12px;
      flex: 1;
      justify-content: flex-end;

      .filter-dropdown {
        ::v-deep .btn {
          padding: 10px 20px;
          font-size: 0.9rem;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          background: #fff;
          color: #2f2f41;
          font-weight: 500;

          &:hover {
            background: #f9f9f9;
            border-color: #d1d5db;
          }

          &:focus {
            box-shadow: none;
          }
        }
      }
    }
  }

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

  .campaigns-table {
    width: 100%;
    min-width: 1690px;

    // Shared checkbox styles for both header and body
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
          color: $white;

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
        display: grid;
        grid-template-columns: 50px 280px 120px 140px 80px 100px 120px 90px 140px 100px 90px 80px 120px 180px;
        align-items: center;
        padding: 0;
        border-bottom: 1.5px solid #e5e5e5;
        width: 100%;

        .table-cell {
          padding: 16px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #000;
          border-right: 1px solid #f0f0f0;

          &:last-child {
            border-right: none;
          }
        }
      }
    }

    .table-body {
      .table-row {
        display: grid;
        grid-template-columns: 50px 280px 120px 140px 80px 100px 120px 90px 140px 100px 90px 80px 120px 180px;
        align-items: center;
        padding: 0;
        transition: background 0.2s ease;
        width: 100%;

        &.alternate {
          background: #fafafa;
        }

        &:hover {
          background: #f5f5f5;
        }

        .table-cell {
          padding: 16px 12px;
          font-size: 0.9rem;
          color: #2f2f41;
          // border-right: 1px solid #f0f0f0;

          // &:last-child {
          //   border-right: none;
          // }
        }

        .agent-cell {
          .agent-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .agent-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
              flex-shrink: 0;
            }

            .agent-details {
              .agent-name {
                font-size: 0.9rem;
                font-weight: 600;
                color: #000;
                margin-bottom: 2px;
              }

              .agent-id {
                font-size: 0.8rem;
                color: #6b7280;
              }
            }
          }
        }

        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;

          &.running {
            background: #beedc6;
            color: #1a1a2c;
          }

          &.paused {
            color: #1a1a2c;
            border: 2px solid #beedc6;
          }
        }

        .owner-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;

          &.good {
            background: #d3e1f5;
            color: #6299eb;
          }

          &.warn {
            background: #fad0d0;
            color: #ec5656;
            border: 1px solid #ec5656;
          }
        }

        .actions-cell {
          display: flex;
          gap: 8px;
          align-items: center;

          .action-btn {
            padding: 6px 16px;
            font-size: 0.85rem;
            font-weight: 500;
            border-radius: 6px;
            border: 1px solid #e5e5e5;
            opacity: 0;
            transition: opacity 0.2s ease;

            &:hover {
              background: #f9f9f9;
              border-color: #d1d5db;
              color: #000;
            }
          }
        }

        &:hover .actions-cell .action-btn {
          opacity: 1;
        }
      }
    }
  }
}
</style>
