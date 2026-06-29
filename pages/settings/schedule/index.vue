<template>
  <div class="schedule-page">
    <b-container>
      <div class="row py-3">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>

        <div class="col col-md-9 col-sm-12">
          <b-button size="lg" variant="link" class="back-btn" @click="back">
            <SvgIcon name="arrow-left" />
          </b-button>
          <ScheduleList @edit="handleEditSchedule" />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import SideBar from '../../../components/Setting/SideBar.vue'

import ScheduleList from '~/components/Schedule/ScheduleList'

export default {
  middleware: 'auth',

  components: { ScheduleList, SideBar },

  methods: {
    back() {
      this.$router.go(-1)
    },
    handleEditSchedule(scheduleId) {
      this.$router.push({
        name: 'settings-schedule-scheduleId',
        params: { scheduleId },
      })
    },
  },
  // handleScheduleDelete(scheduleToDelete) {
  //   if (scheduleToDelete.isUserDefault) {
  //     this.handleChooseSchedule(null)
  //   }
  // },
}
</script>
<style lang="scss">
@import '~@/assets/scss/variables';

.schedule-page {
  position: relative;
  .btn.back-btn {
    position: absolute;
    top: 2px;
    left: 20px;
    color: $dark;
    font-size: 35px;
    line-height: 1;
    padding: 0;
    box-shadow: none;
  }
}
</style>
