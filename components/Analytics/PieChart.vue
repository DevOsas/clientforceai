<template>
  <div class="pie-chart-wrapper">
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
  name: 'PieChart',
  
  props: {
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    colors: {
      type: Array,
      default: () => ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
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
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          top: 'center',
          textStyle: {
            color: '#6b7280',
            fontSize: 12
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.data,
            color: this.colors
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pie-chart-wrapper {
  width: 100%;
  height: 100%;
  
  .chart {
    width: 100%;
    height: 400px;
  }
}
</style>
