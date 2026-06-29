<template>
  <div class="user-settings-page">
    <b-container>
      <div class="row py-3 mb-5">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>
        <div class="col col-md-9 col-sm-12">
          <h3 class="user-settings-header pb-4 font-weight-bolder">
            <span class="mr-3">Profile</span>
          </h3>
          <personal-info />
          <company-detail :user="user" />
          <secruity-card />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import SideBar from '../../components/Setting/SideBar.vue'
import PersonalInfo from '../../components/Setting/PersonalInfo.vue'
import CompanyDetail from '../../components/Setting/CompanyDetail.vue'
import SecruityCard from '../../components/Setting/SecruityCard.vue'

export default {
  middleware: 'auth',

  name: 'SettingsProfile',

  components: { SideBar, PersonalInfo, CompanyDetail, SecruityCard },

  data() {
    return {
      user: null,
      form: new this.$form(),
    }
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.user-settings-page {
  margin-top: 30px;
}
</style>
