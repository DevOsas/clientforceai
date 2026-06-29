<template>
  <div class="settings-tab">
    <!-- Left Sidebar -->
    <aside class="settings-sidebar">
      <nav class="settings-nav">
        <button 
          v-for="(tab, index) in tabs" 
          :key="tab.id"
          class="nav-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <div v-if="index < tabs.length - 1" class="nav-divider"></div>
        </button>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="settings-content">
      <!-- Account Tab -->
      <div v-if="activeTab === 'account'" class="tab-content">
        <div class="accounts-list">
          <!-- Header inside accounts list -->
          <div class="content-header">
            <h2 class="content-title">Account</h2>
            <div style="display:flex; gap:8px;">
            <button class="add-account-btn" @click="saveConfiguration">
              <SvgIcon name="check" />
              Save
            </button>
            <button class="add-account-btn">
              <SvgIcon name="plus" />
              Add Account
            </button>
            </div>
          </div>

          <div class="header-divider"></div>

          <!-- Dynamic Account Items -->
          <div v-for="(account, index) in emailAccounts" :key="account.id">
            <div class="account-item">
              <div class="account-info">
                <div class="account-icon" :class="account.type">
                  <SvgIcon v-if="account.type === 'gmail'" name="gmail" />
                  <SvgIcon v-else-if="account.type === 'outlook'" name="outlook-alt" />
                  <SvgIcon v-else name="email" />
                </div>
                <span class="account-name">{{ account.email }}</span>
              </div>
              <div class="account-details">
                <img v-if="account.avatar" :src="account.avatar" :alt="account.email" class="user-avatar" />
                <span v-if="account.name" class="account-email">{{ account.name }}</span>
              </div>
              <button class="remove-btn" @click="toggleEmailAccount(account.id)">
                <SvgIcon :name="isAccountSelected(account.id) ? 'check' : 'plus'" />
              </button>
            </div>
            <div v-if="index < emailAccounts.length - 1" class="account-divider"></div>
          </div>
        </div>
      </div>

      <!-- Schedule Tab -->
      <div v-if="activeTab === 'schedule'" class="tab-content">
        <div class="schedule-wrapper">
          <div class="schedule-container">
            <h2 class="schedule-title">Schedule</h2>

            <div class="schedules-list">
            <!-- Schedule Card (Dynamic) -->
            <div v-for="schedule in schedules" :key="schedule.id" class="schedule-card">
              <div class="schedule-header">
                <button class="default-btn" :class="{ active: schedule.isDefault }">
                  <SvgIcon v-if="schedule.isDefault" name="check" />
                  Default
                </button>
                <div class="day-buttons">
                  <button
                    v-for="day in daysOfWeek"
                    :key="day.id"
                    :class="['day-btn', { active: schedule.activeDays.includes(day.id) }]"
                    @click="toggleDay(schedule.id, day.id)"
                  >
                    {{ day.label }}
                  </button>
                </div>
                <div class="schedule-actions">
                  <button class="icon-btn settings-btn">
                    <SvgIcon name="settings" />
                  </button>
                  <button class="icon-btn delete-btn" @click="deleteSchedule(schedule.id)">
                    <SvgIcon name="close-alt" />
                  </button>
                </div>
              </div>
            </div>
          </div>

            <!-- Add New Schedule Button -->
            <div class="add-schedule-container">
              <button class="add-schedule-btn" @click="addNewSchedule">
                <SvgIcon name="plus-green" />
                Add New Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Script/Knowledge Tab -->
      <div v-if="activeTab === 'script'" class="tab-content">
        <div class="script-knowledge-wrapper">
          <div class="script-knowledge-container">
            <h2 class="script-knowledge-title">Script/Knowledge</h2>

            <!-- Sub-tabs -->
            <div class="sub-tabs">
              <button
                class="sub-tab-button"
                :class="{ active: scriptSubTab === 'callScripts' }"
                @click="scriptSubTab = 'callScripts'"
              >
                Call Scripts
              </button>
              <button
                class="sub-tab-button"
                :class="{ active: scriptSubTab === 'knowledge' }"
                @click="scriptSubTab = 'knowledge'"
              >
                Knowledge
              </button>
            </div>

            <!-- Call Scripts Content -->
            <div v-if="scriptSubTab === 'callScripts'" class="call-scripts-content">
              <div v-for="script in callScripts" :key="script.id" class="script-card">
                <pre class="script-text">{{ script.content }}</pre>
                <button class="copy-btn" @click="copyScript(script.content)">
                  <SvgIcon name="copy" />
                  Copy
                </button>
              </div>
            </div>

            <!-- Knowledge Content (Show both sections together) -->
            <div v-if="scriptSubTab === 'knowledge'" class="knowledge-content">
              <div class="knowledge-sections">
                <h3 class="section-heading">Add Files/ links</h3>
                <KnowledgeSourcesStep :show-tabs="false" :active-tab="'files'" />
                
                <h3 class="section-heading">Business Description</h3>
                <KnowledgeSourcesStep :show-tabs="false" :active-tab="'description'" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Webhooks & Integrations Tab -->
      <div v-if="activeTab === 'webhooks'" class="tab-content">
        <div class="webhooks-wrapper">
          <div class="webhooks-container">
            <h2 class="webhooks-title">Webhooks & Integrations</h2>

            <!-- Sub-tabs -->
            <div class="sub-tabs">
              <button
                class="sub-tab-button"
                :class="{ active: webhooksSubTab === 'webhooks' }"
                @click="webhooksSubTab = 'webhooks'"
              >
                Webhooks
              </button>
              <button
                class="sub-tab-button"
                :class="{ active: webhooksSubTab === 'integrations' }"
                @click="webhooksSubTab = 'integrations'"
              >
                Integrations
              </button>
            </div>

            <!-- Webhooks Content -->
            <div v-if="webhooksSubTab === 'webhooks'" class="webhooks-content">
              <div class="form-group">
                <label class="form-label">URL</label>
                <input
                  v-model="webhookUrl"
                  type="text"
                  class="form-input"
                  placeholder="enter URL"
                />
              </div>

              <div class="checkbox-group">
                <input
                  id="feedback-checkbox"
                  v-model="sendOnlyWithMessage"
                  type="checkbox"
                  class="custom-checkbox"
                />
                <label for="feedback-checkbox" class="checkbox-label">
                  Send only when feedbacks includes a message
                </label>
              </div>

              <button class="save-btn" @click="saveWebhook">
                Save
              </button>
            </div>

            <!-- Integrations Content -->
            <div v-if="webhooksSubTab === 'integrations'" class="integrations-content">
              <p class="placeholder-text">Integrations content coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import KnowledgeSourcesStep from '@/components/CampaignV2/Steps/KnowledgeSourcesStep.vue'
