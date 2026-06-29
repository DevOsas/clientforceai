<template>
  <div class="dashboard-v2-page">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="greeting">
        <SvgIcon name="sparkles" class="greeting-icon" />
        Hello, <span class="username">{{ $auth.user.fullName }} </span>
      </h1>
      <b-button variant="outline-secondary" class="create-campaign-btn" @click="createCampaign">
        <span class="plus-icon">+</span>
        CREATE AGENT
      </b-button>
    </div>

    <!-- Metrics Cards -->
    <div class="metrics-grid">
      <div 
        v-for="(metric, index) in metricsData" 
        :key="index"
        class="metric-card"
      >
        <div class="card-header">
          <div class="icon-wrapper">
            <SvgIcon :name="metric.icon" class="card-icon" />
          </div>
          <div class="card-label">{{ metric.label }}</div>
        </div>
        <div class="card-content">
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-trend">
            <client-only>
              <v-chart 
                :option="getSparklineOption(metric.chartData, metric.trendColor)" 
                :autoresize="true"
                class="sparkline-chart"
              />
            </client-only>
            <span class="trend-percentage" :class="metric.trendDirection">
              {{ metric.trendPercentage }}
            </span>
            <span class="trend-label">{{ metric.trendLabel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Agents Section -->
    <div class="active-agents-section">
      <div class="section-header">
        <h2 class="section-title">Active Agents</h2>
        <a href="#" class="view-all-link">
          View all agents
          <span class="arrow-icon">›</span>
        </a>
      </div>

      <div class="agents-table-card">
        <div class="agents-table">
          <!-- Table Header -->
          <div class="table-header">
            <div class="table-row">
              <div class="table-cell agent-cell">Agents</div>
              <div class="table-cell">Status</div>
              <div class="table-cell">Channels</div>
              <div class="table-cell">Replies</div>
              <div class="table-cell">Qualified</div>
              <div class="table-cell">Bookings</div>
              <div class="table-cell">Payments</div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="table-body">
            <div 
              v-for="(agent, index) in activeAgentsData" 
              :key="index"
              class="table-row"
            >
              <div class="table-cell agent-cell" data-label="Agent">
                <img :src="agent.avatar" alt="Agent" class="agent-avatar" />
                <span class="agent-name">{{ agent.name }}</span>
              </div>
              <div class="table-cell" data-label="Status">
                <span class="status-badge" :class="agent.status.toLowerCase()">
                  {{ agent.status }}
                </span>
              </div>
              <div class="table-cell channels-cell" data-label="Channels">{{ agent.channels }}</div>
              <div class="table-cell" data-label="Replies">{{ agent.replies }}</div>
              <div class="table-cell" data-label="Qualified">{{ agent.qualified }}</div>
              <div class="table-cell" data-label="Bookings">{{ agent.bookings }}</div>
              <div class="table-cell" data-label="Payments">{{ agent.payments }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Email Account, Campaign Insights, Activity Feed -->
    <div class="bottom-section">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Add Email Account Card -->
        <div class="email-account-card">
          <div class="card-content-wrapper">
            <div class="card-text">
              <h3 class="card-title">Add an Email account</h3>
              <p class="card-description">Add an Email account to your account</p>
            </div>
            <b-button variant="outline-secondary" class="add-btn">
              <span class="plus-icon">+</span> Add
            </b-button>
          </div>
        </div>

        <!-- Campaign Insights Card -->
        <div class="campaign-insights-card">
          <div class="insights-header">
            <h3 class="insights-title">Campaign Insights</h3>
            <div class="insights-filters">
              <b-dropdown variant="outline-secondary" class="filter-dropdown" :text="insightsMetricLabel">
                <b-dropdown-item @click="setInsightsMetric('sends')">Sends</b-dropdown-item>
                <b-dropdown-item @click="setInsightsMetric('opens')">Opens</b-dropdown-item>
                <b-dropdown-item @click="setInsightsMetric('replies')">Replies</b-dropdown-item>
                <b-dropdown-item @click="setInsightsMetric('interested')">Qualified</b-dropdown-item>
              </b-dropdown>
              <b-dropdown variant="outline-secondary" class="filter-dropdown" :text="insightsRangeLabel">
                <b-dropdown-item @click="setInsightsRange('7days')">Last 7 days</b-dropdown-item>
                <b-dropdown-item @click="setInsightsRange('30days')">Last 30 days</b-dropdown-item>
                <b-dropdown-item @click="setInsightsRange('90days')">Last 90 days</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>

          <div class="chart-container">
            <div class="chart-label">
            
            </div>
            <client-only>
              <v-chart 
                :option="campaignInsightsChartOption" 
                :autoresize="true"
                class="insights-chart"
              />
            </client-only>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Activity Feed -->
        <div class="activity-feed-card">
          <h3 class="feed-title">Activity Feed</h3>
          <div class="feed-list">
            <div 
              v-for="(activity, index) in activityFeedData" 
              :key="index"
              class="feed-item"
            >
              <div class="feed-icon">
                <SvgIcon name="bookings" class="campaign-icon" />
              </div>
              <span class="feed-text">{{ activity.text }}</span>
              <span class="feed-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>

        <!-- Health & Warnings -->
        <div class="health-warnings-card">
          <h3 class="health-title">Health & Warnings</h3>
          <div class="warnings-list">
            <div 
              v-for="(warning, index) in healthWarningsData" 
              :key="index"
              class="warning-item"
              :class="warning.type"
            >
              <div class="warning-content">
                <SvgIcon name="warning-triangle" class="warning-icon" />
                <span class="warning-text">{{ warning.text }}</span>
              </div>
              <b-button variant="outline-secondary" size="sm" class="fix-btn">
                Fix
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Onboarding System -->
    <OnboardingContainer />
  </div>
</template>

<script>
import OnboardingContainer from '~/components/Onboarding/OnboardingContainer'
import { ACCOUNT_SETUP_PROGRESS_QUERY, DASHBOARD_STATS_QUERY } from '~/graphql/user/queries'
import { CAMPAIGN_CHART_QUERY, ALL_CAMPAIGNS_QUERY } from '~/graphql/campaign/queries'
import { NOTIFICATIONS_QUERY } from '~/graphql/notification/queries'
import { ALL_EMAIL_ACCOUNTS_QUERY } from '~/graphql/email-account/queries'
import { ACTIVE_AGENTS_QUERY } from '~/graphql/agent/queries'

export default {
  name: 'DashboardV2Page',

  components: {
    OnboardingContainer
  },

  middleware: ['auth', 'setup'],
  layout: 'dashboard',

  data() {
    return {
      activityFeedData: [],
      healthWarningsData: [],
      activeAgentsData: [],
      metricsData: [],

      dashboardStats: null,
      campaignChartData: null,
      userNotifications: null,
      accountSetupProgress: null,
      emailAccounts: [],
      activeCampaignsTotal: 0,

      insightsMetric: 'sends',
      insightsRange: '30days',
    }
  },

  apollo: {
    dashboardStats: {
      query: DASHBOARD_STATS_QUERY,
      variables() {
        return { range: '7days', stats: '' }
      },
      update(data) { return data.dashboardStats },
      error() { return false },
    },
    campaignChartData: {
      query: CAMPAIGN_CHART_QUERY,
      variables() {
        return { campaignIds: null, from: this.chartFromDate, to: this.chartToDate }
      },
      update(data) { return data.campaignChart },
      error() { return false },
    },
    userNotifications: {
      query: NOTIFICATIONS_QUERY,
      error() { return false },
    },
    accountSetupProgress: {
      query: ACCOUNT_SETUP_PROGRESS_QUERY,
      error() { return false },
    },
    emailAccounts: {
      query: ALL_EMAIL_ACCOUNTS_QUERY,
      update(data) { return data.emailAccounts || [] },
      error() { return false },
    },
    activeAgentsData: {
      query: ACTIVE_AGENTS_QUERY,
      variables() { return { limit: 5 } },
      update(data) {
        const list = data && data.activeAgents ? data.activeAgents : []
        return list.map((a) => ({
          avatar: a.avatarUrl || `https://i.pravatar.cc/40?u=${a.id}`,
          name: a.name,
          status: a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : 'Active',
          channels: a.channels || '',
          replies: a.replies,
          qualified: a.qualified,
          bookings: a.bookings,
          payments: a.payments,
        }))
      },
      error() { return false },
    },
    activeCampaignsTotal: {
      query: ALL_CAMPAIGNS_QUERY,
      variables() {
        return { status: 'active', folderId: null, offset: 0, keyword: null }
      },
      update(data) { return (data.campaignResult && data.campaignResult.total) || 0 },
      error() { return false },
    },
  },

  mounted() {
    // Start onboarding when dashboard loads
    this.$store.dispatch('onboarding/startOnboarding')
  },

  watch: {
    dashboardStats: {
      handler() { this.buildMetricsData() },
      immediate: true,
    },
    campaignChartData: {
      handler() { this.buildMetricsData() },
      immediate: true,
    },
    activeCampaignsTotal: {
      handler() { this.buildMetricsData() },
      immediate: true,
    },
    userNotifications: {
      handler() { this.buildActivityFeedData() },
      immediate: true,
    },
    accountSetupProgress: {
      handler() { this.buildHealthWarningsData() },
      immediate: true,
    },
    emailAccounts() { this.buildHealthWarningsData() },
    activeAgentsData: {
      handler() { this.buildMetricsData() },
      immediate: true,
    },
  },

  computed: {
    campaignInsightsChartOption() {
      const chart = this.campaignChartData
      const metricKey = this.insightsMetric === 'sends' ? 'deliveries' : this.insightsMetric
      const months = (chart && chart.dates) ? chart.dates.map(d => this.formatMonth(d)) : []
      const seriesData = (chart && chart[metricKey]) ? chart[metricKey] : []
      const maxValue = seriesData.length ? Math.max(...seriesData) : 0

      return {
        grid: { left: 40, right: 20, top: 20, bottom: 30 },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          textStyle: { color: '#2f2f41' },
          formatter: (params) => {
            const idx = params[0].dataIndex
            const value = seriesData[idx] || 0
            return `<div style="font-weight: 600; margin-bottom: 4px;">${value} ${this.insightsMetricLabel}</div>`
          },
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#6b7280', fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: true, lineStyle: { type: 'dashed', color: '#d1d5db', width: 1 } },
        },
        series: [
          {
            type: 'bar',
            data: seriesData.map((v) => ({
              value: v,
              itemStyle: { color: v === maxValue ? '#0ad855' : '#000', borderRadius: [4, 4, 0, 0] },
            })),
            barWidth: 12,
          },
        ],
      }
    },

    insightsMetricLabel() {
      switch (this.insightsMetric) {
        case 'opens': return 'Opens'
        case 'replies': return 'Replies'
        case 'interested': return 'Qualified'
        default: return 'Sends'
      }
    },

    insightsRangeLabel() {
      switch (this.insightsRange) {
        case 'today': return 'Today'
        case '7days': return 'Last 7 days'
        case '90days': return 'Last 90 days'
        default: return 'Last 30 days'
      }
    },

    chartFromDate() {
      const today = new Date()
      let days = 30
      if (this.insightsRange === 'today') days = 0
      else if (this.insightsRange === '7days') days = 7
      else if (this.insightsRange === '90days') days = 90
      const from = new Date(today)
      from.setDate(today.getDate() - days)
      return this.formatDate(from)
    },

    chartToDate() {
      return this.formatDate(new Date())
    },
  },

  methods: {
    createCampaign() {
      // Navigate directly to campaign setup page
      this.$router.push('/campaign-v2/new/setup')
    },

    setInsightsMetric(key) {
      this.insightsMetric = key
    },

    setInsightsRange(key) {
      this.insightsRange = key
    },

    buildMetricsData() {
      const stats = this.dashboardStats || {}
      const chart = this.campaignChartData || {}
      const activeAgents = Array.isArray(this.activeAgentsData) ? this.activeAgentsData.length : (this.activeCampaignsTotal || 0)

      const leadsSeries = chart.leadsCount || []
      const qualifiedSeries = chart.interested || []

      const contactsValue = stats.leadsCount != null ? stats.leadsCount : (leadsSeries[leadsSeries.length - 1] || 0)
      const qualifiedValue = qualifiedSeries.reduce((a, b) => a + (b || 0), 0)

      const mkTrend = (arr) => {
        if (!arr || arr.length < 2) return { pct: '0%', dir: 'positive' }
        const first = arr[0] || 0
        const last = arr[arr.length - 1] || 0
        const delta = last - first
        const pct = first === 0 ? (delta > 0 ? '100%' : '0%') : `${Math.round((delta / first) * 100)}%`
        return { pct: (delta >= 0 ? '+' : '') + pct, dir: delta >= 0 ? 'positive' : 'negative' }
      }

      const agentsSpark = Array(7).fill(activeAgents)
      const contactsSpark = leadsSeries.length ? leadsSeries.slice(-7) : Array(7).fill(contactsValue)
      const qualifiedSpark = qualifiedSeries.length ? qualifiedSeries.slice(-7) : Array(7).fill(qualifiedValue)

      const agentsTrend = mkTrend(agentsSpark)
      const contactsTrend = mkTrend(contactsSpark)
      const qualifiedTrend = mkTrend(qualifiedSpark)

      this.metricsData = [
        {
          icon: 'agent',
          label: 'Agents Running',
          value: String(activeAgents),
          chartData: agentsSpark,
          trendColor: '#10b981',
          trendPercentage: agentsTrend.pct,
          trendDirection: agentsTrend.dir,
          trendLabel: this.insightsRangeLabel,
        },
        {
          icon: 'contacts',
          label: 'Contacts in Sequences',
          value: String(contactsValue),
          chartData: contactsSpark,
          trendColor: '#10b981',
          trendPercentage: contactsTrend.pct,
          trendDirection: contactsTrend.dir,
          trendLabel: this.insightsRangeLabel,
        },
        {
          icon: 'bulb',
          label: 'Qualified leads',
          value: String(qualifiedValue),
          chartData: qualifiedSpark,
          trendColor: qualifiedTrend.dir === 'negative' ? '#ef4444' : '#10b981',
          trendPercentage: qualifiedTrend.pct,
          trendDirection: qualifiedTrend.dir,
          trendLabel: this.insightsRangeLabel,
        },
        {
          icon: 'bookings',
          label: 'Bookings',
          value: '0',
          chartData: Array(7).fill(0),
          trendColor: '#10b981',
          trendPercentage: '+0%',
          trendDirection: 'positive',
          trendLabel: this.insightsRangeLabel,
        },
        {
          icon: 'payment',
          label: 'Payments Closed',
          value: '0',
          chartData: Array(7).fill(0),
          trendColor: '#10b981',
          trendPercentage: '+0%',
          trendDirection: 'positive',
          trendLabel: this.insightsRangeLabel,
        },
      ]
    },

    buildActivityFeedData() {
      const un = this.userNotifications
      const list = (un && un.notifications) || []
      this.activityFeedData = list.slice(0, 8).map((n) => ({
        text: n.title || n.summary || 'Activity',
        time: this.formatTime(n.createdAt),
      }))
    },

    buildHealthWarningsData() {
      const arr = []
      const progress = this.accountSetupProgress || {}
      const accounts = this.emailAccounts || []
      if (!progress.hasEmailAccount || accounts.length === 0) {
        arr.push({ type: 'email', text: 'Add an Email account' })
      } else {
        const misconfigured = accounts.some(a => !a.isAgreementConfirmed || !a.emailsPerDayLimit)
        if (misconfigured) arr.push({ type: 'email', text: 'Review email account configuration' })
      }
      this.healthWarningsData = arr
    },

    formatDate(d) {
      const pad = (n) => (n < 10 ? '0' + n : '' + n)
      const year = d.getFullYear()
      const month = pad(d.getMonth() + 1)
      const day = pad(d.getDate())
      return `${year}-${month}-${day}`
    },

    formatMonth(dateStr) {
      const d = new Date(dateStr)
      return d.toLocaleString(undefined, { month: 'short' })
    },

    formatTime(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      return d.toLocaleString()
    },

    getSparklineOption(data, color) {
      return {
        grid: {
          left: 0,
          right: 5,
          top: 5,
          bottom: 2
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            type: 'line',
            data: data,
            smooth: true,
            showSymbol: true,
            symbol: 'none',
            symbolSize: 0,
            lineStyle: {
              color: color,
              width: 2
            },
            // Show hollow circle only at the last point
            data: data.map((value, index) => {
              if (index === data.length - 1) {
                return {
                  value: value,
                  symbol: 'circle',
                  symbolSize: 8,
                  itemStyle: {
                    color: '#fff',
                    borderColor: color,
                    borderWidth: 2
                  }
                }
              }
              return value
            })
          }
        ]
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.dashboard-v2-page {
  padding: 32px 40px;
  background: #fafafa;
  min-height: 100vh;
  margin-top: -1rem;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 1200px) {
    max-width: 1440px;
  }
  
  @media (min-width: 1400px) {
    max-width: 1520px;
  }

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
  }

  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 32px;

    .greeting {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.75rem;
      font-weight: 400;
      color: #2f2f41;
      margin: 0;

      .greeting-icon {
        width: 24px;
        height: 24px;
        color: #f59e0b;
      }

      .username {
        font-weight: 600;
        color: #000;
      }
    }

    .create-campaign-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 8px;
      background: #fff;
      color: #000;
      border: 1px solid #6b7280;

      &:hover {
        background: #f9fafb;
        border-color: #4b5563;
      }

      &:focus {
        box-shadow: none;
      }

      .plus-icon {
        font-size: 1.4rem;
        font-weight: 400;
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;

      .create-campaign-btn {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;

    @media (max-width: 1400px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1100px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }

    .metric-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 16px;
      padding: 18px;
      transition: box-shadow 0.2s ease;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
        background: transparent !important;
        border: none !important;
        padding: 1px !important;

        .icon-wrapper {
          width: 30px;
          height: 30px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .card-icon {
            width: 16px;
            height: 16px;
            color: #000;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
          }

          ::v-deep svg {
            width: 16px;
            height: 16px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1;
          }
        }

        .card-label {
          font-size: 1rem;
          font-weight: 400;
          color: #6b7280;
          line-height: 1.3;
        }
      }

      .card-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        @media (max-width: 768px) {
          flex-direction: column;
          align-items: flex-start;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #000;
          line-height: 1;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 6px;

          .sparkline-chart {
            width: 60px;
            height: 28px;
          }

          .trend-percentage {
            font-size: 1rem;
            font-weight: 600;

            &.positive {
              color: #10b981;
            }

            &.negative {
              color: #ef4444;
            }
          }

          .trend-label {
            font-size: 1rem;
            font-weight: 400;
            color: #000;
          }
        }
      }
    }
  }

  .active-agents-section {
    margin-top: 40px;

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;

      .section-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #000;
        margin: 0;
      }

      .view-all-link {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.9rem;
        color: #9ca3af;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: #6b7280;
        }

        .arrow-icon {
          font-size: 1.2rem;
          font-weight: 300;
        }
      }
    }

    .agents-table-card {
      background: #fff;
      border: none;
      border-radius: 12px;
      padding: 0;
      overflow: hidden;
      overflow-x: auto;

      .agents-table {
        width: 100%;
        min-width: 720px;

        @media (max-width: 768px) {
          min-width: 0;
        }

        .table-header {
          background: #fff;
          border-bottom: 1px solid #e5e5e5;

          .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 2.5fr 1fr 1fr 1fr 1fr;
            align-items: center;
            padding: 0;
            width: 100%;

            .table-cell {
              padding: 14px 20px;
              font-size: 0.85rem;
              font-weight: 600;
              color: #6b7280;

              &:first-child {
                padding-left: 24px;
              }

              &:last-child {
                padding-right: 24px;
              }
            }
          }
        }

        .table-body {
          .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 2.5fr 1fr 1fr 1fr 1fr;
            align-items: center;
            padding: 0;
            transition: background 0.2s ease;
            width: 100%;
            border-bottom: 1px solid #f3f4f6;

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: #fafafa;
            }

            .table-cell {
              padding: 16px 20px;
              font-size: 0.9rem;
              color: #2f2f41;

              &:first-child {
                padding-left: 24px;
              }

              &:last-child {
                padding-right: 24px;
              }

              &.agent-cell {
                display: flex;
                align-items: center;
                gap: 12px;

                .agent-avatar {
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  object-fit: cover;
                  flex-shrink: 0;
                }

                .agent-name {
                  font-size: 0.9rem;
                  font-weight: 500;
                  color: #000;
                }
              }

              &.channels-cell {
                color: #d1d5db;
                letter-spacing: 0.5px;
              }

              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 600;

                &.active {
                  background: $primary;
                  color: #fff;
                }

                &.inactive {
                  background: #e5e7eb;
                  color: #4b5563;
                }
              }
            }
          }
        }
      }
    }
  }

  .bottom-section {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 24px;
    margin-top: 40px;

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
    }

    .left-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;

      .email-account-card {
        background: #d5f3f6;
        border-radius: 12px;
        padding: 20px 24px;

        .card-content-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;

          @media (max-width: 600px) {
            flex-direction: column;
            align-items: flex-start;
          }

          .card-text {
            .card-title {
              font-size: 1.4rem;
              font-weight: 600;
              color: #000;
              margin: 0 0 4px 0;
            }

            .card-description {
              font-size: 0.95rem;
              color: #000;
              margin: 0;
            }
          }

          .add-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            font-size: 0.85rem;
            font-weight: 600;
            background: #fff;
            color: #000;
            border: 1px solid #d1d5db;
            border-radius: 8px;

            &:hover {
              background: #f9fafb;
            }

            &:focus {
              box-shadow: none;
            }

            .plus-icon {
              font-size: 1.2rem;
            }

            @media (max-width: 600px) {
              width: 100%;
              justify-content: center;
            }
          }
        }
      }

      .campaign-insights-card {
        background: #c6f56b;
        border-radius: 12px;
        padding: 24px;
        flex: 1;

        .insights-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;

          .insights-title {
            font-size: 1rem;
            font-weight: 600;
            color: #000;
            margin: 0;
          }

          .insights-filters {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;

            .filter-dropdown {
              ::v-deep .btn {
                padding: 6px 12px;
                font-size: 0.8rem;
                font-weight: 500;
                background: #fff;
                color: #000;
                border: 1px solid #d1d5db;
                border-radius: 6px;

                &:hover {
                  background: #f9fafb;
                }

                &:focus {
                  box-shadow: none;
                }
              }
            }
          }
        }

        .chart-container {
          background: #fff;
          border-radius: 12px;
          padding: 20px;

          .chart-label {
            text-align: center;
            margin-bottom: 16px;

            .label-value {
              font-size: 1rem;
              font-weight: 600;
              color: #000;
              margin-bottom: 2px;
            }

            .label-date {
              font-size: 0.75rem;
              color: #9ca3af;
            }
          }

          .insights-chart {
            width: 100%;
            height: 240px;
          }
        }
      }
    }

    .right-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;

      .activity-feed-card {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 20px 24px;

        .feed-title {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
        }

        .feed-list {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .feed-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;

            &:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }

            &:first-child {
              padding-top: 0;
            }

            .feed-icon {
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;

              .campaign-icon {
                width: 18px;
                height: 18px;
                color: #6b7280;
              }
            }

            .feed-text {
              flex: 1;
              font-size: 0.9rem;
              color: #000;
            }

            .feed-time {
              font-size: 0.85rem;
              color: #9ca3af;
            }
          }
        }
      }

      .health-warnings-card {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 20px 24px;
        min-width: 0;
        width: 100%;

        .health-title {
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          margin: 0 0 16px 0;
        }

        .warnings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .warning-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-radius: 8px;

            &.email {
              background: #dbeafe;
            }

            &.voice {
              background: #e9d5ff;
            }

            &.whatsapp {
              background: #fecaca;
            }

            .warning-content {
              display: flex;
              align-items: center;
              gap: 10px;
              flex: 1;
              min-width: 0;

              .warning-icon {
                width: 16px;
                height: 16px;
                color: #000;
                flex-shrink: 0;
              }

              .warning-text {
                font-size: 0.9rem;
                color: #000;
                font-weight: 500;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
            }

            .fix-btn {
              padding: 4px 12px;
              font-size: 0.8rem;
              font-weight: 600;
              background: #fff;
              color: #000;
              border: 1px solid #d1d5db;
              border-radius: 6px;

              &:hover {
                background: #f9fafb;
              }

              &:focus {
                box-shadow: none;
              }
            }
          }

        }

        @media (max-width: 992px) {
          .table-header .table-row,
          .table-body .table-row {
            grid-template-columns: 1.5fr 1fr 1.5fr 1fr 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .table-header {
            display: none;
          }

          .table-body .table-row {
            grid-template-columns: 1fr;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            margin-bottom: 16px;
            padding: 16px;
            gap: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            .table-cell {
              padding: 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 0.9rem;
              color: #000;

              &::before {
                content: attr(data-label);
                font-weight: 600;
                color: #6b7280;
                margin-right: 12px;
              }
            }

            .agent-cell {
              flex-direction: row;
              align-items: center;
              gap: 12px;

              &::before {
                content: '';
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
