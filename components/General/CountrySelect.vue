<template>
  <div
    v-click-outside="hideMenu"
    class="country-select"
    :class="{ open: isOpen }"
  >
    <div class="select-toggle" @click="toggleOpen">
      {{ selectedText }}
      <SvgIcon name="chevron-down-2" />
    </div>
    <div v-show="isOpen" class="country-select-dropdown">
      <ul class="country-select-list">
        <li
          v-for="country in countries"
          :key="country.isoCode"
          @click="select(country)"
        >
          {{ country.name }} +({{ country.callCode }})
        </li>
      </ul>
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

    countries: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isOpen: false,
    }
  },

  computed: {
    selected() {
      return this.countries.find(
        (country) => country.isoCode.toLowerCase() === this.value.toLowerCase()
      )
    },

    selectedText() {
      return this.selected
        ? `${this.selected.isoCode.toUpperCase()} +(${this.selected.callCode})`
        : 'Country'
    },
  },

  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
    },

    hideMenu() {
      this.isOpen = false
    },

    select(country) {
      this.$emit('input', country.isoCode)

      this.hideMenu()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.country-select {
  position: relative;

  .select-toggle {
    background-color: $white;
    border: 1px solid $gray-200;
    white-space: nowrap;
    cursor: pointer;
    min-height: $input-height-lg;
    font-size: 1rem;
    padding: 0.57rem 1rem;
    @include border-radius($input-border-radius-lg);

    .icon {
      font-size: 0.8rem;
      margin-left: 4px;
    }
  }

  &.open {
    .select-toggle {
      border-color: $primary;
    }
  }

  .country-select-dropdown {
    background-color: $white;
    max-height: 350px;
    overflow-y: auto;
    width: 350px;
    border-radius: 0.3rem;
    box-shadow: $dropdown-box-shadow;
    top: -100px;
    position: absolute;

    .country-select-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 10px 20px;
        cursor: pointer;

        &:hover {
          background-color: $gray-100;
        }
      }
    }
  }
}
</style>
