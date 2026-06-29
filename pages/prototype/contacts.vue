<template>
  <div class="prototype-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Prototype Mode</p>
        <h1>Contacts</h1>
      </div>
      <b-button variant="outline-dark" :to="{ name: 'prototype-agents' }">Add To Agent</b-button>
    </div>
    <div class="list-grid">
      <div class="list-card" v-for="list in lists" :key="list.name">
        <h2>{{ list.name }}</h2>
        <p>{{ list.count }} contacts</p>
      </div>
    </div>
    <div class="table-card">
      <div class="table-row table-header">
        <span>Name</span><span>Email</span><span>Company</span><span>Status</span>
      </div>
      <div class="table-row" v-for="lead in leads" :key="lead.email">
        <span>{{ lead.name }}</span><span>{{ lead.email }}</span><span>{{ lead.company }}</span><span>{{ lead.status }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrototypeContactsPage',
  layout: 'default',
  data() {
    return {
      lists: [
        { name: 'Warm Prospects', count: 420 },
        { name: 'Booked Consults', count: 84 },
        { name: 'Follow-up Needed', count: 146 },
      ],
      leads: [
        { name: 'Jenna Stone', email: 'jenna@dentalusa.com', company: 'Dental USA', status: 'Interested' },
        { name: 'Micah Green', email: 'micah@freshmedspa.co', company: 'Fresh MedSpa', status: 'Follow-up' },
        { name: 'Taylor Kim', email: 'taylor@peakchiro.com', company: 'Peak Chiro', status: 'Booked' },
        { name: 'Nina Hall', email: 'nina@northstarclinic.io', company: 'Northstar Clinic', status: 'New' },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.prototype-page { padding: 32px; background: #f7f7f2; min-height: 100vh; }
.page-head { display:flex; justify-content:space-between; align-items:end; gap:16px; margin-bottom:20px; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #5f8f34; margin-bottom: 8px; }
.list-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-bottom:20px; }
.list-card, .table-card { background:#fff; border:1px solid #e6e6dc; border-radius:20px; }
.list-card { padding:20px; }
.list-card h2 { font-size:1.1rem; margin-bottom:8px; }
.list-card p { margin:0; color:#6b7280; }
.table-card { overflow:hidden; }
.table-row { display:grid; grid-template-columns: 1fr 1.2fr 1fr .8fr; gap:16px; padding:18px 20px; border-top:1px solid #efefe8; }
.table-header { border-top:0; background:#fbfbf7; font-weight:600; color:#6b7280; }
@media (max-width: 860px) { .list-grid, .table-row { grid-template-columns: 1fr; } }
</style>
