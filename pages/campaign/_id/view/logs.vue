<template>
  <div class="view-campagin-logs-page">
    <b-container>
      <div class="campaign-logs">
        <div
          v-if="$apollo.queries.campaignLogs.loading"
          class="campaign-logs-loading"
        >
          <b-spinner variant="primary" />
        </div>
        <div v-else-if="campaignLogs.logs.length < 1" class="empty-logs">
          <AddPeopleIl class="illustration" />

          <div class="empty-logs-description">
            Right now there are no logs for this campaign.
          </div>
        </div>
        <template v-else-if="campaignLogs.logs.length">
          <div v-for="log in campaignLogs.logs" :key="log.id" class="log-item">
            <div class="log-time">{{ log.createdAt | formatDate }}</div>
            <div class="log-content">
              <!-- <div class="content-subject"></div> -->
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="content-body" v-html="log.content"></div>
            </div>
          </div>
        </template>
      </div>
    </b-container>
  </div>
</template>

<script>
import moment from 'moment'
import { CAMPAIGN_LOGS_QUERY } from '~/graphql/campaign/queries'

import AddPeopleIl from '~/assets/illustrations/add-people.svg?inline'

export default {
  components: { AddPeopleIl },

  filters: {
    formatDate(val) {
      // 3 Dec, 2:07 PM
      return moment(val).format('D MMM, h:mm A')
    },
  },

  data() {
    return {
      campaignLogs: {
        logs: [],
      },
    }
  },

  apollo: {
    campaignLogs: {
      query: CAMPAIGN_LOGS_QUERY,
      variables() {
        return {
          campaignId: parseInt(this.$route.params.id),
          offset: 0,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.view-campagin-logs-page {
  margin-top: 30px;

  .campaign-logs {
    .campaign-logs-loading {
      min-height: 55vh;
      display: flex;
      justify-content: center;
      align-items: center;

      .spinner-border {
        border-width: 0.5rem;
        height: 5rem;
        width: 5rem;
      }
    }

    .empty-logs {
      text-align: center;

      .illustration {
        width: 350px;
        height: 350px;
      }

      .empty-logs-description {
        text-align: center;
        margin-top: -30px;
        font-size: 17px;
        line-height: 1.3;
      }
    }

    .log-item {
      padding-bottom: 30px;
      padding-left: 40px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 100%;
        background-color: #9eff91;
        left: 8px;
        top: 0;
        transition: all 0.3s ease-in;
      }

      &::after {
        content: '';
        position: absolute;
        width: 100px;
        height: 4px;
        background-color: #9eff91;
        left: 8px;
        top: 0;
        transition: all 0.3s ease-in;
      }

      .log-time {
        background: #9eff91;
        border-radius: 10px;
        font-size: 17px;
        color: #3abc29;
        padding: 10px 15px;
        display: inline-block;
        margin-bottom: 10px;
      }

      .log-content {
        background: #f5f5f5;
        border-radius: 10px;
        padding: 25px 20px;

        .content-body {
          font-size: 15px;
          color: #8f8f8f;
        }
      }

      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }
}
</style>
