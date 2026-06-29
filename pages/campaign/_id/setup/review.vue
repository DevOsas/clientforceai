<template>
  <div class="add-campaign-review-page">
    <b-container>
      <div class="add-campaign-reviews">
        <div class="add-campaign-review-item">
          <div class="review-icon-wrap">
            <SvgIcon name="check" />
          </div>
          <div class="review-details">
            <div class="review-title">Steps</div>
            <div class="review-description">
              Your sequence has total of
              <strong>{{ summary.numberOfSteps }}</strong> steps (<strong>{{
                summary.numberOfEmails
              }}</strong>
              emails)
            </div>
          </div>
        </div>

        <div class="add-campaign-review-item">
          <div class="review-icon-wrap">
            <SvgIcon name="check" />
          </div>
          <div class="review-details">
            <div class="review-title">Schedule</div>
            <div class="review-description">
              This campaign will use your Default schedule. Emails will be sent
              on <strong>{{ summary.emailDays }}</strong>
            </div>
          </div>
        </div>

        <div class="add-campaign-review-item">
          <div class="review-icon-wrap">
            <SvgIcon name="check" />
          </div>
          <div class="review-details">
            <div class="review-title">People</div>
            <div class="review-description">
              This campaign includes overall
              <strong>{{ summary.numberOfLeads }}</strong> people
            </div>
          </div>
        </div>

        <div class="add-campaign-review-item">
          <div class="review-icon-wrap">
            <SvgIcon name="check" />
          </div>
          <div class="review-details">
            <div class="review-title">Duration</div>
            <div class="review-description">
              This approximation of your sequence will be
              <strong>{{ summary.numberOfDays }}</strong> days
            </div>
          </div>
        </div>
      </div>
    </b-container>

    <AddCampaignFooter>
      <b-button
        :to="{
          name: 'campaign-id-setup-settings',
          params: { id: $route.params.id },
        }"
        variant="link"
        class="text-muted px-3 mr-2"
      >
        Back
      </b-button>
      <b-button
        :to="{ name: 'campaigns' }"
        variant="outline-gray"
        class="px-4 mr-2"
        pill
      >
        Save
      </b-button>
      <b-button
        variant="primary"
        class="px-4"
        pill
        :disabled="isLaunching"
        @click="saveAndLauchCampaign"
      >
        <b-spinner v-if="isLaunching" class="mr-1" small />
        Save and Launch
      </b-button>
    </AddCampaignFooter>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import AddCampaignFooter from '~/components/Campaign/AddCampaignFooter'

import { UPDATE_CAMPAIGN_STATUS_MUTATION } from '~/graphql/campaign/mutations'

export default {
  components: { AddCampaignFooter },

  data() {
    return {
      summary: {},
      isLaunching: false,
    }
  },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.setup,
    }),
  },

  created() {
    const activePlans = this.campaign.schedule.plan.filter(
      (plan) => plan.isActive
    )
    const emailDays = activePlans.map((plan) => plan.weekDay).join(', ')
    const numberOfDays = this.campaign.schedule.plan.reduce(
      (prev, plan, index) => {
        if (plan.isActive) {
          return prev + 1
        }
        return prev
      },
      0
    )
    const numberOfEmails = this.campaign.steps.reduce((accum, step) => {
      accum += step.emails.length
      return accum
    }, 0)

    this.summary = {
      numberOfSteps: this.campaign.steps.length,
      numberOfDays,
      numberOfEmails,
      emailDays,
      numberOfLeads: this.campaign.leadsCount,
    }
  },

  methods: {
    saveAndLauchCampaign() {
      this.isLaunching = true

      this.$apollo
        .mutate({
          mutation: UPDATE_CAMPAIGN_STATUS_MUTATION,
          variables: {
            id: this.campaign.id,
            status: 'active',
          },
        })
        .then(({ data }) => {
          this.isLaunching = false

          this.$router.push({ name: 'campaigns' })
        })
        .catch(({ data }) => {
          this.isLaunching = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-campaign-review-page {
  padding-bottom: 50px;

  .add-campaign-reviews {
    width: 877px;
    margin: auto;
    margin-top: 50px;

    .add-campaign-review-item {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      background: #cdffc7;
      border-radius: 10px;
      padding: 15px 30px;

      .review-icon-wrap {
        width: 77px;
        height: 77px;
        background-color: $primary;
        border-radius: 50%;
        color: $white;
        font-size: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        flex-shrink: 0;
      }

      .review-details {
        .review-title {
          font-size: 30px;
          color: $primary;
        }
        .review-description {
          font-size: 17px;
          color: $gray-600;
        }
      }
    }
  }
}
</style>
