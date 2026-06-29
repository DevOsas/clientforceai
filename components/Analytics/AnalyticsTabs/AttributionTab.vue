<template>
  <div class="analytics-attribution-tab">
    <!-- Top Section: Source Mix & First VS Last Touch -->
    <div class="top-section">
      <!-- Source Mix -->
      <div class="chart-card">
        <h3 class="section-title">Source Mix</h3>
        <div class="donut-charts">
          <div class="donut-item">
            <client-only>
              <v-chart 
                :option="getDonutOption('Widget', 'Chrome', 45, 55)" 
                :autoresize="true"
                class="donut-chart"
              />
            </client-only>
            <div class="donut-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #10b981;"></span>
                <span class="legend-label">45%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #3b82f6;"></span>
                <span class="legend-label">55%</span>
              </div>
            </div>
            <div class="donut-title">Widget <strong>VS</strong> Chrome</div>
          </div>

          <div class="donut-item">
            <client-only>
              <v-chart 
                :option="getDonutOption('Widget', 'Chrome', 45, 55)" 
                :autoresize="true"
                class="donut-chart"
              />
            </client-only>
            <div class="donut-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #10b981;"></span>
                <span class="legend-label">45%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #3b82f6;"></span>
                <span class="legend-label">55%</span>
              </div>
            </div>
            <div class="donut-title">Widget <strong>VS</strong> Chrome</div>
          </div>
        </div>
      </div>

      <!-- First VS Last Touch -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="section-title">First VS Last Touch</h3>
          <b-dropdown variant="outline-secondary" class="chart-dropdown" text="First">
            <b-dropdown-item>First</b-dropdown-item>
            <b-dropdown-item>Last</b-dropdown-item>
            <b-dropdown-item>Both</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="pie-container">
          <client-only>
            <v-chart 
              :option="pieChartOption" 
              :autoresize="true"
              class="pie-chart"
            />
          </client-only>
        </div>
      </div>
    </div>

    <!-- Performance by Source Table -->
    <div class="performance-section">
      <div class="performance-card">
        <h3 class="section-title">Performance by Source</h3>
        
        <div class="table-wrapper">
          <div class="performance-table">
            <!-- Table Header -->
            <div class="table-header">
              <div class="table-row">
                <div class="table-cell source-cell">Source</div>
                <div class="table-cell">Sends</div>
                <div class="table-cell">Replies</div>
                <div class="table-cell">Qualified Calls</div>
                <div class="table-cell">Bookings</div>
                <div class="table-cell">Payments</div>
                <div class="table-cell">CPA (Proxy)</div>
              </div>
            </div>

            <!-- Table Body -->
            <div class="table-body">
              <div 
                v-for="(source, index) in performanceData" 
                :key="index"
                class="table-row"
                :class="{ 'alternate': index % 2 === 1 }"
              >
                <div class="table-cell source-cell">
                  <div class="source-info">
                    <div class="source-name">{{ source.name }}</div>
                    <div class="source-id">{{ source.id }}</div>
                  </div>
                </div>
                <div class="table-cell">{{ source.sends }}</div>
                <div class="table-cell">{{ source.replies }}</div>
                <div class="table-cell">{{ source.qualifiedCalls }}</div>
                <div class="table-cell">{{ source.bookings }}</div>
                <div class="table-cell">{{ source.payments }}</div>
                <div class="table-cell">{{ source.cpa }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsAttributionTab',

  data() {
    return {
      performanceData: [
        {
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cpa: '----'
        },
        {
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cpa: '-----'
        },
        {
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cpa: '-----'
        },
        {
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cpa: '----'
        }
      ]
    }
  },

  computed: {
    pieChartOption() {
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          textStyle: {
            color: '#2f2f41'
          },
          formatter: '{b}: {c}%'
        },
        legend: {
          orient: 'horizontal',
          bottom: 20,
          left: 'center',
          itemGap: 30,
          itemWidth: 16,
          itemHeight: 16,
          textStyle: {
            fontSize: 13,
            color: '#2f2f41',
            fontWeight: 500
          },
          data: ['First', 'Last']
        },
        series: [
          {
            type: 'pie',
            radius: ['0%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: '#000',
              formatter: '55%'
            },
            labelLine: {
              show: false
            },
            data: [
              { 
                value: 55, 
                name: 'First',
                itemStyle: { color: '#22d3ee' }
              },
              { 
                value: 45, 
                name: 'Last',
                itemStyle: { color: '#bef264' }
              }
            ]
          }
        ]
      }
    }
  },

  methods: {
    getDonutOption(name1, name2, value1, value2) {
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          textStyle: {
            color: '#2f2f41'
          },
          formatter: '{b}: {c}%'
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              fontSize: 24,
              fontWeight: 700,
              color: '#000',
              formatter: `${value2}%`
            },
            labelLine: {
              show: false
            },
            data: [
              { 
                value: value1, 
                name: name1,
                itemStyle: { color: '#10b981' }
              },
              { 
                value: value2, 
                name: name2,
                itemStyle: { color: '#3b82f6' }
              }
            ]
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.analytics-attribution-tab {
  margin-top: 32px;

  .top-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;

    .chart-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;

      .section-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #000;
        margin: 0 0 20px 0;
      }

      .chart-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        .section-title {
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

      .donut-charts {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;

        .donut-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;

          .donut-chart {
            width: 140px;
            height: 140px;
          }

          .donut-legend {
            display: flex;
            gap: 16px;
            align-items: center;

            .legend-item {
              display: flex;
              align-items: center;
              gap: 6px;

              .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
              }

              .legend-label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #2f2f41;
              }
            }
          }

          .donut-title {
            font-size: 0.9rem;
            color: #2f2f41;
            text-align: center;

            strong {
              font-weight: 700;
            }
          }
        }
      }

      .pie-container {
        .pie-chart {
          width: 100%;
          height: 300px;
        }
      }
    }
  }

  .performance-section {
    .performance-card {
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

      .table-wrapper {
        overflow-x: auto;

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

      .performance-table {
        width: 100%;

        .table-header {
          background: #fff;

          .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr 1fr 1fr;
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

              &:first-child {
                padding-left: 0;
              }

              &:last-child {
                padding-right: 0;
                border-right: none;
              }
            }
          }
        }

        .table-body {
          .table-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr 1fr 1fr;
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

              &:first-child {
                padding-left: 0;
              }

              &:last-child {
                padding-right: 0;
              }
            }

            .source-cell {
              .source-info {
                .source-name {
                  font-size: 0.9rem;
                  font-weight: 600;
                  color: #000;
                  margin-bottom: 2px;
                }

                .source-id {
                  font-size: 0.75rem;
                  color: #9ca3af;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
