<template>
  <div ref="chart" class="report-chart"></div>
</template>

<script>
import * as echarts from 'echarts'

import { use } from 'echarts/core'

import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

function generate(length) {
  const arr = []
  while (arr.length < length) {
    const num = Math.floor(Math.random() * 15) + 10
    if (!arr.includes(num)) arr.push(num)
  }

  return arr
}

export default {
  props: {
    stats: {
      type: Object,
      default: () => ({
        deliveries: generate(12),
        opens: generate(12),
        replies: generate(12),
        interested: generate(12),
      }),
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      chart: null,
    }
  },

  watch: {
    loading(loading) {
      if (!this.chart) {
        return
      }

      if (loading) {
        this.chart.showLoading()
      } else {
        this.chart.hideLoading()
      }
    },

    stats(stats) {
      this.initChart()
    },
  },

  created() {
    // console.log(this.loading)
  },

  mounted() {
    this.initChart()
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  },

  destroyed() {
    this.chart && window.removeEventListener('resize', this.chart.resize)
  },

  methods: {
    initChart() {
      const chartOptions = {
        legend: {
          right: 30,
          icon: 'circle',
          symbolWidth: 22,
          symbolHeight: 22,
          data: ['Deliveries', 'Opens', 'Replies', 'Interested'],
        },
        tooltip: {},
        grid: {
          left: '7%',
          right: '3%',
          top: '25%',
          bottom: '15%',
        },
        animationDuration: 400,
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#A6ACBE',
            fontSize: '14px',
            padding: [15, 0, 0, 0],
          },
          axisLine: { show: false },
          axisTick: {
            show: false,
          },
          data: this.stats.dates,
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 25,
          axisLabel: {
            showMinLabel: false,
            color: '#A6ACBE',
            fontSize: '14px',
            padding: [0, 25, 0, 0],
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            name: 'Deliveries',
            type: 'bar',
            barMaxWidth: 6,
            barGap: '100%',
            itemStyle: {
              color: '#6ED160',
              rderRadius: 10,
            },
            data: this.stats.deliveries,
          },
          {
            name: 'Opens',
            type: 'bar',
            barMaxWidth: 6,
            barGap: '100%',
            itemStyle: {
              color: '#DD1B1B',
              rderRadius: 10,
            },
            data: this.stats.opens,
          },
          {
            name: 'Replies',
            type: 'bar',
            barMaxWidth: 6,
            barGap: '100%',
            itemStyle: {
              color: '#EC9A1E',
              rderRadius: 10,
            },
            data: this.stats.replies,
          },
          {
            name: 'Interested',
            type: 'bar',
            barMaxWidth: 6,
            barGap: '100%',
            itemStyle: {
              color: '#315FE7',
              rderRadius: 10,
            },
            data: this.stats.interested,
          },
        ],
      }

      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption(chartOptions)

      window.addEventListener('resize', this.chart.resize)
    },
  },
}
</script>

<style lang="scss" scoped>
.report-chart {
  height: 50vh;
}
</style>
