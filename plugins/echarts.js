import Vue from 'vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// Import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, ScatterChart, GaugeChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
} from 'echarts/components'

// Register the required components
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
])

// Register component globally
Vue.component('v-chart', ECharts)
