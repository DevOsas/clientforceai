<template>
  <div class="account-email-page">
    <b-container>
      <div class="row py-3">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>
        <div class="col col-md-9 col-sm-12">
          <div class="d-flex justify-content-right mb-4">
            <b-button
              variant="email-account-plus"
              class="ml-auto"
              @click="$bvModal.show('AddEmailAccountModal')"
            >
              <SvgIcon name="plus" class="icon-sm" />
            </b-button>
          </div>

          <b-row>
            <b-skeleton-table
              v-if="isFetching"
              :rows="5"
              :columns="4"
            ></b-skeleton-table>

            <table
              v-else
              class="table table-borderless table-hover email-account-table"
            >
              <thead>
                <tr class="email-account-header">
                  <th scope="col"></th>
                  <th scope="col" class="text-grey">Name</th>
                  <th scope="col" class="text-grey">Email</th>
                  <th scope="col" class="text-grey">Type</th>
                  <th scope="col" class="text-grey">Daily Emails</th>
                  <th scope="col" class="text-grey">Total Emails</th>
                  <th scope="col" class="text-grey"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in emailAccounts"
                  :key="item.id"
                  @click="openAccount(item)"
                >
                  <th scope="row">
                    <SvgIcon name="circle" class="icon-sm text-success" />
                  </th>
                  <td>
                    {{ item.name }}
                    <template v-if="item.isDefault"> (Default) </template>
                  </td>
                  <td>
                    <SvgIcon :name="getIcon(item.type)" class="mr-1" />
                    {{ item.email }}
                    <b-badge v-if="item.isOauth" variant="success" class="ml-2">
                      <i class="fas fa-shield-alt"></i> OAuth2
                    </b-badge>
                  </td>
                  <td>{{ getType(item.type) }}</td>
                  <td>{{ item.emailsPerDayLimit }}</td>
                  <td>
                    <SvgIcon name="mail" class="icon-sm" />
                    {{ item.totalEmails || 0 }}
                  </td>
                  <td>
                    <b-dropdown
                      variant="account-action-dropdown"
                      size="sm"
                      right
                      no-caret
                    >
                      <template #button-content>
                        <SvgIcon name="menu-dots" />
                      </template>
                      <template>
                        <b-dropdown-item
                          v-if="!item.isDefault"
                          @click.stop="setDefaultEmailAccount(item)"
                        >
                          Make default
                        </b-dropdown-item>
                        <b-dropdown-item
                          @click.stop="invokeDeleteEmailAccount(item)"
                        >
                          Remove
                        </b-dropdown-item>
                      </template>
                    </b-dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-row>
        </div>
      </div>
    </b-container>

    <b-modal
      id="AddEmailAccountModal"
      centered
      hide-header
      hide-footer
      modal-class="add-email-account-modal"
    >
      <template #default="{ hide }">
        <b-button variant="link" class="close-btn" @click="hide">
          <SvgIcon name="close" />
        </b-button>

        <h5>Setup email account for sending</h5>
        <p>Please select your email provider:</p>
        <EmailPlatformSelect :value="provider" @input="onProviderChange" />

        <!-- Debug: Show current provider -->
        <p v-if="provider" class="small text-muted mt-2">
          Selected: {{ provider }}
        </p>

        <!-- Test: Simple div that should show -->
        <div v-if="provider === 'outlook'" class="alert alert-warning mt-3">
          TEST: Outlook selected - OAuth section should appear below
        </div>
        <div v-if="provider === 'exchange'" class="alert alert-warning mt-3">
          TEST: Exchange selected - OAuth section should appear below
        </div>

        <!-- Microsoft OAuth2 Quick Connect -->
        <div v-if="provider === 'outlook' || provider === 'exchange'" class="mt-4">
          <div class="alert alert-info">
            <h6 class="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            </h6>
            <p class="mb-3 small">
              Connect securely in seconds using Microsoft OAuth2 authentication.
            </p>
            <MicrosoftOAuthButton
              button-text="Connect with Microsoft"
              :help-text="null"
              @oauth-success="handleOAuthSuccess"
              @oauth-error="handleOAuthError"
            />
          </div>
          <p class="text-center my-2 small text-muted">
            <strong>OR</strong> continue with manual setup
          </p>
        </div>

        <div class="text-right mt-4">
          <b-button
            variant="primary"
            class="px-4"
            :disabled="!provider"
            @click="addEmailProvider"
          >
            Continue
          </b-button>
        </div>
      </template>
    </b-modal>

    <b-modal
      id="DeleteEmailAccountWarningModal"
      centered
      hide-header
      hide-footer
    >
      <template #default="{ hide }">
        <div v-if="isDeleting" class="leads-deleting">
          <b-spinner variant="primary" />
        </div>
        <div v-else-if="invokedForDelete" class="text-center p-4">
          <h4>{{ invokedForDelete.email }}</h4>
          <p class="px-3">
            Account will be permanently removed. Are you sure you want to
            continue?
          </p>

          <div class="mt-4">
            <b-button
              variant="link"
              class="text-dark px-4 mr-1"
              pill
              @click="hide"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4 mr-1"
              pill
              @click="deleteEmailAccount"
            >
              Delete
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import SideBar from '~/components/Setting/SideBar.vue'
import EmailPlatformSelect from '~/components/General/EmailPlatformSelect'
import MicrosoftOAuthButton from '~/components/EmailAccount/MicrosoftOAuthButton'

import { ALL_EMAIL_ACCOUNTS_QUERY } from '~/graphql/email-account/queries'
import {
  DELETE_EMAIL_ACCOUNT_MUTATION,
  SET_DEFAULT_EMAIL_ACCOUNT_MUTATION,
} from '~/graphql/email-account/mutations'

