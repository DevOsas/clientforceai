<template>
  <div class="overview-tab">
    <!-- Metrics Cards -->
    <div class="metrics-grid">
      <div 
        v-for="metric in metrics" 
        :key="metric.label" 
        class="metric-card"
      >
        <div class="metric-header">
          <div class="metric-value">{{ metric.value }}</div>
          <span class="metric-label">{{ metric.label }}</span>
        </div>
        <div class="metric-footer">
          <div class="metric-chart">
            <client-only>
              <v-chart 
                :option="getSparklineOption(metric)" 
                :autoresize="true"
                class="sparkline-chart"
              />
            </client-only>
          </div>
          <div class="metric-change" :class="metric.trend">{{ metric.change }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Funnel Insights -->
        <div class="insights-card">
          <div class="card-header">
            <h3 class="card-title">Funnel Insights</h3>
            <div class="card-actions">
              <b-dropdown variant="outline-secondary" size="sm" text="Contacts">
                <b-dropdown-item>All Contacts</b-dropdown-item>
                <b-dropdown-item>Active Contacts</b-dropdown-item>
              </b-dropdown>
              <b-dropdown variant="outline-secondary" size="sm" text="Filter">
                <b-dropdown-item>This Week</b-dropdown-item>
                <b-dropdown-item>This Month</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <div class="chart-container">
            <client-only>
              <v-chart 
                :option="funnelChartOption" 
                :autoresize="true"
                class="funnel-chart"
              />
            </client-only>
          </div>
        </div>

        <!-- Sequence Step Performance -->
        <div class="insights-card">
          <div class="card-header">
            <h3 class="card-title">Sequence Step Performance</h3>
            <div class="card-actions">
              <b-dropdown variant="outline-secondary" size="sm" text="Sent">
                <b-dropdown-item>Sent</b-dropdown-item>
                <b-dropdown-item>Opened</b-dropdown-item>
                <b-dropdown-item>Clicked</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
          <div class="chart-container">
            <client-only>
              <v-chart 
                :option="sequenceChartOption" 
                :autoresize="true"
                class="sequence-chart"
              />
            </client-only>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Issues & Health -->
        <div class="health-card">
          <h3 class="card-title">Issues & Health</h3>
          <div class="health-items">
            <div 
              v-for="issue in healthIssues" 
              :key="issue.id" 
              class="health-item" 
              :class="issue.type"
              :style="{ background: issue.color }"
            >
              <div class="health-content">
                <SvgIcon name="warning-triangle" class="health-icon" style="fill: none !important;" />
                <span class="health-text">{{ issue.text }}</span>
              </div>
              <b-button variant="outline-dark" size="sm">Fix</b-button>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="activity-card">
          <h3 class="card-title">Activity Feed</h3>
          <div class="activity-items">
            <div 
              v-for="activity in activities" 
              :key="activity.id" 
              class="activity-item"
            >
              <SvgIcon name="calender-star" class="activity-icon" style="fill: none !important;" />
              <div class="activity-content">
                <span class="activity-text">{{ activity.text }}</span>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Live Feed -->
        <div class="live-feed-card">
          <div class="live-feed-header">
            <SvgIcon name="Play Stream" class="live-icon" style="fill: none !important;" />
            <h3 class="card-title">Live Feed</h3>
          </div>
          <div class="live-items">
            <div 
              v-for="call in liveCalls" 
              :key="call.id" 
              class="live-item" 
              :class="{ active: call.isActive }"
            >
              <div class="live-content">
                <SvgIcon name="phone" class="call-icon" />
                <span class="live-text">Call with {{ call.contact }}</span>
              </div>
              <div v-if="call.isActive" class="live-actions">
                <button class="action-btn mute">
                  <SvgIcon name="mute" />
                </button>
                <button class="action-btn end">
                  <SvgIcon name="downward-phone" />
                </button>
                <button class="action-btn add">
                  <SvgIcon name="plus-white" />
                </button>
                <div class="live-badge">
                  <span class="live-dot"></span>
                  <span class="live-text">Live</span>
                </div>
              </div>
              <div v-else class="live-meta">
                <span class="live-time">{{ call.time }}</span>
                <span class="live-status">{{ call.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CAMPAIGN_CHART_QUERY, CAMPAIGN_LOGS_QUERY } from '~/graphql/campaign/queries'
export default {
  name: 'OverviewTab',
  props: {
    campaignId: { type: Number, required: true },
    range: { type: String, default: '30days' },
  },
  apollo: {
    campaignChartData: {
      query: CAMPAIGN_CHART_QUERY,
      variables() {
        return {
          campaignIds: [this.campaignId],
          from: this.fromDate,
          to: this.toDate,
        }
      },
      update(data) { return data.campaignChart },
      error() { return false },
    },
    campaignLogs: {
      query: CAMPAIGN_LOGS_QUERY,
      variables() {
        return { campaignId: this.campaignId, offset: 0 }
      },
      update(data) { return data.campaignLogs },
      error() { return false },
    },
  },

  data() {
    return {
      // Metrics data
      metrics: [
        { value: 225, label: 'Sends', change: '+15% Today', trend: 'positive', chartData: [20, 35, 28, 42, 38, 50, 45, 60], color: '#10b981' },
        { value: 190, label: 'Replies', change: '-5% Today', trend: 'negative', chartData: [50, 45, 48, 42, 40, 35, 38, 30], color: '#ef4444' },
        { value: 98, label: 'Qualified Calls', change: '-5% Today', trend: 'negative', chartData: [45, 42, 40, 38, 35, 32, 30, 28], color: '#ef4444' },
        { value: 235, label: 'Bookings', change: '+15% Today', trend: 'positive', chartData: [25, 30, 35, 40, 45, 50, 55, 60], color: '#10b981' },
        { value: 123, label: 'Payments', change: '-5% Today', trend: 'negative', chartData: [55, 50, 48, 45, 42, 40, 38, 35], color: '#ef4444' }
      ],

      // Health issues
      healthIssues: [
        // { id: 1, type: 'email', text: 'Email deliverability low', color: '#d1fae5' },
        { id: 2, type: 'voice', text: 'Voice number reputation issue', color: '#e9d5ff' },
        { id: 3, type: 'whatsapp', text: 'Whatsapp Template Pending', color: '#fecaca' }
      ],

      // Activity feed
      activities: [],
      campaignChartData: null,
      campaignLogs: { logs: [] },

      // Live feed
      liveCalls: [
        { id: 1, contact: '@Chris Adol', status: 'live', time: null, isActive: true },
        { id: 2, contact: '@Mark Miller', status: 'Next', time: '03:01 AM', isActive: false },
        { id: 3, contact: '@Greg Noman', status: 'Queue', time: '03:01 AM', isActive: false }
      ]
    }
  },

  watch: {
    campaignChartData: {
      handler() {
        const chart = this.campaignChartData || {}
        const deliveries = Array.isArray(chart.deliveries) ? chart.deliveries : []
        const replies = Array.isArray(chart.replies) ? chart.replies : []
        const interested = Array.isArray(chart.interested) ? chart.interested : []
        const last = (arr) => (arr && arr.length ? arr[arr.length - 1] : 0)
        if (this.metrics && this.metrics.length >= 3) {
          this.metrics[0].value = last(deliveries)
          this.metrics[0].chartData = deliveries.slice(-8)
          this.metrics[1].value = last(replies)
          this.metrics[1].chartData = replies.slice(-8)
          this.metrics[2].value = interested.reduce((a, b) => a + (b || 0), 0)
          this.metrics[2].chartData = interested.slice(-8)
        }
      },
      immediate: true,
    },
    campaignLogs: {
      handler() {
        const logs = (this.campaignLogs && this.campaignLogs.logs) ? this.campaignLogs.logs : []
        this.activities = logs.slice(0, 8).map((l) => ({ id: l.id, text: l.content, time: new Date(l.createdAt).toLocaleString() }))
      },
      immediate: true,
    },
    range() {
      if (this.$apollo && this.$apollo.queries && this.$apollo.queries.campaignChartData) {
        this.$apollo.queries.campaignChartData.refetch()
      }
    },
    campaignId() {
      if (this.$apollo && this.$apollo.queries && this.$apollo.queries.campaignChartData) {
        this.$apollo.queries.campaignChartData.refetch()
      }
      if (this.$apollo && this.$apollo.queries && this.$apollo.queries.campaignLogs) {
        this.$apollo.queries.campaignLogs.refetch()
      }
    },
  },

  computed: {
    fromDate() {
      const today = new Date()
      let days = 30
      if (this.range === '7days') days = 7
      else if (this.range === '90days') days = 90
      const from = new Date(today)
      from.setDate(today.getDate() - days)
      const y = from.getFullYear()
      const m = String(from.getMonth() + 1).padStart(2, '0')
      const d = String(from.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    toDate() {
      const t = new Date()
      const y = t.getFullYear()
      const m = String(t.getMonth() + 1).padStart(2, '0')
      const d = String(t.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    funnelChartOption() {
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          textStyle: {
            color: '#2f2f41'
          },
          formatter: (params) => {
            const data = params[0]
            return `<div style="font-weight: 600;">${data.value}k Sends</div>
                    <div style="font-size: 0.85rem; color: #6b7280;">Monday, April 22nd</div>`
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '10%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          axisLabel: {
            color: '#9ca3af',
            fontSize: 11
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#9ca3af',
            fontSize: 11,
            formatter: (value) => {
              if (value >= 1000) return `${value / 1000}k`
              return value
            }
          },
          splitLine: {
            lineStyle: {
              color: '#e5e7eb',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: [30, 80, 40, 70, 90, 60, 50, 55, 65, 75, 85, 95, 100],
            itemStyle: {
              color: (params) => {
                const data = [30, 80, 40, 70, 90, 60, 50, 55, 65, 75, 85, 95, 100]
                const maxValue = Math.max(...data)
                return params.value === maxValue ? '#10b981' : '#000'
              },
              borderRadius: [8, 8, 0, 0]
            },
            barWidth: '40%',
            emphasis: {
              itemStyle: {
                color: '#10b981'
              }
            }
          }
        ]
      }
    },

    sequenceChartOption() {
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          textStyle: {
            color: '#2f2f41'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '10%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          axisLabel: {
            color: '#9ca3af',
            fontSize: 11
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#9ca3af',
            fontSize: 11,
            formatter: (value) => {
              if (value >= 1000) return `${value / 1000}k`
              return value
            }
          },
          splitLine: {
            lineStyle: {
              color: '#e5e7eb',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            type: 'line',
            data: [1000, 12000, 8000, 5000, 3000, 1500, 10000, 9000, 8500, 7000, 4000, 2500, 1000],
            smooth: true,
            lineStyle: {
              color: '#6366f1',
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(99, 102, 241, 0.3)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(99, 102, 241, 0.05)'
                  }
                ]
              }
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#6366f1',
              borderColor: '#fff',
              borderWidth: 2
            },
            showSymbol: false,
            emphasis: {
              showSymbol: true
            }
          }
        ]
      }
    }
  },

  methods: {
    getSparklineOption(metric) {
      return {
        grid: {
          left: 5,
          right: 5,
          top: 5,
          bottom: 5,
          containLabel: false
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
            data: metric.chartData.map((value, index) => {
              return {
                value: value,
                symbol: index === metric.chartData.length - 1 ? 'circle' : 'none',
                symbolSize: 8,
                itemStyle: {
                  color: '#fff',
                  borderColor: metric.color,
                  borderWidth: 2
                }
              }
            }),
            smooth: true,
            lineStyle: {
              color: metric.color,
              width: 2
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: metric.color + '40'
                  },
                  {
                    offset: 1,
                    color: metric.color + '05'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  },

  mounted() {
    // Fetch overview data
    console.log('Overview tab mounted')
    // TODO: Fetch metrics, health issues, activities, and live calls from API
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.overview-tab {
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin-bottom: 30px;

    .metric-card {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .metric-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000;
          margin: 0;
          line-height: 1;
          background: #fcfeff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 16px;
        }

        .metric-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 400;
        }
      }

      .metric-footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;

        .metric-chart {
          flex: 1;
          height: 40px;

          .sparkline-chart {
            width: 100%;
            height: 100%;
          }
        }

        .metric-change {
          font-size: 0.85rem;
          font-weight: 400;
          white-space: nowrap;

          &.positive {
            color: #059669;
          }

          &.negative {
            color: #dc2626;
          }
        }
      }
    }
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 500px;
    gap: 20px;

    .left-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;
    }

    .right-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;
    }
  }

  .insights-card {
    background: #fff;
    padding: 25px;
    border-radius: 12px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      background: #fff !important;

      .card-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #000;
        margin: 0;
      }

      .card-actions {
        display: flex;
        gap: 10px;

        ::v-deep .btn {
          padding: 8px 16px;
          font-size: 0.9rem;
          border-radius: 6px;
          border: 1px solid #e5e5e5;
          background: #fff;
          color: #2f2f41;
          font-weight: 500;
          gap:8px;

          &:hover {
            background: #f9fafb;
          }

          &:focus {
            box-shadow: none;
          }
        }
      }
    }

    .chart-container {
      height: 300px;
      
      .funnel-chart,
      .sequence-chart {
        width: 100%;
        height: 100%;
      }
    }
  }

  .health-card {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    min-width: 0;
    width: 100%;

    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #000;
      margin: 0 0 20px 0;
    }

    .health-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
      padding-right: 8px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 10px;

        &:hover {
          background: #9ca3af;
        }
      }

      .health-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-radius: 8px;

        &.email {
          background: #d1fae5;
        }

        &.voice {
          background: #e9d5ff;
        }

        &.whatsapp {
          background: #fecaca;
        }

        .health-content {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;

          .health-icon {
            width: 18px;
            height: 18px;
            color: #000;
            flex-shrink: 0;
          }

          .health-text {
            font-size: 0.9rem;
            font-weight: 500;
            color: #000;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
        }

        ::v-deep .btn {
          padding: 6px 16px;
          font-size: 0.85rem;
          border-radius: 6px;
          background: #fff;
          border: 1px solid #e5e5e5;

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

  .activity-card {
    background: #fff;
    padding: 25px;
    border-radius: 12px;

    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #000;
      margin: 0 0 20px 0;
    }

    .activity-items {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 8px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 10px;

        &:hover {
          background: #9ca3af;
        }
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e5e5e5;

        &:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }

        .activity-icon {
          width: 20px;
          height: 20px;
          color: #6b7280;
          flex-shrink: 0;
        }

        .activity-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;

          .activity-text {
            font-size: 0.9rem;
            color: #000;
            font-weight: 500;
          }

          .activity-time {
            font-size: 0.85rem;
            color: #6b7280;
          }
        }
      }
    }
  }

  .live-feed-card {
    background: #fff;
    padding: 25px;
    border-radius: 12px;

    .live-feed-header {
      display: flex;
      // align-items: center;
      gap: 10px;
      margin-bottom: 20px;

      .live-icon {
        width: 10px;
        height: 10px;
        color: #000;
      }

      .card-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #000;
        margin: 0;
      }
    }

    .live-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 300px;
      overflow-y: auto;
      padding-right: 8px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 10px;

        &:hover {
          background: #9ca3af;
        }
      }

      .live-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 20px;
        border-radius: 12px;
        background: #f9fafb;

        &.active {
          background: #d1fae5;
        }

        .live-content {
          display: flex;
          align-items: center;
          gap: 10px;

          .call-icon {
            width: 18px;
            height: 18px;
            color: #000;
          }

          .live-text {
            font-size: 0.9rem;
            font-weight: 500;
            color: #000;
          }
        }

        .live-actions {
          display: flex;
          align-items: center;
          gap: 8px;

          .action-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;

            &.mute {
              background: #000;
              color: #fff;

              &:hover {
                background: #1f2937;
              }
            }

            &.end {
              background: #ef4444;
              color: #fff;

              &:hover {
                background: #dc2626;
              }
            }

            &.add {
              background: #10b981;
              color: #fff;

              &:hover {
                background: #059669;
              }
            }

            ::v-deep svg {
              width: 12px;
              height: 12px;
            }
          }

          .live-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: #fff;
            border-radius: 25px;
            border: 1px solid #e5e5e5;

            .live-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #ef4444;
              animation: pulse 2s infinite;
            }

            .live-text {
              font-size: 0.85rem;
              font-weight: 600;
              color: #000;
            }

            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
          }
        }

        .live-meta {
          display: flex;
          align-items: center;
          gap: 12px;

          .live-time {
            font-size: 0.85rem;
            color: #6b7280;
          }

          .live-status {
            font-size: 0.85rem;
            font-weight: 500;
            color: #6b7280;
            border: 1px solid $gray-200;
            padding: 4px ;
            border-radius: 5px;
            

          }
        }
      }
    }
  }
}
</style>
