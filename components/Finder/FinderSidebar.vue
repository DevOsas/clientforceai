<template>
  <div class="finder-sidebar">
    <div class="search-summery-box">
      <h4 class="search-summary-title">Lead Search Summary</h4>

      <div class="search-summary-grid">
        <div class="summary-stat-box">
          <div class="summary-stat-label">Total</div>
          <div class="summary-stat-number">{{ meta.total }}</div>
          <span v-if="meta.next_page">+more</span>
        </div>
      </div>
    </div>

    <div class="leads-queue-box">
      <h4 class="leads-queue-title">Recently Added Leads</h4>
      <div class="leads-queue-list">
        <template v-if="isFetchingFinderStat">
          <b-skeleton width="100%" height="75px" v-for="i in 3" :key="i" />
        </template>
        <template v-else-if="finderStat">
          <div
            class="lead-queue-item"
            v-for="lead in finderStat.recently_added"
            :key="lead.id"
          >
            <div class="lead-photo-wrap">
              <img src="@/assets/images/clientforce-lead.svg" alt="" />
            </div>
            <div class="lead-queue-details">
              <div class="lead-name">{{ lead.company }}</div>
              <div class="lead-email">{{ lead.email }}</div>
              <div class="lead-phone">{{ lead.phone }}</div>
            </div>
          </div>
          <div
            style="text-align: center !important"
            v-if="!finderStat.recently_added.length"
          >
            <MailBroIl style="max-width: 200px" />
            <h6>You have no added leads</h6>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { GET_FINDER_STAT_QUERY } from '~/graphql/finder/queries'
import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'

export default {
  components: { MailBroIl },
  props: {
    meta: {
      type: Object,
      default: () => ({
        next_page: null,
        total: 0,
      }),
    },
  },
  data() {
    return {
      isFetchingFinderStat: false,
    }
  },
  apollo: {
    finderStat: {
      query: GET_FINDER_STAT_QUERY,
      result({ loading }) {
        this.isFetchingFinderStat = loading
      },
    },
  },
}
</script>
<style lang="scss">
@import '~@/assets/scss/variables';

.finder-sidebar {
  width: 27.2%;
  max-width: 330px;
  margin-right: 25px;

  .search-summery-box {
    padding: 30px 50px;
    border-radius: 20px;
    background: rgba(94, 255, 72, 0.24);
    margin-bottom: 20px;

    .search-summary-title {
      text-align: center;
      color: $primary;
      font-weight: bold;
      font-size: 17px;
      line-height: 21px;
    }
    .search-summary-description {
      text-align: center;
      font-size: 12px;
      line-height: 15px;
      margin-bottom: 20px;
    }

    .search-summary-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .summary-stat-box {
        background-color: $white;
        height: 110px;
        width: 100%;
        padding: 10px;
        text-align: center;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;

        .summary-stat-label {
          font-weight: bold;
          font-size: 12px;
          line-height: 15px;
          color: #646464;
        }

        .summary-stat-number {
          font-weight: bold;
          font-size: 30px;
          color: $primary;
        }
      }
    }
  }

  .leads-queue-box {
    background: #f2f2f2;
    mix-blend-mode: normal;
    border: 1px solid $white;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 30px 20px;
    min-height: 370px;

    .leads-queue-title {
      margin-bottom: 20px;
      padding: 0 20px;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
    }

    .leads-queue-list {
      .lead-queue-item {
        display: flex;
        background: rgba(0, 184, 209, 0.12);
        padding: 10px 20px;
        box-shadow: 0 16px 16px rgba(0, 0, 0, 0.01);
        border-radius: 10px;
        margin-bottom: 10px;

        .lead-photo-wrap {
          width: 70px;
          height: 70px;
          margin-right: 10px;

          img {
            width: 100%;
          }
        }

        .lead-queue-details {
          flex-grow: 1;
          font-size: 14px;

          div {
            margin-bottom: 2px;
          }

          .lead-name {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
