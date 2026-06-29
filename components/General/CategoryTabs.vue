<template>
  <div class="tab-switch-wrap">
    <nuxt-link
      v-for="tab in categories"
      :key="tab.id"
      class="tab-switch-item"
      active-class="active"
      :to="{ params: { category: tab.slug } }"
    >
      <SvgIcon :name="tab.icon" />
      {{ tab.title }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.tab-switch-wrap {
  background: #ededed;
  border-radius: 50px;
  display: inline-flex;

  .tab-switch-item {
    padding: 10px 30px;
    cursor: pointer;
    font-size: 20px;
    color: #8f8f8f;
    text-decoration: none;

    .icon {
      font-size: 30px;
      line-height: 0;
      margin-right: 5px;
    }

    &.active {
      background-color: $primary;
      border-radius: 50px;
      color: $white;
    }
  }
}
</style>
