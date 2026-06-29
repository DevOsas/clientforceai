<template>
  <div class="campaign-schedule">
    <p class="campaign-schedule-description">
      Schedules allow you to manage when your emails are being sent. You can
      pick an existing schedule or create a new one.
    </p>
    <ScheduleList
      :campaign="campaign"
      @edit="handleEditSchedule"
      @choose="handleChooseSchedule"
    />
    <AddCampaignFooter>
      <b-button
        :to="{
          name: 'campaign-id-setup-steps',
          params: { id: $route.params.id },
        }"
        variant="link"
        class="text-muted px-3 mr-2"
      >
        Back
      </b-button>
      <b-button
        :to="{
          name: 'campaign-id-setup-settings',
          params: { id: $route.params.id },
        }"
        variant="outline-gray"
        class="px-4 mr-2"
        pill
      >
        Skip
      </b-button>
      <b-button
        variant="primary"
        class="px-4"
        pill
        @click="setCampaignSchedule"
      >
        Continue
      </b-button>
    </AddCampaignFooter>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ScheduleList from '~/components/Schedule/ScheduleList'
import AddCampaignFooter from '~/components/Campaign/AddCampaignFooter'

import { SET_CAMPAIGN_SCHEDULE_MUTATION } from '~/graphql/campaign/mutations'

export default {
  components: { ScheduleList, AddCampaignFooter },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.setup,
    }),
  },

  methods: {
    handleEditSchedule(scheduleId) {
      this.$router.push({
        name: 'campaign-id-setup-schedule-scheduleId',
        params: { id: this.campaign.id, scheduleId },
      })
    },
    handleChooseSchedule(schedule) {
      const params = this.campaign.schedule || {}

      this.$store.dispatch('campaign/updateSetup', {
        ...this.campaign,
        schedule: {
          ...params,
          id: schedule.id,
        },
      })
    },
    setCampaignSchedule() {
      this.$nuxt.$loading.start()
      this.isNextLoading = true

      this.$apollo
        .mutate({
          mutation: SET_CAMPAIGN_SCHEDULE_MUTATION,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            scheduleId: parseInt(this.campaign.schedule.id, 10),
          },
        })
        .then(() => {
          this.$nuxt.$loading.finish()
          this.isNextLoading = false

          this.$router.push({
            name: 'campaign-id-setup-people',
            params: { id: this.campaign.id },
          })
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
          this.isNextLoading = false

          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Operation failed!',
            text: 'Unable to update campaign schedule',
          })
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-schedule {
  .campaign-schedule-description {
    width: 597px;
    margin: auto;
    margin-top: 70px;
    font-size: 20px;
    line-height: 142.3%;
    text-align: center;
  }
}
</style>
