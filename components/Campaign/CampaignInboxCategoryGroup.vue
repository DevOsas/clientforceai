<template>
  <div class="inbox-category-group">
    <div class="inbox-category-group-header">
      <div class="inbox-category-group-title" @click="collapsed = !collapsed">
        <SvgIcon :name="collapsed ? 'chevron-up' : 'chevron-down-3'" />
        {{ group.title }}
      </div>

      <span>{{ group.threads.length }} of {{ threadCount }}</span>
    </div>

    <div v-show="!collapsed" class="group-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      type: Object,
      required: true,
    },
    threadCount: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      collapsed: false,
    }
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/variables';

.inbox-category-group {
  .inbox-category-group-header {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    .inbox-category-group-title {
      text-transform: uppercase;
      cursor: pointer;
      color: $gray-500;

      .icon {
        margin-right: 7px;
      }
    }
  }
}
</style>
