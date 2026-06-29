<template>
  <div v-click-outside="hideMenu" class="checkbox-dropdown">
    <div class="checkbox-dropdown-toggle" @click="toggleOpen">
      <b-form-checkbox
        size="lg"
        :checked="checked"
        @click.native.stop.prevent="handleCheck"
      />
      All
      <SvgIcon name="chevron-down-3" />
    </div>
    <ul v-show="isOpen" class="checkbox-dropdown-menu">
      <li v-for="item in items" :key="item.value">
        <a href="#" @click.prevent="itemClick(item)">{{ item.label }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    checked: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isOpen: false,
    }
  },

  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
    },

    hideMenu() {
      this.isOpen = false
    },

    handleCheck(checked) {
      this.$emit('change', checked)
    },

    itemClick(item) {
      this.$emit('itemClick', item)

      this.hideMenu()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.checkbox-dropdown {
  position: relative;

  .checkbox-dropdown-toggle {
    border: 1px solid $gray-300;
    border-radius: 5px;
    display: flex;
    align-items: center;
    font-size: 1rem;
    line-height: 30px;
    padding: 5px 30px;
    cursor: pointer;
    color: $gray-700;
    box-shadow: 0 0 2px 0 rgba(23, 50, 68, 0.17);

    .icon {
      margin-left: 10px;
      font-size: 0.8rem;
    }
  }

  .checkbox-dropdown-menu {
    background-color: $white;
    width: 200px;
    position: absolute;
    margin: 0.125rem 0 0;
    margin-top: -45px;
    padding: 0.5rem 0;
    font-size: 0.95rem;
    color: #212529;
    text-align: left;
    list-style: none;
    border: 1px solid transparent;
    border-radius: 0.3rem;
    box-shadow: 0 0 17px 0 rgba(23, 50, 68, 0.17);
    z-index: 10;

    li {
      a {
        color: $gray-600;
        display: block;
        padding: 7px 20px;
        text-decoration: none;

        &:hover {
          background-color: $gray-100;
        }
      }
    }
  }
}
</style>
