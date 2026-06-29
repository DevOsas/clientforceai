<template>
  <b-modal
    id="NewCampaignModal"
    size="lg"
    modal-class="new-campaign-modal"
    hide-header
    hide-footer
    centered
  >
    <template #default="{ hide }">
      <div class="new-campaign-modal-header">
        <h3 class="new-campaign-modal-title">Create a campaign</h3>
        <p v-if="limitBalance.campaigns == 'unlimited'">
          You have Unlimited campaigns.
        </p>
        <p v-else>
          You can add only {{ limitBalance.campaigns }} more campaign(s).
        </p>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <div class="new-campaign-options">
        <div class="new-campaign-option" @click="createFromTemplate">
          <div class="new-campaign-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="template" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="new-campaign-option-label">From Template</div>
          <div class="new-campaign-option-description">
            Create a campaign from a template. You can use team or Clientforce
            templates.
          </div>

          <SvgIcon name="arrow-right" class="new-campaign-option-arrow" />
        </div>
        <div class="new-campaign-option" @click="createFromScratch">
          <div class="new-campaign-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="edit" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="new-campaign-option-label">From Scratch</div>
          <div class="new-campaign-option-description">
            Create a campaign from the ground up. Specify steps, emails
            templates, and add people.
          </div>

          <SvgIcon name="arrow-right" class="new-campaign-option-arrow" />
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  data() {
    return {
      limitBalance: {},
    }
  },
  apollo: {
    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
  },

  methods: {
    createFromTemplate() {
      this.$bvModal.hide('NewCampaignModal')
      this.$bvModal.show('CampaignTemplatesModal')
    },

    createFromScratch() {
      this.$bvModal.show('NewCampaignNameModal')
      this.$bvModal.hide('NewCampaignModal')
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.new-campaign-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 70px 70px 100px;
  }

  .new-campaign-modal-header {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .close-btn {
      font-size: 32px;
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .new-campaign-modal-title {
      background-color: $primary;
      padding: 10px 40px;
      color: $white;
      border-radius: 20px;
      margin-bottom: 25px;
      font-size: 20px;
    }
  }

  .new-campaign-options {
    display: flex;
    justify-content: space-around;
    width: 750px;
    margin: auto;
    margin-top: 40px;

    .new-campaign-option {
      width: 290px;
      background-color: $white;
      box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 40px 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;

      .new-campaign-option-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 164px;
        height: 144px;
        border: 1px solid #6ed160;
        box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
        border-radius: 10px;

        .icon {
          color: $primary;
        }

        .wings {
          font-size: 35px;
        }

        .main-icon {
          font-size: 60px;
          margin: 0 5px;
        }
      }

      .new-campaign-option-label {
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        margin-top: 30px;
        color: $gray-600;
        line-height: 115.8%;
        margin-bottom: 20px;
      }

      .new-campaign-option-description {
        font-size: 14px;
        text-align: center;
        text-transform: capitalize;
      }

      .new-campaign-option-arrow {
        font-size: 28px;
        margin-top: 10px;
        color: $primary;
        opacity: 0;
      }

      &:hover {
        background: #edfeeb;
        border: 1px solid #3abc29;

        .new-campaign-option-icon-wrap {
          background-color: $primary;

          .icon {
            color: $white;
          }
        }

        .new-campaign-option-arrow {
          opacity: 1;
        }
      }
    }
  }
}
</style>
