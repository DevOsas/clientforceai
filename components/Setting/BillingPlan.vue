<template>
  <div class="account-billing p-2">
    <b-row>
      <b-col md="8">
        <b-row class="billing-label">
          <h4><SvgIcon name="verified" class="icon-sm" /> Plans/Billings</h4>
        </b-row>
      </b-col>
    </b-row>

    <b-container class="my-3 p-3 shadow-sm rounded">
      <div class="d-flex align-items-center">
        <div class="d-flex flex-column">
          <div>
            {{
              getUserPlan
                ? `You're currently on`
                : `You currently do not have any plan`
            }}
          </div>
          <b-skeleton v-if="isFetchingUserPlan" width="25%"></b-skeleton>
          <h3 v-else-if="getUserPlan">{{ getUserPlan.name }}</h3>
        </div>
        <b-button
          v-if="!isFetchingUserPlan"
          variant="primary"
          size="sm"
          class="ml-3 rounded"
          @click="$bvModal.show('planUpgradeModal')"
          ><SvgIcon name="arrow-up" class="icon-md" />&nbsp;{{
            getUserPlan ? `upgrade` : `Choose plan`
          }}</b-button
        >
      </div>

      <div v-if="isFetchingUserPlan" class="my-2 d-flex flex-column">
        <b-skeleton width="25%"></b-skeleton>
        <b-skeleton width="25%"></b-skeleton>
        <b-skeleton width="25%"></b-skeleton>
      </div>
      <!-- Features -->
      <template v-else-if="limitBalance">
        <div class="my-2 d-flex flex-row justify-content-between">
          <div class="text-capitalize">Leads</div>
          <div class="font-weight-bold">
            {{ limitBalance.leads }}
          </div>
        </div>
        <div class="my-2 d-flex flex-row justify-content-between">
          <div class="text-capitalize">templates</div>
          <div class="font-weight-bold">
            {{ limitBalance.templates }}
          </div>
        </div>
        <div class="my-2 d-flex flex-row justify-content-between">
          <div class="text-capitalize">campaigns</div>
          <div class="font-weight-bold">
            {{ limitBalance.campaigns }}
          </div>
        </div>
        <div class="my-2 d-flex flex-row justify-content-between">
          <div class="text-capitalize">Custom Fields</div>
          <div class="font-weight-bold">
            {{ limitBalance.customFields }}
          </div>
        </div>
        <div class="my-2 d-flex flex-row justify-content-between">
          <div class="text-capitalize">Proposals</div>
          <div class="font-weight-bold">
            {{ limitBalance.proposals }}
          </div>
        </div>
        <div class="my-2 d-flex flex-row justify-content-between">
          <div class="text-capitalize">Workspaces</div>
          <div class="font-weight-bold">
            {{ limitBalance.workspaces }}
          </div>
        </div>
      </template>

      <b-row class="mb-1">
        <b-col align-self="center"> Email Validation Units </b-col>
        <b-col align-self="center">
          <b-progress
            height="6px"
            v-if="isFetchingEmailValidationBalance"
            animated
            value="100"
          ></b-progress>
          <b-progress
            height="6px"
            v-else-if="getEmailValidationBalance"
            :value="getEmailValidationBalance.balance"
            max="10000"
          ></b-progress>
        </b-col>
        <b-col class="d-flex justify-content-between">
          <b-button
            variant="primary"
            size="sm"
            class="rounded-pill px-3"
            @click="$bvModal.show('emailValidationModal')"
            :disabled="isFetchingEmailValidationBalance"
            >Top up</b-button
          >
          <b-spinner
            v-if="isFetchingEmailValidationBalance"
            class="align-self-center"
            small
          ></b-spinner>
          <div
            v-else-if="getEmailValidationBalance"
            class="align-self-center font-weight-bold"
          >
            {{ getEmailValidationBalance.balance }}
          </div>
        </b-col>
      </b-row>
      <b-row class="mb-1">
        <b-col align-self="center"> Lead Enrichment Units </b-col>
        <b-col align-self="center">
          <b-progress
            height="6px"
            v-if="isFetchingLeadEnrichmentBalance"
            animated
            value="100"
          ></b-progress>
          <b-progress
            height="6px"
            v-else-if="getLeadEnrichmentBalance"
            :value="getLeadEnrichmentBalance.balance"
            max="10000"
          ></b-progress>
        </b-col>
        <b-col class="d-flex justify-content-between">
          <b-button
            variant="primary"
            size="sm"
            class="rounded-pill px-3"
            @click="$bvModal.show('leadEnrichmentModal')"
            :disabled="isFetchingLeadEnrichmentBalance"
            >Top up</b-button
          >
          <b-spinner
            v-if="isFetchingLeadEnrichmentBalance"
            class="align-self-center"
            small
            >100</b-spinner
          >
          <div
            v-else-if="getLeadEnrichmentBalance"
            class="align-self-center font-weight-bold"
          >
            {{ getLeadEnrichmentBalance.balance }}
          </div>
        </b-col>
      </b-row>
      <!-- Features  ends here-->
    </b-container>
    <b-container
      class="my-3 shadow-sm rounded"
      :class="{ 'p-0': transactions && transactions.data.length }"
    >
      <div v-if="isFetchingTransactions" class="d-flex justify-content-center">
        <b-skeleton-table class="my-2" />
      </div>
      <b-table
        v-else-if="transactions && transactions.data.length"
        :items="transactions.data"
        striped
        :fields="transactionFields"
      ></b-table>
      <div
        style="text-align: center !important; padding-top: 16px !important"
        v-else
      >
        <h4 class="mb-5">You have no transactions yet</h4>
        <MailBroIl />
      </div>
    </b-container>
    <email-validation-top-up-modal />
    <lead-enrichment-top-up-modal />
    <plan-upgrade-modal />
  </div>
