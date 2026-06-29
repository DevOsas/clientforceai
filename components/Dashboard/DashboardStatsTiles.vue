<template>
  <div class="dashboard-tiles">
    <div class="tile leads">
      <div class="d-flex justify-content-between">
        <h5 class="tile-title">Leads</h5>

        <b-dropdown size="sm" variant="light" toggle-class="px-3" no-caret>
          <template #button-content>
            {{ leadRangeLable }}
            <SvgIcon name="chevron-down" size="sm" class="ml-1" />
          </template>
          <b-dropdown-item @click="updateRange('Today', 'leads')"
            >Today</b-dropdown-item
          >
          <b-dropdown-item @click="updateRange('7days', 'leads')"
            >Last 7 days</b-dropdown-item
          >
          <b-dropdown-item @click="updateRange('30days', 'leads')"
            >Last 30 days</b-dropdown-item
          >
        </b-dropdown>
      </div>

      <b-skeleton
        v-if="queryLoading"
        animation="fade"
        width="70%"
        height="38px"
        class="mt-2"
      />
      <div v-else class="tile-number">+{{ dashboardStats.leadsCount }}</div>
    </div>
    <div class="tile campaigns">
      <div class="d-flex justify-content-between">
        <h5 class="tile-title">Campaigns</h5>

        <b-dropdown size="sm" variant="light" toggle-class="px-3" no-caret>
          <template #button-content>
            {{ campaignRangeLable }}
            <SvgIcon name="chevron-down" size="sm" class="ml-1" />
          </template>
          <b-dropdown-item @click="updateRange('Today', 'campaigns')"
            >Today</b-dropdown-item
          >
          <b-dropdown-item @click="updateRange('7days', 'campaigns')"
            >Last 7 days</b-dropdown-item
          >
          <b-dropdown-item @click="updateRange('30days', 'campaigns')"
            >Last 30 days</b-dropdown-item
          >
        </b-dropdown>
      </div>

      <b-skeleton
        v-if="queryLoading"
        animation="fade"
        width="70%"
        height="38px"
        class="mt-2"
      />
      <div v-else class="tile-number">+{{ dashboardStats.campaignsCount }}</div>
    </div>
    <div class="tile finder" @click="$bvModal.show('FinderModal')">
      <div class="finder-image"></div>
      <h5 class="tile-title">Finder</h5>
    </div>
    <div class="tile sent">
      <div class="d-flex justify-content-between">
        <h5 class="tile-title">Email Sent</h5>

        <b-dropdown size="sm" variant="light" toggle-class="px-3" no-caret>
          <template #button-content>
            {{ emailSentRangeLable }}
            <SvgIcon name="chevron-down" size="sm" class="ml-1" />
          </template>
          <b-dropdown-item @click="updateRange('Today', 'emailSent')"
            >Today</b-dropdown-item
          >
          <b-dropdown-item @click="updateRange('7days', 'emailSent')"
            >Last 7 days</b-dropdown-item
          >
          <b-dropdown-item @click="updateRange('30days', 'emailSent')"
            >Last 30 days</b-dropdown-item
          >
        </b-dropdown>
      </div>

      <b-skeleton
        v-if="queryLoading"
        animation="fade"
        width="70%"
        height="38px"
        class="mt-2"
      />
      <div v-else class="tile-number">+{{ dashboardStats.emailSentCount }}</div>
    </div>
    <div class="tile responses">
      <div class="d-flex justify-content-between">
        <h5 class="tile-title">Responses</h5>

        <b-dropdown
          size="sm"
          variant="light"
          toggle-class="px-3"
          no-caret
          @change="setRange"
        >
          <template #button-content>
            {{ responsesRangeLabel }}
            <SvgIcon name="chevron-down" size="sm" class="ml-1" />
          </template>

          <b-dropdown-item @click="updateRange('Today', 'responses')"
            >Today</b-dropdown-item
          >

          <b-dropdown-item @click="updateRange('7days', 'responses')"
            >Last 7 days</b-dropdown-item
          >
          <b-dropdown-item @click="updateRange('30days', 'responses')"
            >Last 30 days</b-dropdown-item
          >
        </b-dropdown>
      </div>
      <b-skeleton
        v-if="queryLoading"
        animation="fade"
        width="70%"
        height="38px"
        class="mt-2"
      />
      <div v-else class="tile-number">+{{ dashboardStats.responsesCount }}</div>
    </div>
  </div>
