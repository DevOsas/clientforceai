<template>
  <div class="top-campaigns-box">
    <h4 class="box-title">Top Campaigns</h4>
    <template v-if="(!queryLoading && topCampaigns.length) || queryLoading">
      <div class="list-head">
        <div class="label">Campaigns</div>
        <div class="label">Status</div>
      </div>
      <ul class="top-campaigns-list">
        <template v-if="queryLoading">
          <li v-for="num in 8" :key="num">
            <b-skeleton animation="fade" width="100%" height="20px" />
          </li>
        </template>
        <template v-else>
          <li
            v-for="campaign in topCampaigns"
            :key="campaign.title"
            class="d-flex justify-content-between align-items-center"
          >
            <div class="campaign-details">
              <div class="title-line">
                <!-- <div class="font-weight-bold mr-1">Unit</div> -->
                <div class="title text-truncate">
                  {{ campaign.title }}
                  <!-- - <span>Technology</span> -->
                </div>
              </div>
              <div class="time-created">{{ campaign.createdAt | timeAgo }}</div>
            </div>
            <div class="campaign-status">
              <b-badge variant="success" :class="campaign.status">{{
                campaign.status
              }}</b-badge>
            </div>
          </li>
        </template>
      </ul>
    </template>
    <div v-else class="no-data-wrap">
      <MailBroIl class="illustration" />
      <p>There are no campaigns yet.</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { TOP_CAMPAIGNS_QUERY } from '~/graphql/campaign/queries'

import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'

export default {
  components: { MailBroIl },

  filters: {
    timeAgo(time) {
      return moment.utc(time).fromNow()
    },
  },

  data() {
    return {
      topCampaigns: [],
    }
  },

  apollo: {
    topCampaigns: {
      query: TOP_CAMPAIGNS_QUERY,
      variables() {
        return {
          limit: 6,
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
      return this.$apollo.queries.topCampaigns.loading
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.top-campaigns-box {
  background-color: #faf9f5;
  border-radius: 10px;
  width: 50%;
  min-height: 500px;

  .box-title {
    font-size: 21px;
    font-weight: normal;
    padding: 20px 20px 5px;
    color: $gray-600;
  }

  .list-head {
    display: flex;
    justify-content: space-between;
    padding: 4px 20px;

    .label {
      color: $gray-500;
      font-size: 0.9rem;
    }
  }

  .top-campaigns-list {
    list-style: none;
    padding: 0;
    margin-bottom: 0;

    li {
      padding: 12px 20px;
      border-top: 1px solid #e3e2e1;

      .title-line {
        display: flex;
        max-width: 90%;

        .title {
          width: 230px;
          font-size: 0.88rem;

          span {
            color: $gray-500;
          }
        }
      }

      .time-created {
        font-size: 0.8rem;
        color: $gray-500;
      }

      .campaign-status {
        .badge {
          padding: 10px 10px;
          border-radius: 2px;
          width: 70px;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: -5px;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
          }

          &.active {
            color: #72d67a;
            background-color: #d7f5d9;

            &::before {
              border-right: 5px solid #d7f5d9;
            }
          }

          &.inactive {
            color: #efc55c;
            background-color: #fbecc5;

            &::before {
              border-right: 5px solid #fbecc5;
            }
          }
        }
      }
    }
  }

  .no-data-wrap {
    height: 75%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .illustration {
      height: 210px;
    }
  }
}
</style>
