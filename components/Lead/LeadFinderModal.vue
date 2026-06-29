<template>
  <b-modal
    id="FinderModal"
    size="lg"
    modal-class="finder-modal"
    hide-header
    hide-footer
    centered
  >
    <template #default="{ hide }">
      <div class="finder-modal-header">
        <h3 class="finder-modal-title">Choose a Lead Source</h3>
        <p>
          Find Hot Targeted Leads for your business by simply <br />
          using a search from any of our robust Lead Sources
        </p>

        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <div class="finder-options">
        <div class="finder-option" @click="findWith({ name: 'forms' })">
          <div class="finder-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="form-elements" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="finder-option-label">Form Capture</div>

          <SvgIcon name="arrow-right" class="finder-option-arrow" />
        </div>
        <div class="finder-option" @click="findWith({ name: 'finder-gmb' })">
          <div class="finder-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="GMB" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="finder-option-label">Local Businesses</div>

          <SvgIcon name="arrow-right" class="finder-option-arrow" />
        </div>
        <div
          class="finder-option"
          @click="findWith({ name: 'chrome-extension' })"
        >
          <div class="finder-option-icon-wrap">
            <SvgIcon name="line-wings-left" class="wings" />
            <SvgIcon name="google" class="main-icon" />
            <SvgIcon name="line-wings-right" class="wings" />
          </div>
          <div class="finder-option-label">LinkedIn Leads</div>

          <SvgIcon name="arrow-right" class="finder-option-arrow" />
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  methods: {
    findWith(route) {
      this.$router.push(route, () => {})
      this.$bvModal.hide('FinderModal')
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.finder-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 70px 70px 100px;
  }

  .finder-modal-header {
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

    .finder-modal-title {
      background-color: $primary;
      padding: 10px 40px;
      color: $white;
      border-radius: 20px;
      margin-bottom: 25px;
      font-size: 20px;
    }

    p {
      font-size: 18px;
      line-height: 22px;
      color: #646464;
    }
  }

  .finder-options {
    display: flex;
    justify-content: space-around;
    width: 900px;
    margin: auto;

    .finder-option {
      width: 275px;
      background-color: $white;
      box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;

      .finder-option-icon-wrap {
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
          font-size: 35px;
        }

        .main-icon {
          font-size: 60px;
          margin: 0 5px;
        }
      }

      .finder-option-label {
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        text-align: center;
        margin-top: 30px;
        color: $gray-600;
        line-height: 115.8%;
      }

      .finder-option-arrow {
        font-size: 28px;
        margin-top: 20px;
        color: $primary;
        opacity: 0;
      }

      &:hover {
        background: #edfeeb;
        border: 1px solid #3abc29;

        .finder-option-icon-wrap {
          background-color: $primary;

          .icon {
            color: $white;
          }
        }

        .finder-option-arrow {
          opacity: 1;
        }
      }
    }
  }
}
</style>
