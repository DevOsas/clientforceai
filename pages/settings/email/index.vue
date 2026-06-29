<template>
  <div class="account-email-page">
    <b-container>
      <div class="row py-3">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>
        <div class="col col-md-9 col-sm-12">
          <email-settings />
          <div class="text-center mt-5">
            <b-button variant="settings-save">
              <SvgIcon name="save" />
              Save Settings
            </b-button>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import EmailSettings from '../../../components/Setting/EmailSettings.vue'
import SideBar from '../../../components/Setting/SideBar.vue'

export default {
  middleware: 'auth',

  name: 'AccountEmail',

  components: { SideBar, EmailSettings },

  data() {
    return {}
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.account-email-page {
  margin-top: 30px;

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
