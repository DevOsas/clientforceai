<template>
  <div class="view-campagin-settings-page">
    <b-container>
      <CampaignSettings
        :configuration="campaign.configuration"
        @change="handleSettingsChange"
      />

      <div class="text-center mt-5">
        <b-button
          variant="settings-save"
          :disabled="isSaving"
          @click="handleUpdateSettings"
        >
          <b-spinner v-if="isSaving" small class="mr-1" />
          <SvgIcon name="save" />
          Save Settings
        </b-button>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CampaignSettings from '~/components/Campaign/CampaignSettings'

import { SAVE_CAMPAIGN_CONFIGURATION_MUTATION } from '~/graphql/campaign/mutations'

export default {
  components: { CampaignSettings },

  data() {
    return {
      isSaving: false,
    }
  },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.viewing,
    }),
  },

  methods: {
    handleSettingsChange(configuration) {
      this.$store.dispatch('campaign/updateViewing', {
        ...this.campaign,
        configuration: { ...configuration },
      })
    },
    handleUpdateSettings() {
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
          this.isSaving = false
          this.$nuxt.$loading.finish()
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: `Settings Updated Successfully.`,
          })
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
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.view-campagin-settings-page {
  margin-top: 30px;

  .btn-settings-save {
    background-color: #c2fdb9;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    text-transform: uppercase;
    padding: 10px 30px;
    font-size: 20px;

    .icon {
      margin-right: 7px;
    }
  }
}
</style>
