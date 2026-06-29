<template>
  <div class="add-campaign-settings-page">
    <b-container>
      <CampaignSettings
        :configuration="campaign.configuration"
        @change="handleSettingsChange"
      />
    </b-container>

    <AddCampaignFooter>
      <b-button
        :to="{
          name: 'campaign-id-setup-people',
          params: { id: $route.params.id },
        }"
        variant="link"
        class="text-muted px-3 mr-2"
      >
        Back
      </b-button>
      <b-button
        :to="{
          name: 'campaign-id-setup-review',
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
        :disabled="isSaving"
        @click="handleContinue"
      >
        <b-spinner v-if="isSaving" small class="mr-1" />
        Continue
      </b-button>
    </AddCampaignFooter>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CampaignSettings from '~/components/Campaign/CampaignSettings'
import AddCampaignFooter from '~/components/Campaign/AddCampaignFooter'

import { SAVE_CAMPAIGN_CONFIGURATION_MUTATION } from '~/graphql/campaign/mutations'

export default {
  components: { CampaignSettings, AddCampaignFooter },

  data() {
    return {
      isSaving: false,
    }
  },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.setup,
    }),
  },

  methods: {
    handleSettingsChange(configuration) {
      this.$store.dispatch('campaign/updateSetup', {
        ...this.campaign,
        configuration: { ...configuration },
      })
    },

    handleContinue() {
      this.isSaving = true
      this.$nuxt.$loading.start()
      // Save the settings..
      const config = {
        ...this.campaign.configuration,
        campaign_id: this.campaign.id,
      }

      this.$apollo
        .mutate({
          mutation: SAVE_CAMPAIGN_CONFIGURATION_MUTATION,
          variables: config,
        })
        .then(() => {
          this.$router.push(
            {
              name: 'campaign-id-setup-review',
              params: { id: this.campaign.id },
            },
            () => {
              this.isSaving = false
              this.$nuxt.$loading.finish()
            }
          )
        })
        .catch(() => {
          this.isSaving = false
          this.$nuxt.$loading.finish()

          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to save',
            text: `Unable to save campaign settings.`,
          })
        })
    },

    // formatStepTime,
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-campaign-settings-page {
  padding-top: 50px;
}
</style>
