<template>
  <div class="analytics-v2-page">
    <!-- Fixed Analytics Header -->
    <div class="analytics-header">
      <!-- Row 1: Title + Navigation Tabs -->
      <div class="header-row-1">
        <h1 class="analytics-title">Analytics</h1>
        
        <!-- Navigation Tabs -->
        <div class="analytics-tabs">
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
      </div>

      <!-- Row 2: Campaign Selector + Filters + Buttons -->
      <div class="header-row-2">
        <!-- Campaign Selector -->
        <b-dropdown variant="outline-secondary" class="campaign-dropdown">
          <template #button-content>
            <div class="campaign-selector">
              <div class="campaign-info-container">

                <img src="https://i.pravatar.cc/40?img=1" alt="Campaign" class="campaign-avatar" />
                <div class="campaign-info">
                  <div class="campaign-name">Dental USA - Outbound</div>
                  <div class="campaign-id">ID SP7020</div>
                </div>
              </div>
              <SvgIcon name="chevron-down-2" class="dropdown-icon" />
            </div>
          </template>
          <b-dropdown-item>Campaign 1</b-dropdown-item>
          <b-dropdown-item>Campaign 2</b-dropdown-item>
        </b-dropdown>

        <div class="filters-and-actions">
          <!-- Filter Dropdowns -->
          <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Channel">
            <b-dropdown-item>Email</b-dropdown-item>
            <b-dropdown-item>Phone</b-dropdown-item>
            <b-dropdown-item>SMS</b-dropdown-item>
          </b-dropdown>

          <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Owner">
            <b-dropdown-item>All Owners</b-dropdown-item>
            <b-dropdown-item>John Doe</b-dropdown-item>
          </b-dropdown>

          <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Date">
            <b-dropdown-item>Last 7 Days</b-dropdown-item>
            <b-dropdown-item>Last 30 Days</b-dropdown-item>
            <b-dropdown-item>Last 90 Days</b-dropdown-item>
          </b-dropdown>

          <b-dropdown variant="outline-secondary" class="filter-dropdown" text="Source">
            <b-dropdown-item>All Sources</b-dropdown-item>
            <b-dropdown-item>Website</b-dropdown-item>
            <b-dropdown-item>Social Media</b-dropdown-item>
          </b-dropdown>

          <!-- Action Buttons -->
          <button class="reset-btn">Reset</button>
          <button class="apply-btn">Apply</button>
        </div>
      </div>
    </div>

    <!-- Content Area with Top Padding -->
    <div class="analytics-content">
      <!-- Tab Content - Dynamic Component Loading -->
      <component :is="currentTabComponent" />

    </div>
  </div>
</template>

<script>

import OverviewTab from '@/components/Analytics/AnalyticsTabs/OverviewTab.vue'
import TrendsTab from '@/components/Analytics/AnalyticsTabs/TrendsTab.vue'
import FunnelTab from '@/components/Analytics/AnalyticsTabs/FunnelTab.vue'
import AgentsTab from '@/components/Analytics/AnalyticsTabs/AgentsTab.vue'
import DeliverabilityTab from '@/components/Analytics/AnalyticsTabs/DeliverabilityTab.vue'
import TemplatesTab from '@/components/Analytics/AnalyticsTabs/TemplatesTab.vue'
import AttributionTab from '@/components/Analytics/AnalyticsTabs/AttributionTab.vue'

