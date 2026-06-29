<template>
  <b-modal
    id="NewCampaignNameModal"
    size="md"
    modal-class="new-campaign-name-modal"
    hide-header
    hide-footer
    centered
  >
    <template #default="{ hide }">
      <div class="new-campaign-name-modal-header">
        <h3 class="new-campaign-name-modal-title">Create campaign</h3>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <b-form
        class="campaign-name-form"
        method="POST"
        @submit.prevent="createCampaign"
        @keydown="form.onKeydown($event)"
      >
        <b-form-input
          v-model="form.title"
          size="lg"
          autofocus
          placeholder="Camapign name"
          autocomplete="off"
          required
        />

        <div class="text-right mt-4">
          <b-button type="submit" variant="primary" class="px-4" pill>
            <b-spinner v-if="form.busy" class="mr-1" small></b-spinner>
            Continue
            <SvgIcon name="arrow-right" class="ml-1" />
          </b-button>
        </div>
      </b-form>
    </template>
  </b-modal>
</template>

<script>
import { CREATE_CAMPAIGN_MUTATION } from '~/graphql/campaign/mutations'

export default {
  data() {
    return {
      form: new this.$form({ title: '' }),
    }
  },

  methods: {
    createCampaign() {
      this.form.busy = true

      this.$apollo
        .mutate({
          mutation: CREATE_CAMPAIGN_MUTATION,
          variables: {
            title: this.form.title,
          },
        })
        .then(({ data }) => {
          this.$store.dispatch('addCampaign/updateCampaign', data.campaign)
          this.$router.push(
            {
              name: 'campaign-id-setup-steps',
              params: { id: data.campaign.id },
            },
            () => {
              this.form.busy = false
            }
          )
        })
        .catch(() => {
          this.form.busy = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.new-campaign-name-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 50px 70px 50px;
  }

  .new-campaign-name-modal-header {
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

    .new-campaign-name-modal-title {
      background-color: $primary;
      padding: 10px 40px;
      color: $white;
      border-radius: 5px;
      margin-bottom: 25px;
      font-size: 20px;
    }
  }

  .campaign-name-form {
    .form-control {
      border-color: $gray-200;
      box-shadow: 0 2px 5px 0 $gray-200;
      border-radius: 0.3rem;

      &:focus {
        border-color: $primary;
      }

      &.is-invalid {
        border-color: lighten($danger, 40);
      }
      &::placeholder {
        color: $gray-400;
      }
    }
  }
}
</style>
