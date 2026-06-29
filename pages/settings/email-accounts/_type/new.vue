<template>
  <div class="account-email-page">
    <b-container>
      <div class="row py-3">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>

        <EmailAccountSettings
          :type="$route.params.type"
          @change="handleEmailSettingsChange"
        />

        <div class="col col-md-9 offset-md-3 my-4">
          <b-button
            variant="primary"
            class="px-5"
            :disabled="!form.email || !form.name || savingEmailAccount"
            @click="saveEmailAccount"
          >
            Save
          </b-button>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import SideBar from '~/components/Setting/SideBar'
import EmailAccountSettings from '~/components/EmailAccount/EmailAccountSettings'
import { normalizeEmailAccountPorts } from '~/utils/portNormalizer'

import { SAVE_EMAIL_ACCOUNT_MUTATION } from '~/graphql/email-account/mutations'

export default {
  middleware: 'auth',

  components: { SideBar, EmailAccountSettings },

  data() {
    return {
      form: {},
      savingEmailAccount: false,
    }
  },

  methods: {
    handleEmailSettingsChange(form) {
      this.form = form
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
            this.$notify({
              group: 'main',
              type: 'native',
              title: 'Email Account added',
              text: 'The email account has been added successfully',
            })

            this.$router.push({
              name: 'settings-email-accounts',
            })
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

.account-email-page {
  margin-top: 30px;
}
</style>
