<template>
  <div class="analytics-deliverability-tab">
    <!-- Top Section: Email Health & Number Health -->
    <div class="health-section">
      <!-- Email Health -->
      <div class="health-card">
        <h3 class="section-title">Email Health</h3>
        <div class="health-grid">
          <div 
            v-for="(item, index) in emailHealthData" 
            :key="index"
            class="health-item"
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
            <span class="health-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Number Health -->
      <div class="health-card">
        <h3 class="section-title">Number health</h3>
        <div class="health-grid">
          <div 
            v-for="(item, index) in numberHealthData" 
            :key="index"
            class="health-item"
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
            <span class="health-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Incidents & Recommendations Table -->
    <div class="incidents-section">
      <div class="incidents-card">
        <h3 class="section-title">Incidents & Recommendations</h3>
        
        <div class="table-wrapper">
          <div class="incidents-table">
            <!-- Table Header -->
            <div class="table-header">
              <div class="table-row">
                <div class="table-cell">Spike Detection</div>
                <div class="table-cell">Root Causes</div>
                <div class="table-cell">Auto Actions Taken</div>
                <div class="table-cell">Next Steps</div>
              </div>
            </div>

            <!-- Table Body -->
            <div class="table-body">
              <div 
                v-for="(incident, index) in incidentsData" 
                :key="index"
                class="table-row"
                :class="{ 'alternate': index % 2 === 1 }"
              >
                <div class="table-cell">{{ incident.spikeDetection }}</div>
                <div class="table-cell">{{ incident.rootCauses }}</div>
                <div class="table-cell">{{ incident.autoActions }}</div>
                <div class="table-cell">{{ incident.nextSteps }}</div>
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
  name: 'AnalyticsDeliverabilityTab',

  data() {
    return {
      emailHealthData: [
        { label: 'Bounce Rate', percentage: 45 },
        { label: 'Compliant Rate', percentage: 45 },
        { label: 'Warm Up Status', percentage: 45 },
        { label: 'Domain/ Sender Health', percentage: 45 }
      ],
      numberHealthData: [
        { label: 'STR/SHAKEN', percentage: 45 },
        { label: 'Reputation Score', percentage: 45 },
        { label: 'CNAM', percentage: 45 },
        { label: 'Caps', percentage: 45 }
      ],
      incidentsData: [
        {
          spikeDetection: '-----',
          rootCauses: '------',
          autoActions: '------',
          nextSteps: '------'
        },
        {
          spikeDetection: '-----',
          rootCauses: '------',
          autoActions: '------',
          nextSteps: '------'
        },
        {
          spikeDetection: '-----',
          rootCauses: '------',
          autoActions: '------',
          nextSteps: '------'
        }
      ]
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

.analytics-deliverability-tab {
  margin-top: 32px;

  .health-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;

    .health-card {
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

      .health-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;

        .health-item {
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

          .health-label {
            font-size: 0.8rem;
            color: #6b7280;
            text-align: center;
            line-height: 1.3;
          }
        }
      }
    }
  }

  .incidents-section {
    .incidents-card {
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

      .incidents-table {
        width: 100%;

        .table-header {
          background: #fff;

          .table-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
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
            grid-template-columns: 1fr 1fr 1fr 1fr;
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
          }
        }
      }
    }
  }
}
</style>
