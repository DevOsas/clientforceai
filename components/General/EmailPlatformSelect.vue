<template>
  <div class="email-platforms">
    <div
      v-for="platform in platforms"
      :key="platform.lable"
      class="email-platform"
      :class="{ selected: value === platform.value }"
      @click="select(platform)"
    >
      <SvgIcon :name="platform.icon" class="platform-icon" />
      <div class="platform-label">{{ platform.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      platforms: [
        {
          label: 'Gmail',
          value: 'gmail',
          icon: 'gmail',
        },
        {
          label: 'Outlook 365',
          value: 'outlook',
          icon: 'outlook',
        },
        {
          label: 'Exchange',
          value: 'exchange',
          icon: 'microsoft-exchange',
        },
        {
          label: 'Other Provider',
          value: 'other',
          icon: 'paper-plane',
        },
      ],
    }
  },

  methods: {
    select(platform) {
      this.$emit('input', platform.value)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-platforms {
  display: flex;
  justify-content: space-between;

  .email-platform {
    width: 138px;
    height: 170px;
    padding: 10px;
    display: flex;
    border-radius: 8px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $white;
    border: 1px solid $gray-100;
    box-shadow: $box-shadow-sm;
    cursor: pointer;
    position: relative;

    .platform-icon {
      font-size: 55px;
      color: $gray-600;
    }

    .platform-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: $gray-600;
      user-select: none;
    }

    &.selected {
      border: 2px solid $primary;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-top: 0 solid transparent;
        border-bottom: 35px solid transparent;
        border-right: 40px solid $primary;
      }

      &::after {
        content: url('~@/assets/icons/selected-check.svg');
        position: absolute;
        top: 0;
        right: 3px;
        height: 12px;
        width: 12px;
      }
    }
  }
}
</style>
