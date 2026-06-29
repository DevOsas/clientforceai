<template>
  <div class="prototype-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Prototype Mode</p>
        <h1>Agents</h1>
      </div>
      <b-button variant="dark" :to="{ name: 'campaign-v2-id-setup', params: { id: 'new' } }">Open Builder</b-button>
    </div>
    <div class="table-card">
      <div class="table-row table-header">
        <span>Agent</span><span>Status</span><span>Channels</span><span>Replies</span><span>Qualified</span><span>Health</span>
      </div>
      <div class="table-row" v-for="agent in agents" :key="agent.name">
        <span><strong>{{ agent.name }}</strong><small>{{ agent.owner }}</small></span>
        <span>{{ agent.status }}</span>
        <span>{{ agent.channels }}</span>
        <span>{{ agent.replies }}</span>
        <span>{{ agent.qualified }}</span>
        <span :class="['health', agent.health.toLowerCase()]">{{ agent.health }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrototypeAgentsPage',
  layout: 'default',
  data() {
    return {
      agents: [
        { name: 'Dental USA - Outbound', owner: 'Owned by Alex Morgan', status: 'Running', channels: 'Email, Voice', replies: '42', qualified: '11', health: 'Good' },
        { name: 'MedSpa Reactivation', owner: 'Owned by Sade Okoro', status: 'Running', channels: 'Email', replies: '18', qualified: '5', health: 'Warn' },
        { name: 'Chiro Demo Sequence', owner: 'Owned by Mia Park', status: 'Paused', channels: 'Email, SMS', replies: '7', qualified: '2', health: 'Good' },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.prototype-page { padding: 32px; background: #f7f7f2; min-height: 100vh; }
.page-head { display:flex; justify-content:space-between; align-items:end; gap:16px; margin-bottom:20px; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #5f8f34; margin-bottom: 8px; }
.table-card { background:#fff; border:1px solid #e6e6dc; border-radius:20px; overflow:hidden; }
.table-row { display:grid; grid-template-columns: 2fr 1fr 1.2fr .8fr .8fr .8fr; gap:16px; padding:18px 20px; border-top:1px solid #efefe8; align-items:center; }
.table-header { border-top:0; background:#fbfbf7; font-weight:600; color:#6b7280; }
.table-row span { display:flex; flex-direction:column; }
.table-row small { color:#6b7280; margin-top:4px; }
.health.good { color:#2e7d32; }
.health.warn { color:#b26a00; }
@media (max-width: 860px) { .table-row { grid-template-columns: 1fr 1fr; } }
</style>
