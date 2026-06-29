<template>
  <div class="metric-progress">
    <div
      class="metric-progress-bar"
      :class="variant"
      :style="{ width: `${value}%` }"
    >
      <div class="metric-progress-knob"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    variant: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.metric-progress {
  background-color: #e0e0e0;
  border-radius: 30px;

  .metric-progress-bar {
    background-color: $primary;
    border-radius: 30px;
    height: 7px;
    width: 7px;
    position: relative;

    .metric-progress-knob {
      height: 20px;
      width: 20px;
      background-color: $gray-100;
      border-radius: 50%;
      border: 4px solid $white;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
    }

    &.green {
      background-color: #6ed160;
    }
    &.red {
      background-color: #f94144;
    }
    &.yellow {
      background-color: #f8961e;
    }
  }
}
</style>
