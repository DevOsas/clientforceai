<template>
  <b-modal
    id="leadEnrichmentModal"
    size="md"
    modal-class="top-up-form-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHide"
  >
    <template #default="{ hide }">
      <div class="top-up-form-modal-header">
        <h3 class="top-up-form-modal-title">Lead Enrichment Top Up</h3>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <b-form
        class="campaign-name-form"
        method="POST"
        @submit.prevent="topUp"
        @keydown="form.onKeydown($event)"
      >
        <b-form-text id="input-live-help">Unit amount.</b-form-text>
        <b-form-input
          v-model="form.units"
          type="range"
          size="md"
          autofocus
          placeholder="Units"
          autocomplete="off"
          required
          min="1000"
          max="1000000"
          step="3000"
          aria-describedby="input-live-help input-live-feedback"
        />
        <b-form-invalid-feedback id="input-live-feedback">
          {{ amountFeedback }}
        </b-form-invalid-feedback>
        <b-form-input
          v-model="form.units"
          number
          step="1000"
          :state="form.units ? !amountFeedback : null"
          @keyup="validateInput"
        ></b-form-input>

        <h3 class="text-center my-2">${{ dollarEquivalent }}.00</h3>

        <div class="text-right mt-4">
          <b-button
            variant="link"
            class="text-muted mr-1 px-4"
            pill
            @click="hide"
          >
            Cancel
          </b-button>

          <b-button
            :disabled="form.busy"
            type="submit"
            variant="primary"
            class="px-4"
            pill
          >
            <b-spinner v-if="form.busy" class="mr-1" small />
            Continue
          </b-button>
        </div>
      </b-form>
    </template>
  </b-modal>
</template>

<script>
import { INIT_SUBSCRIPTION_PAYMENT_MUTATION } from '~/graphql/subscription/mutations'
import { SETTINGS_QUERY } from '~/graphql/subscription/queries'

export default {
  data() {
    return {
      form: new this.$form({
        units: 1000,
        action_type: 'leadEnrichment',
      }),
      amountFeedback: '',
    }
  },
  apollo: {
    getSetting: {
      query: SETTINGS_QUERY,
      variables: {
        tag: 'unitSetting',
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    dollarEquivalent() {
      const setting = this.getSetting
        ? JSON.parse(this.getSetting.options)
        : null
      return setting ? this.form.units * setting.values.leadEnrichment : 0
    },
  },
  methods: {
    async topUp() {
      this.form.busy = true
      this.form.units = Number(this.form.units)
      await this.$apollo
        .mutate({
          mutation: INIT_SUBSCRIPTION_PAYMENT_MUTATION,
          variables: this.form.data(),
        })
        .then(({ data }) => {
          this.form.busy = false
          location.href = data.initStripePayment
        })
        .catch(({ graphQLErrors: errors }) => {
          this.form.busy = false
          if (typeof errors !== 'undefined') {
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].message === 'validation') {
                this.form.errors.set(errors[i].extensions.validation)
              } else {
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'To-up Failed',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    },

    handleOnHide() {
      this.form.reset()

      this.$emit('closed')
    },

    validateInput(event) {
      if (event.target.value % 1000 !== 0) {
        this.amountFeedback =
          'Invalid input: Amount must be in multiple of 1000'
      } else {
        this.amountFeedback = null
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.top-up-form-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 40px 70px 40px;
  }

  .top-up-form-modal-header {
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

    .top-up-form-modal-title {
      background-color: $primary;
      padding: 5px 40px;
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
