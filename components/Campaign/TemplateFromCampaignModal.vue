<template>
  <b-modal
    id="TemplateFromCampaignModal"
    centered
    hide-header
    hide-footer
    modal-class="template-from-campaign-modal"
    content-class="px-4 py-3"
    @hidden="resetCampaignTemplate"
  >
    <template #default="{ hide }">
      <h5 class="mb-4 text-center">Save campaign as template</h5>

      <b-form
        method="POST"
        @submit.prevent="saveCampaignAsTemplate"
        @keydown="templateForm.onKeydown($event)"
      >
        <b-form-group label="Campaign template title" label-for="title">
          <b-form-input
            id="title"
            v-model="templateForm.title"
            placeholder="Campaign template title"
            autocomplete="off"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Campaign template description"
          label-for="description"
        >
          <b-form-textarea
            id="description"
            v-model="templateForm.description"
            placeholder="Campaign template description"
            required
          ></b-form-textarea>
        </b-form-group>

        <div class="text-right">
          <b-button
            variant="link"
            class="text-dark px-4 mr-1"
            pill
            @click="hide"
          >
            Cancel
          </b-button>
          <b-button type="submit" variant="primary" class="px-4" pill>
            <b-spinner v-if="templateForm.busy" class="mr-1" small />
            <SvgIcon name="check" class="mr-1" />
            Save
          </b-button>
        </div>
      </b-form>
    </template>
  </b-modal>
</template>

<script>
import { CREATE_TEMPLATE_FROM_CAMPAIGN_MUTATION } from '~/graphql/campaign/mutations'

export default {
  props: {
    campaign: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data() {
    return {
      templateForm: new this.$form({
        id: this.campaign.id,
        title: this.campaign.title || '',
        description: '',
        icon: null,
        valid: false,
      }),
    }
  },

  watch: {
    campaign(campaign) {
      this.templateForm.id = campaign.id
      this.templateForm.title = campaign.title
    },
  },

  methods: {
    resetCampaignTemplate() {
      this.templateForm.reset()

      this.$emit('reset')
    },

    saveCampaignAsTemplate() {
      this.templateForm.busy = true
      this.$nuxt.$loading.start()

      const templateForm = this.templateForm
      this.$apollo
        .mutate({
          mutation: CREATE_TEMPLATE_FROM_CAMPAIGN_MUTATION,
          variables: {
            campaignId: templateForm.id,
            title: templateForm.title,
            description: templateForm.description,
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation Successful',
            text: 'Campaign saved as template successfully',
          })

          this.$bvModal.hide('TemplateFromCampaignModal')

          this.templateForm.busy = false
          this.$nuxt.$loading.finish()
          this.resetCampaignTemplate()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'An error occured',
            text: `An error occured while saving campaign as template`,
          })

          this.templateForm.busy = false
          this.$nuxt.$loading.finish()
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.template-from-campaign-modal {
  .form-group {
    margin-bottom: 20px;

    .form-control {
      border-color: $gray-200;
      box-shadow: 0 2px 5px 0 $gray-200;
      border-radius: 0.3rem;

      &:focus {
        border-color: $primary;
      }

      &::placeholder {
        color: $gray-400;
      }
    }
  }
}
</style>
