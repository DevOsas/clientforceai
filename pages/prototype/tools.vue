<template>
  <div class="prototype-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Prototype Mode</p>
        <h1>Tools</h1>
      </div>
    </div>
    <div class="tool-nav">
      <nuxt-link :to="{ name: 'prototype-tools', query: { view: 'integrations' } }">Integrations</nuxt-link>
      <nuxt-link :to="{ name: 'prototype-tools', query: { view: 'proposals' } }">Proposals</nuxt-link>
      <nuxt-link :to="{ name: 'prototype-tools', query: { view: 'widget' } }">Lead Widget</nuxt-link>
      <nuxt-link :to="{ name: 'prototype-tools', query: { view: 'extension' } }">Chrome Extension</nuxt-link>
    </div>
    <div class="tool-panel">
      <h2>{{ activeView.title }}</h2>
      <p>{{ activeView.description }}</p>
      <div class="mock-window">
        <div class="mock-toolbar"></div>
        <div class="mock-body">{{ activeView.body }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrototypeToolsPage',
  layout: 'default',
  computed: {
    activeView() {
      const map = {
        integrations: {
          title: 'Integrations',
          description: 'Preview connected channels, CRMs, and mailbox providers.',
          body: 'Google, Outlook, Zapier, and webhook connections appear here with setup actions.'
        },
        proposals: {
          title: 'Dynamic Proposals',
          description: 'Preview proposal building blocks and reusable sections.',
          body: 'A proposal canvas, block menu, and presentation controls are shown in the prototype.'
        },
        widget: {
          title: 'Lead Capture Widget',
          description: 'Preview embeddable widget states and design controls.',
          body: 'Scheduling, routing, and branding tabs are represented here with demo settings.'
        },
        extension: {
          title: 'LinkedIn Lead Extension',
          description: 'Preview the browser extension workflow for capturing leads.',
          body: 'Side panel, save lead action, and sync states are represented with static demo UI.'
        },
      }
      return map[this.$route.query.view] || map.integrations
    },
  },
}
</script>
<style lang="scss" scoped>
.prototype-page { padding: 32px; background: #f7f7f2; min-height: 100vh; }
.page-head { margin-bottom:20px; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #5f8f34; margin-bottom: 8px; }
.tool-nav { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px; }
.tool-nav a { padding:10px 14px; background:#fff; border:1px solid #e6e6dc; border-radius:999px; color:#111827; text-decoration:none; }
.tool-panel { background:#fff; border:1px solid #e6e6dc; border-radius:20px; padding:22px; }
.tool-panel p { color:#6b7280; }
.mock-window { border:1px solid #efefe8; border-radius:16px; overflow:hidden; margin-top:16px; }
.mock-toolbar { height:42px; background:linear-gradient(90deg, #eff6e8 0%, #f7f4eb 100%); border-bottom:1px solid #efefe8; }
.mock-body { min-height:260px; padding:24px; color:#374151; background:#fcfcf9; }
</style>