import { mapState } from 'vuex'
import { ALL_EMAIL_ACCOUNTS_QUERY } from '~/graphql/email-account/queries'
import { SETUP_CAMPAIGN_V2_CONFIGURATION, SETUP_CAMPAIGN_V2_SCHEDULE } from '~/graphql/campaignV2/campaignExecution'

export default {
  name: 'SettingsTab',
  props: {
    campaignId: { type: Number, required: true },
  },

  components: {
    KnowledgeSourcesStep
  },

  data() {
    return {
      activeTab: 'account',
      scriptSubTab: 'callScripts',
      webhooksSubTab: 'webhooks',
      webhookUrl: '',
      sendOnlyWithMessage: false,
      tabs: [
        { id: 'account', label: 'Account' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'script', label: 'Script/Knowledge' },
        { id: 'webhooks', label: 'Webhooks & Integrations' }
      ],
      daysOfWeek: [
        { id: 'sun', label: 'SUN' },
        { id: 'mon', label: 'MON' },
        { id: 'tue', label: 'TUE' },
        { id: 'wed', label: 'WED' },
        { id: 'thu', label: 'THU' },
        { id: 'fri', label: 'FRI' },
        { id: 'sat', label: 'SAT' }
      ],
      schedules: [
        {
          id: 1,
          isDefault: true,
          activeDays: ['mon', 'tue', 'wed', 'thu', 'fri']
        }
      ],
      timezone: 'America/New_York',
      fromTime: '09:00',
      toTime: '17:00',
      callScripts: [
        {
          id: 1,
          content: `{{Your_Company}} // {{Company}}
Hey {{FirstName}},
How's your day doing?

I understand that life can get pretty busy but I'd really love to connect with you and see whether or not we can help {{Company}} [Your brief value proposition].`
        },
        {
          id: 2,
          content: `{{Your_Company}} // {{Company}}
Hey {{FirstName}},
How's your day doing?

I understand that life can get pretty busy but I'd really love to connect with you and see whether or not we can help {{Company}} [Your brief value proposition].`
        },
        {
          id: 3,
          content: `{{Your_Company}} // {{Company}}
Hey {{FirstName}},
How's your day doing?

I understand that life can get pretty busy but I'd really love to connect with you and see whether or not we can help {{Company}} [Your brief value proposition].`
        }
      ],
      emailAccounts: [],
      selectedEmailAccountIds: [],
      isLoadingAccounts: false,
      isSaving: false,
    }
  },

  computed: {
    ...mapState('campaign', {
      viewingCampaign: (state) => state.viewing || {},
    }),
  },

  methods: {
    removeAccount(accountId) {
      this.selectedEmailAccountIds = this.selectedEmailAccountIds.filter(id => id !== accountId)
    },
    toggleDay(scheduleId, dayId) {
      const schedule = this.schedules.find(s => s.id === scheduleId)
      if (schedule) {
        const index = schedule.activeDays.indexOf(dayId)
        if (index > -1) {
          schedule.activeDays.splice(index, 1)
        } else {
          schedule.activeDays.push(dayId)
        }
      }
    },
    addNewSchedule() {
      const newId = Math.max(...this.schedules.map(s => s.id)) + 1
      this.schedules.push({
        id: newId,
        isDefault: false,
        activeDays: []
      })
    },
    deleteSchedule(scheduleId) {
      this.schedules = this.schedules.filter(s => s.id !== scheduleId)
    },
    copyScript(content) {
      navigator.clipboard.writeText(content).then(() => {
        // You can add a toast notification here
        console.log('Script copied to clipboard')
      })
    },
    saveWebhook() {
      console.log('Saving webhook:', {
        url: this.webhookUrl,
        sendOnlyWithMessage: this.sendOnlyWithMessage
      })
      // TODO: Implement webhook save logic
    },
    async loadEmailAccounts() {
      try {
        this.isLoadingAccounts = true
        const { data } = await this.$apollo.query({
          query: ALL_EMAIL_ACCOUNTS_QUERY,
          fetchPolicy: 'network-only',
        })
        this.emailAccounts = data.emailAccounts || []
        if (this.viewingCampaign && this.viewingCampaign.configuration && Array.isArray(this.viewingCampaign.configuration.emailAccountIds)) {
          this.selectedEmailAccountIds = [...this.viewingCampaign.configuration.emailAccountIds]
        } else if (this.emailAccounts.length) {
          this.selectedEmailAccountIds = [this.emailAccounts[0].id]
        }
      } finally {
        this.isLoadingAccounts = false
      }
    },
    toggleEmailAccount(accountId) {
      const idx = this.selectedEmailAccountIds.indexOf(accountId)
      if (idx > -1) this.selectedEmailAccountIds.splice(idx, 1)
      else this.selectedEmailAccountIds.push(accountId)
    },
    isAccountSelected(accountId) {
      return this.selectedEmailAccountIds.includes(accountId)
    },
    getDayName(dayId) {
      const map = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' }
      return map[dayId]
    },
    async saveSchedule() {
      try {
        this.isSaving = true
        const primary = this.schedules[0]
        const plan = this.daysOfWeek
          .filter((d) => primary.activeDays.includes(d.id))
          .map((d) => ({
            weekDay: this.getDayName(d.id),
            isActive: true,
            timeRanges: [{
              fromTime: { hour: parseInt(this.fromTime.split(':')[0]), minute: parseInt(this.fromTime.split(':')[1]) },
              toTime: { hour: parseInt(this.toTime.split(':')[0]), minute: parseInt(this.toTime.split(':')[1]) },
            }],
          }))
        const tz = (this.viewingCampaign && this.viewingCampaign.schedule && this.viewingCampaign.schedule.timezone && this.viewingCampaign.schedule.timezone.name) || this.timezone
        await this.$apollo.mutate({
          mutation: SETUP_CAMPAIGN_V2_SCHEDULE,
          variables: { campaignId: this.campaignId, timezone: tz, plan: JSON.stringify(plan) },
        })
        this.$notify({ group: 'main', type: 'success', text: 'Schedule saved' })
      } catch (e) {
        this.$notify({ group: 'main', type: 'error', text: 'Failed to save schedule' })
      } finally {
        this.isSaving = false
      }
    },
    async saveConfiguration() {
      try {
        this.isSaving = true
        await this.$apollo.mutate({
          mutation: SETUP_CAMPAIGN_V2_CONFIGURATION,
          variables: {
            campaignId: this.campaignId,
            emailAccountIds: this.selectedEmailAccountIds,
          },
        })
        this.$notify({ group: 'main', type: 'success', text: 'Accounts saved' })
      } catch (e) {
        this.$notify({ group: 'main', type: 'error', text: 'Failed to save accounts' })
      } finally {
        this.isSaving = false
      }
    },
  },

  mounted() {
    console.log('Settings tab mounted')
    this.loadEmailAccounts()
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.settings-tab {
  display: flex;
  background: #f5f5f5;
  min-height: calc(100vh - 200px);
  gap: 20px;
  padding: 0;
}

// Left Sidebar
.settings-sidebar {
  flex: 0 0 320px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  height: fit-content;

  .settings-nav {
    display: flex;
    flex-direction: column;

    .nav-item {
      padding: 20px 24px;
      text-align: left;
      font-size: 0.95rem;
      font-weight: 500;
      color: #6b7280;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      line-height: 1.5;

      &:hover {
        color: #000;
      }

      &.active {
        color: #10b981;
        font-weight: 600;
      }

      .nav-divider {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: #e5e5e5;
      }
    }
  }
}

// Main Content
.settings-content {
  flex: 1;
  overflow-y: auto;

  .tab-content {

    .placeholder-text {
      font-size: 1rem;
      color: #6b7280;
      margin-top: 20px;
    }
  }
}

// Schedule Tab Styles
.schedule-wrapper {
  display: flex;
  justify-content: center;

  .schedule-container {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 0;
    max-width: 1200px;
    width: 100%;

    .schedule-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin: 0;
      padding: 24px 28px;
      border-bottom: 1px solid #e5e5e5;
    }

    .schedules-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px 38px;
      padding-bottom: 0;

      .schedule-card {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 24px 28px;

        .schedule-header {
          display: flex;
          align-items: center;
          gap: 20px;

          .default-btn {
            padding: 10px 20px;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
            background: #fff;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 120px;

            ::v-deep svg {
              width: 16px;
              height: 16px;
            }

            &.active {
              background: $primary;
              color: #fff;
              border-color: $primary;
            }

            &:hover:not(.active) {
              background: #f9f9f9;
            }
          }

          .day-buttons {
            display: flex;
            gap: 12px;
            flex: 1;

            .day-btn {
              width: 56px;
              height: 56px;
              border-radius: 50%;
              border: 2px solid #e5e5e5;
              background: #fff;
              color: #6b7280;
              font-size: 0.9rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;

              &.active {
                background: $primary;
                color: #fff;
                border-color: $primary;
              }

              &:hover:not(.active) {
                border-color: $primary;
                background: rgba($primary, 0.1);
              }
            }
          }

          .schedule-actions {
            display: flex;
            gap: 12px;

            .icon-btn {
              width: 44px;
              height: 44px;
              border-radius: 8px;
              border: 1px solid #e5e5e5;
              background: #fff;
              color: #9ca3af;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;

              ::v-deep svg {
                width: 20px;
                height: 20px;
              }

              &:hover {
                background: #f9f9f9;
                border-color: #d1d5db;
              }

              &.delete-btn:hover {
                background: #fee;
                border-color: #fcc;
                color: #c33;
              }
            }
          }
        }
      }
    }

    .add-schedule-container {
      display: flex;
      justify-content: center;
      padding: 32px 28px;

      .add-schedule-btn {
        padding: 12px 24px;
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 8px;
        border: 2px solid $primary;
        background: #fff;
        color: $primary;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        ::v-deep svg {
          width: 18px;
          height: 18px;
        }

        &:hover {
          background: $primary;
          color: #fff;
        }
      }
    }
  }
}

