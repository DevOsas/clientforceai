<template>
  <div class="email-account-settings col col-md-9 col-sm-12">
    <div class="d-flex align-items-center mb-3">
      <b-button
        :to="{ name: 'settings-email-accounts' }"
        variant="link"
        class="back-btn mr-4"
      >
        <SvgIcon name="arrow-left" />
      </b-button>

      <h4 class="text-muted mb-0">
        <SvgIcon :name="providerIcon" class="mr-1" /> {{ providerText }}
      </h4>
    </div>

    <div class="about-email-config">
      <h5 class="mb-3">About email configuration</h5>

      <ul>
        <li>
          <p>
            Make sure to keep the replies in your inbox in order for Clientforce
            to be able to detect them. Do not remove, archive, or move them to
            any folder at least for a day after a reply has been received.
          </p>
        </li>
        <li>
          <p>
            Please ensure that you have proper DNS settings in place before
            starting an email sequence. SPF record, DKIM signature, and DMARC
            are important settings to be configured for every domain used for
            mailing. See the Email Account's Health section below (for Beta
            users only) to ensure that all the settings are correct.
            <a href="#">Learn more</a>
          </p>
        </li>
        <li>
          <p>
            <a href="#">Chat with us</a> if you need help with setting up your
            email account.
          </p>
        </li>
      </ul>

      <div class="text-right">
        <b-button variant="link" class="text-uppercase" size="sm">
          I Understand
        </b-button>
      </div>
    </div>

    <b-button variant="outline-primary" class="mb-4" block>
      <SvgIcon name="chat-2" />
      I need help with setting up my email account
    </b-button>

    <SettingsCollapse
      icon="settings-2"
      label="Account Settings"
      :description="settingsDescription"
      :expanded="true"
    >
      <template>
        <b-row v-if="type === 'gmail'">
          <b-col md="5">
            <b-form-group class="sm-input-pad" label="Sender name *">
              <b-form-input
                :value="form.name"
                size="sm"
                @input="handleChange('name', $event)"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <ProviderForm v-else :form="form" @change="handleProviderFormChange" />
      </template>
    </SettingsCollapse>

    <SettingsCollapse
      v-if="type === 'gmail'"
      icon="paper-plane-outline"
      label="Sending and receiving"
      description="Configure how you would like to send emails."
    >
      <template>
        <b-row>
          <b-col md="12">
            <h5 class="mb-4">Sending emails</h5>
            <b-form-group label="How to handle sending">
              <b-form-select
                :value="form.sendingClientType"
                size="sm"
                @input="handleChange('sendingClientType', $event)"
              >
                <option value="0">SMTP</option>
                <option value="1">Gmail API</option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </template>
    </SettingsCollapse>

    <SettingsCollapse
      icon="safety"
      label="Safety setting"
      description="Specify the maximum number of emails that could be sent via this email account per day and minute."
    >
      <template>
        <b-row>
          <b-col md="4">
            <b-form-group label="Total number of emails">
              <b-form-input
                :value="form.emailsPerDayLimit"
                type="number"
                max="200"
                @input="handleChange('emailsPerDayLimit', $event)"
              />
            </b-form-group>
          </b-col>
          <b-col md="8">
            <div class="setting-info">
              Total number of emails that could be sent via this email account
              per day (200 max). The limit does not include Warm-Up emails.
            </div>
          </b-col>
        </b-row>
        <b-row class="mb-3">
          <b-col md="4">
            <b-form-checkbox
              :checked="form.isLimitEmailPerMinute"
              switch
              size="md"
              @input="handleChange('isLimitEmailPerMinute', $event)"
            >
              Enable limit of emails per minute
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-group
              class="sm-input-pad"
              label="Max number of emails per minute"
              :disabled="!form.isLimitEmailPerMinute"
            >
              <b-form-input
                :value="form.emailsPerMinuteLimit"
                size="sm"
                type="number"
                :disabled="!form.isLimitEmailPerMinute"
                @input="handleChange('emailsPerMinuteLimit', $event)"
              />
            </b-form-group>
          </b-col>
          <b-col md="8">
            <div class="setting-info">
              Maximum number of emails that could be sent via this email account
              per minute. For Outlook accounts, keep it lower than 30
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-group
              class="sm-input-pad"
              label="Throttling frequency (minutes)"
              :disabled="!form.isLimitEmailPerMinute"
            >
              <b-form-input
                :value="form.emailsThrottleMinuteAmount"
                size="sm"
                type="number"
                :disabled="!form.isLimitEmailPerMinute"
                @input="handleChange('emailsThrottleMinuteAmount', $event)"
              />
            </b-form-group>
          </b-col>
          <b-col md="8">
            <div class="setting-info">
              Use this option to fine-tune sending from this email account.
              Sending rate = Max number of emails per minute * Throttling
              frequency (e.g., 1max email * 5min will send no more than 1 email
              in 5 minutes).
            </div>
          </b-col>
        </b-row>
      </template>
    </SettingsCollapse>

    <SettingsCollapse
      icon="edit-alt"
      label="Signature"
      description="Set your email signature by entering it manually or copy and paste it from your email client to the text area below."
    >
      <template>
        <b-row>
          <b-col md="12">
            <EmailEditor
              :value="form.signature"
              :show-insert-templates="false"
              :show-insert-variables="false"
              :show-insert-proposals="false"
              :show-insert-reports="false"
              :decorated="false"
              class="signature-editor"
              @input="handleChange('signature', $event)"
            />
          </b-col>
        </b-row>
      </template>
    </SettingsCollapse>

    <SettingsCollapse
      icon="email-opt-out"
      label="Opt-out text"
      description="Specify your opt-out text at the bottom of the email. Make it sound friendly and personal."
    >
      <template>
        <div class="d-flex mb-4 mt-4">
          <label for="unsubscribe-switch" class="mr-2">
            Unsubscribe via plain text
          </label>
          <b-form-checkbox
            id="unsubscribe-switch"
            :checked="form.isOptOutLinkEnabled"
            switch
            class="unsubscribe-switch"
            size="md"
            @input="handleChange('isOptOutLinkEnabled', $event)"
          >
            Unsubscribe via opt-out link
          </b-form-checkbox>
        </div>

        <b-form-group label="Text at the bottom of email">
          <b-form-input
            :value="form.optOutTextBlock"
            @input="handleChange('optOutTextBlock', $event)"
          />
        </b-form-group>

        <p class="text-muted mt-4">
          <template v-if="form.isOptOutLinkEnabled"
            >The opt-out link appears at the bottom of the email in a small
            grayed-out font. If you use Reply to communicate with contacts you
            know, you can remove the opt-out text by deleting it from the
            textbox below. Make sure you include an opt-out link with cold
            contacts and wrap the text you want to use as the opt-out hyperlink
            in {curly brackets}.</template
          >
          <template v-else>
            Provide a message that will tell the recipient that they can
            unsubscribe simply by letting you know. For example: "Please, reply
            'opt out' to unsubscribe." Our NLP algorithm automatically handles
            such replies and will unsubscribe the recipient. The message appears
            at the bottom of the email. If you use Clientforce to communicate
            with contacts you know, you can remove the opt-out text by deleting
            it from the textbox above.
          </template>
        </p>

        <p class="text-muted mb-4">
          You can also insert an opt-out link in any place of the email body.
          For more information, see the
          <a href="#">following article</a>.
        </p>

        <b-form-group label="Opt-out page text">
          <EmailEditor
            :value="form.optOutPageText"
            :show-insert-templates="false"
            :show-insert-variables="true"
            :show-insert-proposals="false"
            :show-insert-reports="false"
            :show-menu="false"
            :decorated="false"
            class="opt-out-page-editor"
            @input="handleChange('optOutPageText', $event)"
          />
        </b-form-group>
      </template>
    </SettingsCollapse>
  </div>
