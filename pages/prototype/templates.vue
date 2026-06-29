<template>
  <div class="prototype-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Prototype Mode</p>
        <h1>Templates</h1>
      </div>
      <b-button variant="outline-dark" :to="{ name: 'prototype-tools', query: { view: 'proposals' } }">Open Proposal Tools</b-button>
    </div>
    <div class="template-grid">
      <div class="template-card" v-for="template in templates" :key="template.title">
        <div class="badge">{{ template.category }}</div>
        <h2>{{ template.title }}</h2>
        <p>{{ template.description }}</p>
        <b-button variant="dark" size="sm">Preview</b-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrototypeTemplatesPage',
  layout: 'default',
  data() {
    return {
      templates: [
        { category: 'Outbound', title: 'Cold Intro Sequence', description: 'Five-touch intro for dental clinics and medspas.' },
        { category: 'Follow-up', title: 'No-show Rescue', description: 'Re-engagement flow for missed appointments.' },
        { category: 'Proposal', title: 'Growth Audit Deck', description: 'Presentation-ready proposal with KPI sections.' },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.prototype-page { padding: 32px; background: #f7f7f2; min-height: 100vh; }
.page-head { display:flex; justify-content:space-between; align-items:end; gap:16px; margin-bottom:20px; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #5f8f34; margin-bottom: 8px; }
.template-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; }
.template-card { background:#fff; border:1px solid #e6e6dc; border-radius:20px; padding:20px; }
.badge { display:inline-block; padding:6px 10px; border-radius:999px; background:#eef8df; color:#466b1e; font-size:.75rem; margin-bottom:12px; }
.template-card h2 { font-size:1.2rem; margin-bottom:8px; }
.template-card p { color:#6b7280; min-height:48px; }
@media (max-width: 860px) { .template-grid { grid-template-columns: 1fr; } }
</style>
