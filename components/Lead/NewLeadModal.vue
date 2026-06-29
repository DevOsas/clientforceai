<template>
  <b-modal
    id="NewLeadModal"
    size="lg"
    modal-class="new-lead-modal"
    hide-header
    hide-footer
    centered
  >
    <template #default="{ hide }">
      <div class="new-lead-modal-header">
        <h3 class="new-lead-modal-title">Create a New Lead</h3>
        <p v-if="limitBalance.leads == 'unlimited'">
          You have unlimited leads.
        </p>
        <p v-else>You can add only {{ limitBalance.leads }} more lead(s).</p>
        <p>
          Import or add leads manually or find targeted prospects <br />
          based on a keyword or location from any of our robust Lead Sources
        </p>

        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <div class="new-lead-options">
        <div class="new-lead-option" @click="addLeadsVia('csv')">
          <div class="new-lead-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="csv" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="new-lead-option-label">Import CSV FILE</div>
          <div class="new-lead-option-description">
            Add contacts from CSV file to leads list via bulk upload.
          </div>

          <SvgIcon name="arrow-right" class="new-lead-option-arrow" />
        </div>
        <div class="new-lead-option" @click="addLeadsVia('manual')">
          <div class="new-lead-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="add-contact" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="new-lead-option-label">Add Manually</div>
          <div class="new-lead-option-description">
            Add contacts to leads list manually one by one.
          </div>

          <SvgIcon name="arrow-right" class="new-lead-option-arrow" />
        </div>
        <div class="new-lead-option" @click="addLeadsVia('finder')">
          <div class="new-lead-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="find-contact" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="new-lead-option-label">Find Prospects</div>
          <div class="new-lead-option-description">
            Find targeted leads based on a keywords and location.
          </div>

          <SvgIcon name="arrow-right" class="new-lead-option-arrow" />
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
    addLeadsVia(via) {
      if (via === 'csv') {
        this.$bvModal.hide('NewLeadModal')
        this.$bvModal.show('LeadCsvImportModal')
      } else if (via === 'manual') {
        this.$bvModal.hide('NewLeadModal')
        this.$bvModal.show('LeadFormModal')
      } else if (via === 'finder') {
        this.$bvModal.hide('NewLeadModal')
        this.$bvModal.show('FinderModal')
      } else {
        this.$bvModal.hide('NewLeadModal')
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.new-lead-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 70px 70px 100px;
  }

  .new-lead-modal-header {
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

    .new-lead-modal-title {
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

  .new-lead-options {
    display: flex;
    justify-content: space-around;
    margin: auto;

    .new-lead-option {
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

      .new-lead-option-icon-wrap {
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

      .new-lead-option-label {
        font-size: 15px;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        margin-top: 30px;
        color: $gray-600;
        line-height: 115.8%;
        margin-bottom: 15px;
      }

      .new-lead-option-description {
        font-size: 14px;
        text-align: center;
        text-transform: capitalize;
        color: #263238;
      }

      .new-lead-option-arrow {
        font-size: 28px;
        margin-top: 10px;
        color: $primary;
        opacity: 0;
      }

      &:hover {
        background: #edfeeb;
        border: 1px solid #3abc29;

        .new-lead-option-icon-wrap {
          background-color: $primary;

          .icon {
            color: $white;
          }
        }

        .new-lead-option-arrow {
          opacity: 1;
        }
      }
    }
  }
}
</style>
