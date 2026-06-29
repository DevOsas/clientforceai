<template>
  <div class="prototype-page">
    <div class="page-head">
      <div>
        <p class="eyebrow">Prototype Mode</p>
        <h1>Settings</h1>
      </div>
    </div>
    <div class="settings-grid">
      <div class="panel">
        <h2>Profile</h2>
        <div class="field"><label>Name</label><input value="Alex Morgan" readonly /></div>
        <div class="field"><label>Email</label><input value="alex@northstardental.co" readonly /></div>
        <div class="field"><label>Role</label><input value="Growth Lead" readonly /></div>
      </div>
      <div class="panel">
        <h2>Company</h2>
        <div class="field"><label>Company</label><input value="Northstar Dental" readonly /></div>
        <div class="field"><label>Industry</label><input value="Healthcare" readonly /></div>
        <div class="field"><label>Plan</label><input value="Scale Prototype" readonly /></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PrototypeSettingsPage',
  layout: 'default',
}
</script>
<style lang="scss" scoped>
.prototype-page { padding: 32px; background: #f7f7f2; min-height: 100vh; }
.page-head { margin-bottom:20px; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #5f8f34; margin-bottom: 8px; }
.settings-grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
.panel { background:#fff; border:1px solid #e6e6dc; border-radius:20px; padding:22px; }
.field { margin-top:14px; }
label { display:block; color:#6b7280; margin-bottom:6px; }
input { width:100%; border:1px solid #e5e7eb; border-radius:12px; padding:12px 14px; background:#fbfbf7; }
@media (max-width: 860px) { .settings-grid { grid-template-columns: 1fr; } }
</style>
