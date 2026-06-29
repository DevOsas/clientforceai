<template>
  <div class="prototype-page dashboard-prototype">
    <div class="hero-card">
      <div>
        <p class="eyebrow">Prototype Mode</p>
        <h1>ClientForce AI</h1>
        <p class="subcopy">A safe click-through preview with demo data, wired for navigation instead of backend dependencies.</p>
      </div>
      <div class="hero-actions">
        <b-button variant="dark" :to="{ name: 'prototype-agents' }">View Agents</b-button>
        <b-button variant="outline-dark" :to="{ name: 'prototype-analytics' }">Open Analytics</b-button>
      </div>
    </div>

    <div class="metric-grid">
      <div v-for="item in metrics" :key="item.label" class="metric-card">
        <div class="metric-label">{{ item.label }}</div>
        <div class="metric-value">{{ item.value }}</div>
        <div class="metric-meta">{{ item.meta }}</div>
      </div>
    </div>

    <div class="two-col">
      <div class="panel">
        <div class="panel-header">
          <h2>Suggested Walkthrough</h2>
        </div>
        <ol class="walkthrough">
          <li><nuxt-link :to="{ name: 'prototype-agents' }">Review AI agents and campaign health</nuxt-link></li>
          <li><nuxt-link :to="{ name: 'prototype-contacts' }">Browse contacts and lists</nuxt-link></li>
          <li><nuxt-link :to="{ name: 'prototype-analytics' }">Inspect performance analytics</nuxt-link></li>
          <li><nuxt-link :to="{ name: 'prototype-settings' }">Open account settings</nuxt-link></li>
        </ol>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Recent Activity</h2>
        </div>
        <div class="activity-item" v-for="item in activity" :key="item.title">
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.detail }}</p>
          </div>
          <span>{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrototypeDashboardPage',
  layout: 'default',
  data() {
    return {
      metrics: [
        { label: 'Agents Running', value: '12', meta: '+3 this week' },
        { label: 'Contacts In Sequence', value: '1,284', meta: 'Across 8 lists' },
        { label: 'Qualified Leads', value: '87', meta: '18% conversion rate' },
        { label: 'Bookings', value: '19', meta: '5 scheduled today' },
      ],
      activity: [
        { title: 'Inbound reply classified', detail: 'Dental USA - Outbound marked a lead as interested.', time: '2m ago' },
        { title: 'Sequence launched', detail: 'Local MedSpa Follow-up went live for 220 contacts.', time: '18m ago' },
        { title: 'Warning resolved', detail: 'Mailbox warmup issue cleared on support@northstar.co.', time: '1h ago' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.prototype-page { padding: 32px; background: #f7f7f2; min-height: 100vh; }
.hero-card, .panel, .metric-card { background: #fff; border: 1px solid #e6e6dc; border-radius: 20px; }
.hero-card { padding: 28px; display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; margin-bottom: 24px; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #5f8f34; margin-bottom: 8px; }
h1 { margin: 0 0 10px; font-size: 2.5rem; }
.subcopy { max-width: 650px; margin: 0; color: #5f6368; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.metric-card { padding: 20px; }
.metric-label { color: #6b7280; margin-bottom: 10px; }
.metric-value { font-size: 2rem; font-weight: 700; }
.metric-meta { color: #3f6e17; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.panel { padding: 22px; }
.panel-header h2 { margin: 0 0 16px; font-size: 1.1rem; }
.walkthrough { margin: 0; padding-left: 20px; }
.walkthrough li { margin-bottom: 12px; }
.activity-item { display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-top: 1px solid #efefe8; }
.activity-item:first-of-type { border-top: 0; padding-top: 0; }
.activity-item p { margin: 4px 0 0; color: #6b7280; }
.activity-item span { color: #6b7280; white-space: nowrap; }
@media (max-width: 960px) { .metric-grid, .two-col { grid-template-columns: 1fr 1fr; } }
@media (max-width: 680px) { .hero-card { display:block; } .metric-grid, .two-col { grid-template-columns: 1fr; } }
</style>