export default {
  name: 'AnalyticsV2Page',

  components: {
    OverviewTab,
    TrendsTab,
    FunnelTab,
    AgentsTab,
    DeliverabilityTab,
    TemplatesTab,
    AttributionTab
  },

  middleware: ['auth', 'setup'],
  layout: 'dashboard',

  data() {
    return {
      activeTab: 'overview',
      tabs: [
        { id: 'overview', label: 'Overview' },
        { id: 'trends', label: 'Trends' },
        { id: 'funnel', label: 'Funnel' },
        { id: 'by-agent', label: 'By Agent' },
        { id: 'deliverability', label: 'Deliverability & Numbers' },
        { id: 'templates', label: 'Templates' },
        { id: 'attribution', label: 'Attribution' }
      ],
      
    }
  },

  computed: {
    currentTabComponent() {
      const tabComponentMap = {
        overview: 'OverviewTab',
        trends: 'TrendsTab',
        funnel: 'FunnelTab',
        'by-agent': 'AgentsTab',
        deliverability: 'DeliverabilityTab',
        templates: 'TemplatesTab',
        attribution: 'AttributionTab'
      }
      return tabComponentMap[this.activeTab] || 'OverviewTab'
    }
  },

  mounted() {
    console.log('Analytics V2 page mounted - ECharts should be working!')
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.analytics-v2-page {
  background: #fafafa;
  min-height: 100vh;

  .analytics-header {
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    z-index: 999;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 40px;

    // Row 1: Title + Tabs
    .header-row-1 {
      display: flex;
      align-items: center;
      gap: 250px;
      padding-top: 50px;

      .analytics-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #000;
        margin: 0;
        padding-bottom: 16px;
        white-space: nowrap;
      }

      .analytics-tabs {
        display: flex;
        align-items: center;
        gap: 32px;
        border-bottom: 1px solid #e5e5e5;

        .tab-item {
          font-size: 0.95rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          padding-bottom: 16px;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          white-space: nowrap;

          &:hover {
            color: #2f2f41;
          }

          &.active {
            color: $primary;
            border-bottom-color: $primary;
          }
        }
      }
    }

    // Row 2: Campaign + Filters + Actions
    .header-row-2 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      gap: 16px;

      .filters-and-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: auto;
      }

      .campaign-dropdown {
        ::v-deep .btn {
          padding: 0;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #fff;
          height: auto;

          &:hover {
            border-color: #d1d5db;
          }

          &:focus {
            box-shadow: none;
          }
        }

        .campaign-selector {
          display: flex;
          align-items: center;
          gap: 40px;
          padding: 8px 12px;


          .campaign-info-container{
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .campaign-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }

          .campaign-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .campaign-name {
              font-size: 0.85rem;
              font-weight: 500;
              color: #2f2f41;
              line-height: 1.2;
            }

            .campaign-id {
              font-size: 0.75rem;
              color: #9ca3af;
              line-height: 1.2;
            }
          }

          .dropdown-icon {
            width: 16px;
            height: 16px;
            color: #6b7280;
          }
        }
      }

      .filter-dropdown {
        ::v-deep .btn {
          padding: 10px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #2f2f41;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #fff;

          &:hover {
            border-color: #d1d5db;
          }

          &:focus {
            box-shadow: none;
          }
        }
      }

      .reset-btn,
      .apply-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
        font-weight: 500;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .reset-btn {
        color: #2f2f41;
        background: #fff;
        border: 1px solid #e5e5e5;

        &:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }
      }

      .apply-btn {
        color: #fff;
        background: #000;
        border: 1px solid #000;

        &:hover {
          background: #1f2937;
        }
      }
    }
  }

  .analytics-content {
    padding: 32px;
    padding-top: 180px;
    background: #fff;


    .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;

    .stat-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      gap: 16px;

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 24px;
          height: 24px;
        }
      }

      .stat-content {
        flex: 1;

        .stat-label {
          font-size: 0.85rem;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2f2f41;
          margin: 0 0 4px 0;
        }

        .stat-change {
          font-size: 0.8rem;
          font-weight: 500;

          &.positive {
            color: #10B981;
          }

          &.negative {
            color: #EF4444;
          }
        }
      }
    }
  }

    .charts-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    .chart-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;

      &.full {
        grid-column: span 2;
      }

      &.half {
        grid-column: span 1;
      }
      }
    }
  }
}
</style>
