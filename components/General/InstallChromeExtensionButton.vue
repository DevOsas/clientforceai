<template>
  <b-button
    :to="to"
    variant="install-chrome-extension"
    block
    @click="$emit('click', $event)"
  >
    <SvgIcon name="chrome-plain" class="chrome-icon" />
    <slot />
  </b-button>
</template>

<script>
export default {
  props: {
    to: {
      type: [Object, String],
      default: null,
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.btn.btn-install-chrome-extension {
  color: darken($primary, 5);
  border: 1px solid $primary;
  background-color: rgba($primary, 0.2);
  box-shadow: none;

  .chrome-icon {
    margin-right: 4px;
  }
}
</style>
