<template>
  <b-modal
    id="topUpModal"
    size="md"
    modal-class="top-up-form-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHide"
  >
    <template #default="{ hide }">
      <div class="top-up-form-modal-header">
        <h3 class="top-up-form-modal-title">Top Up Account</h3>
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
        <b-form-input
          v-model="form.amount"
          size="md"
          autofocus
          placeholder="Amount in USD"
          autocomplete="off"
          required
          type="number"
        />

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
            Submit
          </b-button>
        </div>
      </b-form>
    </template>
  </b-modal>
</template>

<script>
import { TOP_UP_MUTATION } from '~/graphql/units/mutations'

export default {
  props: {
    unitBalance: {
      type: Object,
      required: true,
    },
    creditUnitTransactions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: new this.$form({ amount: null }),
    }
  },

  methods: {
    async topUp() {
      this.form.busy = true
      await this.$apollo
        .mutate({
          mutation: TOP_UP_MUTATION,
          variables: this.form.data(),
        })
        .then(({ data }) => {
          this.form.busy = false

          this.$bvModal.hide('topUpModal')

          this.creditUnitTransactions.refetch()
          this.unitBalance.refetch()
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
