<template>
  <div class="add-schedule-page">
    <b-container>
      <div class="schedule-list-wrap">
        <div v-if="$apollo.queries.schedules.loading">
          <b-skeleton
            v-for="num in 2"
            :key="num"
            animation="fade"
            width="100%"
            height="45px"
            class="mb-2"
          />
        </div>
        <div v-else-if="schedules.length < 1" class="empty-schedule">
          <MailBroIl class="illustration" />
          <h2 class="title">Start by creating a Campaign</h2>
          <b-button
            variant="primary"
            size="lg"
            class="text-uppercase px-5"
            :to="{ name: 'campaigns' }"
          >
            Create Campaign
          </b-button>
        </div>
        <template v-else>
          <div
            v-for="schedule in schedules"
            :key="schedule.name"
            class="schedule-item"
            @click="chooseSchedule(schedule)"
          >
            <div class="d-flex align-items-center">
              <div
                v-if="campaign"
                class="circular-check"
                :class="{ active: campaign.schedule.id === schedule.id }"
              >
                <SvgIcon name="check" />
              </div>
              <div
                v-else
                class="circular-check"
                :class="{ active: schedule.isUserDefault }"
              >
                <SvgIcon name="check" />
              </div>
              <div class="schedule-name">{{ schedule.title }}</div>
            </div>

            <div class="weekdays">
              <div
                v-for="(day, dayIndex) in schedule.plan"
                :key="`${schedule.id}-${dayIndex}`"
                class="weekday"
                :class="{ selected: day.isActive }"
              >
                {{ day.weekDay.substring(0, 3) }}
              </div>
            </div>

            <div class="schedule-actions">
              <b-button
                v-if="!campaign && !schedule.isUserDefault"
                v-b-tooltip.hover
                title="Set as Default Schedule"
                variant="link"
                size="sm"
                @click="handleMakeDefaultSchedule(schedule)"
              >
                <SvgIcon name="checked-circle" />
              </b-button>
              <b-button
                v-else
                v-b-tooltip.hover
                title="Default Schedule"
                variant="link"
                size="sm"
              >
                <SvgIcon name="checked-circle" class="invisible" />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Edit schedule"
                variant="link"
                size="sm"
                @click="editSchedule(schedule.id)"
              >
                <SvgIcon name="settings" />
              </b-button>
              <b-button
                v-b-tooltip.hover
                title="Delete schedule"
                variant="link"
                size="sm"
                :disabled="schedule.isUserDefault"
                @click="showDeleteScheduleConfirmation(schedule)"
              >
                <SvgIcon name="delete" />
              </b-button>
            </div>
          </div>
          <div class="schedule-footer">
            <b-button
              variant="outline-primary"
              size="lg"
              @click="editSchedule(1)"
            >
              <SvgIcon name="plus-colored" class="plus-icon" />
              Create New Schedule
            </b-button>
          </div>
        </template>
      </div>
    </b-container>

    <b-modal
      id="DeleteScheduleConfirmationModal"
      content-class="text-center"
      centered
      hide-header
      hide-footer
      @hidden="handleDeleteScheduleConfirmOnHide"
    >
      <template #default="{ hide }">
        <h4 class="mb-3">{{ scheduleToDelete.title }}</h4>
        <p class="mb-3">Are you sure you would like to remove this schedule?</p>
        <div class="pr-3 pl-3">
          <b-button variant="link" class="mr-1" pill @click="hide">
            Cancel
          </b-button>
          <b-button
            variant="primary"
            class="px-4"
            pill
            @click="handleDeleteSchedule(scheduleToDelete)"
          >
            Okay
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { SCHEDULE_LIST_QUERY } from '~/graphql/schedule/queries'
import {
  DELETE_SCHEDULE_MUTATION,
  UPDATE_SCHEDULE_MUTATION,
} from '~/graphql/schedule/mutations'

