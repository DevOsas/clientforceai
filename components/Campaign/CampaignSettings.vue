<template>
  <div class="campaign-settings">
    <SettingsCollapse
      icon="megaphone"
      label="General Campaign Configuration"
      description="Select email account that will be used for sending and receiving emails, set maximum number of first step emails, delay between emails, enable/disable email opens and links tracking."
    >
      <template>
        <b-row>
          <b-col md="4">
            <b-form-group label="Email account for sending email">
              <b-form-select v-model.number="campaignConfig.email_account_id">
                <option
                  v-for="account in emailAccounts"
                  :key="account.id"
                  :value="account.id"
                  :selected="account.id === campaignConfig.email_account_id"
                >
                  {{ account.email }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <div class="setting-info">
              The Email address cannot be changed once the campaign has been
              launched and the first email has been sent.
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-group label="Max number of emails (200 max) per day *">
              <b-form-input
                v-model.number="campaignConfig.max_no_emails"
                type="number"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <div class="setting-info">
              Set maximum number of emails that can be sent per day. This allows
              to avoid mail servers treating your emails as high volume mass
              mailing, makes emails go out more graduall and easier to handle
              responses promptly.
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-group label="Delay between each email sent (seconds) *">
              <b-form-input
                v-model.number="campaignConfig.email_delay"
                type="number"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <div class="setting-info">
              Set the delay between sending every single email to avoid mail
              servers treating your emails as bulk and to make them go out more
              gradually, making it easier to handle responses promptly.
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-checkbox
              v-model="campaignConfig.disable_opens_tracking"
              switch
              size="lg"
            >
              Disable opens tracking
            </b-form-checkbox>
          </b-col>
          <b-col>
            <div class="setting-info">
              Disable email opens tracking by removing the invisible pixel from
              your emails. This could improve the deliverability rate of your
              emails and make them look more personal, since your email will
              contain just plain HTML without any additional technologies.
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-checkbox
              v-model="campaignConfig.enable_links_tracking"
              switch
              size="lg"
            >
              Enable links tracking
            </b-form-checkbox>
          </b-col>
          <b-col>
            <div class="setting-info">
              By enabling link tracking all links inside of your email will be
              wrapped in intermediate Reply's short link. Please be aware that
              enabling link tracking sometimes decreases your emails
              deliverability rate.
            </div>
          </b-col>
        </b-row>
      </template>
    </SettingsCollapse>
    <SettingsCollapse
      icon="chat"
      label="Replies Handling"
      description="Specify what to do once a contact has replied to the email and when to consider the campaign finished, if contacts haven’t replied to the email"
    >
      <template>
        <b-row>
          <b-col md="4">
            <b-form-group label="When person replies">
              <b-form-select v-model="campaignConfig.upon_reply">
                <option
                  v-for="replyAction in fieldOptions.upon_reply"
                  :key="`ur-${replyAction.value}`"
                  :value="replyAction.value"
                  :selected="replyAction.value === campaignConfig.upon_reply"
                >
                  {{ replyAction.label }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col></b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-group
              label='Mark contact "Finished" if no reply after last email (days) *'
            >
              <b-form-input
                v-model.number="campaignConfig.max_unreplied_emails_to_track"
                type="number"
              />
            </b-form-group>
          </b-col>
          <b-col>
            <div class="setting-info">
              Finished state indicates that the campaign is over for certain
              contacts. The contact could be switched to a finished state if a
              response is received, if their email bounced, if they opted out or
              if there was no reply after a certain number of days since the
              last email was sent.
            </div>
          </b-col>
        </b-row>
      </template>
    </SettingsCollapse>
    <SettingsCollapse
      icon="phone-call"
      label="Call in Campaign"
      description="Automatically begin a direct call with the contacts most interested in your message after your email has been opened a set number of times."
    >
      <b-row>
        <b-col md="4">
          <b-form-checkbox
            v-model="campaignConfig.call_automatically"
            switch
            size="lg"
          >
            Automatically call
          </b-form-checkbox>
        </b-col>
        <b-col> </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <div class="inline-select-wrap">
            <label class="inline-select-label">
              Number of Email Opens before call
            </label>
            <select
              v-model.number="campaignConfig.num_email_opens_before_call"
              class="inline-select"
            >
              <option
                v-for="num in [1, 2, 3, 4]"
                :key="`es-key-${num}`"
                :value="num"
              >
                {{ num }}
              </option>
            </select>
          </div>
        </b-col>
        <b-col>
          <div class="setting-info">
            Once the prospect has opened a particular email a set number of
            times a call will automatically be put through. We recommend setting
            the number of opens between 4 and 7.
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-checkbox
            v-model="campaignConfig.pause_on_successful_call"
            switch
            size="lg"
          >
            Pause on successful call
          </b-form-checkbox>
        </b-col>
        <b-col>
          <div class="setting-info">
            Once you have contacted the prospect via the phone, Reply will
            automatically grant that contact Paused status for their current
            campaign.
          </div>
        </b-col>
      </b-row>
    </SettingsCollapse>
    <SettingsCollapse
      icon="settings-2"
      label="Advanced Campaign Configuration"
      description="Specify which type of emails (first step or follow up) are prioritized in case of the campaign approaching its sending limits. Set how often you can contact the same person."
    >
      <template>
        <b-row>
          <b-col md="4">
            <b-form-group label="Emails priority">
              <b-form-select v-model="campaignConfig.emails_priority">
                <option
                  v-for="priority in fieldOptions.emails_priority"
                  :key="`ep-${priority.value}`"
                  :value="priority.value"
                  :selected="priority.value === campaignConfig.emails_priority"
                >
                  {{ priority.label }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <div class="setting-info">
              Specify which type of emails (first step or follow-up) are
              prioritized in case of the campaign approaching its sending
              limits.
            </div>
          </b-col>
        </b-row>
      </template>
    </SettingsCollapse>
  </div>
</template>

<script>
import SettingsCollapse from '~/components/General/SettingsCollapse'
import { ALL_EMAIL_ACCOUNTS_QUERY } from '~/graphql/email-account/queries'

export default {
  components: { SettingsCollapse },

  props: {
    configuration: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      campaignConfig: {
        call_automatically: true,
        disable_opens_tracking: true,
        email_account_id: null,
        email_delay: 27,
        emails_priority: 'follow-up',
        enable_links_tracking: true,
        max_no_emails: 200,
        max_unreplied_emails_to_track: 3,
        num_email_opens_before_call: 3,
        pause_on_successful_call: true,
        upon_reply: 'mark-as-finished',
      },
      emailAccounts: [],
    }
  },

  apollo: {
    emailAccounts: {
      query: ALL_EMAIL_ACCOUNTS_QUERY,
      result({ data, loading }) {
        if (!loading) {
          if (
            !this.campaignConfig.email_account_id &&
            data.emailAccounts.length
          ) {
            this.campaignConfig.email_account_id = data.emailAccounts[0].id
          }
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    fieldOptions() {
      return {
        upon_reply: [
          { label: 'Continue Sending emails', value: 'continue-sending' },
          { label: 'Mark person as finished', value: 'mark-as-finished' },
        ],
        emails_priority: [
          { label: 'Equally divided between', value: 'equally-divided' },
          { label: 'First Step Emails', value: 'first-step-email' },
          { label: 'Follow-up Emails', value: 'follow-up' },
        ],
      }
    },
  },

  watch: {
    campaignConfig: {
      handler(value) {
        this.$emit('change', value)
      },
      deep: true,
    },
  },

  mounted() {
    if (this.configuration && this.configuration.id) {
      this.campaignConfig = { ...this.configuration }
    } else if (this.configuration && !this.configuration.emails_priority) {
      this.$emit('change', this.campaignConfig)
    }
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.setting-info {
  color: $gray-500;
  margin: auto;
  position: relative;
  padding-left: 45px;
  margin-top: 25px;

  &::before {
    content: url('~@/assets/icons/information.svg');
    width: 28px;
    height: 28px;
    position: absolute;
    left: 0;
  }
}
.campaign-settings {
  .form-group {
    margin-bottom: 35px;

    .custom-select,
    .form-control {
      border-color: $gray-200;
      box-shadow: 0 1px 3px 0 $gray-200;
      border-radius: 0.3rem;

      &:focus {
        border-color: $primary;
      }

      &.is-invalid {
        border-color: lighten($danger, 40);
      }
    }

    legend,
    label {
      color: $gray-600;
      font-size: 0.8rem;
    }
  }

  .custom-control {
    margin-top: 30px;
  }

  .inline-select-wrap {
    margin-top: 30px;

    .inline-select-label {
      color: $gray-600;
      margin-right: 10px;
      font-size: 1.1rem;
    }

    .inline-select {
      border-color: $gray-200;
      box-shadow: 0 1px 3px 0 $gray-200;
      border-radius: 0.3rem;
      padding: 4px 10px;
      width: 65px;
      outline: 0;

      &:focus {
        border-color: $primary;
      }
    }
  }
}
</style>
