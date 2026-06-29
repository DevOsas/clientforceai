<template>
  <div class="wizard-steps">
    <div
      v-for="step in steps"
      :key="step.number"
      class="wizard-step"
      :class="{ done: isDone(step) }"
    >
      {{ step.label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true,
    },
    current: {
      type: Number,
      default: 1,
    },
  },

  methods: {
    isDone(step) {
      return step.number <= this.current
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.wizard-steps {
  display: flex;

  .wizard-step {
    background: #e0e0e0;
    border-radius: 20px;
    display: flex;
    padding: 0 30px 0 10px;
    align-items: center;
    height: 27px;
    margin-right: 10px;
    font-size: 14px;
    line-height: 1;

    &::before {
      content: '';
      height: 19px;
      width: 19px;
      border: 1px solid #8f8f8f;
      border-radius: 50%;
      margin-right: 5px;
      margin-top: 1px;
    }

    &.done {
      background: #9dff8f;
      position: relative;

      &::before {
        background-color: $primary;
        border-color: $primary;
      }

      &::after {
        content: url('~@/assets/icons/selected-check.svg');
        position: absolute;
        top: 7px;
        left: 15px;
        height: 10px;
        width: 10px;
      }
    }
  }
}
</style>