</template>

<script>
import EmailValidationTopUpModal from './EmailValidationTopUpModal.vue'
import LeadEnrichmentTopUpModal from './LeadEnrichmentTopUpModal.vue'
import PlanUpgradeModal from './PlanUpgradeModal.vue'
import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'

import {
  EMAIL_VALIDATION_BALANCE_QUERY,
  GET_LIMIT_BALANCE_QUERY,
  LEAD_ENRICHMENT_BALANCE_QUERY,
  PLAN_QUERY,
  TRANSACTIONS_QUERY,
} from '~/graphql/subscription/queries'
export default {
  components: {
    EmailValidationTopUpModal,
    LeadEnrichmentTopUpModal,
    PlanUpgradeModal,
    MailBroIl,
  },

  props: {},

  data() {
    return {
      isFetchingTransactions: false,
      transactionPage: 1,
      transactionAction: null,
      isFetchingEmailValidationBalance: false,
      isFetchingLeadEnrichmentBalance: false,
      isFetchingUserPlan: false,
      transactionFields: [
        {
          key: 'created_at',
          label: 'Trans Date',
          sortable: true,
        },
        {
          key: 'action_type',
          label: 'Unit type',
        },
        {
          key: 'units',
          label: 'Units',
          sortable: true,
        },
        {
          key: 'amount',
          label: 'Amount',
        },
        {
          key: 'transaction_type',
          label: 'Transaction Type',
        },
      ],
    }
  },

  methods: {},

  apollo: {
    transactions: {
      query: TRANSACTIONS_QUERY,
      result({ loading }) {
        this.isFetchingTransactions = loading
      },
      variables() {
        return {
          page: this.transactionPage,
          limit: 10,
          action: this.transactionAction,
        }
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    getEmailValidationBalance: {
      query: EMAIL_VALIDATION_BALANCE_QUERY,
      result({ loading }) {
        this.isFetchingEmailValidationBalance = loading
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    getLeadEnrichmentBalance: {
      query: LEAD_ENRICHMENT_BALANCE_QUERY,
      result({ loading }) {
        this.isFetchingLeadEnrichmentBalance = loading
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    getUserPlan: {
      query: PLAN_QUERY,
      result({ loading }) {
        this.isFetchingUserPlan = loading
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.muted {
  text-decoration: line-through;
  color: $gray-400;
}
.billing-options {
  border: 2px solid $gray-400;
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  text-align: center;
  .billing-title {
    font-weight: bold;
    color: rgb(36, 32, 32);
    font-size: 16px;
  }
  .billing-desc {
    color: $gray-500;
    font-size: 14px;
  }
  .select {
    border-color: $primary;
  }
  .no-transactions {
    text-align: center;
  }
}
</style>
