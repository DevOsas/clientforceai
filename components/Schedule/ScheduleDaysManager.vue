<template>
  <div class="pt-3">
    <div class="d-flex">
      <div class="day-name-col"></div>
      <div class="schedule-timeline">
        <div
          v-for="(num, numIndex) in timelines"
          :key="numIndex + 1"
          class="interval"
        >
          {{ num }}
        </div>
      </div>
    </div>

    <div v-for="(day, i) in days" :key="i + 1" class="schedule-ranges">
      <div class="day-name-col">
        <b-form-checkbox
          :id="`checklist-${id}-${i + 1}`"
          name="checkbox-1"
          :checked="day.isActive"
          @change.native="handleActivateDay(i, $event)"
        >
          {{ day.weekDay }}
        </b-form-checkbox>
      </div>
      <div class="bar-wrap">
        <template v-if="day.isActive">
          <div
            v-for="(range, rangeIndex) in day.timeRanges"
            :key="rangeIndex + 1"
            class="bar"
            :style="getRangeStyle(range.fromTime, range.toTime)"
          >
            <span v-show="day.isActive && !isMinsDiffLessThan(range)">{{
              getRangeText(range.fromTime, range.toTime)
            }}</span>
            <b-button
              variant="link"
              :class="{ middle: isMinsDiffLessThan(range) }"
              @click.prevent="handleDeactivateDay(i)"
            >
              <SvgIcon name="minus-circle" />
            </b-button>
          </div>
        </template>
      </div>
      <div class="day-actions">
        <b-button
          variant="link"
          class="add-btn"
          @click.prevent="handleShowTimeForm(i)"
        >
          <SvgIcon name="add" />
        </b-button>
      </div>
    </div>

    <b-modal
      id="TimeFormModal"
      modal-class="time-form-modal"
      centered
      hide-header
      hide-footer
      @hide="handleTimeFormOnHide"
    >
      <template #default="{ hide }">
        <h4 class="my-4 text-center">Add time range</h4>

        <div class="time-row">
          <div class="time-column">
            <div class="select">
              <select v-model="timeForm.fromHour">
                <option
                  v-for="(hour, i) in hours"
                  :key="i + 1"
                  :value="hour + 1"
                >
                  {{ hour + 1 }}
                </option>
              </select>
            </div>
          </div>
          <div class="time-column">
            <div class="select">
              <select v-model="timeForm.fromMinute">
                <option
                  v-for="(minute, i) in minutes"
                  :key="i + 1"
                  :value="minute"
                >
                  {{ appendZero(minute) }}
                </option>
              </select>
            </div>
          </div>
          <div class="time-column">
            <div class="select">
              <select v-model="timeForm.fromAmPm">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div class="joint time-column">
            <span class="has-tex-weight-bold">--</span>
          </div>
          <div class="time-column">
            <div class="select">
              <select v-model="timeForm.toHour">
                <option
                  v-for="(hour, i) in hours"
                  :key="i + 1"
                  :value="hour + 1"
                >
                  {{ hour + 1 }}
                </option>
              </select>
            </div>
          </div>
          <div class="time-column">
            <div class="select">
              <select v-model="timeForm.toMinute">
                <option
                  v-for="(minute, i) in minutes"
                  :key="i + 1"
                  :value="minute"
                >
                  {{ appendZero(minute) }}
                </option>
              </select>
            </div>
          </div>
          <div class="time-column">
            <div class="select">
              <select v-model="timeForm.toAmPm">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        <div class="text-center mb-3">
          <b-button variant="link" class="text-dark mr-1" @click="hide">
            Cancel
          </b-button>
          <b-button
            type="submit"
            variant="primary"
            class="px-4"
            @click="handleSaveTimeRange"
          >
            Save
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    days: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      id: null,
      timelines: [...Array(25).keys()],
      hours: [...Array(12).keys()],
      minutes: [...Array(4).keys()].reduce(function (
        accumulator,
        currentValue,
        currentIndex
      ) {
        currentIndex === 0
          ? accumulator.push(0)
          : accumulator.push(accumulator[accumulator.length - 1] + 15)
        return accumulator
      },
      []),
      showTimeForm: false,
      timeForm: new this.$form({
        fromHour: '9',
        fromMinute: '0',
        fromAmPm: 'AM',
        toHour: '5',
        toMinute: '0',
        toAmPm: 'PM',
      }),
    }
  },

  mounted() {
    this.id = this._uid
  },

  methods: {
    handleShowTimeForm(dayIndex) {
      this.timeForm.reset()
      this.activeDayIndex = dayIndex

      this.$bvModal.show('TimeFormModal')
    },

    handleTimeFormOnHide() {
      this.activeDayIndex = null
    },

    handleSaveTimeRange() {
      const days = this.days
      const dayIndex = this.activeDayIndex
      const { fromHour, fromMinute, fromAmPm, toHour, toMinute, toAmPm } =
        this.timeForm

      if (dayIndex !== -1) {
        const newDays = [
          ...days.slice(0, dayIndex),
          {
            ...days[dayIndex],
            timeRanges: [
              {
                fromTime: {
                  ...this.timeTo24HStr({
                    hour: fromHour,
                    minute: fromMinute,
                    ampm: fromAmPm,
                  }),
                },
                toTime: {
                  ...this.timeTo24HStr({
                    hour: toHour,
                    minute: toMinute,
                    ampm: toAmPm,
                  }),
                },
              },
            ],
            isActive: true,
          },
          ...days.slice(dayIndex + 1),
        ]

        this.$emit('update', newDays)
      }

      this.$bvModal.hide('TimeFormModal')
    },

    handleDeactivateDay(index) {
      const days = this.days

      if (index !== -1) {
        const newDays = [
          ...days.slice(0, index),
          {
            ...days[index],
            timeRanges: [
              {
                fromTime: {
                  hour: 0,
                  minute: 0,
                },
                toTime: {
                  hour: 0,
                  minute: 0,
                },
              },
            ],
            isActive: false,
          },
          ...days.slice(index + 1),
        ]

        this.$emit('update', newDays)
      }
    },

    handleActivateDay(index, e) {
      const isActive = e.target.checked
      const days = this.days

      if (index !== -1) {
        const newDays = [
          ...days.slice(0, index),
          {
            ...days[index],
            timeRanges: [
              {
                fromTime: {
                  hour: 0,
                  minute: 0,
                },
                toTime: {
                  hour: isActive ? 23 : 0,
                  minute: isActive ? 45 : 0,
                },
              },
            ],
            isActive,
          },
          ...days.slice(index + 1),
        ]

        this.$emit('update', newDays)
      }
    },

    getRangeStyle(fromTime, toTime) {
      if (!fromTime || !toTime) {
        return {}
      }
      const fromTimeHours = fromTime.hour + fromTime.minute / 60
      const toTimeInHours = toTime.hour + toTime.minute / 60
      const fromToTimeDiff = toTimeInHours - fromTimeHours
      let width = 0.6 + 4 * fromToTimeDiff
      let startPos = 4 * fromTimeHours

      if (fromTime.hour > 3) {
        startPos += 0.15 * fromTime.hour
      }
      if (fromToTimeDiff < 10) {
        width += 0.075 * fromToTimeDiff
      } else if (fromToTimeDiff >= 10 && fromToTimeDiff < 15) {
        width += 0.12 * fromToTimeDiff
      } else if (fromToTimeDiff >= 15 && fromToTimeDiff < 20) {
        width += 0.13 * fromToTimeDiff
      } else if (fromToTimeDiff > 20) {
        width += 0.14 * fromToTimeDiff
      }
      return (
        width > 100 && (width = 100),
        { left: startPos + '%', width: width + '%' }
      )
    },

    getRangeText(fromTime, toTime) {
      return this.timeTo12HStr(fromTime) + ' - ' + this.timeTo12HStr(toTime)
    },

    timeTo12HStr(time) {
      let hours = time.hour
      let minutes = time.minute
      const ampm = hours >= 12 ? 'pm' : 'am'

      hours = hours % 12
      // eslint-disable-next-line no-unneeded-ternary
      hours = hours ? hours : 12 // the hour '0' should be '12'

      minutes = minutes < 10 ? '0' + minutes : minutes
      return hours + ':' + minutes + ' ' + ampm
    },

    timeTo24HStr(time) {
      let hours = time.hour
      let minutes = time.minute
      const AMPM = time.ampm

      if (AMPM === 'PM' && hours < 12) hours = Number(hours) + 12
      if (AMPM === 'AM' && hours === 12) hours = Number(hours) - 12

      if (hours < 10 && hours.length < 2) hours = '0' + hours
      if (minutes < 10 && minutes.length < 2) minutes = '0' + minutes

      return {
        hour: Number(hours),
        minute: Number(minutes),
      }
    },

    appendZero(num) {
      return String(num).length < 2 ? '0' + num : num
    },

    isMinsDiffLessThan(range) {
      const time = range.fromTime.hour * 60 + range.fromTime.minute
      return range.toTime.hour * 60 + range.toTime.minute - time < 210
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.day-name-col {
  max-width: 10%;
  max-height: 100%;
  flex: 1 1 100%;
  box-sizing: border-box;
}

.schedule-timeline {
  display: flex;
  flex: 1 1 89.5%;
  max-width: 89.5%;
  max-height: 100%;

  .interval {
    flex: 1 1 4%;
    max-width: 4%;
    max-height: 100%;
    color: $dark;
    font-size: 12px;
  }
}

.schedule-ranges {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-content: center;
  margin: 30px 0;
  max-width: 100%;

  .btn.add-btn {
    margin-left: 15px;
    font-size: 18px;
    color: $dark;
    padding: 0;
    box-shadow: none !important;
  }

  .bar-wrap {
    flex: 1 1 87%;
    max-width: 87%;
    max-height: 100%;
    position: relative;
    height: 50px;
    background: $gray-200;

    .bar {
      position: absolute;
      min-width: 20px;
      height: 100%;
      background: $primary;
      line-height: 50px;
      text-align: center;
      transition: all 0.15s;

      span {
        color: $white;
        font-size: 14px;
      }

      .btn {
        position: absolute;
        right: 5px;
        top: 12px;
        padding: 0;
        box-shadow: none !important;

        &.middle {
          position: static;
        }

        .icon {
          font-size: 17px;
          color: lighten($primary, 30);
          transition: all 0.1s;
        }
      }
    }
  }

  .day-actions {
    flex: 1 1 3%;
    max-width: 3%;
    max-height: 100%;
  }
}

.time-form-modal {
  .joint {
    align-items: flex-end;
    display: flex;
    font-size: 22px;
  }

  .time-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 0 25px;

    .select select {
      border-width: 0;
      border-bottom-width: 1px;
      border-radius: 0;
      outline: none;

      &:active,
      &:focus {
        outline: none;
        box-shadow: none;
      }
    }
  }
}
</style>
