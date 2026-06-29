<template>
  <div class="provider-form">
    <b-form-checkbox
      :checked="form.useDifferentEmailServers"
      switch
      size="lg"
      class="mb-4"
      @input="handleChange('useDifferentEmailServers', $event)"
    >
      Use different email servers for sending and receiving emails
    </b-form-checkbox>

    <template v-if="!form.useDifferentEmailServers">
      <b-row>
        <b-col>
          <b-form-group
            label="Email *"
            label-for="email"
            :state="getInputState('name')"
          >
            <b-form-input
              id="email"
              :value="form.email"
              type="email"
              name="email"
              required
              :state="getInputState('name')"
              trim
              @input="handleChange('email', $event)"
            ></b-form-input>

            <b-form-invalid-feedback
              :state="getInputState('email')"
              class="mt-2"
            >
              {{ form.errors.get('email') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            label="Sender name *"
            label-for="name"
            :state="getInputState('name')"
          >
            <b-form-input
              id="name"
              :value="form.name"
              type="text"
              name="name"
              required
              :state="getInputState('name')"
              trim
              @input="handleChange('name', $event)"
            ></b-form-input>

            <b-form-invalid-feedback
              :state="getInputState('name')"
              class="mt-2"
            >
              {{ form.errors.get('name') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-form-checkbox
            :checked="form.useDifferentAccountName"
            switch
            size="lg"
            class="mt-4"
            @input="handleChange('useDifferentAccountName', $event)"
          >
            Use different Account name
          </b-form-checkbox>
        </b-col>
        <b-col>
          <b-form-group
            v-if="form.useDifferentAccountName"
            label="User name *"
            label-for="username"
            :state="getInputState('username')"
          >
            <b-form-input
              id="username"
              :value="form.username"
              type="text"
              name="username"
              required
              :state="getInputState('username')"
              trim
              @input="handleChange('username', $event)"
            ></b-form-input>

            <b-form-invalid-feedback
              :state="getInputState('username')"
              class="mt-2"
            >
              {{ form.errors.get('username') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
      </b-row>
    </template>

    <b-row class="mt-5">
      <b-col>
        <div class="d-flex justify-content-between mb-2">
          <h4 class="email-test" :class="recieveTest.result">
            Receiving emails
          </h4>

          <b-button
            variant="outline-primary"
            size="sm"
            class="px-3"
            @click.prevent="testReceivingEmails()"
          >
            <b-spinner v-if="recieveTest.loading" small class="mr-1" />
            <SvgIcon v-else name="paper-plane" />
            <span class="label">Test</span>
          </b-button>
        </div>

        <b-form-group
          v-if="form.useDifferentEmailServers"
          label="User name *"
          label-for="imap-username"
        >
          <b-form-input
            id="imap-username"
            :value="form.imapSettings.username"
            type="text"
            name="imap-username"
            required
            trim
            @change="handleNestedChange('imapSettings', 'username', $event)"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="IMAP Host" label-for="imap-host">
          <b-form-input
            id="imap-host"
            :value="form.imapSettings.host"
            type="text"
            name="imap-host"
            required
            trim
            @change="handleNestedChange('imapSettings', 'host', $event)"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="IMAP Port" label-for="imap-port">
          <b-form-input
            id="imap-port"
            :value="form.imapSettings.port"
            type="number"
            name="imap-port"
            required
            max="99999"
            min="10"
            trim
            @change="handleNestedChange('imapSettings', 'port', $event)"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password" label-for="imap-password">
          <b-form-input
            id="imap-password"
            :value="form.imapSettings.password"
            type="password"
            name="imap-password"
            required
            trim
            @change="handleNestedChange('imapSettings', 'password', $event)"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox
          :checked="form.imapSettings.enableSsl"
          switch
          size="lg"
          @change="handleNestedChange('imapSettings', 'enableSsl', $event)"
        >
          Enable SSL
        </b-form-checkbox>
      </b-col>
      <b-col>
        <div class="d-flex justify-content-between mb-2">
          <h4 class="email-test" :class="sendTest.result">Sending emails</h4>

          <b-button
            variant="outline-primary"
            size="sm"
            class="px-3"
            @click.prevent="testSendingEmails()"
          >
            <b-spinner v-if="sendTest.loading" small class="mr-1" />
            <SvgIcon v-else name="paper-plane" />
            <span class="label">Test</span>
          </b-button>
        </div>

        <template v-if="form.useDifferentEmailServers">
          <b-form-group
            v-if="form.useDifferentEmailServers"
            label="Email *"
            label-for="smtp-email"
          >
            <b-form-input
              id="smtp-email"
              :value="form.smtpSettings.email"
              type="email"
              name="smtp-email"
              required
              trim
              @change="handleNestedChange('smtpSettings', 'email', $event)"
            ></b-form-input>
          </b-form-group>

          <div
            v-if="!enableSmtpUsername"
            class="enable-smtp-username-checkbox mb-3 mr-2"
          >
            <b-form-checkbox
              id="enable-smtp-username"
              v-model="enableSmtpUsername"
              name="enable-smtp-username"
            >
              My email account username is different from my email address
            </b-form-checkbox>
          </div>
          <b-form-group
            v-if="enableSmtpUsername"
            label="User name *"
            label-for="smtp-username"
          >
            <b-form-input
              id="smtp-username"
              :value="form.smtpSettings.username"
              name="smtp-username"
              required
              trim
              @change="handleNestedChange('smtpSettings', 'username', $event)"
            ></b-form-input>
          </b-form-group>

          <div v-if="!enableReplyTo" class="enable-replyTo-checkbox mb-3 mr-2">
            <b-form-checkbox
              id="enable-replyTo"
              v-model="enableReplyTo"
              name="enable-smtp-reply-to"
            >
              Replies should go to a different email address
            </b-form-checkbox>
          </div>
          <b-form-group
            v-if="enableReplyTo"
            label="Reply To"
            label-for="smtp-reply-to"
          >
            <b-form-input
              id="smtp-reply-to"
              :value="form.smtpSettings.replyToEmail"
              name="smtp-reply-to"
              required
              trim
              @change="
                handleNestedChange('smtpSettings', 'replyToEmail', $event)
              "
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Sender name *" label-for="smtp-sender-name">
            <b-form-input
              id="smtp-sender-name"
              :value="form.smtpSettings.senderName"
              name="smtp-sender-name"
              required
              trim
              @change="handleNestedChange('smtpSettings', 'senderName', $event)"
            ></b-form-input>
          </b-form-group>
        </template>

        <b-form-group label="SMTP Host" label-for="smtp-host">
          <b-form-input
            id="smtp-host"
            :value="form.smtpSettings.host"
            name="smtp-host"
            required
            trim
            @change="handleNestedChange('smtpSettings', 'host', $event)"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="SMTP Port" label-for="smtp-port">
          <b-form-input
            id="smtp-port"
            :value="form.smtpSettings.port"
            type="number"
            name="smtp-port"
            required
            max="99999"
            min="10"
            trim
            @change="handleNestedChange('smtpSettings', 'port', $event)"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password" label-for="smtp-password">
          <b-form-input
            id="smtp-password"
            :value="form.smtpSettings.password"
            type="password"
            name="smtp-password"
            required
            trim
            @change="handleNestedChange('smtpSettings', 'password', $event)"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox
          :checked="form.smtpSettings.enableSsl"
          switch
          size="lg"
          @change="handleNestedChange('smtpSettings', 'enableSsl', $event)"
        >
          Enable SSL
        </b-form-checkbox>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  TEST_SMTP_CONFIGURATION_QUERY,
  TEST_IMAP_CONFIGURATION_QUERY,
} from '~/graphql/email-account/queries'

export default {
  props: {
    form: {
      type: Object,
      required: true,
    },
  },

  data() {
    const isUsernameEnabled = !!this.form.smtpSettings.username
    const isReplyToEnabled = !!this.form.smtpSettings.replyToEmail

    return {
      enableSmtpUsername: isUsernameEnabled,
      enableReplyTo: isReplyToEnabled,
      tests: {
        sending: {
          loading: false,
          result: null,
        },
        receiving: {
          loading: false,
          result: null,
        },
      },
    }
  },

  computed: {
    sendTest() {
      return this.tests.sending
    },

    recieveTest() {
      return this.tests.receiving
    },
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    setStatus(type, result, loading = false) {
      this.tests[type] = {
        result,
        loading,
      }

      if (!loading) {
        const which = type === 'receiving' ? 'IMAP' : 'SMTP'
        this.$notify({
          group: 'main',
          type: result === 'invalid' ? 'native-eroor' : 'native',
          text:
            result === 'invalid'
              ? `Invalid ${which} settings`
              : `Your ${which} details are valid!`,
        })
      }
    },

    handleChange(key, value) {
      if (key === 'useDifferentEmailServers') {
        if (!this.form.smtpSettings.email) {
          this.$emit('change', {
            key: 'smtpSettings',
            value: {
              ...this.form.smtpSettings,
              email: this.form.email,
            },
          })
        }

        if (!this.form.smtpSettings.username && this.form.username) {
          this.enableSmtpUsername = true

          this.$emit('change', {
            key: 'smtpSettings',
            value: {
              ...this.form.smtpSettings,
              username: this.form.username,
            },
          })
        }
        if (!this.form.smtpSettings.senderName) {
          this.$emit('change', {
            key: 'smtpSettings',
            value: {
              ...this.form.smtpSettings,
              senderName: this.form.name,
            },
          })
        }

        if (!this.form.imapSettings.username) {
          this.$emit('change', {
            key: 'imapSettings',
            value: {
              ...this.form.imapSettings,
              username: this.form.email,
            },
          })
        }
      }

      this.$emit('change', { key, value })
    },

    handleNestedChange(key, child, value) {
      const prop = {
        ...this.form[key],
        [child]: value,
      }

      this.handleChange(key, prop)
    },

    async testReceivingEmails() {
      this.setStatus('receiving', '', true)

      const { data } = await this.$apollo.mutate({
        mutation: TEST_IMAP_CONFIGURATION_QUERY,
        variables: {
          ...this.form.imapSettings,
          port: this.form.imapSettings.port ? Number(this.form.imapSettings.port) : null,
          username: this.form.useDifferentAccountName
            ? this.form.username
            : this.form.email,
        },
      })

      const result = data.status ? 'valid' : 'invalid'
      this.setStatus('receiving', result, false)
    },

    async testSendingEmails() {
      this.setStatus('sending', '', true)

      const { data } = await this.$apollo.mutate({
        mutation: TEST_SMTP_CONFIGURATION_QUERY,
        variables: {
          ...this.form.smtpSettings,
          port: this.form.smtpSettings.port ? Number(this.form.smtpSettings.port) : null,
          email: this.form.email,
          senderName: this.form.useDifferentEmailServers
            ? this.form.smtpSettings.senderName
            : this.form.name,
          username: this.form.useDifferentAccountName
            ? this.form.username
            : this.form.email,
        },
      })

      const result = data.status ? 'valid' : 'invalid'
      this.setStatus('sending', result, false)
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
