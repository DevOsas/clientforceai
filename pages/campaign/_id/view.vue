<template>
  <div class="view-campaign-page">
    <b-container>
      <div class="view-campaign-header">
        <div class="campaign-name-input-wrap">
          <b-form-input
            :value="title"
            placeholder="Campaign Name"
            size="lg"
            autocomplete="off"
            class="campaign-name-input"
            @input="updateCampaignTitle"
            @blur="saveTitle"
          />
          <SvgIcon name="pencil" />
        </div>

        <div class="d-flex">
          <div class="email-limit-wrap">
            <div class="email-limit-label">Email Limit</div>
            <div class="email-limit-value">0 / 50</div>
          </div>

          <div class="campaign-status-switch-wrap">
            <div class="campaign-status-switch-label">
              {{ campaign.isActive ? 'Active' : 'Inactive' }}
            </div>
            <b-form-checkbox
              :checked="campaign.isActive"
              size="lg"
              switch
              @change="updateCampaignStatus()"
            />
          </div>
        </div>
      </div>

      <ViewCampaignTabs />
    </b-container>

    <Nuxt />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ViewCampaignTabs from '~/components/Campaign/ViewCampaignTabs'

import { CAMPAIGN_BY_ID_QUERY } from '~/graphql/campaign/queries'
import {
  SAVE_CAMPAIGN_TITLE_MUTATION,
  UPDATE_CAMPAIGN_STATUS_MUTATION,
} from '~/graphql/campaign/mutations'

export default {
  components: { ViewCampaignTabs },

  middleware: ['auth'],

  asyncData({ app, store, params }) {
    const {
      apolloProvider: { defaultClient },
    } = app

    return defaultClient
      .query({
        query: CAMPAIGN_BY_ID_QUERY,
        variables: {
          id: parseInt(params.id),
        },
      })
      .then(({ data }) => {
        store.dispatch('campaign/updateViewing', data.campaign)
      })
  },

  data() {
    return {
      initialTitle: '',
    }
  },

  computed: {
    ...mapState('campaign', {
      title: (state) => state.viewing.title,
      campaign: (state) => state.viewing,
    }),
  },

  methods: {
    updateCampaignTitle(title) {
      this.$store.dispatch('campaign/updateViewing', {
        ...this.campaign,
        title,
      })
    },

    async saveTitle() {
      if (this.initialTitle !== this.title && this.title !== '') {
        this.$nuxt.$loading.start()

        await this.$apollo.mutate({
          mutation: SAVE_CAMPAIGN_TITLE_MUTATION,
          variables: {
            id: parseInt(this.$route.params.id),
            title: this.title,
          },
        })

        this.$nuxt.$loading.finish()
      }
    },

    async updateCampaignStatus() {
      const newCampaignStatus = !this.campaign.isActive
      const newCampaignStatusName = newCampaignStatus ? 'active' : 'paused'

      this.$nuxt.$loading.start()

      await this.$apollo.mutate({
        mutation: UPDATE_CAMPAIGN_STATUS_MUTATION,
        variables: {
          id: this.campaign.id,
          status: newCampaignStatusName,
        },
      })

      this.$store.dispatch('campaign/updateViewing', {
        ...this.campaign,
        status: newCampaignStatus ? 'active' : 'paused',
        isActive: newCampaignStatus,
      })

      this.$nuxt.$loading.finish()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.view-campaign-page {
  padding-top: 30px;
  margin-bottom: 50px;
  min-height: 80vh;

  .view-campaign-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .campaign-name-input-wrap {
      width: 337px;
      position: relative;

      .campaign-name-input {
        background: $gray-100;
        border-radius: 5px;
        font-size: 20px;
        line-height: 24px;
        padding-right: 45px;
        border-color: transparent;
        box-shadow: 0 2px 5px 0 $gray-200;

        &::placeholder {
          color: #e0e0e0;
        }

        &:focus {
          border-color: $primary;
        }
      }

      .icon {
        top: 9px;
        right: 15px;
        font-size: 22px;
        position: absolute;
        color: #dadada;
      }
    }

    .email-limit-wrap {
      background-color: #f5f5f5;
      display: flex;
      border-radius: 4px;
      font-size: 18px;

      .email-limit-label {
        background-color: $primary;
        padding: 5px 10px;
        border-radius: 4px;
        color: $white;
      }

      .email-limit-value {
        color: $gray-600;
        padding: 5px 30px;
      }
    }

    .campaign-status-switch-wrap {
      margin-left: 15px;
      display: flex;
      align-items: center;

      .campaign-status-switch-label {
        color: $gray-600;
        margin-right: 10px;
        font-size: 1.1rem;
        min-width: 70px;
      }

      .custom-switch {
        margin-top: -5px;
      }
    }
  }
}
</style>
