<template>
  <div class="proposal-fab-item">
    <b-button
      :id="computedId"
      variant="proposal-fab"
      :class="{ active: isOpen }"
      @click="$emit('toggle')"
    >
      <SvgIcon :name="fab.icon" />
    </b-button>

    <b-tooltip
      v-if="!isOpen && fab.tip"
      :target="computedId"
      triggers="hover"
      placement="left"
      variant="primary"
    >
      {{ fab.tip }}
    </b-tooltip>

    <component
      :is="fab.panel"
      v-show="isOpen"
      :editor="editor"
      @close="$emit('close')"
    />
  </div>
</template>

<script>
export default {
  props: {
    fab: {
      type: Object,
      required: true,
    },

    isOpen: {
      type: Boolean,
      default: false,
    },

    editor: {
      type: Object,
      required: true,
    },
  },

  computed: {
    computedId() {
      return this.fab.id || `fab-${Math.floor(Math.random() * 100)}`
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.proposal-fab-item {
  margin-bottom: 2px;

  .btn.btn-proposal-fab {
    color: $white;
    box-shadow: none !important;
    font-size: 20px;
    position: relative;
    border-radius: 20px;
    transition: all 0.3s ease-out;

    &.active {
      background-color: darken($primary, 4);

      &::before {
        content: '';
        position: absolute;
        left: -10px;
        height: 10px;
        top: 18px;
        width: 10px;
        background-color: darken($primary, 4);
      }
    }
  }
}
</style>
