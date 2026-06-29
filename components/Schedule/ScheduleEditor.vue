<template>
  <b-container>
    <div class="edit-schedule-header mt-5">
      <b-button size="lg" variant="link" class="back-btn" @click="back">
        <SvgIcon name="arrow-left" />
      </b-button>

      <div class="schedule-name-wrap">
        <SvgIcon name="clock" class="clock-icon" />
        <b-form-input v-model="scheduleForm.name" required />
      </div>

      <div class="column ml-30">
        <b-form-select v-model="timezone" class="zone-select">
          <option value="">Select timezone</option>
          <option v-for="zone in timezones" :key="zone.id" :value="zone.id">
            {{ zone.name }}
          </option>
        </b-form-select>
      </div>
      <div class="ml-auto">
        <b-button variant="primary" class="px-4" @click="saveSchedule">
          <b-spinner v-if="scheduleForm.busy" class="mr-1" small />
          Save
        </b-button>
      </div>
    </div>

    <ScheduleDaysManager :days="days" @update="handleDaysUpdate" />

    <b-form-checkbox v-model="separateFollowUps" size="lg" class="my-5" switch>
      Separate schedule for follow-ups
    </b-form-checkbox>

    <template v-if="separateFollowUps">
      <ScheduleDaysManager
        :days="followUpDays"
        class="mt-20"
        @update="handleFollowUpDaysUpdate"
      />
    </template>

    <SettingsCollapse
      icon="wrench-alt"
      label="Advanced settings"
      description="Configure default time zone and public holiday inclusion."
    >
      <template>
        <div class="d-flex">
          <b-form-checkbox
            v-model="useContactTimezone"
            size="lg"
            class="mr-5"
            switch
          >
            Use contact's specific time-zone if set
          </b-form-checkbox>

          <b-form-checkbox v-model="excludeHolidays" size="lg" switch>
            Exclude US public holidays
          </b-form-checkbox>
        </div>
      </template>
    </SettingsCollapse>
  </b-container>
</template>

<script>
import SettingsCollapse from '~/components/General/SettingsCollapse'
import ScheduleDaysManager from '~/components/Schedule/ScheduleDaysManager'

import { SCHEDULE_LIST_QUERY } from '~/graphql/schedule/queries'
import { SAVE_SCHEDULE_MUTATION } from '~/graphql/schedule/mutations'

export default {
  components: { SettingsCollapse, ScheduleDaysManager },

  props: {
    campaign: {
      type: Object,
      required: true,
    },
    schedule: {
      type: Object,
      required: true,
    },
    timezones: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      days: [],
      separateFollowUps: false,
      followUpDays: [],
      useContactTimezone: false,
      excludeHolidays: false,
      timezone: '',
      scheduleForm: new this.$form({
        name: 'New Schedule',
      }),
    }
  },

  created() {
    // if (this.schedule) {}
    this.updateFromSchedule(this.schedule)
  },

  methods: {
    back() {
      this.$router.go(-1)
    },

    handleDaysUpdate(days) {
      this.days = days
    },

    handleFollowUpDaysUpdate(days) {
      this.followUpDays = days
    },

    updateFromSchedule(schedule) {
      this.days = schedule.plan.map((day) => ({
        ...day,
        isActive: schedule.id === 1 ? true : day.isActive,
      }))
      this.followUpDays = schedule.followUpPlan.map((day) => ({
        ...day,
        isActive: schedule.id === 1 ? true : day.isActive,
      }))
      this.scheduleForm.name =
        schedule.title != null ? schedule.title : this.scheduleForm.name
      this.separateFollowUps = schedule.useFollowUpPlan
      this.useContactTimezone = schedule.useLeadTimezone
      this.excludeHolidays = schedule.excludeHolidays
      this.timezone = schedule.timezone.id
    },

    saveSchedule() {
      this.scheduleForm.busy = true
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: SAVE_SCHEDULE_MUTATION,
          variables: {
            id: this.schedule.id,
            title: this.scheduleForm.name,
            timezoneId: this.timezone,
            plan: this.days,
            followUpPlan: this.followUpDays,
            useLeadTimezone: !!this.useContactTimezone,
            useFollowUpPlan: !!this.separateFollowUps,
            excludeHolidays: !!this.excludeHolidays,
          },
          update: this.updateCache,
        })
        .then(() => {
          this.scheduleForm.busy = false
          this.$nuxt.$loading.finish()

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful!',
            text: 'Schedule saved successfully',
          })

          this.$router.go(-1)
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Operation failed!',
            text: 'Unable to save schedule',
          })

          this.scheduleForm.busy = false
          this.$nuxt.$loading.finish()
        })
    },

    updateCache(store, { data: { schedule } }) {
      try {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: SCHEDULE_LIST_QUERY,
          variables: { offset: 0 },
        })
        if (this.schedule.id === 1) {
          // Add the new schedule from the mutation to the end.
          data.schedules.push(schedule)
        } else {
          const index = data.schedules.findIndex(
            (schd) => schd.id === this.schedule.id
          )

          if (index !== -1) {
            data.schedules = [
              ...data.schedules.slice(0, index),
              schedule,
              ...data.schedules.slice(index + 1),
            ]
          }
        }
        // Write the schedules data back to the cache.
        store.writeQuery({
          query: SCHEDULE_LIST_QUERY,
          variables: { offset: 0 },
          data,
        })
      } catch (err) {
        // Do something
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.edit-schedule-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .btn.back-btn {
    color: $dark;
    font-size: 35px;
    margin-right: 81px;
    line-height: 1;
    padding: 0;
    box-shadow: none;
  }

  .schedule-name-wrap {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .clock-icon {
      font-size: 30px;
      margin-right: 20px;
    }

    .form-control {
      border: 0;
      border-radius: 0;
      padding: 2px 0;
      font-size: 18px;
      box-shadow: none;
      border-bottom: 1px solid $gray-500;

      &:focus {
        border-bottom-color: $primary;
      }
    }
  }
}
</style>
