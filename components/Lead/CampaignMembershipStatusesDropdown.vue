<template>
  <b-dropdown
    :variant="variant"
    class="lead-status-dropdown"
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
      <div class="lead-status-wrap">
        <b-form-input
          ref="searchInput"
          v-model="keyword"
          size="sm"
          class="search-input"
          placeholder="Search statuses"
        />
        <custom-scroll>
          <div v-if="filteredStatuses.length < 1" class="empty-statuses">
            No statuses match '{{ keyword }}'
          </div>
          <ul v-else class="lead-statuses-list">
            <li v-for="status in filteredStatuses" :key="status.id">
              <div class="d-flex">
                <div class="status-select-boxes">
                  <div
                    class="status-select-box"
                    :class="{
                      selected:
                        statusInput === status.name && actionInput === 'add',
                    }"
                    @click="setStatus(status.name, 'add')"
                  >
                    <SvgIcon name="plus" />
                  </div>
                  <div
                    class="status-select-box"
                    :class="{
                      selected:
                        statusInput === status.name && actionInput === 'remove',
                    }"
                    @click="setStatus(status.name, 'remove')"
                  >
                    <SvgIcon name="minus" />
                  </div>
                </div>
                <div class="status-label">{{ status.name }}</div>
              </div>
            </li>
          </ul>
        </custom-scroll>
        <b-button
          variant="primary"
          size="sm"
          class="mt-3"
          block
          :disabled="setStatusDisabled"
          @click="setStatuses(hide)"
        >
          Set Status
        </b-button>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
import { CAMPAIGN_MEMBERSHIP_STATUSES_QUERY } from '~/graphql/lead/queries'

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
      statusInput: '',
      actionInput: '',
      keyword: '',
      campaignMembershipStatuses: [],
    }
  },

  apollo: {
    campaignMembershipStatuses: {
      query: CAMPAIGN_MEMBERSHIP_STATUSES_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    filteredStatuses() {
      return this.campaignMembershipStatuses.filter((status) => {
        const name = status.name.toLowerCase()
        return name.includes(this.keyword.toLowerCase())
      })
    },

    setStatusDisabled() {
      return this.filteredStatuses.length < 1 || !this.statusInput
    },
  },

  methods: {
    setStatus(name, action) {
      this.statusInput = name
      this.actionInput = action
    },

    setStatuses(hide) {
      this.$emit('change', {
        status: this.statusInput,
        action: this.actionInput,
      })

      hide()
    },

    handleOnShown() {
      this.$refs.searchInput.focus()
    },

    handleOnHidden() {
      this.searchInput = ''
      this.statusInput = ''
      this.actionInput = ''
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-status-dropdown {
  .dropdown-menu {
    min-width: 13rem;
    margin-top: -40px;
    margin-left: -2px;

    .lead-status-wrap {
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

      .empty-statuses {
        text-align: center;
        white-space: wrap;
        padding: 0 10px;
        max-width: 170px;
      }

      .lead-statuses-list {
        max-height: 200px;
        list-style: none;
        padding: 0;
        margin: 10px 0;

        .status-select-boxes {
          display: flex;

          .status-select-box {
            border: 1px solid $gray-200;
            color: $gray-500;
            margin-right: 5px;
            height: 20px;
            width: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border-radius: 3px;

            &.selected {
              background-color: $primary;
              border-color: $primary;
              color: $white;
            }

            .icon {
              font-size: 0.7rem;
              line-height: 1;
              margin-top: 3px;
            }
          }
        }

        .status-label {
          margin-left: 4px;
        }

        li {
          padding: 0.45rem 3px;
        }
      }
    }
  }
}
</style>
