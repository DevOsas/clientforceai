<template>
  <b-dropdown
    :variant="variant"
    class="add-lead-to-campaign-dropdown"
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
      <div class="add-to-campaigns-wrap">
        <b-form-input
          ref="searchInput"
          v-model="keyword"
          size="sm"
          class="search-input"
        />
        <custom-scroll>
          <div v-if="filteredCampaigns.length < 1" class="empty-campaigns">
            No campaigns {{ keyword ? `match '${keyword}'` : 'yet' }}
          </div>
          <ul v-else class="campaigns-list">
            <li v-for="campaign in filteredCampaigns" :key="campaign.id">
              <a href="#" @click.prevent="setCampaign(campaign, hide)">
                {{ campaign.title }}
              </a>
            </li>
            <li v-if="loadingMore">
              <b-skeleton
                v-for="num in 2"
                :key="num"
                animation="fade"
                width="100%"
                height="25px"
                :class="{ 'mb-2': num !== 1 }"
              />
            </li>
            <li v-if="campaignResult.hasMore" class="pb-2">
              <b-button
                variant="primary"
                size="sm"
                class="mt-2"
                block
                @click="fetchMoreCampaigns"
              >
                Load more
              </b-button>
            </li>
          </ul>
        </custom-scroll>
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
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    filteredCampaigns() {
      return this.campaignResult.campaigns.filter((campaign) => {
        const name = campaign.title.toLowerCase()
        return name.includes(this.keyword.toLowerCase())
      })
    },
  },

  methods: {
    setCampaign(campaign, hide) {
      this.$emit('change', campaign)

      hide()
    },

    // Fetch More Campaign
    fetchMoreCampaigns() {
      this.loadingMore = true

      const nextOffset = this.nextOffset + 15
      // Fetch more data and transform the original result
      this.$apollo.queries.campaignResult
        .fetchMore({
          variables: {
            offset: nextOffset,
          },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newCampaigns = fetchMoreResult.campaignResult.campaigns
            const hasMore = fetchMoreResult.campaignResult.hasMore

            this.nextOffset = nextOffset

            return {
              campaignResult: {
                ...previousResult.campaignResult,
                __typename: previousResult.campaignResult.__typename,
                // Merging the tag list
                campaigns: [
                  ...previousResult.campaignResult.campaigns,
                  ...newCampaigns,
                ],
                hasMore,
              },
            }
          },
        })
        .then(() => {
          // Then ...
        })
        .catch((e) => {
          // Handle errors
        })
        .finally(() => {
          this.loadingMore = false
        })
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

.add-lead-to-campaign-dropdown {
  .dropdown-menu {
    min-width: 17rem;
    margin-top: -40px;
    margin-left: -5px;

    .add-to-campaigns-wrap {
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
        max-height: 200px;
        list-style: none;
        padding: 0;
        margin: 10px 0;

        li {
          > a {
            display: block;
            padding: 0.45rem 3px;
            color: $dark;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
