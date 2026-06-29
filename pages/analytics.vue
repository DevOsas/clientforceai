<template>
  <div class="reports-page">
    <b-container>
      <div class="d-flex justify-content-between">
        <div>
          <b-dropdown variant="primary-light" no-caret>
            <template #button-content>
              <SvgIcon name="user-star" class="main-icon" />
              Select Team
              <SvgIcon name="chevron-down-3" class="chevron" />
            </template>
            <b-dropdown-item>All</b-dropdown-item>
            <b-dropdown-item>None</b-dropdown-item>
          </b-dropdown>
          <SelectCampaignsDropdown
            variant="primary-light"
            @change="handleSelectCampaigns"
          >
            <SvgIcon name="trend" class="main-icon" />
            {{ selectedCampaignsLabel }}
            <SvgIcon name="chevron-down-3" class="chevron" />
          </SelectCampaignsDropdown>
          <b-dropdown variant="primary-light" no-caret>
            <template #button-content>
              <SvgIcon name="clock" class="main-icon" />
              Select Time
              <SvgIcon name="chevron-down-3" class="chevron" />
            </template>
            <b-dropdown-item @click="handleTimeRageSelect('week')">
              Last Week
            </b-dropdown-item>
            <b-dropdown-item @click="handleTimeRageSelect('month')">
              Last Month
            </b-dropdown-item>
            <b-dropdown-item @click="handleTimeRageSelect('year')">
              Last Year
            </b-dropdown-item>
            <b-dropdown-item @click="handleTimeRageSelect('all')">
              All time
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="d-flex">
          <b-button variant="export">
            <SvgIcon name="export" />
            Export
          </b-button>
          <div class="report-timezone">
            <div class="timezone-label">Timezone</div>
            <div class="timezone-value">(UTC -07:00)</div>
          </div>
        </div>
      </div>
      <div v-if="isChartLoading" class="stats-loading">
        <Spinner size="4" />
      </div>
      <template v-else>
        <ReportSummary
          :report="{
            leadsCount,
            deliveredCount,
            deliveredRate,
            opensCount,
            openRate,
            replyCount,
            replyRate,
            interestedCount,
            interestedRate,
            notReachedCount,
            notReachedRate,
            optedOutCount,
            optedOutRate,
          }"
        />
        <div class="chart-wrap">
          <ReportChart :loading="isChartLoading" :stats="campaignChart" />
        </div>
        <div class="reports-table-wrap">
          <ReportTable />
        </div>
      </template>
    </b-container>
  </div>
</template>

<script>
import moment from 'moment'

import SelectCampaignsDropdown from '~/components/Campaign/SelectCampaignsDropdown'
import ReportSummary from '~/components/Report/ReportSummary'
import ReportChart from '~/components/Report/ReportChart'
import ReportTable from '~/components/Report/ReportTable'

import { CAMPAIGN_CHART_QUERY } from '~/graphql/campaign/queries'

