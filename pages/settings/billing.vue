<template>
  <div class="user-settings-page">
    <b-container>
      <div class="row py-3">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>
        <div class="col col-md-9 col-sm-12">
          <billing
            :value="value"
            :max-val="maxVal"
            :mail-count="mailCount"
            :used-mail="usedMail"
            :data="data"
          />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Billing from '../../components/Setting/BillingPlan.vue'
import SideBar from '../../components/Setting/SideBar.vue'

export default {
  middleware: 'auth',

  name: 'SettingsBilling',

  components: { Billing, SideBar },

  data() {
    return {
      value: '10',
      maxVal: '300',
      mailCount: '200',
      usedMail: '0',
      data: [
        { title: '200 emails', amount: null, desc: 'Included in subscription' },
        { title: 'unlimited emails', amount: '49', desc: 'month' },
      ],
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