export default {
  props: {
    campaign: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      schedules: [],
      scheduleToDelete: null,
    }
  },

  apollo: {
    schedules: {
      query: SCHEDULE_LIST_QUERY,
      variables: {
        offset: 0,
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  methods: {
    editSchedule(schedule) {
      this.$emit('edit', schedule)
    },
    chooseSchedule(schedule) {
      this.$emit('choose', schedule)
    },
    showDeleteScheduleConfirmation(schedule) {
      if (schedule.isUserDefault) {
        return
      }
      this.scheduleToDelete = schedule

      this.$bvModal.show('DeleteScheduleConfirmationModal')
    },

    handleDeleteScheduleConfirmOnHide() {
      this.scheduleToDelete = null
    },

    handleMakeDefaultSchedule(scheduleToUpdate) {
      if (scheduleToUpdate.isUserDefault) {
        return
      }

      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: UPDATE_SCHEDULE_MUTATION,
          variables: {
            id: scheduleToUpdate.id,
          },

          update: (store) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: SCHEDULE_LIST_QUERY,
              variables: { offset: 0 },
            })

            // Update schedules
            data.schedules = data.schedules.map((schedule) => ({
              ...schedule,
              isUserDefault: schedule.id === scheduleToUpdate.id,
            }))
            // Write the schedules data back to the cache.
            store.writeQuery({
              query: SCHEDULE_LIST_QUERY,
              variables: { offset: 0 },
              data,
            })
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful!',
            text: 'Schedule successfully set as default',
          })

          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Operation failed!',
            text: 'Unable to update default schedule',
          })
          this.$nuxt.$loading.finish()
        })
    },

    handleDeleteSchedule(scheduleToDelete) {
      this.$bvModal.hide('DeleteScheduleConfirmationModal')

      if (scheduleToDelete.isUserDefault) {
        return
      }

      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: DELETE_SCHEDULE_MUTATION,
          variables: {
            id: scheduleToDelete.id,
          },
          update: (store) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: SCHEDULE_LIST_QUERY,
              variables: { offset: 0 },
            })
            const scheduleIndex = data.schedules.findIndex((shdle) => {
              return shdle.id === scheduleToDelete.id
            })

            if (scheduleIndex !== -1) {
              const newSchedules = [
                ...data.schedules.slice(0, scheduleIndex),
                ...data.schedules.slice(scheduleIndex + 1),
              ]

              // Update schedules
              data.schedules = newSchedules
              // Write the schedules data back to the cache.
              store.writeQuery({
                query: SCHEDULE_LIST_QUERY,
                variables: { offset: 0 },
                data,
              })
            }
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful!',
            text: 'Schedule deleted successfully',
          })

          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Operation failed!',
            text: 'Unable to delete schedule',
          })
          this.$nuxt.$loading.finish()
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-schedule-page {
  .schedule-list-wrap {
    background-color: $white;
    border: 1px solid $gray-200;
    box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 30px 20px;
    margin: auto;
    margin-top: 50px;

    .schedule-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid $gray-200;
      padding: 20px 20px;
      cursor: pointer;

      &:last-child {
        border-bottom: 0;
      }

      &:hover {
        box-shadow: 0 1px 5px 0 rgba($gray-500, 0.3);
        border-radius: 3px;
      }

      .circular-check {
        width: 22px;
        height: 22px;
        background-color: $white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;

        .icon {
          color: $white;
          font-size: 0.8rem;
        }

        &:not(.active) {
          border: 1px solid $gray-500;
        }

        &.active {
          background-color: $primary;
        }
      }

      .schedule-name {
        color: $gray-500;
        font-size: 18px;
        width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .weekdays {
        display: flex;

        .weekday {
          padding: 0 10px;
          background: #e5ffe1;
          border: 1px solid #e0e0e0;
          border-radius: 7px;
          margin-right: 5px;
          text-transform: uppercase;
          font-size: 16px;

          &.selected {
            border-color: $primary;
            background: $primary;
            color: $white;
          }
        }
      }

      .schedule-actions {
        .btn {
          color: $gray-600;
          box-shadow: none;

          &:hover {
            color: rgba($gray-600, 0.7);
          }

          .icon {
            font-size: 1.2rem;
          }
        }
      }
    }
  }

  .schedule-footer {
    margin-top: 70px;
    text-align: center;

    .btn-outline-primary {
      color: $gray-600;

      .plus-icon {
        margin-right: 7px;
        font-size: 25px;
        line-height: 0;
      }

      &:hover {
        color: $white;
      }
    }
  }
}
</style>
