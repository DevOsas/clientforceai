<template>
  <b-dropdown
    :variant="variant"
    class="move-lead-to-list-dropdown"
    :size="size"
    no-caret
    boundary="window"
    @shown="handleOnShown"
    @hidden="handleOnHidden"
  >
    <template #button-content>
      <slot />
    </template>
    <template #default="{ hide }">
      <div class="move-to-list-wrap">
        <b-form-input
          ref="searchInput"
          v-model="keyword"
          size="sm"
          class="search-input"
        />
        <custom-scroll>
          <div v-if="filteredLists.length < 1" class="empty-lists">
            No lead list {{ keyword ? `match '${keyword}'` : 'yet' }}
          </div>
          <ul v-else class="lead-lists">
            <li v-for="list in filteredLists" :key="list.id">
              <b-form-checkbox v-model="listIds" :value="list.id">
                {{ list.title }}
              </b-form-checkbox>
            </li>
          </ul>
        </custom-scroll>
        <b-button
          variant="primary"
          size="sm"
          class="mt-2"
          block
          :disabled="disabled"
          @click="applyMoveLeads(hide)"
        >
          Apply
        </b-button>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
import { ALL_LEAD_LISTS_QUERY } from '~/graphql/lead/queries'

export default {
  props: {
    selected: {
      type: Array,
      default: () => [],
    },
    variant: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      keyword: '',
      lists: [],
      listIds: [],
    }
  },

  apollo: {
    lists: {
      query: ALL_LEAD_LISTS_QUERY,

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    filteredLists() {
      return this.lists.filter((list) => {
        const name = list.title.toLowerCase()
        return name.includes(this.keyword.toLowerCase())
      })
    },

    disabled() {
      return this.lists.length < 1 || this.listIds.length < 1
    },
  },

  watch: {
    selected(selected) {
      const map = {}

      selected.forEach((lead) => {
        map[lead.id] = lead.lists.map((list) => list.id)
      })

      this.listIds = this.lists.reduce((accum, list) => {
        if (selected.every((lead) => map[lead.id].includes(list.id))) {
          accum.push(list.id)
        }

        return accum
      }, [])
    },
  },

  methods: {
    applyMoveLeads(hide) {
      hide()

      this.$emit('change', this.listIds)
    },

    handleOnShown() {
      this.$refs.searchInput.focus()
    },

    handleOnHidden() {},
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.move-lead-to-list-dropdown {
  .dropdown-menu {
    min-width: 17rem;
    margin-top: -40px;
    margin-left: -5px;

    .move-to-list-wrap {
      padding: 0 15px;

      .search-input {
        margin-bottom: 5px;
        box-shadow: none;
        border: 0;
        border-radius: 0;
        padding-left: 0;
        padding-right: 0;
        border-bottom: 1px solid $gray-500;

        &:focus {
          border-bottom-color: $primary;
        }
      }

      .empty-lists {
        max-width: 17rem;
        min-height: 100px;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
      }

      .lead-lists {
        max-height: 200px;
        list-style: none;
        padding: 0;
        margin: 10px 0;

        li {
          .custom-checkbox {
            padding: 0.45rem 1.5rem;

            .custom-control-input {
              &:focus {
                ~ .custom-control-label::before {
                  box-shadow: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
