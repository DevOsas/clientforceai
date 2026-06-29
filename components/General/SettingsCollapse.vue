<template>
  <div class="settings-collapse" :class="{ expanded: expand }">
    <div class="collapse-header" @click="toggleCollapse">
      <div class="d-flex align-items-center justify-content-between">
        <div class="settings-label">
          <SvgIcon :name="icon" class="label-icon" />
          {{ label }}
        </div>

        <b-button variant="setting-expand" @click.stop="toggleCollapse">
          <SvgIcon
            :name="expand ? 'chevron-up' : 'chevron-down-3'"
            class="expand-icon"
          />
        </b-button>
      </div>
      <div class="collapse-description">
        {{ description }}
      </div>
    </div>

    <transition name="slide">
      <div v-show="expand" class="collapse-body">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      expand: this.expanded,
    }
  },

  watch: {
    expanded(isIt) {
      console.log(isIt)
      if (isIt) {
        this.expand = true
      } else {
        this.expand = false
      }
    },
  },

  methods: {
    expandCollapse() {
      this.expand = true
    },

    toggleCollapse() {
      this.expand = !this.expand
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.settings-collapse {
  margin-bottom: 30px;
  transition: all 0.3s ease-out;

  .collapse-header {
    padding: 25px 30px;
    border-radius: 20px;
    background-color: #fafafa;
    box-shadow: 0 0.12rem 0.4rem rgba($gray-600, 0.2);
    position: relative;
    z-index: 1;
    transition: all 0.3s ease-in;
    cursor: pointer;

    .btn-setting-expand {
      border: 1px solid $gray-500;
      border-radius: 50%;
      color: $dark;
      align-self: center;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.9rem;

      .expand-icon {
        margin-top: 4px;
      }
    }

    .settings-label {
      font-size: 20px;
      padding: 7px 20px;
      background-color: #c2fdb9;
      border: 1px solid #e0e0e0;
      margin-bottom: 15px;
      border-radius: 10px;

      .label-icon {
        font-size: 30px;
        line-height: 1;
        margin-right: 5px;
      }
    }

    .collapse-description {
      font-size: 17px;
      margin-top: 7px;
    }
  }

  .collapse-body {
    padding: 40px 30px;
    background-color: $white;
    border: 1px solid $white;
    box-shadow: 0 6px 40px -3px rgba(0, 0, 0, 0.1);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin-top: -10px;
    // position: relative;
    // z-index: 1;
    transform-origin: top;
    transition: all 0.3s ease-out;
  }

  &.expanded {
    margin-bottom: 40px;

    .collapse-header {
      background-color: #e9ffe6;
      box-shadow: none;

      .btn-setting-expand {
        background-color: $primary;
        color: $white;
      }
    }
  }
}

.slide-enter,
.slide-leave-to {
  transform: scaleY(0);
}
</style>
