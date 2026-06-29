<template>
  <div class="guardrails-account-step">
    <!-- Tabs -->
    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Scheduling Tab Content -->
    <div v-if="activeTab === 'scheduling'" class="tab-content">
      <div class="schedules-list">
        <!-- Schedule Card 1 (Default) -->
        <div class="schedule-card">
          <div class="schedule-header">
            <button class="default-btn active">
              <SvgIcon name="check" />
              Default
            </button>
            <div class="day-buttons">
              <button
                v-for="day in daysOfWeek"
                :key="day.id"
                :class="['day-btn', { active: schedule1Days.includes(day.id), inactive: day.id === 'sun' || day.id === 'sat' }]"
                @click="toggleDay(1, day.id)"
              >
                {{ day.label }}
              </button>
            </div>
            <div class="schedule-actions">
              <button class="icon-btn settings-btn">
                <SvgIcon name="settings" size="lg" />
              </button>
              <button class="icon-btn delete-btn">
                <SvgIcon name="close-alt" size="lg" />
              </button>
            </div>
          </div>
        </div>

        <!-- Schedule Card 2 -->
        <!-- <div class="schedule-card">
          <div class="schedule-header">
            <button class="default-btn">
              Default
            </button>
            <div class="day-buttons">
              <button
                v-for="day in daysOfWeek"
                :key="day.id"
                :class="['day-btn', { active: schedule2Days.includes(day.id) }]"
                @click="toggleDay(2, day.id)"
              >
                {{ day.label }}
              </button>
            </div>
            <div class="schedule-actions">
              <button class="icon-btn settings-btn">
                <SvgIcon name="settings" />
              </button>
              <button class="icon-btn delete-btn">
                <SvgIcon name="close-alt" size="lg" />
              </button>
            </div>
          </div>
        </div> -->
      </div>

      <!-- Timezone and Time Range -->
      <div class="schedule-settings">
        <div class="input-group">
          <label class="input-label">Timezone</label>
          <select v-model="timezone" class="input-field">
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">From Time</label>
          <input v-model="fromTime" type="time" class="input-field" />
        </div>
        <div class="input-group">
          <label class="input-label">To Time</label>
          <input v-model="toTime" type="time" class="input-field" />
        </div>
      </div>

      <div class="section-card account-section">
        <div class="section-header">
          <h3 class="section-title">Voice Numbers</h3>
          <button class="add-account-btn" @click="showAddVoice = !showAddVoice">
            <SvgIcon name="plus" />
            Add Number
          </button>
        </div>

        <div v-if="showAddVoice" class="add-number-form">
          <div class="input-group">
            <label class="input-label">Phone (E.164)</label>
            <input v-model="newVoiceNumber.e164" type="text" class="input-field" placeholder="+15551234567" />
          </div>
          <div class="input-group" style="margin-top:12px;">
            <label class="input-label">Label (optional)</label>
            <input v-model="newVoiceNumber.label" type="text" class="input-field" placeholder="Sales Line" />
          </div>
          <div style="margin-top:12px; display:flex; gap:12px;">
            <button class="add-account-btn" @click="saveVoiceNumber" :disabled="isSaving">
              <b-spinner v-if="isSaving" small class="mr-1" />
              Save
            </button>
            <button class="add-account-btn" @click="resetVoiceForm" :disabled="isSaving">Cancel</button>
          </div>
        </div>

        <div v-if="isLoadingPhones" class="accounts-list">
          <div class="text-center py-4">
            <b-spinner small></b-spinner>
            <p class="mt-2 text-muted">Loading voice numbers...</p>
          </div>
        </div>

        <div v-else-if="callPhoneNumbers.length === 0" class="accounts-list">
          <div class="text-center py-4">
            <p class="text-muted">No voice numbers found. Add numbers in settings.</p>
          </div>
        </div>

        <div v-else class="accounts-list">
          <div
            v-for="num in callPhoneNumbers"
            :key="num.id"
            class="account-item"
            :class="{ selected: isCallPhoneNumberSelected(num.id) }"
            @click="toggleCallPhoneNumber(num.id)"
          >
            <div class="account-checkbox">
              <input
                type="checkbox"
                :checked="isCallPhoneNumberSelected(num.id)"
                @click.stop="toggleCallPhoneNumber(num.id)"
              />
            </div>
            <div class="account-info">
              <div class="account-icon">
                <SvgIcon name="phone" size="lg" />
              </div>
              <span class="account-type">Voice</span>
              <div class="account-user">
                <span class="user-phone">{{ num.e164 }}</span>
                <span v-if="num.label" class="user-name">{{ num.label }}</span>
              </div>
            </div>
            <div class="account-status">
              <span v-if="isCallPhoneNumberSelected(num.id)" class="badge badge-success">Selected</span>
              <button class="text-danger small" style="margin-left:8px;" @click.stop="deletePhoneNumber(num.id, 'voice')">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="section-card account-section">
        <div class="section-header">
          <h3 class="section-title">WhatsApp Numbers</h3>
          <button class="add-account-btn" @click="showAddWhatsapp = !showAddWhatsapp">
            <SvgIcon name="plus" />
            Add Number
          </button>
        </div>

        <div v-if="showAddWhatsapp" class="add-number-form">
          <div class="input-group">
            <label class="input-label">Phone (E.164)</label>
            <input v-model="newWhatsappNumber.e164" type="text" class="input-field" placeholder="+15551234567" />
          </div>
          <div class="input-group" style="margin-top:12px;">
            <label class="input-label">Label (optional)</label>
            <input v-model="newWhatsappNumber.label" type="text" class="input-field" placeholder="Support Line" />
          </div>
          <div class="input-group" style="margin-top:12px;">
            <label class="input-label">Custom WhatsApp Sender (optional)</label>
            <input v-model="newWhatsappNumber.whatsappSender" type="text" class="input-field" placeholder="whatsapp:+15551234567" />
          </div>
          <div style="margin-top:12px; display:flex; gap:12px;">
            <button class="add-account-btn" @click="saveWhatsappNumber" :disabled="isSaving">
              <b-spinner v-if="isSaving" small class="mr-1" />
              Save
            </button>
            <button class="add-account-btn" @click="resetWhatsappForm" :disabled="isSaving">Cancel</button>
          </div>
        </div>

        <div v-if="isLoadingPhones" class="accounts-list">
          <div class="text-center py-4">
            <b-spinner small></b-spinner>
            <p class="mt-2 text-muted">Loading WhatsApp numbers...</p>
          </div>
        </div>

        <div v-else-if="whatsappPhoneNumbers.length === 0" class="accounts-list">
          <div class="text-center py-4">
            <p class="text-muted">No WhatsApp numbers found. Add numbers in settings.</p>
          </div>
        </div>

        <div v-else class="accounts-list">
          <div
            v-for="num in whatsappPhoneNumbers"
            :key="num.id"
            class="account-item"
            :class="{ selected: isWhatsappPhoneNumberSelected(num.id) }"
            @click="toggleWhatsappPhoneNumber(num.id)"
          >
            <div class="account-checkbox">
              <input
                type="checkbox"
                :checked="isWhatsappPhoneNumberSelected(num.id)"
                @click.stop="toggleWhatsappPhoneNumber(num.id)"
              />
            </div>
            <div class="account-info">
              <div class="account-icon whatsapp-icon">
                <SvgIcon name="whatsapp" size="lg" />
              </div>
              <span class="account-type">WhatsApp</span>
              <div class="account-user">
                <span class="user-phone">{{ num.whatsappSender || ('whatsapp:' + num.e164) }}</span>
                <span v-if="num.label" class="user-name">{{ num.label }}</span>
              </div>
            </div>
            <div class="account-status">
              <span v-if="isWhatsappPhoneNumberSelected(num.id)" class="badge badge-success">Selected</span>
              <button class="text-danger small" style="margin-left:8px;" @click.stop="deletePhoneNumber(num.id, 'whatsapp')">Delete</button>
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

    <!-- Randomization & Rotation Tab Content -->
    <div v-if="activeTab === 'randomization'" class="tab-content">
      <div class="randomization-content">
        <!-- Inputs Row -->
        <div class="inputs-row">
          <div class="input-group">
            <label class="input-label">Emails Per day</label>
            <input v-model="emailsPerDay" type="number" class="input-field" />
          </div>
          <div class="input-group">
            <label class="input-label">Calls Per day</label>
            <input v-model="callsPerDay" type="number" class="input-field" />
          </div>
          <div class="input-group">
            <label class="input-label">Retries (calls)</label>
            <input v-model="retriesCalls" type="number" class="input-field" />
          </div>
        </div>

        <!-- Compliance Section -->
        <div class="section-card compliance-section">
          <h3 class="section-title">Compliance</h3>
          
          <div class="compliance-option">
            <div class="option-header">
              <div class="checkbox-wrapper">
                <input
                  id="gdpr-compliance"
                  v-model="gdprCompliance"
                  type="checkbox"
                  class="custom-checkbox"
                />
                <label for="gdpr-compliance" class="checkbox-label">
                  <span class="checkmark"></span>
                  GDPR Compliance
                </label>
              </div>
            </div>
            <p class="option-description">
              GDPR protects EU citizens' data and mandates consent and breach reporting
            </p>
          </div>

          <div class="compliance-option">
            <div class="option-header">
              <div class="checkbox-wrapper">
                <input
                  id="whatsapp-consents"
                  v-model="whatsappConsents"
                  type="checkbox"
                  class="custom-checkbox"
                />
                <label for="whatsapp-consents" class="checkbox-label">
                  <span class="checkmark"></span>
                  Whatsapp Consents
                </label>
              </div>
            </div>
            <p class="option-description">
              WhatsApp requires user consent for data sharing and privacy
            </p>
          </div>
        </div>

        <!-- Account Section -->
        <div class="section-card account-section">
          <div class="section-header">
            <h3 class="section-title">Account</h3>
            <button class="add-account-btn" @click="addAccount">
              <SvgIcon name="plus" />
              Add Account
            </button>
          </div>

          <div v-if="isLoading" class="accounts-list">
            <div class="text-center py-4">
              <b-spinner small></b-spinner>
              <p class="mt-2 text-muted">Loading email accounts...</p>
            </div>
          </div>
          
          <div v-else-if="emailAccounts.length === 0" class="accounts-list">
            <div class="text-center py-4">
              <p class="text-muted">No email accounts found. Please add an email account first.</p>
            </div>
          </div>
          
          <div v-else class="accounts-list">
            <div 
              v-for="account in emailAccounts" 
              :key="account.id" 
              class="account-item"
              :class="{ selected: isAccountSelected(account.id) }"
              @click="toggleEmailAccount(account.id)"
            >
              <div class="account-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isAccountSelected(account.id)"
                  @click.stop="toggleEmailAccount(account.id)"
                />
              </div>
              <div class="account-info">
                <div class="account-icon" :class="`${account.type}-icon`">
                  <SvgIcon v-if="account.type === 'gmail'" name="gmail-alt" size="lg" />
                  <SvgIcon v-else-if="account.type === 'outlook'" name="outlook-alt" size="lg" />
                  <SvgIcon v-else name="email" size="lg" />
                </div>
                <span class="account-type">{{ account.type || 'Email' }}</span>
                <div class="account-user">
                  <span class="user-email">{{ account.email }}</span>
                  <span v-if="account.name" class="user-name">{{ account.name }}</span>
                </div>
              </div>
              <div class="account-status">
                <span v-if="isAccountSelected(account.id)" class="badge badge-success">Selected</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Health & Warnings Section -->
        <div class="section-card health-warnings-section">
          <h3 class="section-title">Health & Warnings</h3>

          <div class="warnings-list">
            <div class="warning-item cyan-warning">
              <div class="warning-content">
                <SvgIcon name="warning-triangle" class="warning-icon" />
                <span class="warning-text">Email deliverability low</span>
              </div>
              <button class="fix-btn">Fix</button>
            </div>

            <div class="warning-item purple-warning">
              <div class="warning-content">
                <SvgIcon name="warning-triangle" class="warning-icon" />
                <span class="warning-text">Voice number reputation issue</span>
              </div>
              <button class="fix-btn">Fix</button>
            </div>

            <div class="warning-item pink-warning">
              <div class="warning-content">
                <SvgIcon name="warning-triangle" class="warning-icon" />
                <span class="warning-text">Whatsapp Template Pending</span>
              </div>
              <button class="fix-btn">Fix</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Tab Content -->
    <div v-if="activeTab === 'settings'" class="tab-content">
    
    </div>


  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  CONVERT_DRAFTS_TO_STEPS,
  SETUP_CAMPAIGN_V2_SCHEDULE,
  SETUP_CAMPAIGN_V2_CONFIGURATION,
  ADD_CONTACTS_TO_CAMPAIGN_V2,
  ACTIVATE_CAMPAIGN_V2,
} from '~/graphql/campaignV2/campaignExecution'

