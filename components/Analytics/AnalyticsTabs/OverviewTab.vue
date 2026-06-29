<template>
  <div class="analytics-overview-tab">
    <!-- Metrics Cards with Real Charts -->
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
          <div class="metric-change" :class="metric.trend">
            {{ metric.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Trends Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Trends</h3>
          <b-dropdown variant="outline-secondary" class="chart-dropdown" text="Sends">
            <b-dropdown-item>Sends</b-dropdown-item>
            <b-dropdown-item>Opens</b-dropdown-item>
            <b-dropdown-item>Clicks</b-dropdown-item>
            <b-dropdown-item>Replies</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="chart-container">
          <client-only>
            <v-chart 
              :option="trendsChartOption" 
              :autoresize="true"
              class="trends-chart"
            />
          </client-only>
        </div>
      </div>

      <!-- Funnel Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Funnel</h3>
          <b-dropdown variant="outline-secondary" class="chart-dropdown" text="Booking">
            <b-dropdown-item>Booking</b-dropdown-item>
            <b-dropdown-item>Meetings</b-dropdown-item>
            <b-dropdown-item>Qualified</b-dropdown-item>
          </b-dropdown>
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
    </div>

    <!-- By Agent & Top Templates Section -->
    <div class="bottom-section">
      <!-- By Agent Table -->
      <div class="by-agent-card">
        <h3 class="section-title">By Agent</h3>
        <div class="agent-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Sends Today</th>
                <th>Replies</th>
                <th>Qualified Calls</th>
                <th>Bookings</th>
                <th>Payments</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(agent, index) in agentData" 
                :key="index"
                :class="{ 'alternate': index % 2 === 1 }"
              >
                <td>{{ agent.date }}</td>
                <td>{{ agent.sendsToday }}</td>
                <td>{{ agent.replies }}</td>
                <td>{{ agent.qualifiedCalls }}</td>
                <td>{{ agent.bookings }}</td>
                <td>{{ agent.payments }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Templates -->
      <div class="top-templates-card">
        <h3 class="section-title">Top Templates</h3>
        <div class="templates-list">
          <div 
            v-for="(template, index) in templates" 
            :key="index"
            class="template-item"
            :style="{ backgroundColor: template.bgColor }"
          >
            <h4 class="template-title">{{ template.title }}</h4>
            <p class="template-content">{{ template.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Attributions Section -->
    <div class="attributions-section">
      <div class="attribution-card">
        <div class="chart-header">
          <h3 class="chart-title">Attributions (Sources)</h3>
          <b-dropdown variant="outline-secondary" class="chart-dropdown" text="Widget vs Chrome">
            <b-dropdown-item>Widget vs Chrome</b-dropdown-item>
            <b-dropdown-item>Email vs Phone</b-dropdown-item>
            <b-dropdown-item>All Sources</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="chart-container">
          <client-only>
            <v-chart 
              :option="attributionsChartOption" 
              :autoresize="true"
              class="attributions-chart"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsOverviewTab',

  data() {
    return {
      metrics: [
        {
          value: '225',
          label: 'Meetings',
          change: '+15% Today',
          trend: 'positive',
          chartData: [20, 25, 22, 28, 30, 35, 32, 38, 40, 42],
          color: '#10b981'
        },
        {
          value: '190',
          label: 'Positive Replies',
          change: '-5% Today',
          trend: 'negative',
          chartData: [45, 42, 40, 38, 35, 32, 30, 28, 25, 22],
          color: '#ef4444'
        },
        {
          value: '98',
          label: 'Qualified Calls',
          change: '-6% Today',
          trend: 'negative',
          chartData: [30, 28, 32, 25, 22, 20, 18, 15, 12, 10],
          color: '#ef4444'
        },
        {
          value: '235',
          label: 'Bookings',
          change: '+15% Today',
          trend: 'positive',
          chartData: [15, 18, 20, 25, 28, 32, 35, 38, 42, 45],
          color: '#10b981'
        },
        {
          value: '123',
          label: 'Payments',
          change: '-5% Today',
          trend: 'negative',
          chartData: [40, 38, 35, 32, 30, 28, 25, 22, 20, 18],
          color: '#ef4444'
        }
      ],
      agentData: [
        {
          date: '18 Sep, 25',
          sendsToday: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k'
        },
        {
          date: '18 Sep, 25',
          sendsToday: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k'
        },
        {
          date: '18 Sep, 25',
          sendsToday: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k'
        },
        {
          date: '18 Sep, 25',
          sendsToday: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k'
        }
      ],
      templates: [
        {
          title: 'Call Script',
          content: '{{Your_Company}} // {{Company}}\nHey {{FirstName}},\nHow\'s your day doing?',
          bgColor: '#e0f2fe'
        },
        {
          title: 'Template 1',
          content: '{{Your_Company}} // {{Company}}\nHey {{FirstName}},\nHow\'s your day doing?',
          bgColor: '#fef9c3'
        }
      ]
    }
  },

  computed: {
    trendsChartOption() {
      return {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          textStyle: {
            color: '#2f2f41'
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#e5e5e5'
            }
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
          boundaryGap: false,
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
            type: 'line',
            data: [5000, 10000, 8000, 7000, 6000, 9000, 12000, 11000, 8000, 7000, 5000, 4000, 3000].map((value, index) => {
              return {
                value: value,
                symbol: index === 1 ? 'circle' : 'none',
                symbolSize: 8,
                itemStyle: {
                  color: '#fff',
                  borderColor: '#10b981',
                  borderWidth: 2
                }
              }
            }),
            smooth: true,
            lineStyle: {
              color: '#10b981',
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
                    color: '#10b98140'
                  },
                  {
                    offset: 1,
                    color: '#10b98100'
                  }
                ]
              }
            }
          }
        ]
      }
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
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
            data: [30, 80, 40, 70, 90, 60, 50, 55, 65, 75, 85, 95],
            itemStyle: {
              color: (params) => {
                // Find the highest value and highlight it
                const data = [30, 80, 40, 70, 90, 60, 50, 55, 65, 75, 85, 95]
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

    attributionsChartOption() {
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
            // Show tooltip for the top series (Widget)
            const widgetData = params.find(p => p.seriesName === 'Widget')
            if (widgetData) {
              return `<div style="font-weight: 600;">${widgetData.seriesName}</div>
                      <div style="font-size: 0.85rem; color: #6b7280;">Monday, April 22nd</div>`
            }
            return ''
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#e5e5e5'
            }
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
          boundaryGap: false,
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
            name: 'Widget',
            type: 'line',
            stack: 'Total',
            data: [100, 5000, 3000, 2000, 1500, 4000, 6000, 5000, 3500, 4500, 5500, 7000, 8000].map((value, index) => {
              return {
                value: value,
                symbol: index === 1 ? 'circle' : 'none',
                symbolSize: 8,
                itemStyle: {
                  color: '#fff',
                  borderColor: '#06b6d4',
                  borderWidth: 2
                }
              }
            }),
            smooth: true,
            lineStyle: {
              color: '#06b6d4',
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
                    color: '#06b6d480'
                  },
                  {
                    offset: 1,
                    color: '#06b6d420'
                  }
                ]
              }
            }
          },
          {
            name: 'Chrome',
            type: 'line',
            stack: 'Total',
            data: [50, 300, 200, 150, 100, 250, 400, 350, 200, 300, 400, 500, 600],
            smooth: true,
            symbol: 'none',
            lineStyle: {
              color: '#d946ef',
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
                    color: '#d946ef80'
                  },
                  {
                    offset: 1,
                    color: '#d946ef20'
                  }
                ]
              }
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
              // Show symbol only on the last point
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
                    color: `${metric.color}40`
                  },
                  {
                    offset: 1,
                    color: `${metric.color}00`
                  }
                ]
              }
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.analytics-overview-tab {
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 32px;
    margin-top: 32px;

    .metric-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .metric-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        

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
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;

        .metric-chart {
          flex: 1;
          height: 40px;
          min-width: 0;

          .sparkline-chart {
            width: 100%;
            height: 100%;
          }
        }

        .metric-change {
          font-size: 0.8rem;
          font-weight: 500;
          white-space: nowrap;
          align-self: flex-end;

          &.positive {
            color: #10b981;
          }

          &.negative {
            color: #ef4444;
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

      .chart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .chart-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #000;
          margin: 0;
        }

        .chart-dropdown {
          ::v-deep .btn {
            padding: 8px 16px;
            font-size: 0.85rem;
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
      }

      .chart-container {
        .trends-chart,
        .funnel-chart {
          width: 100%;
          height: 300px;
        }
      }
    }
  }

  .bottom-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 24px;

    .by-agent-card,
    .top-templates-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;

      .section-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #000;
        margin: 0 0 20px 0;
        padding-bottom: 16px;
        border-bottom: 1px solid #e5e5e5;
      }
    }

    .by-agent-card {
      .agent-table {
        overflow-x: auto;

        table {
          width: 100%;
          border-collapse: collapse;

          thead {
            tr {
              border-bottom: 1.5px solid #e5e5e5;

              th {
                text-align: left;
                padding: 16px 12px;
                font-size: 0.85rem;
                font-weight: 600;
                color: #000;
                white-space: nowrap;

                &:first-child {
                  padding-left: 0;
                }

                &:last-child {
                  padding-right: 0;
                }
              }
            }
          }

          tbody {
            tr {
              transition: background 0.2s ease;

              &.alternate {
                background: #fafafa;
              }

              &:hover {
                background: #f5f5f5;
              }

              td {
                padding: 16px 12px;
                font-size: 0.9rem;
                color: #2f2f41;
                white-space: nowrap;

                &:first-child {
                  padding-left: 0;
                  font-weight: 500;
                }

                &:last-child {
                  padding-right: 0;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }

    .top-templates-card {
      .templates-list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .template-item {
          border-radius: 8px;
          padding: 16px;

          .template-title {
            font-size: 0.95rem;
            font-weight: 600;
            color: #2f2f41;
            margin: 0 0 8px 0;
          }

          .template-content {
            font-size: 0.85rem;
            color: #6b7280;
            margin: 0;
            line-height: 1.6;
            white-space: pre-line;
            font-family: 'Courier New', monospace;
          }
        }
      }
    }
  }

  .attributions-section {
    margin-top: 24px;

    .attribution-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;

      .chart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .chart-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #000;
          margin: 0;
        }

        .chart-dropdown {
          ::v-deep .btn {
            padding: 8px 16px;
            font-size: 0.85rem;
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
      }

      .chart-container {
        .attributions-chart {
          width: 100%;
          height: 300px;
        }
      }
    }
  }
}
</style>
