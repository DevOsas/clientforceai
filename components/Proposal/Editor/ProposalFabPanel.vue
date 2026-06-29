<template>
  <div class="proposal-fab-panel">
    <header class="mb-3">
      <h5 class="m-0">{{ title }}</h5>

      <b-button
        variant="proposal-fab-close"
        class="shadow-0"
        @click="$emit('close')"
      >
        <SvgIcon name="close" />
      </b-button>
    </header>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.proposal-fab-panel {
  background-color: $white;
  width: 300px;
  min-height: 400px;
  position: absolute;
  right: 55px;
  top: -20px;
  border: 1px solid $gray-200;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px $gray-200;
  border-right: 5px solid $primary;
  z-index: 10;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn-proposal-fab-close {
      font-size: 20px;
      padding: 0;
      box-shadow: none !important;
    }
  }
}
</style>
