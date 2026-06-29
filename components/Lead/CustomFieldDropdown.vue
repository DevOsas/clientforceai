<template>
  <div v-click-outside="hideMenu" class="csv-map-dropdown">
    <div class="csv-map-dropdown-toggle" @click="toggleOpen">
      <div class="selected-label">
        {{ selected }}
        <span v-if="selectedSlug" class="selected-custom-fields">
          (custom.{{ selectedSlug }})
        </span>
      </div>
      <SvgIcon name="chevron-down-3" class="dropdown-icon" />
    </div>

    <div v-show="isOpen" class="csv-map-dropdown-menu">
      <div class="fields-input-wrap">
        <SvgIcon name="search-2" />
        <b-form-input
          v-model="searchKeyword"
          placeholder="Search fields"
          autofocus
        />
      </div>

      <ul class="map-dropdown-items">
        <li
          v-for="(item, i) in computedItems"
          :key="item.id || i + 1"
          class="map-dropdown-item"
          :class="{ selected: selected === item.title }"
        >
          <a
            href="#"
            class="map-dropdown-link"
            @click.prevent="itemClick(item)"
          >
            {{ item.title }}
          </a>
        </li>
        <li
          v-for="customField in computedCustomFields"
          :key="`custom-${customField.id}`"
          class="map-dropdown-item"
          :class="{ selected: selected === customField.title }"
        >
          <a
            href="#"
            class="map-dropdown-link"
            @click="selectCustomField(customField)"
          >
            {{ customField.title }}
            <small class="map-custom-fields">
              (custom.{{ customField.slug }})
            </small>
          </a>
        </li>
      </ul>

      <div class="map-dropdown-footer">
        <b-button
          variant="add-custom-field"
          block
          @click="$emit('add-custom-field')"
        >
          <SvgIcon name="add" class="mr-1" />
          Add custom field
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: String,
      default: '',
    },

    items: {
      type: Array,
      required: true,
    },

    customFields: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isOpen: false,
      searchKeyword: '',
    }
  },

  computed: {
    selectedSlug() {
      const custom = this.customFields.find((c) => c.title === this.selected)
      return custom ? custom.slug : null
    },

    computedItems() {
      if (!this.searchKeyword) {
        return this.items
      }

      return this.items.filter((i) => {
        const title = i.title.toLowerCase()
        return title.includes(this.searchKeyword.toLowerCase())
      })
    },

    computedCustomFields() {
      if (!this.searchKeyword) {
        return this.customFields
      }

      return this.customFields.filter((i) => {
        const title = i.title.toLowerCase()

        return title.includes(this.searchKeyword.toLowerCase())
      })
    },
  },

  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen
    },

    hideMenu() {
      this.isOpen = false
    },

    itemClick(item) {
      this.$emit('change', item)

      this.hideMenu()
    },

    selectCustomField(item) {
      this.$emit('custom-field-change', item)

      this.hideMenu()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.csv-map-dropdown {
  position: relative;

  .csv-map-dropdown-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid $gray-500;
    cursor: pointer;
    user-select: none;
    min-height: 47px;

    .selected-label {
      font-size: 1.1rem;
      color: darken($gray-500, 45);

      .selected-custom-fields {
        font-size: 0.83rem;
        opacity: 0.7;
      }
    }

    .dropdown-icon {
      font-size: 0.8rem;
      color: $gray-500;
    }
  }

  .csv-map-dropdown-menu {
    width: 100%;
    padding: 20px 30px;
    position: absolute;
    top: 0;
    background-color: $white;
    border: 1px solid transparent;
    border-radius: 0.2rem;
    z-index: 10;
    box-shadow: 0 0 17px 0 rgba(23, 50, 68, 0.17);

    .fields-input-wrap {
      position: relative;

      .icon {
        position: absolute;
        left: 0;
        top: 8px;
      }

      .form-control {
        border: 0;
        border-radius: 0;
        box-shadow: none;
        border-bottom: 1px solid $gray-500;
        padding-left: 25px;

        &:focus {
          border-color: $primary;
        }
      }
    }

    .map-dropdown-items {
      padding: 0;
      margin: 0;
      list-style: none;
      margin-top: 20px;
      margin-bottom: 15px;
      max-height: 200px;
      overflow-y: auto;

      .map-dropdown-item {
        font-size: 1rem;

        .map-dropdown-link {
          display: flex;
          padding: 5px 0;
          color: darken($gray-500, 20);
          text-decoration: none;

          &:hover {
            color: $primary;
          }

          .map-custom-fields {
            font-size: 0.83rem;
            margin-left: 4px;
            color: #748290;
            margin-top: 3px;
            opacity: 0.7;
          }
        }

        &.selected {
          .map-dropdown-link {
            color: $primary;
          }
        }
      }
    }
  }

  .map-dropdown-footer {
    .btn-add-custom-field {
      border: 1px solid $gray-500;
    }
  }
}
</style>