export default {
  middleware: 'auth',

  name: 'SettingsEmailAccounts',

  components: {
    SideBar,
    EmailPlatformSelect,
    MicrosoftOAuthButton,
  },

  data() {
    return {
      isFetching: false,
      emailAccounts: [],
      provider: '',

      invokedForDelete: null,
      isDeleting: false,
    }
  },

  apollo: {
    emailAccounts: {
      query: ALL_EMAIL_ACCOUNTS_QUERY,

      result({ loading }) {
        this.isFetching = loading
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  methods: {
    getIcon(type) {
      switch (type) {
        case 'other':
          return 'paper-plane-alt'
        case 'exchange':
          return 'microsoft-exchange'
        default:
          return type
      }
    },

    getType(type) {
      switch (type) {
        case 'gmail':
          return 'GmailSingleClick'
        case 'exchange':
          return 'Exchange'
        case 'outlook':
          return 'Outlook'
        default:
          return 'Unknown'
      }
    },
    openAccount(account) {
      this.$router.push({
        name: 'settings-email-accounts-id-type-edit',
        params: { id: account.id, type: account.type },
      })
    },

    onProviderChange(value) {
      console.log('Provider changed to:', value)
      this.provider = value
      this.$forceUpdate() // Force Vue to re-render
    },

    addEmailProvider() {
      if (this.provider === 'gmail') {
        window.location = `${this.$config.APIRoot}/EmailAccount/ConnectWithGMailAsync?next=/dashboardv2`
      } else {
        this.$router.push({
          name: 'settings-email-accounts-type-new',
          params: {
            type: this.provider,
          },
        })
      }
    },

    invokeDeleteEmailAccount(emailAccount) {
      this.invokedForDelete = emailAccount

      this.$bvModal.show('DeleteEmailAccountWarningModal')
    },

    deleteEmailAccount() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_EMAIL_ACCOUNT_MUTATION,
          variables: {
            id: this.invokedForDelete.id,
          },
          update: (store, { data: { deleted } }) => {
            if (deleted) {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: ALL_EMAIL_ACCOUNTS_QUERY,
              })

              const index = data.emailAccounts.findIndex(
                (a) => a.id === this.invokedForDelete.id
              )
              if (index !== -1) {
                data.emailAccounts.splice(index, 1)
              }
              // Write our data back to the cache.
              store.writeQuery({
                query: ALL_EMAIL_ACCOUNTS_QUERY,
                data,
              })
            }
          },
        })
        .then(() => {
          this.$bvModal.hide('DeleteEmailAccountWarningModal')

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: 'The email account has been removed successfully',
          })

          setTimeout(() => {
            this.isDeleting = false
            this.invokedForDelete = null
          }, 500)
        })
        .catch(({ graphQLErrors }) => {
          this.isDeleting = false

          graphQLErrors.forEach((error) => {
            if (error.message === 'CannotRemoveDefaultEmailAccount') {
              this.$bvModal.hide('DeleteEmailAccountWarningModal')

              return this.$notify({
                group: 'main',
                type: 'native-error',
                title: 'Operation failed',
                text: 'You cannot remove your default email account',
              })
            }

            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Operation failed',
              text: 'An error occurred while processing your request.',
            })
          })
        })
    },

    setDefaultEmailAccount(account) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: SET_DEFAULT_EMAIL_ACCOUNT_MUTATION,
          variables: {
            id: account.id,
          },
          update: (store, { data: { emailAccount } }) => {
            if (emailAccount) {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: ALL_EMAIL_ACCOUNTS_QUERY,
              })

              // Mutate the cache
              data.emailAccounts = data.emailAccounts.map((acct) => ({
                ...acct,
                isDefault: acct.id === account.id,
              }))

              // Write our data back to the cache.
              store.writeQuery({
                query: ALL_EMAIL_ACCOUNTS_QUERY,
                data,
              })
            }
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: 'Default email account updated successfully.',
          })
        })
        .finally(() => {
          this.$nuxt.$loading.finish()
        })
    },

    handleOAuthSuccess(emailAccount) {
      // Close the modal
      this.$bvModal.hide('AddEmailAccountModal')

      // Refresh the email accounts list
      this.$apollo.queries.emailAccounts.refetch()

      // Show success notification
      this.$notify({
        group: 'main',
        type: 'success',
        title: 'Account Connected!',
        text: `Successfully connected ${emailAccount.email}`,
      })

      // Reset provider selection
      this.provider = ''
    },

    handleOAuthError(error) {
      // Error already shown in notification from mixin
      console.error('OAuth error:', error)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-email-account-modal {
  .close-btn {
    font-size: 2rem;
    color: $gray-200;
    position: absolute;
    right: -25px;
    top: -30px;
    padding: 0;
    line-height: 0;

    &:active,
    &:focus {
      box-shadow: none !important;
      outline: 0 !important;
    }
  }

  .modal-dialog {
    max-width: 745px;
  }

  .modal-body {
    padding: 30px 40px;
  }
}

.account-email-page {
  margin-top: 30px;

  .btn-email-account-plus {
    border-radius: 25px;
    background: $danger;
    color: $white;
    padding: 8px 12px;
    padding: 12px 16px;
  }

  .email-account-table {
    text-align: left;

    .email-account-header {
      color: $gray-500;
    }

    tr {
      cursor: pointer;

      .btn-account-action-dropdown {
        opacity: 0.4;
        box-shadow: none;
        outline: 0;
      }

      &:hover {
        .btn-account-action-dropdown {
          opacity: 1;
        }
      }
    }
  }
}
</style>
