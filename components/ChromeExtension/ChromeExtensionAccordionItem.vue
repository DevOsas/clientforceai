<template>
  <div class="accordion-item">
    <div class="indicator" @click="handleClick">
      <transition name="fade">
        <SvgIcon :name="indicatorIcon" />
      </transition>
    </div>
    <div class="accordion-content">
      <h5 class="title" @click="handleClick">{{ content.title }}</h5>
      <div class="body" :class="{ open: isOpen }">
        {{ content.body }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true,
    },

    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    indicatorIcon() {
      return this.isOpen ? 'minus' : 'plus'
    },
  },

  methods: {
    handleClick() {
      this.$emit('toggle', this.content)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.accordion-item {
  margin-bottom: 15px;
  display: flex;

  .indicator {
    display: inline-flex;
    padding: 3px 10px 0 0;
    cursor: pointer;

    > .icon {
      padding: 0;
      margin: 0;
      width: 18px;
      height: 18px;
    }
  }

  .accordion-content {
    .title {
      margin-left: 5px;
      font-size: 18px;
      user-select: none;
      color: $gray-700;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .body {
      color: $gray-700;
      font-size: 17px;
      overflow: hidden;
      height: 0;
      transition: all 0.5s ease-in;

      &.open {
        height: 100px;
      }
    }
  }
}
</style>
