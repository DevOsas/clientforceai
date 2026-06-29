<template>
  <div class="schedule-container">
    <div class="schedule-select" :tabindex="tabindex" @blur="open = false">
      <div class="selected" :class="{ open: open }" @click="open = !open">
        <SvgIcon name="check-circle" class="schedule-marker" />
        <span class="schedule-name">{{ selected.title }}</span>
        <span class="schedule-timestamp">{{ selected.timezone.name }}</span>
      </div>
      <div class="items" :class="{ selectHide: !open }">
        <div
          v-for="(schedule, i) of schedules"
          :key="i"
          class="select-option"
          @click="
            selected = schedule
            open = false
            $emit('input', schedule)
          "
        >
          <SvgIcon name="schedule-button" />
          <span class="schedule-name">
            {{ schedule.title }}
          </span>
          <span class="schedule-timestamp">{{ schedule.timezone.name }}</span>
        </div>
        <div @click="editSchedule(1)">
          <SvgIcon name="add" />
          <span class="schedule-name">Add New</span>
        </div>
      </div>
    </div>
    <div class="my-5 schedule-wrapper d-flex justify-content-between">
      <div class="weekdays">
        <div
          v-for="(day, dayIndex) in selected.plan"
          :key="`${selected.id}-${dayIndex}`"
          class="weekday"
          :class="{ selected: day.isActive }"
        >
          {{ day.weekDay.substring(0, 3) }}
        </div>
      </div>
      <div class="schedule-actions">
        <b-button
          v-b-tooltip.hover
          title="Edit schedule"
          variant="link"
          size="sm"
          @click="editSchedule(1)"
        >
          <SvgIcon name="settings" />
          Customize
        </b-button>
      </div>
    </div>
    <div class="mt-3 d-flex justify-content-between">
      <NuxtLink
        :to="{
          name: 'settings-schedule',
        }"
      >
        View all Schedules
      </NuxtLink>
      <div>
        <b-button
          variant="link"
          class="text-muted mr-2"
          @click="$bvModal.hide('UpdateCampaignScheduleModal')"
        >
          Cancel
        </b-button>
        <b-button
          variant="primary"
          class="px-4"
          @click="updateCampaignSchedule"
        >
          Ok
        </b-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    schedules: {
      type: Array,
      required: true,
    },
    campaign: {
      type: Object,
      required: true,
    },
    default: {
      type: Object,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.schedules.length > 0
        ? this.schedules[0]
        : null,
      open: false,
    }
  },

  mounted() {
    this.$emit('input', this.selected)
  },

  methods: {
    editSchedule(scheduleId) {
      this.$router.push({
        name: 'settings-schedule-scheduleId',
        params: { scheduleId },
      })
    },
    updateCampaignSchedule() {
      this.$emit('update', this.selected)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.schedule-container {
  .schedule-select {
    position: relative;
    width: 100%;
    text-align: left;
    outline: none;
    height: 47px;
    line-height: 47px;
    margin-bottom: 20px;

    .selected {
      background-color: $gray-100;
      border-bottom: 2px solid $primary;
      color: $gray-600;
      padding-left: 1em;
      cursor: pointer;
      user-select: none;

      .open {
        border-bottom: 2px solid $primary;
        box-shadow: 0 3px 30px 20px rgba(0, 0, 0, 0.2);
      }

      &::after {
        position: absolute;
        content: '';
        top: 22px;
        right: 1em;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-color: $gray-600 transparent transparent transparent;
      }
    }

    .schedule-name {
      color: $gray-500;
      font-size: 16px;
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .schedule-marker {
      fill: $primary;
    }
    svg {
      fill: $primary;
    }

    .schedule-timestamp {
      color: $gray-500;
      float: right;
      margin-right: 55px;
      font-size: 14px;
    }

    .items {
      color: $gray-600;
      overflow-y: hidden;
      position: absolute;
      background-color: $gray-100;
      left: 0;
      right: 0;
      z-index: 1;
      font-size: 20px;
      box-shadow: 0 3px 30px 20px rgba(0, 0, 0, 0.2);

      div {
        color: $gray-600;
        padding-left: 1em;
        cursor: pointer;
        user-select: none;
        font-size: 20px;
        margin: 15px auto;

        &:hover {
          background-color: $gray-400;
        }
      }
    }
  }

  .schedule-wrapper {
    margin-bottom: 20px;

    .weekdays {
      display: flex;

      .weekday {
        padding: 5px 10px;
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

  .selectHide {
    display: none;
  }
}
</style>