export default {
  components: {
    SelectCampaignsDropdown,
    ReportSummary,
    ReportChart,
    ReportTable,
  },

  middleware: ['auth', 'setup'],

  data() {
    return {
      campaignChart: {
        deliveries: [],
        opens: [],
        replies: [],
        interested: [],
        nonDeliveries: [],
        optedOuts: [],
      },
      isChartLoading: false,
      rangeFrom: null,
      rangeTo: moment(),
      selectedCampaignsIds: [],
    }
  },

  apollo: {
    campaignChart: {
      query: CAMPAIGN_CHART_QUERY,
      variables() {
        return {
          campaignIds: this.selectedCampaignsIds,
          from: this.rangeFrom ? this.rangeFrom.toISOString() : null,
          to: this.rangeTo.toISOString(),
        }
      },

      watchLoading(isLoading) {
        this.$nextTick(() => {
          this.isChartLoading = isLoading
        })
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    selectedCampaignsLabel() {
      if (this.selectedCampaignsIds.length) {
        const s = this.selectedCampaignsIds.length > 1 ? 's' : ''

        return `${this.selectedCampaignsIds.length} Campaign${s}`
      }
      return 'All Campaigns'
    },

    leadsCount() {
      return this.campaignChart.leadsCount
    },

    deliveredCount() {
      return this.campaignChart.deliveries.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    },

    deliveredRate() {
      if (this.leadsCount < 1) {
        return 0
      }

      return Math.floor((this.deliveredCount * 100) / this.leadsCount)
    },

    opensCount() {
      return this.campaignChart.opens.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    },

    openRate() {
      if (this.leadsCount < 1) {
        return 0
      }

      return Math.floor((this.opensCount * 100) / this.leadsCount)
    },

    replyCount() {
      return this.campaignChart.replies.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    },

    replyRate() {
      if (this.leadsCount < 1) {
        return 0
      }

      return Math.floor((this.replyCount * 100) / this.leadsCount)
    },

    interestedCount() {
      return this.campaignChart.interested.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    },

    interestedRate() {
      if (this.leadsCount < 1) {
        return 0
      }

      return Math.floor((this.interestedCount * 100) / this.leadsCount)
    },

    notReachedCount() {
      return this.campaignChart.nonDeliveries.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    },

    notReachedRate() {
      if (this.leadsCount < 1) {
        return 0
      }

      return Math.floor((this.notReachedCount * 100) / this.leadsCount)
    },

    optedOutCount() {
      return this.campaignChart.optedOuts.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )
    },

    optedOutRate() {
      if (this.leadsCount < 1) {
        return 0
      }

      return Math.floor((this.notReachedCount * 100) / this.leadsCount)
    },
  },

  methods: {
    handleSelectCampaigns(ids) {
      this.selectedCampaignsIds = ids
    },

    handleTimeRageSelect(range) {
      const today = moment()
      if (range === 'week') {
        this.rangeFrom = today.subtract(7, 'days')
      } else if (range === 'month') {
        this.rangeFrom = today.subtract(30, 'days')
      } else if (range === 'year') {
        this.rangeFrom = today.subtract(365, 'days')
      } else {
        this.rangeFrom = null
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.reports-page {
  padding-top: 40px;
  margin-bottom: 50px;

  .stats-loading {
    height: 70vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-primary-light {
    background: #ecffea;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-size: 13px;
    line-height: 16px;
    color: #646464;
    padding: 7px 20px;
    display: flex;
    align-items: center;
    margin-right: 10px;

    .icon {
      color: $primary;
    }

    .main-icon {
      font-size: 23px;
      margin-right: 5px;
    }

    .chevron {
      margin-left: 10px;
      font-size: 14px;
    }
  }

  .btn-export {
    background-color: $primary;
    color: $white;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    margin-right: 10px;
    text-transform: uppercase;
    border-radius: 10px;
    padding: 10px 15px;

    .icon {
      font-size: 22px;
      line-height: 0;
      margin-right: 5px;
    }
  }

  .report-timezone {
    .timezone-label {
      font-size: 14px;
      line-height: 17px;
      color: $gray-500;
    }
    .timezone-value {
      font-size: 14px;
      line-height: 17px;
      color: #8f8f8f;
    }
  }

  .reports-table-wrap {
    margin-top: 50px;

    .btn-white {
      background-color: $white;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      font-size: 13px;
      line-height: 16px;
      color: #646464;
      padding: 7px 20px;
      display: flex;
      align-items: center;
      margin-right: 10px;

      .icon {
        color: $primary;
      }

      .main-icon {
        font-size: 23px;
        margin-right: 5px;
      }

      .chevron {
        margin-left: 10px;
        font-size: 14px;
      }
    }
  }

  .chart-wrap {
    width: 100%;
    min-height: 375px;
    margin-top: 50px;
    background: $white;
    border-radius: 10px;
    box-shadow: 0 10px 100px rgba(0, 0, 0, 0.05);
    padding-top: 30px;
    position: relative;

    &::before {
      content: '';
      height: 1px;
      width: 100%;
      position: absolute;
      left: 0;
      top: 75px;
      background-color: $gray-200;
    }

    .echarts {
      width: 100%;
    }
  }
}
</style>
