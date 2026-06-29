# 🎨 Microsoft OAuth2 Frontend Integration Guide

## 📁 **FILES CREATED**

1. `graphql/email-account/oauth.js` - GraphQL queries/mutations
2. `pages/oauth/microsoft/callback.vue` - OAuth callback page
3. `mixins/microsoftOAuth.js` - Reusable OAuth logic
4. `components/EmailAccount/MicrosoftOAuthButton.vue` - Connect button component

---

## 🔧 **INTEGRATION EXAMPLE**

### **Option 1: Add to Email Platform Selection**

Update `pages/setup/email-account/index.vue`:

```vue
<template>
  <div class="setup-email-account">
    <h3 class="mb-3">Set up an email account</h3>
    <p class="text-muted mb-4">
      Set up an email account to be used in sending out emails and proposals
    </p>

    <EmailPlatformSelect :value="platform" @input="updatePlatform" />

    <!-- Add Microsoft OAuth Button -->
    <div v-if="platform === 'outlook' || platform === 'exchange'" class="mt-4">
      <div class="alert alert-info">
        <h5>Quick Connect with OAuth2</h5>
        <p class="mb-3">
          Microsoft requires OAuth2 authentication. Click below to connect your account securely.
        </p>
        <MicrosoftOAuthButton
          @oauth-success="handleOAuthSuccess"
          @oauth-error="handleOAuthError"
        />
      </div>
      <p class="text-center my-3">
        <strong>OR</strong>
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

  methods: {
    updatePlatform(provider) {
      this.$store.dispatch('emailAccount/updatePlatform', provider)
    },

    setEmailProvider() {
      if (this.platform === 'gmail') {
        window.location = `${this.$config.APIRoot}/EmailAccount/ConnectWithGMailAsync?next=/dashboard`
      } else {
        this.$router.push({ name: 'setup-email-account-receiving' })
      }
    },

    handleOAuthSuccess(emailAccount) {
      // OAuth connection successful, redirect to dashboard
      this.$router.push({ name: 'dashboard' })
    },

    handleOAuthError(error) {
      // Handle error (already shown in notification)
      console.error('OAuth error:', error)
    },
  },
}
</script>
```

---

### **Option 2: Add to Email Account List**

Create a new component `components/EmailAccount/EmailAccountList.vue`:

```vue
<template>
  <div class="email-account-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>Email Accounts</h4>
      <b-dropdown text="Add Account" variant="primary" right>
        <b-dropdown-item @click="showManualSetup = true">
          Manual Setup
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="connectMicrosoft">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 23 23"
            class="mr-2"
          >
            <rect x="1" y="1" width="10" height="10" fill="#f25022" />
            <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
            <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
            <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
          </svg>
          Connect Microsoft
        </b-dropdown-item>
        <b-dropdown-item @click="connectGoogle">
          Connect Google
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <!-- Account List -->
    <div v-for="account in emailAccounts" :key="account.id" class="email-account-card mb-3">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="mb-1">{{ account.name }}</h5>
          <p class="text-muted mb-1">{{ account.email }}</p>
          <b-badge v-if="account.isOauth" variant="success">
            <i class="fas fa-shield-alt"></i>
            Connected via {{ account.oauthProvider }}
          </b-badge>
          <b-badge v-if="account.isDefault" variant="primary" class="ml-2">
            Default
          </b-badge>
        </div>
        <b-dropdown variant="link" no-caret right>
          <template #button-content>
            <i class="fas fa-ellipsis-v"></i>
          </template>
          <b-dropdown-item @click="editAccount(account)">
            Edit
          </b-dropdown-item>
          <b-dropdown-item @click="setDefault(account)" v-if="!account.isDefault">
            Set as Default
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item variant="danger" @click="deleteAccount(account)">
            Delete
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import microsoftOAuth from '~/mixins/microsoftOAuth'
import { ALL_EMAIL_ACCOUNTS_QUERY } from '~/graphql/email-account/queries'

export default {
  mixins: [microsoftOAuth],

  data() {
    return {
      emailAccounts: [],
      showManualSetup: false,
    }
  },

  apollo: {
    emailAccounts: {
      query: ALL_EMAIL_ACCOUNTS_QUERY,
      update: (data) => data.emailAccounts || [],
    },
  },

  methods: {
    connectMicrosoft() {
      this.connectMicrosoftAccount()
    },

    connectGoogle() {
      window.location = `${this.$config.APIRoot}/EmailAccount/ConnectWithGMailAsync?next=/settings/email-accounts`
    },

    refreshEmailAccounts() {
      // Refetch email accounts
      this.$apollo.queries.emailAccounts.refetch()
    },

    editAccount(account) {
      // Navigate to edit page
      this.$router.push({ name: 'settings-email-account-edit', params: { id: account.id } })
    },

    setDefault(account) {
      // Set as default account
      // Implement mutation
    },

    deleteAccount(account) {
      // Delete account
      // Implement mutation
    },
  },
}
</script>

<style scoped>
.email-account-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}
</style>
```

---

### **Option 3: Standalone OAuth Page**

