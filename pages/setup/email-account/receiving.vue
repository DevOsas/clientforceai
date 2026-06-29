<template>
  <b-form
    method="POST"
    @submit.prevent="testImapConfig"
    @keydown="form.onKeydown($event)"
  >
    <h4 class="email-test" :class="recieveTestResult">Receiving emails</h4>
    <p class="mb-4">
      Enter your IMAP configurations for receiving emails.
      <a href="#">Learn more</a>
    </p>

    <b-form-group
      label="User name *"
      label-for="username"
      :state="getInputState('username')"
    >
      <b-form-input
        id="username"
        :value="form.imapSettings.username"
        type="text"
        name="username"
        trim
        required
        :state="getInputState('username')"
        @input="handleNestedChange('imapSettings', 'username', $event)"
      ></b-form-input>

      <b-form-invalid-feedback :state="getInputState('username')" class="mt-2">
        {{ form.errors.get('username') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      label="IMAP Host *"
      label-for="host"
      :state="getInputState('host')"
    >
      <b-form-input
        id="host"
        :value="form.imapSettings.host"
        type="text"
        name="host"
        trim
        required
        :state="getInputState('host')"
        @input="handleNestedChange('imapSettings', 'host', $event)"
      ></b-form-input>

      <b-form-invalid-feedback :state="getInputState('host')" class="mt-2">
        {{ form.errors.get('host') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      label="IMAP Port *"
      label-for="port"
      :state="getInputState('port')"
    >
      <b-form-input
        id="port"
        :value="form.imapSettings.port"
        type="number"
        name="port"
        max="99999"
        min="10"
        trim
        required
        :state="getInputState('port')"
        @input="handleNestedChange('imapSettings', 'port', $event)"
      ></b-form-input>

      <b-form-invalid-feedback :state="getInputState('port')" class="mt-2">
        {{ form.errors.get('port') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      label="Password *"
      label-for="imap-password"
      :state="getInputState('password')"
    >
      <b-form-input
        id="password"
        :value="form.imapSettings.password"
        type="password"
        name="password"
        trim
        required
        :state="getInputState('password')"
        @input="handleNestedChange('imapSettings', 'password', $event)"
      ></b-form-input>

      <b-form-invalid-feedback :state="getInputState('password')" class="mt-2">
        {{ form.errors.get('password') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-checkbox
      :checked="form.imapSettings.enableSsl"
      switch
      size="lg"
      @input="handleNestedChange('imapSettings', 'enableSsl', $event)"
    >
      Enable SSL
    </b-form-checkbox>

    <div class="d-flex justify-content-between align-items-center mt-5">
      <b-button
        :to="{ name: 'setup-email-account' }"
        variant="link"
        size="sm"
        class="caps-spaced text-dark"
      >
        <SvgIcon name="left-arrow" class="mr-1" />
        Back
      </b-button>

      <div>
        <b-button
          type="submit"
          variant="outline-primary"
          size="sm"
          class="px-4 mr-2"
          :disabled="isTestRunning || hasInvalidImapSettings"
        >
          <b-spinner v-if="isTestRunning" small class="mr-1" />
          <SvgIcon v-else name="paper-plane" class="mr-1" />
          <span class="label">Test IMAP configuration</span>
        </b-button>

        <b-button
          :to="{ name: 'setup-email-account-sending' }"
          variant="primary"
          size="sm"
          class="caps-spaced px-4"
          :disabled="hasInvalidImapSettings"
        >
          Next
          <SvgIcon name="right-arrow" class="ml-1" />
        </b-button>
      </div>
    </div>
  </b-form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { TEST_IMAP_CONFIGURATION_QUERY } from '~/graphql/email-account/queries'

export default {
  layout: 'setup',

  middleware: [
    'auth',
    ({ store, redirect }) => {
      if (!store.state.emailAccount.platform) {
        return redirect({ name: 'setup-email-account' })
      }
    },
  ],

  data() {
    return {
      isTestRunning: false,
      recieveTestResult: null,
    }
  },

  computed: {
    ...mapState('emailAccount', {
      form(state) {
        return new this.$form(state.form)
      },
    }),
    ...mapGetters({
      hasInvalidImapSettings: 'emailAccount/hasInvalidImapSettings',
    }),
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    handleChange(key, value) {
      this.$store.dispatch('emailAccount/updateForm', {
        ...this.form.data(),
        [key]: value,
      })
    },

    handleNestedChange(key, child, value) {
      const prop = {
        ...this.form[key],
        [child]: value,
      }

      this.handleChange(key, prop)
    },

    testImapConfig() {
      this.isTestRunning = true

      this.$apollo
        .mutate({
          mutation: TEST_IMAP_CONFIGURATION_QUERY,
          variables: {
            ...this.form.imapSettings,
            port: Number(this.form.imapSettings.port),
          },
        })
        .then(({ data }) => {
          if (data.status) {
            this.recieveTestResult = 'valid'

            this.$notify({
              group: 'main',
              type: 'success',
              title: 'IMAP configuration confirmed',
              text: 'These IMAP details has been confirmed to be valid.',
            })
          } else {
            this.recieveTestResult = 'invalid'

            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Invalid IMAP configuration',
              text: 'The IMAP details you entered seems to be invalid.',
            })
          }

          this.isTestRunning = false
        })
        .catch((error) => {
          this.isTestRunning = false

          const validations = error.graphQLErrors.filter(
            (err) => err.message === 'validation'
          )

          if (validations.length) {
            validations.forEach((err) => {
              this.form.errors.set(err.extensions.validation)
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Unable to update',
              text: 'An error occurred while processing your request.',
            })
          }
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-test {
  &.valid {
    padding-left: 10px;
    border-left: 5px solid $success;
  }
  &.invalid {
    padding-left: 10px;
    border-left: 5px solid $danger;
  }
}
</style>
