<template>
  <div class="oauth-callback-container">
    <div class="text-center py-5">
      <div v-if="loading">
        <b-spinner variant="primary" label="Processing..."></b-spinner>
        <p class="mt-3">Completing Microsoft authentication...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger">
        <h4>Authentication Failed</h4>
        <p>{{ error }}</p>
        <b-button variant="primary" @click="closeWindow">Close</b-button>
      </div>
      
      <div v-else-if="success" class="alert alert-success">
        <h4>Success!</h4>
        <p>Your Microsoft account has been connected.</p>
        <p class="small">This window will close automatically...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { COMPLETE_MICROSOFT_OAUTH_MUTATION } from '~/graphql/email-account/oauth'

export default {
  layout: 'blank',
  
  data() {
    return {
      loading: true,
      error: null,
      success: false,
    }
  },

  mounted() {
    this.handleCallback()
  },

  methods: {
    async handleCallback() {
      try {
        // Get code and state from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const state = urlParams.get('state')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        // Check for OAuth errors
        if (error) {
          this.error = errorDescription || error
          this.loading = false
          return
        }

        // Validate required parameters
        if (!code || !state) {
          this.error = 'Missing authorization code or state parameter'
          this.loading = false
          return
        }

        // Complete OAuth flow
        const { data } = await this.$apollo.mutate({
          mutation: COMPLETE_MICROSOFT_OAUTH_MUTATION,
          variables: {
            code,
            state,
          },
        })

        if (data && data.emailAccount) {
          this.success = true
          this.loading = false

          // Notify parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'microsoft-oauth-success',
                emailAccount: data.emailAccount,
              },
              window.location.origin
            )
          }

          // Close window after 2 seconds
          setTimeout(() => {
            window.close()
          }, 2000)
        } else {
          this.error = 'Failed to create email account'
          this.loading = false
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        
        this.error = error.message || 'An unexpected error occurred'
        this.loading = false

        // Notify parent window of error
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'microsoft-oauth-error',
              error: this.error,
            },
            window.location.origin
          )
        }
      }
    },

    closeWindow() {
      window.close()
    },
  },
}
</script>

<style scoped>
.oauth-callback-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}
</style>
