import { GET_MICROSOFT_OAUTH_URL_QUERY } from '~/graphql/email-account/oauth'

export default {
  data() {
    return {
      oauthWindow: null,
      oauthLoading: false,
    }
  },

  beforeDestroy() {
    // Clean up event listener
    if (process.client) {
      window.removeEventListener('message', this.handleOAuthMessage)
    }
  },

  methods: {
    /**
     * Initiate Microsoft OAuth2 flow
     */
    async connectMicrosoftAccount() {
      try {
        this.oauthLoading = true

        // Get OAuth URL from backend
        const { data } = await this.$apollo.query({
          query: GET_MICROSOFT_OAUTH_URL_QUERY,
          fetchPolicy: 'network-only',
        })

        if (!data || !data.url) {
          throw new Error('Failed to get OAuth URL')
        }

        // Open popup window
        const width = 600
        const height = 700
        const left = window.screen.width / 2 - width / 2
        const top = window.screen.height / 2 - height / 2

        this.oauthWindow = window.open(
          data.url,
          'Microsoft OAuth',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
        )

        // Listen for messages from popup
        window.addEventListener('message', this.handleOAuthMessage)

        // Check if popup was blocked
        if (!this.oauthWindow || this.oauthWindow.closed) {
          throw new Error('Popup was blocked. Please allow popups for this site.')
        }

        // Monitor popup closure
        const checkClosed = setInterval(() => {
          if (this.oauthWindow && this.oauthWindow.closed) {
            clearInterval(checkClosed)
            this.oauthLoading = false
            window.removeEventListener('message', this.handleOAuthMessage)
          }
        }, 500)
      } catch (error) {
        console.error('OAuth error:', error)
        this.oauthLoading = false

        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Connection Failed',
          text: error.message || 'Failed to connect Microsoft account',
        })
      }
    },

    /**
     * Handle messages from OAuth popup
     */
    handleOAuthMessage(event) {
      // Verify origin
      if (event.origin !== window.location.origin) {
        return
      }

      const { type, emailAccount, error } = event.data

      if (type === 'microsoft-oauth-success') {
        this.oauthLoading = false

        this.$notify({
          group: 'main',
          type: 'success',
          title: 'Account Connected',
          text: `Successfully connected ${emailAccount.email}`,
        })

        // Close popup
        if (this.oauthWindow) {
          this.oauthWindow.close()
        }

        // Refresh email accounts list
        if (this.refreshEmailAccounts) {
          this.refreshEmailAccounts()
        }

        // Emit event for parent component
        this.$emit('oauth-success', emailAccount)
      } else if (type === 'microsoft-oauth-error') {
        this.oauthLoading = false

        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Connection Failed',
          text: error || 'Failed to connect Microsoft account',
        })

        // Close popup
        if (this.oauthWindow) {
          this.oauthWindow.close()
        }

        // Emit event for parent component
        this.$emit('oauth-error', error)
      }
    },

    /**
     * Refresh email accounts list (to be implemented by parent component)
     */
    refreshEmailAccounts() {
      // Override this method in parent component
      console.log('refreshEmailAccounts not implemented')
    },
  },
}
