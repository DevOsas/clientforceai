<template>
  <div class="microsoft-oauth-button">
    <b-button
      variant="primary"
      :disabled="loading"
      @click="handleConnect"
      class="d-flex align-items-center"
    >
      <b-spinner v-if="loading" small class="mr-2"></b-spinner>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 23 23"
        class="mr-2"
      >
        <rect x="1" y="1" width="10" height="10" fill="#f25022" />
        <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
        <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
        <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
      </svg>
      {{ buttonText }}
    </b-button>

    <p v-if="helpText" class="small text-muted mt-2 mb-0">
      {{ helpText }}
    </p>
  </div>
</template>

<script>
import microsoftOAuth from '~/mixins/microsoftOAuth'

export default {
  mixins: [microsoftOAuth],

  props: {
    buttonText: {
      type: String,
      default: 'Connect with Microsoft',
    },
    helpText: {
      type: String,
      default: 'Connect your Outlook or Microsoft 365 account',
    },
  },

  computed: {
    loading() {
      return this.oauthLoading
    },
  },

  methods: {
    handleConnect() {
      this.connectMicrosoftAccount()
    },
  },
}
</script>

<style scoped>
.microsoft-oauth-button button {
  font-weight: 500;
}

.microsoft-oauth-button svg {
  flex-shrink: 0;
}
</style>
