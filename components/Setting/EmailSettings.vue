<template>
  <div class="campaign-settings">
    <SettingsCollapse
      icon="email"
      label="General Email Configuration"
      description="Select email account that will be used for sending and receiving emails, set maximum number of first step emails, delay between emails, enable/disable email opens and links tracking."
    >
      <template>
        <b-row>
          <b-col md="4">
            <b-form-group label="Email account for sending email">
              <b-form-select value="a">
                <option value="a">trondev@tronweb.co</option>
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
              <b-form-input type="number" value="200" />
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
              <b-form-input type="number" value="27" />
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
            <b-form-checkbox switch size="lg" :checked="true">
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
            <b-form-checkbox switch size="lg" :checked="true">
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
              <b-form-select value="b">
                <option value="a">Continue Sending emails</option>
                <option value="b">Mark person as finished</option>
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
              <b-form-input type="number" value="3" />
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
      icon="settings-2"
      label="Advanced Email Configuration"
      description="Specify which type of emails (first step or follow up) are prioritized in case of the campaign approaching its sending limits. Set how often you can contact the same person."
    >
      <template>
        <b-row>
          <b-col md="4">
            <b-form-group label="Emails priority">
              <b-form-select value="b">
                <option value="a">Equally divided between</option>
                <option value="b">First Step Emails</option>
                <option value="c">Follow-up Emails</option>
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

export default {
  components: { SettingsCollapse },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-settings {
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
