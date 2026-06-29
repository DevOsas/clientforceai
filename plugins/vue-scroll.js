import Vue from 'vue'
import vuescroll from 'vuescroll'

Vue.use(vuescroll, {
  ops: {
    // The global config
    vuescroll: {},
    scrollPanel: {},
    rail: {},
    bar: {
      background: '#adb5bd',
    },
  },
  name: 'custom-scroll', // customize component name, default -> vueScroll
})
