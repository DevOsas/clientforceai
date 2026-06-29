<template>
  <b-dropdown
    :variant="variant"
    class="select-campaigns-dropdown"
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
      <div class="select-campaigns-wrap">
        <b-form-input
          ref="searchInput"
          v-model="keyword"
          placeholder="Search"
          size="sm"
          class="search-input"
        />
        <custom-scroll>
          <div
            v-if="!queryLoading && campaignResult.campaigns.length < 1"
            class="empty-campaigns"
          >
            No campaigns {{ keyword ? `match '${keyword}'` : 'yet' }}
          </div>
          <ul v-else class="campaigns-list">
            <template v-if="!queryLoading && campaignResult.campaigns.length">
              <li
                v-for="campaign in campaignResult.campaigns"
                :key="campaign.id"
              >
                <b-form-checkbox
                  :id="`campaign-${campaign.id}`"
                  v-model="ids"
                  :value="campaign.id"
                />
                <label
                  :for="`campaign-${campaign.id}`"
                  class="campaign-item-title"
                  >{{ campaign.title }}</label
                >
              </li>
            </template>
            <template v-if="queryLoading">
              <li v-for="num in 10" :key="num">
                <b-skeleton
                  animation="fade"
                  width="97%"
                  height="20px"
                  :class="{ 'mb-2': num !== 1 }"
                />
              </li>
            </template>
          </ul>
        </custom-scroll>
        <div class="border-top pb-2">
          <b-button
            variant="primary"
            size="sm"
            class="mt-2"
            block
            :disabled="queryLoading"
            @click="apply(hide)"
          >
            Apply
          </b-button>
        </div>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
import { ALL_CAMPAIGNS_QUERY } from '~/graphql/campaign/queries'

export default {
  props: {
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
      campaignResult: {
        campaigns: [],
      },
      ids: [],
      nextOffset: 0,
      loadingMore: false,
    }
  },

  apollo: {
    campaignResult: {
      query: ALL_CAMPAIGNS_QUERY,
      variables() {
        return {
          offset: 0,
          keyword: this.keyword,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    queryLoading() {
      return this.$apollo.queries.campaignResult.loading
    },
  },

  watch: {
    keyword() {
      this.ids = []
    },
  },

  methods: {
    apply(hide) {
      this.$emit('change', this.ids)

      hide()
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

.select-campaigns-dropdown {
  .dropdown-menu {
    min-width: 400px;
    margin-top: -40px;
    margin-left: -5px;

    .select-campaigns-wrap {
      padding: 0 15px;
      max-width: 400px;

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

      .empty-campaigns {
        max-width: 17rem;
        min-height: 100px;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
      }

      .campaigns-list {
        max-height: 350px;
        list-style: none;
        padding: 0;
        margin: 10px 0;

        li {
          display: flex;
          padding-left: 3px;
          margin-bottom: 10px;

          .campaign-item-title {
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 320px;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
