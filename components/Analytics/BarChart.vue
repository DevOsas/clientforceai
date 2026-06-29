<template>
  <div class="bar-chart-wrapper">
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
  name: 'BarChart',
  
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
          axisPointer: {
            type: 'shadow'
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
            type: 'bar',
            data: this.data.values,
            itemStyle: {
              color: this.color,
              borderRadius: [8, 8, 0, 0]
            },
            barWidth: '40%'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bar-chart-wrapper {
  width: 100%;
  height: 100%;
  
  .chart {
    width: 100%;
    height: 400px;
  }
}
</style>
