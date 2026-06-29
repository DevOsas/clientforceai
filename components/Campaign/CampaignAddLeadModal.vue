<template>
  <b-modal
    id="CampaignAddLeadModal"
    size="lg"
    modal-class="campaign-add-lead-modal"
    hide-header
    hide-footer
    centered
    @hidden="$emit('hidden')"
  >
    <template #default="{ hide }">
      <div class="campaign-add-lead-modal-header">
        <h3 class="campaign-add-lead-modal-title">Add Leads to Campaign</h3>

        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <div class="campaign-add-lead-options">
        <div class="campaign-add-lead-option" @click="addLeadsVia('csv')">
          <div class="campaign-add-lead-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="csv" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="campaign-add-lead-option-label">Import CSV FILE</div>
          <div class="campaign-add-lead-option-description">
            Add contacts from CSV file to leads list via bulk upload.
          </div>

          <SvgIcon name="arrow-right" class="campaign-add-lead-option-arrow" />
        </div>
        <div class="campaign-add-lead-option" @click="addLeadsVia('existing')">
          <div class="campaign-add-lead-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="users" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="campaign-add-lead-option-label">Add From Existing</div>
          <div class="campaign-add-lead-option-description">
            Choose from existing leads in your account
          </div>

          <SvgIcon name="arrow-right" class="campaign-add-lead-option-arrow" />
        </div>
        <div class="campaign-add-lead-option" @click="addLeadsVia('manual')">
          <div class="campaign-add-lead-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="add-contact" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="campaign-add-lead-option-label">Add Manually</div>
          <div class="campaign-add-lead-option-description">
            Add contacts to leads list manually one by one.
          </div>

          <SvgIcon name="arrow-right" class="campaign-add-lead-option-arrow" />
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  methods: {
    addLeadsVia(via) {
      this.$emit('add-via', via)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-add-lead-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 70px 70px 100px;
  }

  .campaign-add-lead-modal-header {
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

    .campaign-add-lead-modal-title {
      background-color: $primary;
      padding: 10px 40px;
      color: $white;
      border-radius: 20px;
      margin-bottom: 25px;
      font-size: 20px;
    }

    p {
      text-align: center;
      font-size: 18px;
      line-height: 22px;
      color: #646464;
    }
  }

  .campaign-add-lead-options {
    display: flex;
    justify-content: space-around;
    margin: auto;

    .campaign-add-lead-option {
      width: 250px;
      background-color: $white;
      box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 40px 30px 10px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;

      .campaign-add-lead-option-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 164px;
        height: 144px;
        border: 1px solid #6ed160;
        box-sizing: border-box;
        box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
        border-radius: 10px;

        .icon {
          color: $primary;
        }

        .wings {
          font-size: 25px;
        }

        .main-icon {
          font-size: 70px;
          margin: 0 5px;
        }
      }

      .campaign-add-lead-option-label {
        font-size: 15px;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        margin-top: 30px;
        color: $gray-600;
        line-height: 115.8%;
        margin-bottom: 15px;
      }

      .campaign-add-lead-option-description {
        font-size: 14px;
        text-align: center;
        text-transform: capitalize;
        color: #263238;
      }

      .campaign-add-lead-option-arrow {
        font-size: 28px;
        margin-top: 10px;
        color: $primary;
        opacity: 0;
      }

      &:hover {
        background: #edfeeb;
        border: 1px solid #3abc29;

        .campaign-add-lead-option-icon-wrap {
          background-color: $primary;

          .icon {
            color: $white;
          }
        }

        .campaign-add-lead-option-arrow {
          opacity: 1;
        }
      }
    }
  }
}
</style>