export default {
  name: 'GuardrailsAccountStep',
  data() {
    return {
      activeTab: 'scheduling',
      tabs: [
        { id: 'scheduling', label: 'Scheduling' },
        { id: 'randomization', label: 'Randomization & Rotation' },
        { id: 'settings', label: 'Settings' },
      ],
      daysOfWeek: [
        { id: 'sun', label: 'SUN' },
        { id: 'mon', label: 'MON' },
        { id: 'tue', label: 'TUE' },
        { id: 'wed', label: 'WED' },
        { id: 'thu', label: 'THU' },
        { id: 'fri', label: 'FRI' },
        { id: 'sat', label: 'SAT' },
      ],
      schedule1Days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      schedule2Days: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      emailsPerDay: 50,
      callsPerDay: 3,
      retriesCalls: 3,
      gdprCompliance: true,
      whatsappConsents: false,
      timezone: 'America/New_York',
      fromTime: '09:00',
      toTime: '17:00',
      selectedEmailAccountIds: [],
      emailAccounts: [],
      isLoading: false,
      isSaving: false,
      selectedCallPhoneNumberIds: [],
      selectedWhatsappPhoneNumberIds: [],
      callPhoneNumbers: [],
      whatsappPhoneNumbers: [],
      isLoadingPhones: false,
      showAddVoice: false,
      showAddWhatsapp: false,
      newVoiceNumber: { e164: '', label: '' },
      newWhatsappNumber: { e164: '', label: '', whatsappSender: '' },
    }
  },
  computed: {
    ...mapState('campaignV2', ['campaign']),
  },
  async mounted() {
    await this.loadEmailAccounts()
    await Promise.all([
      this.loadCallPhoneNumbers(),
      this.loadWhatsappPhoneNumbers(),
    ])

    if (this.campaign && this.campaign.configuration) {
      if (Array.isArray(this.campaign.configuration.callPhoneNumberIds)) {
        this.selectedCallPhoneNumberIds = [...this.campaign.configuration.callPhoneNumberIds]
      }
      if (Array.isArray(this.campaign.configuration.whatsappPhoneNumberIds)) {
        this.selectedWhatsappPhoneNumberIds = [...this.campaign.configuration.whatsappPhoneNumberIds]
      }
    }
  },
  methods: {
    toggleDay(scheduleNum, dayId) {
      const scheduleKey = `schedule${scheduleNum}Days`
      const index = this[scheduleKey].indexOf(dayId)
      if (index > -1) {
        this[scheduleKey].splice(index, 1)
      } else {
        this[scheduleKey].push(dayId)
      }
    },
    
    async loadEmailAccounts() {
      try {
        this.isLoading = true
        const { data } = await this.$apollo.query({
          query: require('~/graphql/email-account/queries').ALL_EMAIL_ACCOUNTS_QUERY,
          fetchPolicy: 'network-only',
        })
        
        this.emailAccounts = data.emailAccounts || []
        
        // Load existing configuration if available
        if (this.campaign.configuration && this.campaign.configuration.emailAccountIds) {
          this.selectedEmailAccountIds = this.campaign.configuration.emailAccountIds
        } else if (this.emailAccounts.length > 0) {
          // Default to first account if no configuration exists
          this.selectedEmailAccountIds = [this.emailAccounts[0].id]
        }
      } catch (error) {
        console.error('Failed to load email accounts:', error)
        this.$notify({
          type: 'error',
          text: 'Failed to load email accounts',
        })
      } finally {
        this.isLoading = false
      }
    },

    async loadCallPhoneNumbers() {
      try {
        this.isLoadingPhones = true
        const { data } = await this.$apollo.query({
          query: require('~/graphql/phone-number/queries').ALL_USER_PHONE_NUMBERS_QUERY,
          variables: { channel: 'voice' },
          fetchPolicy: 'network-only',
        })
        this.callPhoneNumbers = data.allUserPhoneNumbers || []
      } catch (error) {
        console.error('Failed to load call phone numbers:', error)
      } finally {
        this.isLoadingPhones = false
      }
    },

    async loadWhatsappPhoneNumbers() {
      try {
        const { data } = await this.$apollo.query({
          query: require('~/graphql/phone-number/queries').ALL_USER_PHONE_NUMBERS_QUERY,
          variables: { channel: 'whatsapp' },
          fetchPolicy: 'network-only',
        })
        this.whatsappPhoneNumbers = data.allUserPhoneNumbers || []
      } catch (error) {
        console.error('Failed to load WhatsApp phone numbers:', error)
      }
    },

    toggleCallPhoneNumber(id) {
      const idx = this.selectedCallPhoneNumberIds.indexOf(id)
      if (idx > -1) {
        this.selectedCallPhoneNumberIds.splice(idx, 1)
      } else {
        this.selectedCallPhoneNumberIds.push(id)
      }
    },

    isCallPhoneNumberSelected(id) {
      return this.selectedCallPhoneNumberIds.includes(id)
    },

    toggleWhatsappPhoneNumber(id) {
      const idx = this.selectedWhatsappPhoneNumberIds.indexOf(id)
      if (idx > -1) {
        this.selectedWhatsappPhoneNumberIds.splice(idx, 1)
      } else {
        this.selectedWhatsappPhoneNumberIds.push(id)
      }
    },

    isWhatsappPhoneNumberSelected(id) {
      return this.selectedWhatsappPhoneNumberIds.includes(id)
    },
    
    getDayName(dayId) {
      const map = {
        sun: 'Sunday',
        mon: 'Monday',
        tue: 'Tuesday',
        wed: 'Wednesday',
        thu: 'Thursday',
        fri: 'Friday',
        sat: 'Saturday',
      }
      return map[dayId]
    },
    
    async saveSchedule() {
      try {
        this.isSaving = true
        
        // Build plan from selected days
        const plan = this.daysOfWeek
          .filter(day => this.schedule1Days.includes(day.id))
          .map(day => ({
            weekDay: this.getDayName(day.id),
            isActive: true,
            timeRanges: [{
              fromTime: {
                hour: parseInt(this.fromTime.split(':')[0]),
                minute: parseInt(this.fromTime.split(':')[1]),
              },
              toTime: {
                hour: parseInt(this.toTime.split(':')[0]),
                minute: parseInt(this.toTime.split(':')[1]),
              },
            }],
          }))
        
        await this.$apollo.mutate({
          mutation: SETUP_CAMPAIGN_V2_SCHEDULE,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            timezone: this.timezone,
            plan: JSON.stringify(plan),
          },
        })
        
        console.log('Schedule saved successfully')
      } catch (error) {
        console.error('Failed to save schedule:', error)
        throw error
      } finally {
        this.isSaving = false
      }
    },
    
    async saveEmailConfiguration() {
      try {
        this.isSaving = true
        
        if (!this.selectedEmailAccountIds || this.selectedEmailAccountIds.length === 0) {
          throw new Error('Please select at least one email account')
        }
        
        const { data } = await this.$apollo.mutate({
          mutation: SETUP_CAMPAIGN_V2_CONFIGURATION,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            emailAccountIds: this.selectedEmailAccountIds,
            emailsPerDayLimit: parseInt(this.emailsPerDay) || 50,
            callsPerDayLimit: parseInt(this.callsPerDay) || 3,
            retriesCalls: parseInt(this.retriesCalls) || 3,
            gdprCompliance: this.gdprCompliance,
            whatsappConsents: this.whatsappConsents,
            callPhoneNumberIds: this.selectedCallPhoneNumberIds,
            whatsappPhoneNumberIds: this.selectedWhatsappPhoneNumberIds,
          },
        })
        
        if (data && data.setupCampaignV2Configuration && data.setupCampaignV2Configuration.configuration) {
          const cfg = data.setupCampaignV2Configuration.configuration
          // Update store so other components can use it
          this.$store.dispatch('campaignV2/updateCampaign', { configuration: cfg })

          // Sync local selections from server response
          this.selectedEmailAccountIds = Array.isArray(cfg.emailAccountIds) ? [...cfg.emailAccountIds] : this.selectedEmailAccountIds
          this.selectedCallPhoneNumberIds = Array.isArray(cfg.callPhoneNumberIds) ? [...cfg.callPhoneNumberIds] : this.selectedCallPhoneNumberIds
          this.selectedWhatsappPhoneNumberIds = Array.isArray(cfg.whatsappPhoneNumberIds) ? [...cfg.whatsappPhoneNumberIds] : this.selectedWhatsappPhoneNumberIds
          if (cfg.emailsPerDayLimit) this.emailsPerDay = cfg.emailsPerDayLimit
          if (cfg.callsPerDayLimit) this.callsPerDay = cfg.callsPerDayLimit
        }

        console.log('Configuration saved successfully')
      } catch (error) {
        console.error('Failed to save configuration:', error)
        throw error
      } finally {
        this.isSaving = false
      }
    },
    
    async convertDraftsToSteps() {
      try {
        await this.$apollo.mutate({
          mutation: CONVERT_DRAFTS_TO_STEPS,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
            autoApprove: true,
          },
        })
        
        console.log('Drafts converted to steps successfully')
      } catch (error) {
        console.error('Failed to convert drafts:', error)
        throw error
      }
    },
    
    async activateCampaign() {
      try {
        this.isActivating = true
        
        // Step 1: Save schedule
        this.$notify({
          type: 'info',
          text: 'Saving schedule...',
        })
        await this.saveSchedule()
        
        // Step 2: Save email configuration
        this.$notify({
          type: 'info',
          text: 'Configuring email account...',
        })
        await this.saveEmailConfiguration()
        
        // Step 3: Convert drafts to steps
        this.$notify({
          type: 'info',
          text: 'Converting drafts to executable steps...',
        })
        await this.convertDraftsToSteps()
        
        // Step 4: Activate campaign
        this.$notify({
          type: 'info',
          text: 'Activating campaign...',
        })
        await this.$apollo.mutate({
          mutation: ACTIVATE_CAMPAIGN_V2,
          variables: {
            campaignId: parseInt(this.campaign.id, 10),
          },
        })
        
        // Success!
        this.$notify({
          type: 'success',
          text: 'Campaign activated! Emails will start sending according to schedule.',
          duration: 5000,
        })
        
        // Redirect to campaign dashboard
        setTimeout(() => {
          this.$router.push({ 
            name: 'campaign-v2-id',
            params: { id: this.campaign.id }
          })
        }, 2000)
      } catch (error) {
        console.error('Failed to activate campaign:', error)
        this.$notify({
          type: 'error',
          text: error.message || 'Failed to activate campaign. Please check all settings and try again.',
          duration: 5000,
        })
      } finally {
        this.isActivating = false
      }
    },
    
    addNewSchedule() {
      console.log('Add new schedule')
      // Handle add new schedule logic
    },
    
    addAccount() {
      // Navigate to email accounts page to add new account
      this.$router.push({ name: 'settings-email-accounts' })
    },
    
    toggleEmailAccount(accountId) {
      const index = this.selectedEmailAccountIds.indexOf(accountId)
      if (index > -1) {
        // Remove if already selected
        this.selectedEmailAccountIds.splice(index, 1)
      } else {
        // Add if not selected
        this.selectedEmailAccountIds.push(accountId)
      }
    },
    
    isAccountSelected(accountId) {
      return this.selectedEmailAccountIds.includes(accountId)
    },
    
    removeAccount(accountType) {
      console.log('Remove account:', accountType)
      // Handle remove account logic
    },

    async saveVoiceNumber() {
      try {
        if (!this.newVoiceNumber.e164) {
          return this.$notify({ type: 'error', text: 'Please enter a phone number in E.164 format' })
        }
        this.isSaving = true
        await this.$apollo.mutate({
          mutation: require('~/graphql/phone-number/mutations').SAVE_USER_PHONE_NUMBER_MUTATION,
          variables: {
            e164: this.newVoiceNumber.e164,
            label: this.newVoiceNumber.label || null,
            channels: ['voice'],
          },
        })
        await this.loadCallPhoneNumbers()
        this.resetVoiceForm()
        this.$notify({ type: 'native', text: 'Voice number saved' })
      } catch (error) {
        console.error('Failed to save voice number:', error)
        this.$notify({ type: 'error', text: 'Failed to save voice number' })
      } finally {
        this.isSaving = false
      }
    },

    resetVoiceForm() {
      this.showAddVoice = false
      this.newVoiceNumber = { e164: '', label: '' }
    },

    async saveWhatsappNumber() {
      try {
        if (!this.newWhatsappNumber.e164) {
          return this.$notify({ type: 'error', text: 'Please enter a phone number in E.164 format' })
        }
        this.isSaving = true
        await this.$apollo.mutate({
          mutation: require('~/graphql/phone-number/mutations').SAVE_USER_PHONE_NUMBER_MUTATION,
          variables: {
            e164: this.newWhatsappNumber.e164,
            label: this.newWhatsappNumber.label || null,
            channels: ['whatsapp'],
            whatsappSender: this.newWhatsappNumber.whatsappSender || null,
          },
        })
        await this.loadWhatsappPhoneNumbers()
        this.resetWhatsappForm()
        this.$notify({ type: 'native', text: 'WhatsApp number saved' })
      } catch (error) {
        console.error('Failed to save WhatsApp number:', error)
        this.$notify({ type: 'error', text: 'Failed to save WhatsApp number' })
      } finally {
        this.isSaving = false
      }
    },

    resetWhatsappForm() {
      this.showAddWhatsapp = false
      this.newWhatsappNumber = { e164: '', label: '', whatsappSender: '' }
    },

    async deletePhoneNumber(id, channel) {
      try {
        this.isSaving = true
        await this.$apollo.mutate({
          mutation: require('~/graphql/phone-number/mutations').DELETE_USER_PHONE_NUMBER_MUTATION,
          variables: { id },
        })
        if (channel === 'voice') {
          this.selectedCallPhoneNumberIds = this.selectedCallPhoneNumberIds.filter((x) => x !== id)
          this.callPhoneNumbers = this.callPhoneNumbers.filter((x) => x.id !== id)
        } else {
          this.selectedWhatsappPhoneNumberIds = this.selectedWhatsappPhoneNumberIds.filter((x) => x !== id)
          this.whatsappPhoneNumbers = this.whatsappPhoneNumbers.filter((x) => x.id !== id)
        }
        this.$notify({ type: 'native', text: 'Number deleted' })
      } catch (error) {
        console.error('Failed to delete number:', error)
        this.$notify({ type: 'error', text: 'Failed to delete number' })
      } finally {
        this.isSaving = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.guardrails-account-step {
  background: $white;

  .tabs-container {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #e5e5e5;
    margin-bottom: 32px;

    .tab-button {
      padding: 16px 24px;
      font-size: 1rem;
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
        color: $gray-700;
      }

      &.active {
        color: $primary;
        border-bottom-color: $primary;
        font-weight: 600;
      }
    }
  }

  .tab-content {
    padding: 0;

    .schedules-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 32px;

      .schedule-card {
        background: $white;
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
            background: $white;
            color: $gray-700;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 120px;

            &.active {
              background: $primary;
              color: $white;
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
              background: $white;
              color: $gray-700;
              font-size: 0.9rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;

              &.active {
                background: $primary;
                color: $white;
                border-color: $primary;
              }

              &.inactive {
                background: $white;
                color: $gray-700;
                border-color: #e5e5e5;
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
              background: $white;
              color: $gray-600;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                background: #f9f9f9;
                border-color: $gray-400;
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

    .schedule-settings {
      display: flex;
      gap: 20px;
      margin-bottom: 32px;
      padding: 24px;
      background: #f9f9f9;
      border-radius: 12px;

      .input-group {
        flex: 1;

        .input-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: $gray-900;
          margin-bottom: 8px;
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          color: $gray-900;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: $white;
          transition: all 0.2s ease;

          &:focus {
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
            outline: none;
          }
        }
      }
    }

    .add-schedule-container {
      display: flex;
      justify-content: center;
      padding: 20px 0;

      .add-schedule-btn {
        padding: 12px 24px;
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 8px;
        border: 2px solid $primary;
        background: $white;
        color: $primary;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: $primary;
          color: $white;
        }
      }
    }

    .randomization-content {
      max-width: 700px;

      .inputs-row {
        display: flex;
        gap: 20px;
        margin-bottom: 32px;

        .input-group {
          flex: 1;

          .input-label {
            display: block;
            font-size: 0.9rem;
            font-weight: 500;
            color: $gray-900;
            margin-bottom: 8px;
          }

          .input-field {
            width: 100%;
            padding: 14px 16px;
            font-size: 1.1rem;
            font-weight: 600;
            color: $gray-900;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            background: #f5f5f5;
            transition: all 0.2s ease;

            &:focus {
              border-color: $primary;
              box-shadow: 0 0 0 3px rgba($primary, 0.1);
              outline: none;
              background: $white;
            }
          }
        }
      }

      .section-card {
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 24px 28px;
        margin-bottom: 24px;

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: $gray-900;
          margin: 0 0 20px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;

          .section-title {
            margin: 0;
          }

          .add-account-btn {
            padding: 8px 16px;
            font-size: 0.9rem;
            font-weight: 600;
            border-radius: 8px;
            border: 1px solid $gray-900;
            background: $white;
            color: $gray-900;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: $gray-900;
              color: $white;
            }
          }
        }
      }

      .compliance-section {
        .compliance-option {
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          &:first-child {
            padding-top: 0;
          }

          .option-header {
            margin-bottom: 8px;

            .checkbox-wrapper {
              display: flex;
              align-items: center;

              .checkbox-label {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 1rem;
                font-weight: 600;
                color: $gray-900;
                cursor: pointer;
                user-select: none;

                .checkmark {
                  position: relative;
                  width: 26px;
                  height: 26px;
                  border-radius: 50%;
                  border: 1px solid #000;
                  background: $white;
                  transition: all 0.2s ease;

                  &::after {
                    content: '';
                    position: absolute;
                    display: none;
                    left: 9px;
                    top: 5px;
                    width: 6px;
                    height: 11px;
                    border: solid $white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                  }
                }
              }

              .custom-checkbox {
                display: none;

                &:checked + .checkbox-label .checkmark {
                  background: $primary;
                  border-color: #000;

                  &::after {
                    display: block;
                  }
                }
              }
            }
          }

          .option-description {
            font-size: 0.9rem;
            color: #9ca3af;
            margin: 0 0 0 36px;
            line-height: 1.5;
          }
        }
      }

      .account-section {
        .accounts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .account-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            background: $white;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              border-color: $primary;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            &.selected {
              border-color: $primary;
              background: #f0f4ff;
            }

            .account-checkbox {
              margin-right: 12px;
              
              input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
                accent-color: $primary;
              }
            }

            .account-info {
              display: flex;
              align-items: center;
              gap: 16px;
              flex: 1;

              .account-icon {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;

                &.gmail-icon {
                  background: #fff;
                }

                &.whatsapp-icon {
                  // background: #25d366;
                }

                &.outlook-icon {
                  // background: #0078d4;
                }
              }

              .account-type {
                font-size: 0.95rem;
                font-weight: 600;
                color: $gray-900;
                min-width: 80px;
              }

              .account-user {
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

                .user-email,
                .user-phone {
                  font-size: 0.95rem;
                  color: $gray-700;
                }
              }
            }

            .account-status {
              .badge {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
              }

              .badge-success {
                background: #d4edda;
                color: #155724;
              }
            }

            .remove-account-btn {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: none;
              background: none;
              color: $gray-600;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                color: #c33;
              }
            }
          }
        }
      }

      .health-warnings-section {
        .warnings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .warning-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-radius: 8px;
            transition: all 0.2s ease;

            &.cyan-warning {
              background: #d1f4f7;
            }

            &.purple-warning {
              background: #e9d5ff;
            }

            &.pink-warning {
              background: #fce4e4;
            }

            .warning-content {
              display: flex;
              align-items: center;
              gap: 12px;

              .warning-icon {
                width: 20px;
                height: 20px;
                color: $gray-900;
              }

              .warning-text {
                font-size: 0.95rem;
                font-weight: 500;
                color: $gray-900;
              }
            }

            .fix-btn {
              padding: 8px 20px;
              font-size: 0.9rem;
              font-weight: 600;
              border-radius: 6px;
              border: none;
              background: $white;
              color: $gray-900;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                background: $gray-900;
                color: $white;
              }
            }
          }
        }
      }
    }

    .placeholder-content {
      padding: 60px 20px;
      text-align: center;
      color: $gray-600;
      font-size: 1rem;
    }
  }

  .activation-section {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 2px solid #e5e5e5;

    .activation-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 32px;
      color: $white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;

      .activation-content {
        flex: 1;

        .activation-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 12px 0;
        }

        .activation-description {
          font-size: 1rem;
          margin: 0 0 20px 0;
          opacity: 0.95;
        }

        .activation-checklist {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            font-size: 0.95rem;
            margin-bottom: 8px;
            opacity: 0.9;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      .activation-actions {
        text-align: center;

        .btn-activate {
          padding: 16px 48px;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 12px;
          border: none;
          background: $white;
          color: #667eea;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          white-space: nowrap;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          }

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }

        .activation-note {
          margin-top: 12px;
          font-size: 0.85rem;
          opacity: 0.85;
        }
      }
    }
  }
}

