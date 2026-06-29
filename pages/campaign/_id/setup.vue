<template>
  <div class="add-campaign-page">
    <div class="add-campaign-header">
      <b-container>
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
      </b-container>
    </div>

    <Nuxt />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { CAMPAIGN_BY_ID_QUERY } from '~/graphql/campaign/queries'
import { SAVE_CAMPAIGN_TITLE_MUTATION } from '~/graphql/campaign/mutations'

export default {
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
        store.dispatch('campaign/updateSetup', data.campaign)
      })
  },

  data() {
    return {
      initialTitle: '',
    }
  },

  computed: {
    ...mapState('campaign', {
      title: (state) => state.setup.title,
    }),
  },

  beforeCreate() {
    this.$store.dispatch('layout/hideFooter')
  },

  created() {
    this.initialTitle = this.title
  },

  beforeDestroy() {
    this.initialTitle = ''

    this.$store.dispatch('layout/showFooter')

    this.$store.dispatch('campaign/resetSetup')
  },

  methods: {
    updateCampaignTitle(title) {
      this.$store.dispatch('campaign/updateSetup', {
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
            id: this.$route.params.id,
            title: this.title,
          },
        })

        this.$nuxt.$loading.finish()
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-campaign-page {
  padding-top: 30px;
  padding-bottom: 100px;
  min-height: 80vh;

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
}
</style>
