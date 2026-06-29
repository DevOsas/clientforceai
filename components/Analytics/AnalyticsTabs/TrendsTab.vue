<template>
  <div class="analytics-trends-tab">
    <!-- Charts Section -->
    <div class="charts-section">
      <!-- Time Series Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Time Series</h3>
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
              :option="timeSeriesChartOption" 
              :autoresize="true"
              class="time-series-chart"
            />
          </client-only>
        </div>
      </div>

      <!-- Breakdowns Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Breakdowns</h3>
          <b-dropdown variant="outline-secondary" class="chart-dropdown" text="By Agents">
            <b-dropdown-item>By Agents</b-dropdown-item>
            <b-dropdown-item>By Channel</b-dropdown-item>
            <b-dropdown-item>By Campaign</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="chart-container">
          <client-only>
            <v-chart 
              :option="breakdownsChartOption" 
              :autoresize="true"
              class="breakdowns-chart"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsTrendsTab',

  computed: {
    timeSeriesChartOption() {
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
            type: 'line',
            data: [5000, 10000, 8000, 7000, 6000, 9000, 12000, 11000, 8000, 7000, 5000, 4000].map((value, index) => {
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

    breakdownsChartOption() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.analytics-trends-tab {
  .charts-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 32px;

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
        .time-series-chart,
        .breakdowns-chart {
          width: 100%;
          height: 300px;
        }
      }
    }
  }
}
</style>