Create `pages/settings/email-accounts/connect-microsoft.vue`:

```vue
<template>
  <div class="connect-microsoft-page">
    <b-container>
      <b-row class="justify-content-center">
        <b-col md="8" lg="6">
          <div class="card shadow-sm">
            <div class="card-body p-5 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 23 23"
                class="mb-4"
              >
                <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
                <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
                <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
              </svg>

              <h3 class="mb-3">Connect Microsoft Account</h3>
              <p class="text-muted mb-4">
                Connect your Outlook or Microsoft 365 account to send and receive emails
                through Clientforce.
              </p>

              <div class="alert alert-info text-left mb-4">
                <h6>What you'll authorize:</h6>
                <ul class="mb-0">
                  <li>Send emails on your behalf</li>
                  <li>Read your email messages</li>
                  <li>Access your email address and profile</li>
                </ul>
              </div>

              <MicrosoftOAuthButton
                button-text="Connect with Microsoft"
                :help-text="null"
                @oauth-success="handleSuccess"
                @oauth-error="handleError"
              />

              <p class="small text-muted mt-4 mb-0">
                Your credentials are securely stored and never shared.
              </p>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import MicrosoftOAuthButton from '~/components/EmailAccount/MicrosoftOAuthButton'

export default {
  components: { MicrosoftOAuthButton },

  layout: 'dashboard',
  middleware: 'auth',

  methods: {
    handleSuccess(emailAccount) {
      this.$router.push({ name: 'settings-email-accounts' })
    },

    handleError(error) {
      // Error already shown in notification
    },
  },
}
</script>
```

---

## 🎨 **UI/UX RECOMMENDATIONS**

### **1. Visual Indicators**

Show OAuth accounts differently:

```vue
<template>
  <div class="email-account-item">
    <!-- OAuth Badge -->
    <b-badge v-if="account.isOauth" variant="success" class="oauth-badge">
      <i class="fas fa-shield-alt"></i>
      OAuth2 Connected
    </b-badge>

    <!-- Token Status -->
    <div v-if="account.isOauth" class="token-status">
      <small class="text-muted">
        <i class="fas fa-check-circle text-success"></i>
        Token valid until {{ formatDate(account.oauthTokenExpiresAt) }}
      </small>
    </div>
  </div>
</template>
```

### **2. Error States**

Handle expired tokens:

```vue
<template>
  <div v-if="isTokenExpired(account)" class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    Your Microsoft connection has expired.
    <b-button size="sm" variant="warning" @click="reconnect(account)">
      Reconnect Now
    </b-button>
  </div>
</template>

<script>
export default {
  methods: {
    isTokenExpired(account) {
      if (!account.oauthTokenExpiresAt) return false
      return new Date(account.oauthTokenExpiresAt) < new Date()
    },

    reconnect(account) {
      // Trigger OAuth flow again
      this.connectMicrosoftAccount()
    },
  },
}
</script>
```

### **3. Loading States**

Show progress during OAuth:

```vue
<template>
  <div class="oauth-loading" v-if="oauthLoading">
    <div class="text-center">
      <b-spinner variant="primary"></b-spinner>
      <p class="mt-2">Connecting to Microsoft...</p>
      <p class="small text-muted">
        A popup window should have opened. If not, please allow popups for this site.
      </p>
    </div>
  </div>
</template>
```

---

## 🧪 **TESTING CHECKLIST**

### **Frontend Tests:**
- [ ] OAuth button renders correctly
- [ ] Clicking button opens popup window
- [ ] Popup window loads Microsoft login
- [ ] Callback page receives code and state
- [ ] Callback page completes mutation
- [ ] Success message shown
- [ ] Email account list refreshes
- [ ] Error handling works
- [ ] Popup blocked warning shown

### **Integration Tests:**
- [ ] Complete full OAuth flow
- [ ] Verify account appears in list
- [ ] Verify OAuth badge shown
- [ ] Test sending email with OAuth account
- [ ] Test receiving email with OAuth account
- [ ] Test token refresh (wait for expiration)

---

## 🔧 **TROUBLESHOOTING**

### **Popup Blocked**

```javascript
// Check if popup was blocked
if (!this.oauthWindow || this.oauthWindow.closed) {
  this.$notify({
    type: 'warning',
    title: 'Popup Blocked',
    text: 'Please allow popups for this site and try again.',
  })
}
```

### **CORS Issues**

Ensure `.env` has correct CORS settings:

```env
CORS_ALLOWED_ORIGINS=https://app.clientforce.io,http://localhost:3000
```

### **Callback Not Working**

Check redirect URI in Azure AD matches:

```
https://yourdomain.com/oauth/microsoft/callback
```

---

## 📚 **ADDITIONAL RESOURCES**

- **Backend Setup:** `MICROSOFT_OAUTH2_SETUP_GUIDE.md`
- **Implementation Details:** `MICROSOFT_OAUTH2_IMPLEMENTATION.md`
- **Backend Complete:** `OAUTH2_BACKEND_COMPLETE.md`

---

**Status:** 🟢 Frontend Components Ready  
**Next:** Integrate into your application and test!