</template>

<script>
import { DASHBOARD_STATS_QUERY } from '~/graphql/user/queries'

export default {
  data() {
    return {
      dashboardStats: {},
      range: 'today',
      stats: '',
      responsesRangeLabel: 'Today',
      leadRangeLable: 'Today',
      campaignRangeLable: 'Today',
      emailSentRangeLable: 'Today',
    }
  },

  apollo: {
    dashboardStats: {
      query: DASHBOARD_STATS_QUERY,
      variables() {
        return {
          range: this.range,
          stats: this.stats,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    queryLoading() {
      return this.$apollo.queries.dashboardStats.loading
    },
  },

  methods: {
    updateRange(range, stats) {
      this.range = range
      this.stats = stats
      this.updateRangeLabel(range, stats)
      this.$apollo.queries.dashboardStats.refresh()
    },

    updateRangeLabel(range, stats) {
      if (range === '7days' && stats === 'responses') {
        this.responsesRangeLabel = 'Last 7 days'
      } else if (range === '30days' && stats === 'responses') {
        this.responsesRangeLabel = 'Last 30 days'
      } else if (range === '7days' && stats === 'leads') {
        this.leadRangeLable = 'Last 7 days'
      } else if (range === '30days' && stats === 'leads') {
        this.leadRangeLable = 'Last 30 days'
      } else if (range === '7days' && stats === 'campaigns') {
        this.campaignRangeLable = 'Last 7 days'
      } else if (range === '30days' && stats === 'campaigns') {
        this.campaignRangeLable = 'Last 30 days'
      } else if (range === '7days' && stats === 'emailSent') {
        this.emailSentRangeLable = 'Last 7 days'
      } else if (range === '30days' && stats === 'emailSent') {
        this.emailSentRangeLable = 'Last 30 days'
      } else {
        this.emailSentRangeLable = 'Today'
        this.responsesRangeLabel = 'Today'
        this.campaignRangeLable = 'Today'
        this.leadRangeLable = 'Today'
      }
    },

    setRange() {
      // this.updateRange(this.range, this.stats)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.dashboard-tiles {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 250px 250px 250px;

  .tile {
    background-color: #444;
    border-radius: 8px;
    padding: 20px 20px 7px;

    .tile-title {
      font-size: 1.2rem;
      color: $dark;
      font-weight: normal;
    }

    .dropdown {
      .icon {
        font-size: 0.5rem;
      }
    }

    .tile-number {
      font-size: 35px;
      font-weight: bold;
      margin-top: 5px;
    }

    .btn {
      box-shadow: none;
      border-color: transparent;
    }

    &.leads {
      background-color: #fcf3da;

      .btn {
        background-color: #fcf3da;
      }
    }

    &.campaigns {
      grid-column: 1;
      background-color: #eafbeb;

      .btn {
        background-color: #eafbeb;
      }
    }

    &.finder {
      grid-column: 2;
      grid-row: 1 / span 2;
      padding: 0;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      border: 1px solid #eec2ff;

      .tile-title {
        position: absolute;
        top: 20px;
        left: 20px;
      }

      .finder-image {
        background: #eec2ff url('~@/assets/images/dash-finder.png') 3.5rem
          2.4rem / cover no-repeat;
        width: 100%;
        height: 100%;
        transition: all 1s;
      }

      &:hover {
        border-color: darken(#eec2ff, 15);
        box-shadow: 0 0 5px 0 rgba(23, 50, 68, 0.17);

        .finder-image {
          transform: scale(1.1);
        }
      }
    }

    &.sent {
      grid-row: 1;
      grid-column: 3;
      background-color: #fbf2ff;

      .btn {
        background-color: #fbf2ff;
      }
    }

    &.responses {
      grid-column: 3;
      background-color: #faf9f4;

      .btn {
        background-color: #faf9f4;
      }
    }
  }
}
</style>
