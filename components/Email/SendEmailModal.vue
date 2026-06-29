<template>
  <b-modal
    id="SendEmailModal"
    size="xl"
    modal-class="send-email-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHidden"
  >
    <template #default="{ hide }">
      <b-button variant="link" class="close-btn" @click="hide()">
        <SvgIcon name="close" />
      </b-button>

      <b-row>
        <b-col md="9" class="editor-col">
          <b-form @submit.stop.prevent="handleSubmit">
            <!-- sender email -->
            <b-row class="send-email-input">
              <b-col md="10">
                <b-row>
                  <b-col sm="2">
                    <label for="from-email" class="mt-3">From:</label>
                  </b-col>
                  <b-col sm="10">
                    <EmailAccountSelect
                      class="ml-4"
                      :accounts="emailAccounts"
                      @selected="setSelectedEmail"
                    />
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="2" class="mt-3">
                <div class="toggle-cc" @click="enable_cc = !enable_cc">Cc</div>
              </b-col>
            </b-row>

            <!-- CC -->
            <b-row v-if="enable_cc" class="my-1 send-email-input">
              <b-col sm="2">
                <label for="cc-email" class="mt-3">Cc:</label>
              </b-col>
              <b-col sm="10">
                <b-form-input
                  id="email-copy"
                  v-model="form.cc_email"
                  size="lg"
                  placeholder="Enter Email Address"
                  class="email-input"
                  type="email"
                />
              </b-col>
            </b-row>

            <!-- Email subject -->
            <b-row class="my-1 mb-3 send-email-input">
              <b-col sm="2">
                <label for="email-subject" class="mt-3">Subject:</label>
              </b-col>
              <b-col sm="10">
                <b-form-input
                  id="email-subject"
                  v-model="form.subject"
                  size="lg"
                  placeholder="Enter email subject"
                  class="email-input"
                />
              </b-col>
            </b-row>

            <EmailEditor v-model="form.body" placeholder="Message ..." />

            <div class="d-flex justify-content-end mt-5">
              <div>
                <b-button
                  variant="link"
                  class="px-4 mr-3 text-muted"
                  @click="hide()"
                >
                  Cancel
                </b-button>
                <b-button
                  type="submit"
                  variant="primary"
                  class="px-4"
                  pill
                  :disabled="!canSubmit"
                >
                  <b-spinner v-if="busy" small />
                  Send
                </b-button>
              </div>
            </div>
          </b-form>
        </b-col>
        <b-col class="response-chance-col">
          <EmailResponseChanceMetrics :quality="emailQuality" />
        </b-col>
      </b-row>
    </template>
  </b-modal>
</template>

<script>
import { debounce } from 'lodash'
import { GET_EMAIL_QUALITY_QUERY } from '~/graphql/email/queries'

import { ALL_EMAIL_ACCOUNTS_QUERY } from '~/graphql/email-account/queries'
import { SEND_EMAIL_TO_LEAD_MUTATION } from '~/graphql/lead/email/mutations'

import EmailAccountSelect from '~/components/EmailAccount/EmailAccountSelect'
import EmailEditor from '~/components/Email/Editor/EmailEditor'
import EmailResponseChanceMetrics from '~/components/Email/EmailResponseChanceMetrics'

export default {
  components: { EmailAccountSelect, EmailEditor, EmailResponseChanceMetrics },

  props: {
    lead: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      leadId: '',
      busy: false,
      enable_cc: false,
      emailAccounts: [],
      form: new this.$form({
        account_id: '',
        cc_email: '',
        subject: '',
        body: '',
      }),
      emailQuality: null,
    }
  },

  apollo: {
    emailAccounts: {
      query: ALL_EMAIL_ACCOUNTS_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    canSubmit() {
      return this.form.subject && this.form.body
    },
  },

  watch: {
    'form.subject'() {
      this.getEmailQuality()
    },

    'form.body'() {
      this.getEmailQuality()
    },
  },

  methods: {
    setSelectedEmail(selected) {
      this.form.account_id = selected.id
    },
    handleSubmit() {
      this.$nuxt.$loading.start()
      this.busy = true

      this.$apollo
        .mutate({
          mutation: SEND_EMAIL_TO_LEAD_MUTATION,
          variables: {
            id: this.form.account_id,
            leadId: this.lead.id,
            subject: this.form.subject,
            htmlBody: this.form.body,
            ccEmail: this.form.cc_email,
          },
        })
        .then(() => {
          this.form.reset()
          this.$nuxt.$loading.finish()
          this.busy = false

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: 'Your email is now being processed for sending.',
          })
          this.$bvModal.hide('SendEmailModal')
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Unable to send reply!',
            text: 'An error occurred while processing your request.',
          })

          this.$nuxt.$loading.finish()
          this.busy = false
        })
    },

    handleOnHidden() {
      if (typeof this.form.reset === 'function') {
        this.form.reset()
      }
      this.$bvModal.hide('SendEmailModal')
    },

    getEmailQuality: debounce(function () {
      if (!this.form.subject || !this.form.body) {
        this.emailQuality = {}
        return
      }

      this.$apollo
        .mutate({
          mutation: GET_EMAIL_QUALITY_QUERY,
          variables: {
            subject: this.form.subject,
            body: this.form.body,
          },
        })
        .then(({ data }) => {
          this.emailQuality = data.getEmailQuality
        })
        .catch(() => {})
    }, 1000),
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';
.send-email-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 40px;
  }

  .close-btn {
    font-size: 32px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .editor-col {
    max-width: 788px;
    flex: 0 0 790px;

    .toggle-cc {
      border: 0;
      outline: 0;
      cursor: pointer;
      &:focus {
        border: 0;
        outline: 0;
      }
    }
    .send-email-input {
      border-bottom: 1px solid $gray-500;
      &:focus {
        border-color: $primary;
      }
      .email-input {
        background-color: transparent;
        border: 0;
        border-radius: 0;
        padding: 0;
        box-shadow: none;
        font-size: 16px;
        margin-top: 10px;
        &::placeholder {
          color: #8f8f8f;
        }
      }
    }

    .email-editor-input-wrap {
      background-color: $white;
      border-radius: 20px;
      box-shadow: 0 8px 24px -3px rgba(85, 64, 64, 0.1);
    }
  }

  .response-chance-col {
    margin: 80px 40px 0;
    padding: 0;

    .response-chance-header {
      margin-bottom: 45px;
      position: relative;

      h4 {
        font-size: 24px;
        color: $primary;
        margin-bottom: 0;
      }

      p {
        color: $gray-600;
      }

      &::after {
        content: url('~@/assets/images/long-arrow.svg');
        position: absolute;
        top: 45px;
        left: 0;
        height: 10px;
        width: 100px;
      }
    }
  }
}
</style>
