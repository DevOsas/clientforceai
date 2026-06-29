<template>
  <div class="prototype-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Prototype Mode</p>
        <h1>Analytics</h1>
      </div>
      <b-button variant="outline-dark" :to="{ name: 'prototype-agents' }">View Agents</b-button>
    </div>
    <div class="chart-grid">
      <div class="chart-card" v-for="card in cards" :key="card.title">
        <div class="card-title">{{ card.title }}</div>
        <div class="card-value">{{ card.value }}</div>
        <div class="bars">
          <span v-for="(bar, index) in card.bars" :key="index" :style="{ height: bar + '%' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrototypeAnalyticsPage',
  layout: 'default',
  data() {
    return {
      cards: [
        { title: 'Open Rate', value: '54%', bars: [40, 58, 46, 75, 64, 82, 54] },
        { title: 'Reply Rate', value: '17%', bars: [18, 22, 30, 26, 34, 29, 38] },
        { title: 'Qualified Rate', value: '9%', bars: [8, 12, 10, 16, 14, 18, 20] },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.prototype-page { padding: 32px; background: #f7f7f2; min-height: 100vh; }
.page-head { display:flex; justify-content:space-between; align-items:end; gap:16px; margin-bottom:20px; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #5f8f34; margin-bottom: 8px; }
.chart-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; }
.chart-card { background:#fff; border:1px solid #e6e6dc; border-radius:20px; padding:20px; }
.card-title { color:#6b7280; margin-bottom:8px; }
.card-value { font-size:2rem; font-weight:700; margin-bottom:18px; }
.bars { display:flex; align-items:flex-end; gap:8px; height:140px; }
.bars span { flex:1; background: linear-gradient(180deg, #88dd4b 0%, #151515 100%); border-radius:999px; min-height:18px; }
@media (max-width: 860px) { .chart-grid { grid-template-columns: 1fr; } }
</style>
