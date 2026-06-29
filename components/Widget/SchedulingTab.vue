<template>
  <div class="scheduling-tab">
    <!-- Left: Availability Section -->
    <div class="availability-section">
      <div class="availability-card">
        <h2 class="section-title">Availability</h2>

        <!-- Time Zone -->
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Time Zone</label>
            <CustomSelect
              v-model="timeZone"
              :options="timeZoneOptions"
              placeholder="Select time zone"
            />
          </div>
        </div>

        <!-- Calendar -->
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Calender</label>
            <CustomSelect
              v-model="calendar"
              :options="calendarOptions"
              placeholder="Select calendar"
            />
          </div>
        </div>

        <!-- Business Hours -->
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Business Hours</label>
            <CustomSelect
              v-model="businessHours"
              :options="businessHoursOptions"
              placeholder="Select hours"
            />
          </div>
        </div>

        <!-- Buffer -->
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Buffer</label>
            <CustomSelect
              v-model="buffer"
              :options="bufferOptions"
              placeholder="Select buffer"
            />
          </div>
        </div>

        <!-- Min Notice -->
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Min Notice</label>
            <CustomSelect
              v-model="minNotice"
              :options="minNoticeOptions"
              placeholder="Select min notice"
            />
          </div>
        </div>

        <!-- Voice Policies -->
        <div class="voice-policies-section">
          <h3 class="policies-title">Voice Policies</h3>

          <!-- Number Pool -->
          <div class="form-group">
            <label class="form-label">Number Pool</label>
            <input
              v-model="numberPool"
              type="text"
              class="form-input"
              placeholder="+1"
            />
          </div>

          <!-- Queue -->
          <div class="form-group queue-group">
            <div class="queue-row">
              <div class="queue-input-wrapper">
                <label class="form-label">Queue</label>
                <input
                  v-model="queue"
                  type="text"
                  class="form-input queue-input"
                  placeholder="Max 5 days"
                />
              </div>
              <div class="overflow-toggle">
                <span class="overflow-label">Overflow: Schedule</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="overflowSchedule" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Reputation -->
          <div class="form-group">
            <div class="reputation-row">
              <label class="form-label">Reputation</label>
              <span class="reputation-badge">Good</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Flow Preview Section -->
    <div class="preview-section">
      <div class="preview-card">
        <h2 class="section-title">Flow Preview</h2>

        <!-- Slot Grid -->
        <div class="slot-grid-section">
          <h3 class="grid-title">Slot Grid</h3>
          <div class="time-slots">
            <div class="slot-row">
              <button
                v-for="(slot, index) in timeSlots.slice(0, 4)"
                :key="index"
                class="time-slot"
              >
                <SvgIcon name="plus" class="slot-icon" />
                {{ slot }}
              </button>
            </div>
            <div class="slot-row">
              <button
                v-for="(slot, index) in timeSlots.slice(4, 8)"
                :key="index + 4"
                class="time-slot"
              >
                <SvgIcon name="plus" class="slot-icon" />
                {{ slot }}
              </button>
            </div>
          </div>
        </div>

        <!-- Call-Now Queue -->
        <div class="call-now-section">
          <h3 class="call-now-title">Call-Now queue</h3>
          <p class="eta-text">ETA- 2 - 4 mins Queue: 3 Ahead</p>
          <div class="action-buttons">
            <button class="call-now-btn">
              <SvgIcon name="phone" class="btn-icon" />
              Call me Now
            </button>
            <button class="pick-time-btn">
              <SvgIcon name="clock" class="btn-icon" />
              Pick A Time
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from '@/components/CampaignV2/CustomSelect.vue'

