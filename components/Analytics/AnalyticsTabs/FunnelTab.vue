<template>
  <div class="analytics-funnel-tab">
    <!-- Top Section: Overall Funnel & Drop Off Response -->
    <div class="top-section">
      <!-- Overall Funnel -->
      <div class="funnel-card">
        <h3 class="section-title">Overall Funnel</h3>
        <div class="chart-container">
          <!-- <client-only>
            <v-chart 
              :option="overallFunnelOption" 
              :autoresize="true"
              class="overall-funnel-chart"
            />
          </client-only> -->
        </div>
      </div>

      <!-- Drop Off Response -->
      <div class="dropoff-card">
        <h3 class="section-title">Drop Off Response</h3>
        <div class="dropoff-grid">
          <div 
            v-for="(item, index) in dropOffData" 
            :key="index"
            class="dropoff-item"
          >
            <div class="progress-circle">
              <client-only>
                <v-chart 
                  :option="getProgressOption(item.percentage)" 
                  :autoresize="true"
                  class="progress-chart"
                />
              </client-only>
            </div>
            <span class="dropoff-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Funnel by Segment -->
    <div class="segment-section">
      <div class="segment-card">
        <div class="chart-header">
          <h3 class="chart-title">Funnel by Segment</h3>
          <b-dropdown variant="outline-secondary" class="chart-dropdown" text="Widget vs Chrome">
            <b-dropdown-item>Widget vs Chrome</b-dropdown-item>
            <b-dropdown-item>Email vs Phone</b-dropdown-item>
            <b-dropdown-item>All Segments</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="chart-container">
          <client-only>
            <v-chart 
              :option="funnelBySegmentOption" 
              :autoresize="true"
              class="segment-chart"
            />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsFunnelTab',

  data() {
    return {
      dropOffData: [
        { label: 'Bounces', percentage: 45 },
        { label: 'No Aswers', percentage: 45 },
        { label: 'DNC', percentage: 45 },
        { label: 'Templates Pending', percentage: 45 },
        { label: 'Number Rep', percentage: 45 }
      ]
    }
  },

  computed: {
    overallFunnelOption() {
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
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              formatter: '{b}\n{c}%',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                fontSize: 16
              }
            },
            data: [
              { value: 100, name: 'Total Leads', itemStyle: { color: '#10b981' } },
              { value: 80, name: 'Contacted', itemStyle: { color: '#06b6d4' } },
              { value: 60, name: 'Engaged', itemStyle: { color: '#8b5cf6' } },
              { value: 40, name: 'Qualified', itemStyle: { color: '#f59e0b' } },
              { value: 20, name: 'Converted', itemStyle: { color: '#ef4444' } }
            ]
          }
        ]
      }
    },

    funnelBySegmentOption() {
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
            data: [100, 5000, 3000, 2000, 1500, 4000, 6000, 5000, 3500, 4500, 5500, 7000, 8000].map((value, index) => {
              return {
                value: value,
                symbol: index === 1 ? 'circle' : 'none',
                symbolSize: 8,
                itemStyle: {
                  color: '#fff',
                  borderColor: '#d946ef',
                  borderWidth: 2
                }
              }
            }),
            smooth: true,
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
    getProgressOption(percentage) {
      // Green if >= 50%, Red if < 50%
      const color = percentage >= 50 ? '#10b981' : '#ef4444'
      
      return {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            radius: '90%',
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                color: color
              }
            },
            axisLine: {
              lineStyle: {
                width: 8,
                color: [[1, '#f3f4f6']]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [
              {
                value: percentage,
                detail: {
                  valueAnimation: true,
                  offsetCenter: [0, 0]
                }
              }
            ],
            title: {
              show: false
            },
            detail: {
              fontSize: 16,
              fontWeight: 700,
              color: '#000',
              formatter: '{value}%'
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

.analytics-funnel-tab {
  margin-top: 32px;

  .top-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;

    .funnel-card,
    .dropoff-card {
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

      .chart-container {
        .overall-funnel-chart {
          width: 100%;
          height: 400px;
        }
      }
    }

    .dropoff-card {
      .dropoff-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;

        .dropoff-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;

          .progress-circle {
            width: 80px;
            height: 80px;

            .progress-chart {
              width: 100%;
              height: 100%;
            }
          }

          .dropoff-label {
            font-size: 0.8rem;
            color: #6b7280;
            text-align: center;
            line-height: 1.3;
          }
        }
      }
    }
  }

  .segment-section {
    .segment-card {
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
        .segment-chart {
          width: 100%;
          height: 300px;
        }
      }
    }
  }
}
</style>
