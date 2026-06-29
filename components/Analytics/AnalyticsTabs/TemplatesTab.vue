<template>
  <div class="analytics-templates-tab">
    <!-- Top Section: Email Templates & Call Script -->
    <div class="top-section">
      <!-- Email Templates -->
      <div class="template-card">
        <h3 class="section-title">Email Templates</h3>
        <div class="metrics-grid">
          <div 
            v-for="(item, index) in emailTemplatesData" 
            :key="index"
            class="metric-item"
          >
            <div class="metric-display">
              <client-only>
                <v-chart 
                  v-if="item.type === 'progress'"
                  :option="getProgressOption(item.value)" 
                  :autoresize="true"
                  class="progress-chart"
                />
                <div v-else class="number-display">
                  <span class="number-value">{{ item.value }}</span>
                </div>
              </client-only>
            </div>
            <span class="metric-label">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Call Script (Voice) -->
      <div class="template-card">
        <h3 class="section-title">Call Script <span class="subtitle">(Voice)</span></h3>
        <div class="metrics-grid">
          <div 
            v-for="(item, index) in callScriptData" 
            :key="index"
            class="metric-item"
          >
            <div class="metric-display">
              <client-only>
                <v-chart 
                  :option="getProgressOption(item.value)" 
                  :autoresize="true"
                  class="progress-chart"
                />
              </client-only>
            </div>
            <span class="metric-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section: WhatsApp Templates -->
    <div class="bottom-section">
      <div class="template-card whatsapp-card">
        <h3 class="section-title">Whatspp Templates</h3>
        <div class="metrics-grid">
          <div 
            v-for="(item, index) in whatsappTemplatesData" 
            :key="index"
            class="metric-item"
          >
            <div class="metric-display">
              <client-only>
                <v-chart 
                  v-if="item.type === 'progress'"
                  :option="getProgressOption(item.value)" 
                  :autoresize="true"
                  class="progress-chart"
                />
                <div v-else class="number-display">
                  <span class="number-value">{{ item.value }}</span>
                </div>
              </client-only>
            </div>
            <span class="metric-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsTemplatesTab',

  data() {
    return {
      emailTemplatesData: [
        { label: 'Subject Lines', value: 4, type: 'progress' },
        { label: 'Body Variants', value: 4, type: 'progress' },
        { label: 'Replies', value: 45, type: 'progress' },
        { label: 'Unsubscribes', value: 45, type: 'progress' }
      ],
      callScriptData: [
        { label: 'Connect', value: 45, type: 'progress' },
        { label: 'Qualified', value: 45, type: 'progress' },
        { label: 'Average Talk Time', value: 45, type: 'progress' },
        { label: 'Top Objections Resolved', value: 45, type: 'progress' }
      ],
      whatsappTemplatesData: [
        { label: 'Approval Status', value: 4, type: 'progress' },
        { label: 'Usage', value: 4, type: 'progress' },
        { label: 'Replies', value: 45, type: 'progress' },
        { label: 'Issues', value: 45, type: 'progress' }
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

.analytics-templates-tab {
  margin-top: 32px;

  .top-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  .bottom-section {
    .whatsapp-card {
      max-width: 50%;
    }
  }

  .template-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 24px;

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 20px 0;

      .subtitle {
        font-weight: 400;
        color: #6b7280;
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      .metric-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .metric-display {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;

          .progress-chart {
            width: 100%;
            height: 100%;
          }

          .number-display {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;

            .number-value {
              font-size: 1.5rem;
              font-weight: 700;
              color: #000;
            }
          }
        }

        .metric-label {
          font-size: 0.8rem;
          color: #6b7280;
          text-align: center;
          line-height: 1.3;
        }
      }
    }
  }
}
</style>
