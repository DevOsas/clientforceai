<template>
  <div class="setup-email-account">
    <h3 class="mb-3">Set up an email account</h3>
    <p class="text-muted mb-4">
      Set up an email account to be used in sending out emails and proposals
    </p>

    <EmailPlatformSelect :value="platform" @input="updatePlatform" />

    <!-- Microsoft OAuth2 Quick Connect -->
    <div v-if="platform === 'outlook' || platform === 'exchange'" class="mt-4">
      <div class="alert alert-info">
        <h5 class="mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 23 23"
            class="mr-2"
            style="vertical-align: middle;"
          >
            <rect x="1" y="1" width="10" height="10" fill="#f25022" />
            <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
            <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
            <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
          </svg>
          Quick Connect with OAuth2
        </h5>
        <p class="mb-3">
          Microsoft requires OAuth2 authentication for security. Click below to connect your account securely in seconds.
        </p>
        <MicrosoftOAuthButton
          @oauth-success="handleOAuthSuccess"
          @oauth-error="handleOAuthError"
        />
      </div>
      <p class="text-center my-3 text-muted">
        <strong>OR</strong> continue with manual setup
      </p>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-5">
      <b-button
        :to="{ name: 'setup-business' }"
        variant="link"
        size="sm"
        class="caps-spaced text-dark"
      >
        <SvgIcon name="left-arrow" class="mr-1" />
        Previous step
      </b-button>
      <div>
        <b-button
          variant="primary"
          size="sm"
          class="caps-spaced px-4"
          :disabled="!platform"
          @click="setEmailProvider"
        >
          Continue
          <SvgIcon name="right-arrow" class="ml-1" />
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import EmailPlatformSelect from '~/components/General/EmailPlatformSelect'
import MicrosoftOAuthButton from '~/components/EmailAccount/MicrosoftOAuthButton'

export default {
  components: {
    EmailPlatformSelect,
    MicrosoftOAuthButton,
  },

  layout: 'setup',

  middleware: 'auth',

  computed: {
    ...mapState('emailAccount', {
      platform: (state) => state.platform,
    }),
  },

  created() {
    // Sync email form with default email account
    const { defaultEmailAccount } = this.$auth.user

    if (defaultEmailAccount) {
      this.updatePlatform(defaultEmailAccount.type)

      const form = { ...this.$store.state.emailAccount.form }

      for (const key in form) {
        if (defaultEmailAccount[key]) {
          form[key] = defaultEmailAccount[key]
        }
      }

      this.$store.dispatch('emailAccount/updateForm', form)
    }
  },

  methods: {
    updatePlatform(provider) {
      this.$store.dispatch('emailAccount/updatePlatform', provider)
    },

    setEmailProvider() {
      if (this.platform === 'gmail') {
        window.location = `${this.$config.APIRoot}/EmailAccount/ConnectWithGMailAsync?next=/dashboardv2`
      } else {
        this.$router.push({ name: 'setup-email-account-receiving' })
      }
    },

    handleOAuthSuccess(emailAccount) {
      // OAuth connection successful, redirect to dashboard
      this.$notify({
        group: 'main',
        type: 'success',
        title: 'Success!',
        text: `Successfully connected ${emailAccount.email}`,
      })
      this.$router.push({ name: 'dashboardv2' })
    },

    handleOAuthError(error) {
      // Error already shown in notification from mixin
      console.error('OAuth error:', error)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.setup-email-account {
  .alert-info {
    border-left: 4px solid #0078d4;
    
    h5 {
      color: #0078d4;
      font-weight: 600;
    }
  }
}
</style>
