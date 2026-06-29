<template>
  <b-popover
    :target="target"
    :show="isShowing"
    triggers="manual"
    placement="bottom"
    custom-class="lead-campaign-memberships-popover"
  >
    <template>
      <div class="lead-memberships-wrap">
        <div class="lead-memberships-header">
          <h4 class="lead-memberships-title">Campaigns and Statuses</h4>

          <b-button variant="link" size="sm" @click="$emit('close')">
            <SvgIcon name="close" />
          </b-button>
        </div>
        <ul ref="scrollRef" class="lead-memberships-list">
          <template>
            <li v-if="wholeListLoading" class="membership-loading">
              <b-skeleton
                v-for="num in numToLoad"
                :key="num"
                animation="fade"
                width="100%"
                height="25px"
                :class="{ 'mb-2': num !== 1 }"
              />
            </li>
            <template v-else>
              <li
                v-for="membership in leadCampaignMemberships.memberships"
                :key="membership.id"
              >
                <div class="membership-campaign-wrap">
                  {{ membership.campaign.title }}

                  <CampaignMembershipStatusesDropdown
                    v-b-tooltip.hover.left
                    title="Change status"
                    variant="link"
                    size="sm"
                    @change="handleSetLeadStatuses(membership.id, $event)"
                  >
                    <SvgIcon name="chevron-down-3" class="action-icon" />
                  </CampaignMembershipStatusesDropdown>
                </div>
                <LeadStatuses :statuses="membership.statuses" />
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
              <li
                v-else-if="lead.campaignMembershipCount > 5 && loadMoreEnabled"
              >
                <b-button variant="primary" size="sm" block @click="loadMore">
                  Load more ...
                </b-button>
              </li>
            </template>
          </template>
        </ul>
      </div>
    </template>
  </b-popover>
</template>

<script>
import CampaignMembershipStatusesDropdown from '~/components/Lead/CampaignMembershipStatusesDropdown'
import LeadStatuses from '~/components/Lead/LeadStatuses'

import { LEAD_CAMPAIGN_MEMBERSHIPS_QUERY } from '~/graphql/lead/queries'
import { SET_CAMPAIGN_MEMBERSHIPS_STATUS_MUTATION } from '~/graphql/lead/mutations'

export default {
  components: { CampaignMembershipStatusesDropdown, LeadStatuses },

  props: {
    lead: {
      type: Object,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: 'primary',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      leadCampaignMemberships: {},
      loadAll: true,
      loadingMore: false,
      nextOffset: 0,
      loadMoreEnabled: true,
      isShowing: this.show,
    }
  },

  apollo: {
    leadCampaignMemberships: {
      query: LEAD_CAMPAIGN_MEMBERSHIPS_QUERY,
      variables() {
        return {
          id: this.lead.id,
          offset: 0,
        }
      },
      skip() {
        return !this.loadAll
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    wholeListLoading() {
      return (
        !this.loadingMore &&
        this.$apollo.queries.leadCampaignMemberships.loading
      )
    },
    numToLoad() {
      return this.lead.campaignMembershipCount < 5
        ? this.lead.campaignMembershipCount
        : 5
    },
  },

  watch: {
    show(show) {
      this.isShowing = show
    },
  },

  methods: {
    handleOnShown() {
      this.$refs.searchInput.focus()
    },

    handleSetLeadStatuses(id, { status, action }) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: SET_CAMPAIGN_MEMBERSHIPS_STATUS_MUTATION,
          variables: { ids: [id], status, action },
          update: (store, { data: { setCampaignMembershipsStatus } }) => {
            const data = store.readQuery({
              query: LEAD_CAMPAIGN_MEMBERSHIPS_QUERY,
              variables: {
                id: this.lead.id,
                offset: 0,
              },
            })

            const index = data.leadCampaignMemberships.memberships.findIndex(
              (m) => m.id === id
            )
            if (index !== -1) {
              data.leadCampaignMemberships.memberships = [
                ...data.leadCampaignMemberships.memberships.slice(0, index),
                setCampaignMembershipsStatus[0],
                ...data.leadCampaignMemberships.memberships.slice(index + 1),
              ]
            }

            // Write the leads data back to the cache.
            store.writeQuery({
              query: LEAD_CAMPAIGN_MEMBERSHIPS_QUERY,
              variables: {
                id: this.lead.id,
                offset: 0,
              },
              data,
            })
          },
        })
        .then(({ data }) => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: 'Lead campaign status set successfully',
          })

          this.$nuxt.$loading.finish()
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          this.$nuxt.$loading.finish()

          if (errors && errors.length) {
            const validationErrors = errors.filter(
              (error) => error.extensions.category === 'Validation'
            )

            validationErrors.forEach((e) => {
              this.$notify({
                group: 'main',
                type: 'native-error',
                title: 'Unable to set status',
                text: e.message,
              })
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'native-error',
              title: 'Unable to set status',
              text: 'An error occurred while processing your request',
            })
          }
        })
    },

    loadMore() {
      this.loadingMore = true

      const nextOffset = this.nextOffset + 5

      // Fetch more data and transform the original result
      this.$apollo.queries.leadCampaignMemberships
        .fetchMore({
          // New variables
          variables: { offset: nextOffset },
          // Transform the previous result with new data
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newItems = fetchMoreResult.leadCampaignMemberships.memberships
            const hasMore = fetchMoreResult.leadCampaignMemberships.hasMore

            this.nextOffset = nextOffset
            this.loadMoreEnabled = hasMore

            return {
              leadCampaignMemberships: {
                ...previousResult.leadCampaignMemberships,
                __typename: previousResult.leadCampaignMemberships.__typename,
                // Merging the items list
                memberships: [
                  ...previousResult.leadCampaignMemberships.memberships,
                  ...newItems,
                ],
                hasMore,
              },
            }
          },
        })
        .then(() => {
          // Scroll up a bit
          setTimeout(() => {
            const container = this.$refs.scrollRef
            container.scrollTop = container.scrollTop + 50
          })
        })
        .catch((e) => {
          // Handle errors
        })
        .finally(() => {
          this.loadingMore = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-campaign-memberships-popover {
  min-width: 350px;
  width: 350px;
  font-size: initial;

  .lead-memberships-wrap {
    .lead-memberships-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .lead-memberships-title {
        margin-bottom: 0;
        padding: 10px 2px 0;
        font-size: 1.2rem;
      }

      .btn {
        box-shadow: none !important;
        color: $gray-600;
        padding: 0;
        margin-top: 10px;

        .icon {
          font-size: 24px;
          line-height: 1;
        }
      }
    }

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

    .lead-memberships-list {
      max-height: 400px;
      list-style: none;
      padding: 0;
      margin: 10px 0;
      overflow-x: hidden;

      > li {
        padding: 0.45rem 3px;
        border-bottom: 1px solid $gray-100;

        &:last-child {
          border-bottom: 0;
        }

        .membership-campaign-wrap {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