// SVG icon styles - ordered by specificity (shortest path first)
.guardrails-account-step .default-btn svg {
  width: 16px;
  height: 16px;
}

.guardrails-account-step .icon-btn svg {
  width: 20px;
  height: 20px;
}

.guardrails-account-step .add-schedule-btn svg {
  width: 18px;
  height: 18px;
}

.guardrails-account-step .add-account-btn svg {
  width: 16px;
  height: 16px;
}

.guardrails-account-step .account-icon svg {
  width: 24px;
  height: 24px;
}

.guardrails-account-step .remove-account-btn svg {
  width: 18px;
  height: 18px;
}

.guardrails-account-step .warning-icon svg {
  width: 20px;
  height: 20px;
}

/* stylelint-disable selector-pseudo-element-no-unknown */
.guardrails-account-step .tab-content .schedules-list .schedule-card .schedule-header .schedule-actions .icon-btn.delete-btn ::v-deep svg {
  fill: none !important;
  stroke: currentColor;
  stroke-width: 2;
}

.guardrails-account-step .tab-content .schedules-list .schedule-card .schedule-header .schedule-actions .icon-btn.delete-btn ::v-deep svg path {
  fill: none !important;
  stroke: currentColor;
  stroke-width: 2;
}

.guardrails-account-step .tab-content .schedules-list .schedule-card .schedule-header .schedule-actions .icon-btn.delete-btn ::v-deep svg circle {
  fill: none !important;
  stroke: currentColor;
  stroke-width: 2;
}

.guardrails-account-step .tab-content .schedules-list .schedule-card .schedule-header .schedule-actions .icon-btn.delete-btn ::v-deep svg * {
  fill: none !important;
  stroke: currentColor;
}
/* stylelint-enable selector-pseudo-element-no-unknown */
</style>
