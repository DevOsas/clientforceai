<template>
  <div class="lead-form-extension-campaigns">
    <div
      v-if="leadCampaignMemberships.memberships.length"
      class="campaigns-list"
    >
      <h5>Active</h5>
      <hr />

      <div v-if="activeMembership" class="campaign-item">
        <div class="campaign-details-col">
          <div class="campaign-active">
            <div class="status-indicator active"></div>
          </div>
          <div class="campaign-title">
            {{ activeMembership.campaign.title }}
          </div>
          <div class="campaign-statuses">
            <LeadStatuses :statuses="activeMembership.statuses" :max="3" />
          </div>
        </div>

        <div class="campaign-actions">
          <b-button variant="link">
            <SvgIcon name="email" />
            {{ activeMembership.campaign.deliveredCount }}
          </b-button>
          <b-button variant="link">
            <SvgIcon name="cursor" />
            {{ activeMembership.campaign.opensCount }}
          </b-button>
          <b-button variant="link">
            <SvgIcon name="reply" />
            {{ activeMembership.campaign.replyCount }}
          </b-button>
        </div>
      </div>

      <h5>History</h5>
      <hr />

      <div
        v-for="membership in membershipHistory"
        :key="membership.id"
        class="campaign-item"
      >
        <div class="campaign-details-col">
          <div class="campaign-active">
            <div class="status-indicator active"></div>
          </div>
          <div class="campaign-title">
            {{ membership.campaign.title }}
          </div>
          <div class="campaign-statuses">
            <LeadStatuses :statuses="membership.statuses" :max="3" />
          </div>
        </div>

        <div class="campaign-actions">
          <b-button variant="link">
            <SvgIcon name="email" />
            {{ membership.campaign.deliveredCount }}
          </b-button>
          <b-button variant="link">
            <SvgIcon name="cursor" />
            {{ membership.campaign.opensCount }}
          </b-button>
          <b-button variant="link">
            <SvgIcon name="reply" />
            {{ membership.campaign.replyCount }}
          </b-button>
        </div>
      </div>
    </div>
    <div v-else class="empty-list">
      <div class="empty-list-box">
        <div class="empty-lead-lists">
          <SvgIcon name="info-circle" class="empty-lists-icon" />
          <p>This lead has not been added to any campaigns yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeadStatuses from '~/components/Lead/LeadStatuses'

import { LEAD_CAMPAIGN_MEMBERSHIPS_QUERY } from '~/graphql/lead/queries'

export default {
  components: { LeadStatuses },

  props: {
    lead: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      leadCampaignMemberships: {
        memberships: [],
      },
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
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    activeMembership() {
      return this.leadCampaignMemberships.memberships.find((m) => m.isActive)
    },

    membershipHistory() {
      return this.leadCampaignMemberships.memberships.filter((m) => !m.isActive)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-form-extension-campaigns {
  .campaigns-list {
    margin-top: 30px;

    .campaign-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;

      .campaign-details-col {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .campaign-active {
          font-size: 14px;
          line-height: 21px;
          width: 20px;

          .status-indicator {
            width: 10px;
            height: 10px;
            background-color: $gray-600;
            border-radius: 50%;

            &.active {
              background-color: $primary;
            }
          }
        }

        .campaign-title {
          margin-right: 35px;
        }

        .campaign-statuses {
          //
        }

        .campaign-actions {
          //
        }
      }
    }
  }
}
.empty-list {
  padding-top: 30px;
  .empty-list-box {
    width: 100%;
    min-height: 305px;
    background: white;
    border: 1px solid #dee2de;
    border-radius: 5px;

    .empty-lead-lists {
      text-align: center;
      padding-top: 30px;
    }

    .empty-lists-icon {
      font-size: 5rem;
      color: #8f8f8f;
    }
  }
}
</style>
