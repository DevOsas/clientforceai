<template>
  <div class="lead-form-extension-emails">
    <div v-if="$apollo.queries.leadEmailThreads.loading" class="leads-loading">
      <b-spinner variant="primary" />
    </div>
    <template v-else-if="leadEmailThreads.length">
      <div
        v-for="thread in leadEmailThreads"
        :key="thread.id"
        class="extension-email-item"
      >
        <div class="email-time">{{ thread.replies[0].date }}</div>
        <div class="extension-email-box">
          <div class="email-subject">{{ thread.replies[0].subject }}</div>
          <div class="email-body">
            {{ stripTags(thread.replies[0].htmlBody) }}
          </div>
        </div>
      </div>
    </template>
    <div v-else-if="leadEmailThreads == 0" class="empty-list-box">
      <div class="empty-lead-lists">
        <SvgIcon name="info-circle" class="empty-lists-icon" />
        <p>This lead doesn't have any emails yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { LEAD_EMAIL_THREADS_QUERY } from '~/graphql/lead/queries'

import { stripTags } from '~/utils/helpers'

export default {
  props: {
    lead: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      leadEmailThreads: [],
    }
  },

  apollo: {
    leadEmailThreads: {
      query: LEAD_EMAIL_THREADS_QUERY,
      variables() {
        return {
          leadId: this.lead.id,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  methods: {
    stripTags,
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-form-extension-emails {
  padding-top: 30px;

  .leads-loading {
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.4rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .extension-email-item {
    margin-bottom: 15px;
    position: relative;
    padding-left: 50px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      height: 17px;
      width: 17px;
      background-color: #e0e0e0;
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 0;
      width: 3px;
      height: 140px;
      background-color: #e0e0e0;
      margin-top: 2px;
    }

    &:last-child {
      &::after {
        display: none;
      }
    }

    .email-time {
      color: #646464;
      font-size: 14px;
      margin-bottom: 7px;
    }

    .extension-email-box {
      padding: 20px;
      border-radius: 10px;
      background: #fffafa;
      border: 1px solid rgba(224, 224, 224, 0.31);

      .email-subject {
        color: $primary;
        margin-bottom: 5px;
      }

      .email-body {
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #646464;
      }
    }
  }
}

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
</style>