// Script/Knowledge Tab Styles
.script-knowledge-wrapper {
  display: flex;
  justify-content: center;

  .script-knowledge-container {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 0;
    max-width: 1200px;
    width: 100%;

    .script-knowledge-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin: 0;
      padding: 24px 28px;
      border-bottom: 1px solid #e5e5e5;
    }

    .sub-tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #e5e5e5;
      padding: 0 28px;

      .sub-tab-button {
        padding: 16px 24px;
        font-size: 0.95rem;
        font-weight: 500;
        color: #9ca3af;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        bottom: -2px;

        &:hover {
          color: #6b7280;
        }

        &.active {
          color: $primary;
          border-bottom-color: $primary;
          font-weight: 600;
        }
      }
    }

    .call-scripts-content {
      padding: 24px 38px;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .script-card {
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .script-text {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #6b7280;
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          flex: 1;
        }

        .copy-btn {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6b7280;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;

          ::v-deep svg {
            width: 16px;
            height: 16px;
          }

          &:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
            color: #000;
          }
        }
      }
    }

    .knowledge-content {
      padding: 24px 38px;

      .knowledge-sections {
        display: flex;
        flex-direction: column;
        gap: 40px;

        .section-heading {
          font-size: 1.1rem;
          font-weight: 700;
          color: #000;
          margin: 0 0 20px 0;
        }

        // Override KnowledgeSourcesStep styles to fit within the container
        ::v-deep .knowledge-sources-step {
          background: transparent;
          padding: 0;

          .tabs-header {
            display: none; // Hide the internal tabs
          }

          .tab-content {
            padding: 0;
          }
        }
      }
    }
  }
}