export default {
  name: 'SchedulingTab',

  components: {
    CustomSelect
  },

  data() {
    return {
      timeZone: 'Time',
      timeZoneOptions: ['Time', 'EST', 'PST', 'CST', 'MST'],
      calendar: 'Google Calendar - Connected',
      calendarOptions: ['Google Calendar - Connected', 'Outlook Calendar', 'Apple Calendar'],
      businessHours: 'Mon-Fri',
      businessHoursOptions: ['Mon-Fri', 'Mon-Sun', '24/7', 'Custom'],
      buffer: '15 min',
      bufferOptions: ['5 min', '10 min', '15 min', '30 min', '60 min'],
      minNotice: '10 min',
      minNoticeOptions: ['5 min', '10 min', '15 min', '30 min', '60 min'],
      numberPool: '+1',
      queue: 'Max 5 days',
      overflowSchedule: true,
      timeSlots: ['2:30 PM', '2:30 PM', '2:30 PM', '2:30 PM', '3:30 PM', '3:30 PM', '3:30 PM', '3:30 PM']
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.scheduling-tab {
  display: grid;
  grid-template-columns: 550px 1fr;
  gap: 32px;
}

.preview-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 32px 80px;
  }

.availability-section,
.preview-section {
  .availability-card
   {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 32px;
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #000;
    margin: 0 0 28px 0;
  }
}

// Availability Section Styles
.availability-section {
  .form-group {
    margin-bottom: 24px;

    .form-label-row {
      display: flex;
      align-items: center;
      gap: 16px;

      .form-label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #2f2f41;
        min-width: 120px;
        flex-shrink: 0;
      }
    }

    .form-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      color: #2f2f41;
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      font-size: 0.9rem;
      color: #2f2f41;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background: #fff;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: $primary;
      }

      &::placeholder {
        color: #9ca3af;
      }
    }
  }

  // Override CustomSelect background
  ::v-deep .custom-select-wrapper {
    .custom-select-trigger {
      background-color: #fff !important;
    }
  }

  .voice-policies-section {
    margin-top: 32px;
    padding-top: 28px;
    border-top: 1px solid #e5e5e5;

    .policies-title {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 20px 0;
    }

    .queue-group {
      .queue-row {
        display: flex;
        align-items: flex-end;
        gap: 16px;

        .queue-input-wrapper {
          flex: 1;

          .form-label {
            margin-bottom: 8px;
          }

          .queue-input {
            width: 100%;
          }
        }

        .overflow-toggle {
          display: flex;
          // align-items: center;
          gap: 12px;
          padding-bottom: 12px;

          .overflow-label {
            font-size: 0.9rem;
            color: #2f2f41;
            white-space: nowrap;
          }

          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;

            input {
              opacity: 0;
              width: 0;
              height: 0;

              &:checked + .toggle-slider {
                background-color: $primary;
              }

              &:checked + .toggle-slider:before {
                transform: translateX(24px);
              }
            }

            .toggle-slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #e5e5e5;
              transition: 0.3s;
              border-radius: 24px;

              &:before {
                position: absolute;
                content: '';
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
              }
            }
          }
        }
      }
    }

    .reputation-row {
      display: flex;
      align-items: center;
      gap: 16px;

      .form-label {
        margin: 0;
      }

      .reputation-badge {
        padding: 6px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #000;
        background: $primary;
        border-radius: 6px;
      }
    }
  }
}

// Preview Section Styles
.preview-section {
  .slot-grid-section {
    margin-bottom: 32px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 24px;


    .grid-title {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 20px 0;
    }

    .time-slots {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .slot-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;

        .time-slot {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          font-size: 0.9rem;
          font-weight: 400;
          color: #2f2f41;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;

          .slot-icon {
            font-size: 0.7rem;
          }

          &:hover {
            background: #f9fafb;
            border-color: $primary;
          }
        }
      }
    }
  }

  .call-now-section {
    padding: 24px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;

    .call-now-title {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 12px 0;
    }

    .eta-text {
      font-size: 0.9rem;
      color: #6b7280;
      margin: 0 0 20px 0;
    }

    .action-buttons {
      display: flex;
      gap: 12px;

      .call-now-btn,
      .pick-time-btn {
        // flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        .btn-icon {
          font-size: 1rem;
          color: #fff;
        }
      }

      .call-now-btn {
        color: #fff;
        background: #2f2f41;
        border: 1px solid #2f2f41;

        &:hover {
          background: #1f1f2e;
          border-color: #1f1f2e;
        }
      }

      .pick-time-btn {
        color: #2f2f41;
        background: #fff;
        border: 1px solid #e5e5e5;

        &:hover {
          background: #f9fafb;
          border-color: #d0d0d0;
        }
      }
    }
  }
}
</style>
