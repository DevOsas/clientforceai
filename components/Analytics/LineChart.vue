<template>
  <div class="line-chart-wrapper">
    <client-only>
      <v-chart 
        :option="chartOption" 
        :autoresize="true"
        class="chart"
      />
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'LineChart',
  
  props: {
    data: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#4F46E5'
    }
  },

  computed: {
    chartOption() {
      return {
        title: {
          text: this.title,
          left: 'left',
          textStyle: {
            fontSize: 16,
            fontWeight: 600,
            color: '#2f2f41'
          }
        },
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
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.labels,
          axisLine: {
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          axisLabel: {
            color: '#6b7280',
            fontSize: 12
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
            color: '#6b7280',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: '#f3f4f6'
            }
          }
        },
        series: [
          {
            name: this.data.name || 'Value',
            type: 'line',
            smooth: true,
            data: this.data.values,
            lineStyle: {
              width: 3,
              color: this.color
            },
            itemStyle: {
              color: this.color
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
                    color: `${this.color}40`
                  },
                  {
                    offset: 1,
                    color: `${this.color}00`
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
.line-chart-wrapper {
  width: 100%;
  height: 100%;
  
  .chart {
    width: 100%;
    height: 400px;
  }
}
</style>
