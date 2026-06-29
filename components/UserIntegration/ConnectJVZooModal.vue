<template>
  <b-modal
    id="ConnectJVZooModal"
    size="md"
    modal-class="connect-jvzoo-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHide"
  >
    <template #default="{ hide }">
      <div class="connect-jvzoo-modal-header">
        <h3 class="connect-jvzoo-modal-title">Connect JVZoo</h3>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <p>
        Enter your JVZoo API Key. For guidance on obtaining your key, please
        refer to <a href="#" target="_blank">this article</a>.
      </p>
      <b-form
        class="campaign-name-form"
        method="POST"
        @submit.prevent="connect"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group
          label-for="key"
          label-size="lg"
          :state="getInputState('key')"
        >
          <b-form-input
            v-model="form.key"
            size="md"
            autofocus
            placeholder="API Key"
            autocomplete="off"
            name="key"
            :state="getInputState('key')"
            required
          />
          <b-form-invalid-feedback :state="getInputState('key')" class="mt-2">
            {{ form.errors.get('key') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <div class="text-right mt-4">
          <b-button
            variant="link"
            class="text-muted mr-1 px-4"
            pill
            @click="hide"
          >
            Cancel
          </b-button>

          <b-button type="submit" variant="primary" class="px-4" pill>
            <b-spinner v-if="form.busy" class="mr-1" small></b-spinner>
            Connect
          </b-button>
        </div>
      </b-form>
    </template>
  </b-modal>
</template>

<script>
import { CONNECT_JVZOO_MUTATION } from '~/graphql/user-integration/mutations'

export default {
  props: {},

  data() {
    return {
      form: new this.$form({ key: '' }),
    }
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    async connect(edited) {
      this.form.busy = true
      await this.$apollo
        .mutate({
          mutation: CONNECT_JVZOO_MUTATION,
          variables: { ...this.form.data() },
        })
        .then(({ data }) => {
          this.form.busy = false

          this.$auth.setUser({
            ...this.$auth.user,
            hasJVZooIntegration: true,
          })

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success!',
            text: 'JVZoo connected successfully',
          })

          this.$bvModal.hide('ConnectJVZooModal')

          this.$emit('connected', data.connectJVZoo)
        })
        .catch(({ graphQLErrors: errors, ...others }) => {
          this.form.busy = false

          for (let i = 0; i < errors.length; i++) {
            const error = errors[i]
            if (error.message === 'InvalidKey') {
              this.form.errors.set(
                'key',
                'The provided API Key seems to be invalid'
              )
            } else if (error.message === 'validation') {
              this.form.errors.set(error.extensions.validation)
            } else {
              this.$notify({
                group: 'main',
                type: 'error',
                title: 'Unable to connect',
                text: `${errors[i].message}`,
              })
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

.connect-jvzoo-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 40px 70px 40px;
  }

  .connect-jvzoo-modal-header {
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

    .connect-jvzoo-modal-title {
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