// Webhooks & Integrations Tab Styles
.webhooks-wrapper {
  display: flex;
  justify-content: center;

  .webhooks-container {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 0;
    max-width: 1200px;
    width: 100%;

    .webhooks-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin: 0;
      padding: 24px 28px;
      border-bottom: 1px solid #e5e5e5;
    }

    .sub-tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #e5e5e5;
      padding: 0 28px;

      .sub-tab-button {
        padding: 16px 24px;
        font-size: 0.95rem;
        font-weight: 500;
        color: #9ca3af;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        bottom: -2px;

        &:hover {
          color: #6b7280;
        }

        &.active {
          color: $primary;
          border-bottom-color: $primary;
          font-weight: 600;
        }
      }
    }

    .webhooks-content {
      padding: 24px 38px;
      max-width: 700px;

      .form-group {
        margin-bottom: 24px;

        .form-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 500;
          color: #000;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 0.95rem;
          color: #6b7280;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #fff;
          transition: all 0.2s ease;

          &::placeholder {
            color: #9ca3af;
          }

          &:focus {
            outline: none;
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
          }
        }
      }

      .checkbox-group {
        display: flex;
        // align-items: center;
        gap: 12px;
        margin-bottom: 24px;

        .custom-checkbox {
          width: 22px;
          height: 22px;
          border: 2px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          appearance: none;
          transition: all 0.2s ease;

          &:checked {
            background: $primary;
            border-color: $primary;
            position: relative;

            &::after {
              content: '';
              position: absolute;
              left: 5px;
              top: 2px;
              width: 5px;
              height: 10px;
              border: solid #fff;
              border-width: 0 2px 2px 0;
              transform: rotate(45deg);
            }
          }
        }

        .checkbox-label {
          font-size: 0.95rem;
          color: #000;
          cursor: pointer;
          user-select: none;
        }
      }

      .save-btn {
        padding: 12px 32px;
        font-size: 0.95rem;
        font-weight: 600;
        color: #fff;
        background: linear-gradient(90deg, $primary  0%, #3d950f 100%);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: linear-gradient(90deg, darken($primary, 5%) 0%, darken(#3d950f, 5%) 100%);
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }

    .integrations-content {
      padding: 24px 38px;

      .placeholder-text {
        font-size: 1rem;
        color: #6b7280;
      }
    }
  }
}

