<template>
  <div class="top-leads-box">
    <h4 class="box-title">Top Leads</h4>
    <template v-if="(!queryLoading && topLeads.length) || queryLoading">
      <div class="list-head">
        <div class="label">Leads</div>
        <div class="label">Tags</div>
      </div>
      <ul class="top-leads-list">
        <template v-if="queryLoading">
          <li v-for="num in 8" :key="num">
            <b-skeleton animation="fade" width="100%" height="20px" />
          </li>
        </template>
        <template v-else>
          <li
            v-for="lead in topLeads"
            :key="lead.name"
            class="d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <img
                src="@/assets/images/default.png"
                alt=""
                class="lead-photo"
              />
              <div class="lead-details">
                <div class="name">{{ lead.firstName }} {{ lead.lastName }}</div>
                <div class="email">{{ lead.email }}</div>
              </div>
            </div>
            <div class="lead-tags">
              <b-badge
                v-for="status in getStatuses(lead)"
                :key="status.id"
                class="px-2 py-1"
              >
                {{ status.name }}
              </b-badge>
            </div>
          </li>
        </template>
      </ul>
    </template>
    <div v-else class="no-data-wrap">
      <LeadsIl class="illustration" />
      <p>There are no leads yet.</p>
    </div>
  </div>
</template>

<script>
import LeadsIl from '~/assets/illustrations/leads.svg?inline'

import { TOP_LEADS_QUERY } from '~/graphql/lead/queries'

export default {
  components: { LeadsIl },

  data() {
    return {
      topLeads: [],
    }
  },

  apollo: {
    topLeads: {
      query: TOP_LEADS_QUERY,
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
      return this.$apollo.queries.topLeads.loading
    },
  },

  methods: {
    getStatuses(lead) {
      const membership = lead.firstCampaignMembership

      if (membership && membership.statuses) {
        return membership.statuses.slice(0, 2)
      }

      return []
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.top-leads-box {
  background-color: #faf9f5;
  border-radius: 10px;
  width: 50%;
  margin-right: 15px;
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

  .top-leads-list {
    list-style: none;
    padding: 0;
    margin-bottom: 0;

    li {
      padding: 12px 20px;
      border-top: 1px solid #e3e2e1;

      .lead-photo {
        height: 42px;
        width: 42px;
        margin-right: 7px;
      }

      .name {
        font-weight: bold;
      }

      .email {
        font-size: 0.8rem;
        color: $gray-500;
      }

      .lead-tags {
        .badge {
          margin-right: 1px;
          font-size: 0.58rem;

          &:first-of-type {
            border-radius: 7px 0 0 7px;
            color: #59cd61;
            background-color: #c7f1c9;
          }
          &:last-of-type {
            border-radius: 0 7px 7px 0;
            color: #bf54e2;
            background-color: #ecbffe;
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
