<template>
  <div class="campaign-steps-page">
    <b-container>
      <CampaignStepsManager
        :steps="campaign.steps"
        :campaign-id="campaign.id"
        @update="updateCampaignSteps"
      />
    </b-container>

    <AddCampaignFooter>
      <b-button
        variant="link"
        class="text-muted px-3 mr-2"
        @click="cancelCampaign"
      >
        Back
      </b-button>
      <b-button
        variant="primary"
        class="px-4"
        pill
        :disabled="campaign.steps.length < 1"
        @click="handleContinue"
      >
        Continue
      </b-button>
    </AddCampaignFooter>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CampaignStepsManager from '~/components/Campaign/CampaignStepsManager'
import AddCampaignFooter from '~/components/Campaign/AddCampaignFooter'

export default {
  components: { CampaignStepsManager, AddCampaignFooter },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.setup,
    }),
  },

  methods: {
    cancelCampaign() {
      this.$router.push({ name: 'campaigns' }, () => {
        this.$store.dispatch('campaign/resetSetup')
      })
    },

    handleContinue() {
      this.$router.push({
        name: 'campaign-id-setup-schedule',
        params: { id: this.campaign.id },
      })
    },

    updateCampaignSteps(steps) {
      this.$store.dispatch('campaign/updateSetup', {
        ...this.campaign,
        steps,
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-steps-page {
  padding-top: 30px;
  min-height: 80vh;
}
</style>
