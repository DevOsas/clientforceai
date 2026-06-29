<template>
  <div class="view-campagin-steps-page">
    <b-container>
      <div class="text-right">
        <b-button
          variant="primary"
          class="timezone-btn"
          @click="$bvModal.show('UpdateCampaignScheduleModal')"
        >
          <SvgIcon name="clock-alt" />
          {{ campaign.schedule.title }}
        </b-button>
      </div>
      <CampaignStepsManager
        class="pl-4"
        :steps="campaign.steps"
        :campaign-id="campaign.id"
        @update="updateCampaignSteps"
      />
    </b-container>
    <b-modal
      id="UpdateCampaignScheduleModal"
      modal-class="schedule-modal"
      size="lg"
      hide-header
      hide-footer
      centered
    >
      <template #default="{ hide }">
        <div class="schedule-modal-header">
          <h3 class="schedule-modal-title">Update campaign schedule</h3>
          <b-button variant="link" class="close-btn" @click="hide()">
            <SvgIcon name="close" />
          </b-button>
        </div>
        <div class="my-3">
          <ScheduleSelect
            :schedules="schedules"
            :default="campaign.schedule"
            :campaign="campaign"
            @update="setCampaignSchedule"
          />
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CampaignStepsManager from '~/components/Campaign/CampaignStepsManager'
import ScheduleSelect from '~/components/Schedule/ScheduleSelect'

import { SCHEDULE_LIST_QUERY } from '~/graphql/schedule/queries'
import { SET_CAMPAIGN_SCHEDULE_MUTATION } from '~/graphql/campaign/mutations'

export default {
  components: { CampaignStepsManager, ScheduleSelect },

  data() {
    return {
      schedules: [],
    }
  },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.viewing,
    }),
  },

  apollo: {
    schedules: {
      query: SCHEDULE_LIST_QUERY,
      variables: {
        offset: 0,
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  methods: {
    updateCampaignSteps(steps) {
      this.$store.dispatch('campaign/updateViewing', {
        ...this.campaign,
        steps,
      })
    },
    setCampaignSchedule(newSchedule) {
      this.$nuxt.$loading.start()
      this.isNextLoading = true
      this.welcomeMsg = newSchedule.title

      this.$apollo
        .mutate({
          mutation: SET_CAMPAIGN_SCHEDULE_MUTATION,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            scheduleId: parseInt(newSchedule.id, 10),
          },
        })
        .then(() => {
          this.$nuxt.$loading.finish()
          this.isNextLoading = false

          this.$store.dispatch('campaign/updateViewing', {
            ...this.campaign,
            schedule: newSchedule,
          })

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful!',
            text: 'Campaign Schedule updated successfully',
          })

          this.$bvModal.hide('UpdateCampaignScheduleModal')
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

.view-campagin-steps-page {
  margin-top: 30px;

  .timezone-btn {
    padding: 5px 25px;
    border-radius: 10px;

    .icon {
      margin-right: 5px;
    }
  }
}
.schedule-modal {
  .modal-dialog {
    width: 55% !important;
  }
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 40px;
  }

  .schedule-modal-header {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .close-btn {
      font-size: 32px;
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .schedule-modal-title {
      background-color: $primary;
      padding: 10px 40px;
      color: $white;
      border-radius: 20px;
      margin-bottom: 25px;
      font-size: 20px;
    }
  }
}
</style>