// Accounts List
.accounts-list {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  height: fit-content;

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;

    .content-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin: 0;
    }

    .add-account-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #000;
      cursor: pointer;
      transition: all 0.2s ease;

      ::v-deep svg {
        width: 16px;
        height: 16px;
      }

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }
    }
  }

  .header-divider {
    height: 1px;
    background: #e5e5e5;
    margin: 0;
  }

  .account-item {
    display: flex;
    align-items: center;
    padding: 15px 24px;
    gap: 20px;
    transition: background 0.2s ease;

    &:hover {
      background: #f9fafb;
    }

    .account-info {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 180px;

      .account-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        ::v-deep svg {
          width: 24px;
          height: 24px;
        }

        &.gmail ::v-deep svg {
          color: #ea4335;
        }

        &.whatsapp ::v-deep svg {
          color: #25d366;
        }

        &.outlook ::v-deep svg {
          color: #0078d4;
        }
      }

      .account-name {
        font-size: 0.95rem;
        font-weight: 500;
        color: #000;
      }
    }

    .account-details {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      .account-email,
      .account-phone {
        font-size: 0.9rem;
        color: #2f2f41;
      }
    }

    .remove-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s ease;

      ::v-deep svg {
        width: 16px;
        height: 16px;
        color: #9ca3af;
      }

      &:hover {
        background: #f3f4f6;

        ::v-deep svg {
          color: #ef4444;
        }
      }
    }
  }

  .account-divider {
    height: 1px;
    background: #e5e5e5;
    margin: 0;
  }
}
</style>
