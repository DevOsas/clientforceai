<template>
  <b-form
    method="POST"
    @submit.prevent="testSmtpConfig"
    @keydown="form.onKeydown($event)"
  >
    <h4 class="email-test" :class="smtpTestResult">Sending emails</h4>
    <p class="mb-4">
      Enter your SMTP configuration to be used when sending emails.
      <a href="#">Learn more</a>
    </p>

    <b-form-row>
      <b-col>
        <b-form-group
          label="Email *"
          label-for="email"
          :state="getInputState('email')"
        >
          <b-form-input
            id="email"
            :value="form.smtpSettings.email"
            type="email"
            name="email"
            trim
            required
            :state="getInputState('email')"
            @input="handleNestedChange('smtpSettings', 'email', $event)"
          ></b-form-input>

          <b-form-invalid-feedback :state="getInputState('email')" class="mt-2">
            {{ form.errors.get('email') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group
          label="User name"
          label-for="username"
          :state="getInputState('username')"
        >
          <b-form-input
            id="username"
            :value="form.smtpSettings.username"
            name="username"
            placeholder="Optional"
            trim
            :state="getInputState('username')"
            @input="handleNestedChange('smtpSettings', 'username', $event)"
          ></b-form-input>

          <b-form-invalid-feedback
            :state="getInputState('username')"
            class="mt-2"
          >
            {{ form.errors.get('username') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>

    <b-form-row>
      <b-col>
        <b-form-group
          label="Sender name *"
          label-for="sender-name"
          :state="getInputState('senderName')"
        >
          <b-form-input
            id="sender-name"
            :value="form.smtpSettings.senderName"
            name="sender-name"
            trim
            required
            :state="getInputState('senderName')"
            @input="handleNestedChange('smtpSettings', 'senderName', $event)"
          ></b-form-input>

          <b-form-invalid-feedback
            :state="getInputState('senderName')"
            class="mt-2"
          >
            {{ form.errors.get('senderName') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group
          label="Reply-to email"
          label-for="reply-to"
          :state="getInputState('replyToEmail')"
        >
          <b-form-input
            id="reply-to"
            :value="form.smtpSettings.replyToEmail"
            type="email"
            name="reply-to"
            placeholder="Optional"
            trim
            :state="getInputState('replyToEmail')"
            @input="handleNestedChange('smtpSettings', 'replyToEmail', $event)"
          ></b-form-input>

          <b-form-invalid-feedback
            :state="getInputState('replyToEmail')"
            class="mt-2"
          >
            {{ form.errors.get('replyToEmail') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>

    <b-form-row>
      <b-col>
        <b-form-group
          label="SMTP Host *"
          label-for="host"
          :state="getInputState('host')"
        >
          <b-form-input
            id="host"
            :value="form.smtpSettings.host"
            name="host"
            trim
            required
            :state="getInputState('host')"
            @input="handleNestedChange('smtpSettings', 'host', $event)"
          ></b-form-input>

          <b-form-invalid-feedback :state="getInputState('host')" class="mt-2">
            {{ form.errors.get('host') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group
          label="SMTP Port *"
          label-for="port"
          :state="getInputState('port')"
        >
          <b-form-input
            id="port"
            :value="form.smtpSettings.port"
            type="number"
            name="port"
            max="99999"
            min="10"
            trim
            required
            :state="getInputState('port')"
            @input="handleNestedChange('smtpSettings', 'port', $event)"
          ></b-form-input>

          <b-form-invalid-feedback :state="getInputState('port')" class="mt-2">
            {{ form.errors.get('port') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-col>
    </b-form-row>

    <b-form-group
      label="Password *"
      label-for="smtp-password"
      :state="getInputState('password')"
    >
      <b-form-input
        id="smtp-password"
        :value="form.smtpSettings.password"
        type="password"
        name="smtp-password"
        trim
        required
        :state="getInputState('password')"
        @input="handleNestedChange('smtpSettings', 'password', $event)"
      ></b-form-input>

      <b-form-invalid-feedback :state="getInputState('password')" class="mt-2">
        {{ form.errors.get('password') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-checkbox
      :checked="form.smtpSettings.enableSsl"
      switch
      size="lg"
      class="mt-4"
      @input="handleNestedChange('smtpSettings', 'enableSsl', $event)"
    >
      Enable SSL
    </b-form-checkbox>

    <div class="d-flex justify-content-between align-items-center mt-5">
      <b-button
        :to="{ name: 'setup-email-account-receiving' }"
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
          :disabled="isTestRunning || hasInvalidSmtpSettings"
        >
          <b-spinner v-if="isTestRunning" small class="mr-1" />
          <SvgIcon v-else name="paper-plane" class="mr-1" />
          <span class="label">Test SMTP configuration</span>
        </b-button>

        <b-button
          variant="primary"
          size="sm"
          class="caps-spaced px-4"
          :disabled="hasInvalidSmtpSettings"
          @click="saveEmailAccount"
        >
          <b-spinner v-if="savingEmailAccount" small class="mr-1" />
          Finish Setup
          <SvgIcon name="right-arrow" class="ml-1" />
        </b-button>
      </div>
    </div>
  </b-form>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { normalizeEmailAccountPorts } from '~/utils/portNormalizer'
import { TEST_SMTP_CONFIGURATION_QUERY } from '~/graphql/email-account/queries'
import { SAVE_EMAIL_ACCOUNT_MUTATION } from '~/graphql/email-account/mutations'

export default {
  layout: 'setup',

  middleware: [
    'auth',
    ({ store, redirect }) => {
      if (store.getters['emailAccount/hasInvalidImapSettings']) {
        return redirect({ name: 'setup-email-account-receiving' })
      }
    },
  ],

  data() {
    return {
      isTestRunning: false,
      smtpTestResult: null,
      savingEmailAccount: false,
    }
  },

  computed: {
    ...mapState('emailAccount', {
      form(state) {
        return new this.$form(state.form)
      },
    }),

    ...mapGetters({
      hasInvalidSmtpSettings: 'emailAccount/hasInvalidSmtpSettings',
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
      if (child === 'email') {
        this.handleChange('email', value)
      }

      if (child === 'senderName') {
        this.handleChange('name', value)
      }

      const prop = {
        ...this.form[key],
        [child]: value,
      }

      this.handleChange(key, prop)
    },

    testSmtpConfig(test) {
      this.isTestRunning = true

      this.$apollo
        .mutate({
          mutation: TEST_SMTP_CONFIGURATION_QUERY,
          variables: {
            ...this.form.smtpSettings,
            port: Number(this.form.smtpSettings.port),
          },
        })
        .then(({ data }) => {
          if (data.status) {
            this.smtpTestResult = 'valid'

            this.$notify({
              group: 'main',
              type: 'success',
              title: 'SMTP configuration confirmed',
              text: 'These SMTP details has been confirmed to be valid.',
            })
          } else {
            this.smtpTestResult = 'invalid'

            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Invalid SMTP configuration',
              text: 'The SMTP details you entered seems to be invalid.',
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

    saveEmailAccount() {
      this.savingEmailAccount = true

      this.$apollo
        .mutate({
          mutation: SAVE_EMAIL_ACCOUNT_MUTATION,
          variables: normalizeEmailAccountPorts(this.form.data()),
        })
        .then(({ data }) => {
          if (data.emailAccount) {
            this.$auth.setUser({
              ...this.$auth.user,
              defaultEmailAccount: data.emailAccount,
            })

            this.$router.push({ name: 'dashboardv2' })
          }

          this.savingEmailAccount = false
        })
        .catch((error) => {
          this.savingEmailAccount = false

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
