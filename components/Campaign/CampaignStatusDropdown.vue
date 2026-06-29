<template>
  <div v-click-outside="hideMenu" class="campaign-status-dropdown">
    <div class="campaign-status-dropdown-toggle" @click="toggleOpen">
      <SvgIcon name="archive" class="main-icon" />
      {{ selected }}
      <SvgIcon name="chevron-down-3" class="chevron-icon" />
    </div>
    <ul v-show="isOpen" class="campaign-status-dropdown-menu">
      <li v-for="status in filteredStatuses" :key="status.value">
        <a href="#" @click.prevent="itemClick(status)">{{ status.label }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'all',
    },
  },

  data() {
    return {
      isOpen: false,
      statuses: [
        {
          label: 'All Statuses',
          value: 'all',
        },
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Paused',
          value: 'paused',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
    }
  },

  computed: {
    filteredStatuses() {
      return this.statuses.filter(({ value }) => this.value !== value)
    },

    selected() {
      return this.statuses.find((status) => status.value === this.value).label
    },
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
      this.$emit('input', item.value)

      this.hideMenu()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-status-dropdown {
  position: relative;

  .campaign-status-dropdown-toggle {
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

    .main-icon {
      font-size: 1.1rem;
      margin-right: 7px;
    }
    .chevron-icon {
      margin-left: 10px;
      font-size: 0.8rem;
    }
  }

  .campaign-status-dropdown-menu {
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