</template>

<script>
import ProviderForm from '~/components/EmailAccount/ProviderForm'
import SettingsCollapse from '~/components/General/SettingsCollapse'
import EmailEditor from '~/components/Email/Editor/EmailEditor'

import emailAccountForms from '~/utils/emailAccountForms'

export default {
  components: { SettingsCollapse, ProviderForm, EmailEditor },

  middleware: 'auth',

  props: {
    type: {
      type: String,
      required: true,
    },

    emailAccount: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      form: new this.$form({
        type: this.type,
        email: '',
        name: '',
        senderName: '',
        emailsPerDayLimit: 200,
        isLimitEmailPerMinute: false,
        emailsPerMinuteLimit: 30,
        emailsThrottleMinuteAmount: 1,
        signature: '',
        optOutTextBlock: `PS: If you don't want to hear from me anymore, just let me know`,
        optOutPageText: 'You now have been removed from my contact list.',
        isOptOutLinkEnabled: false,
        sendingClientType: 1,
        imapSettings: {},
        smtpSettings: {},
      }),
    }
  },

  computed: {
    settingsDescription() {
      return this.type === 'gmail'
        ? 'Please specify a desired sender name.'
        : 'Configure your email account settings below.'
    },

    providerText() {
      switch (this.type) {
        case 'gmail':
          return 'Gmail Single Click'
        case 'exchange':
          return 'Exchange'
        case 'outlook':
          return 'Outlook'
        default:
          return 'Other Provider'
      }
    },

    providerIcon() {
      switch (this.type) {
        case 'other':
          return 'paper-plane-alt'
        case 'exchange':
          return 'microsoft-exchange'
        default:
          return this.type
      }
    },
  },

  watch: {
    emailAccount(emailAccount) {
      this.processForm(emailAccount)
    },
  },

  mounted() {
    if (this.emailAccount.id) {
      this.processForm(this.emailAccount)
    } else {
      const formData = emailAccountForms[this.type]
      // Ensure ports are numbers when filling form
      if (formData.smtpSettings && formData.smtpSettings.port) {
        formData.smtpSettings.port = Number(formData.smtpSettings.port)
      }
      if (formData.imapSettings && formData.imapSettings.port) {
        formData.imapSettings.port = Number(formData.imapSettings.port)
      }
      this.form.fill(formData)
    }

    this.$emit('initiated', this.form)
  },

  methods: {
    processForm(emailAccount) {
      this.form.keys().forEach((key) => {
        if (emailAccount[key]) {
          this.form[key] = emailAccount[key]
        }
      })

      this.form.imapSettings.password = ''
      this.form.smtpSettings.password = ''
    },

    handleProviderFormChange({ key, value }) {
      // Normalize ports to numbers for smtp/imap settings
      let normalizedValue = value
      if ((key === 'smtpSettings' || key === 'imapSettings') && value && value.port !== null && value.port !== undefined && value.port !== '') {
        normalizedValue = {
          ...value,
          port: Number(value.port)
        }
      }

      this.form.fill({
        ...this.form.data(),
        [key]: normalizedValue,
      })

      this.$emit('change', this.form)
    },

    handleChange(key, value) {
      let changes = {
        ...this.form.data(),
        [key]: value,
      }

      if (key === 'isOptOutLinkEnabled') {
        const text = value
          ? 'Want to opt out? Please {click here}'
          : "PS: If you don't want to hear from me anymore, just let me know"

        changes = {
          ...changes,
          optOutTextBlock: text,
        }
      }

      this.form.fill(changes)

      this.$emit('change', this.form)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-account-settings {
  margin-top: 30px;

  .back-btn {
    padding: 0;
    color: $gray-700;
    line-height: 0;

    &:focus,
    &:active {
      box-shadow: none !important;
      outline: 0 !important;
    }

    .icon {
      font-size: 25px;
    }
  }

  .sm-input-pad {
    padding-left: 35px;
  }

  .email-editor-input-wrap {
    border: 1px solid $gray-400;
    border-radius: 7px;
  }

  .unsubscribe-switch {
    .custom-control-label::before {
      color: #fff;
      border-color: #2ecb3a;
      background-color: #2ecb3a;
    }

    .custom-control-label::after {
      background-color: #fff;
    }
  }

  .signature-editor {
    .email-editor .JMEditor {
      min-height: 200px;
    }
  }

  .opt-out-page-editor {
    .editor-insert-btns {
      margin-top: 25px;
    }
    .email-editor .JMEditor {
      min-height: 90px;
      font-size: 0.95rem;
    }
  }

  .about-email-config {
    background-color: rgb(255, 255, 255);
    color: rgb(6, 24, 54);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 30%) 0 1px 3px;
    overflow: hidden;
    margin-bottom: 25px;
    padding: 30px 30px 10px;

    ul {
      padding: 0;
      list-style: none;

      li {
        margin-bottom: 15px;
        position: relative;
        display: flex;

        &::before {
          flex-shrink: 0;
          margin-top: 8px;
          margin-right: 15px;
          content: '';
          width: 1em;
          height: 1em;
          font-size: 8px;
          border-radius: 50%;
          background-color: rgb(156, 162, 175);
        }
      }
    }
  }

  .btn-settings-save {
    background-color: #c2fdb9;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    text-transform: uppercase;
    padding: 10px 30px;
    font-size: 20px;

    .icon {
      margin-right: 7px;
    }
  }
}
</style>
