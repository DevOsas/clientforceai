<template>
  <ul class="view-campaign-tabs">
    <li
      v-for="tab in tabs"
      :key="tab.icon"
      class="tab-item"
      :class="{ active: current === tab.label }"
    >
      <nuxt-link :to="{ ...tab.route, params: { id: $route.params.id } }">
        <SvgIcon :name="tab.icon" /> {{ tab.label }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          label: 'Inbox',
          icon: 'inbox',
          route: { name: 'campaign-id-view-inbox' },
        },
        {
          label: 'Steps',
          icon: 'steps',
          route: { name: 'campaign-id-view-steps' },
        },
        {
          label: 'Leads',
          icon: 'users',
          route: { name: 'campaign-id-view-people' },
        },
        {
          label: 'Preview',
          icon: 'preview',
          route: { name: 'campaign-id-view-preview' },
        },
        {
          label: 'Stats',
          icon: 'stats-alt',
          route: { name: 'campaign-id-view-stats' },
        },
        {
          label: 'Settings',
          icon: 'settings-alt',
          route: { name: 'campaign-id-view-settings' },
        },
        {
          label: 'Logs',
          icon: 'log',
          route: { name: 'campaign-id-view-logs' },
        },
      ],
    }
  },

  computed: {
    current() {
      const found = this.tabs.find(
        (s) => s.route && this.$route.name.includes(s.route.name)
      )

      return found ? found.label : ''
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.view-campaign-tabs {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e0e0e0;
  border-radius: 30px;
  background-color: #f5f5f5;
  margin-top: 30px;
  display: flex;

  .tab-item {
    display: flex;
    align-items: center;

    > a {
      display: flex;
      align-items: center;
      padding: 12px 44.5px;
      border-radius: 30px;
      text-decoration: none;
      font-size: 18px;
      color: #646464;

      .icon {
        font-size: 27px;
        line-height: 1;
        margin-right: 10px;
      }
    }

    &.active {
      > a {
        color: $white;
        background-color: $primary;
      }
    }
  }
}
</style>
