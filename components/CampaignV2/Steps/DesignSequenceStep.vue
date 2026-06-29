<template>
  <div class="design-sequence-step">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-content">
        
        <h3>🤖 {{ agentDisplayName }} is generating your campaign...</h3>
        <p>This may take 30-60 seconds. Please wait.</p>

        <div class="spinner-container">
          <div class="spinner"></div>
        </div>
        
        <div class="loading-steps">
          <div class="loading-step" :class="{ active: loadingStep >= 1 }">
            <div class="step-icon">{{ loadingStep >= 1 ? '✓' : '⏳' }}</div>
            <span>Analyzing your documents</span>
          </div>
          <div class="loading-step" :class="{ active: loadingStep >= 2 }">
            <div class="step-icon">{{ loadingStep >= 2 ? '✓' : '⏳' }}</div>
            <span>Building campaign context</span>
          </div>
          <div class="loading-step" :class="{ active: loadingStep >= 3 }">
            <div class="step-icon">{{ loadingStep >= 3 ? '✓' : '⏳' }}</div>
            <span>Generating email sequence</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <div class="header-section">
        <div class="header-left">
          <h3>Campaign Steps</h3>
          <p v-if="drafts.length > 0" class="draft-count">{{ drafts.length }} emails in sequence</p>
        </div>
        <div class="header-right">
          <button class="add-step-btn" @click="addStep">
            <SvgIcon name="plus-green" />
            Add Step
          </button>
          <button v-if="drafts.length > 0" class="regenerate-btn" @click="regenerateCampaign">
            🔄 Regenerate
          </button>
        </div>
      </div>

      <!-- Email Editor Modal V2 -->
      <EmailEditorModalV2
        :form-data="editingDraftData"
        :channel="selectedChannel"
        @save="saveDraft"
      />

      <!-- Drafts Display -->
      <div v-if="drafts.length > 0" class="steps-list">
        <div
          v-for="(draft, index) in drafts"
          :key="draft.id"
          class="step-item"
        >
          <div class="step-header">
            <div class="step-circle">
              <div class="inner-circle"></div>
            </div>
            <div class="step-badge" :class="`day-${getDayNumber(draft.timing)}`">
              Step {{ draft.stepNumber }} - Day {{ getDayNumber(draft.timing) }}
            </div>
            <div class="step-timing" @click="toggleDropdown(draft.id)">
              <SvgIcon name="clock" />
              <span>{{ formatDelay(draft) }}</span>
              <SvgIcon name="chevron-down-alt" class="ml-1" />
              
              <!-- Delay Picker Dropdown -->
              <div v-if="dropdownOpen === draft.id" class="delay-picker-dropdown" @click.stop>
                <div class="delay-picker-header">
                  <!-- <SvgIcon name="clock" class="header-icon" /> -->
                  <span class="header-title">Deliver after a delay</span>
                </div>
                
                <div class="delay-inputs">
                  <div class="input-group">
                    <label class="input-label">Days</label>
                    <div class="number-input">
                      <input 
                        type="number" 
                        v-model.number="delayPicker.days" 
                        min="0" 
                        max="365"
                        @click.stop
                      />
                      <!-- <SvgIcon name="chevron-down-alt" class="input-arrow" /> -->
                    </div>
                  </div>
                  
                  <div class="input-group">
                    <label class="input-label">Hours</label>
                    <div class="number-input">
                      <input 
                        type="number" 
                        v-model.number="delayPicker.hours" 
                        min="0" 
                        max="23"
                        @click.stop
                      />
                    </div>
                  </div>
                  
                  <div class="input-group">
                    <label class="input-label">Minutes</label>
                    <div class="number-input">
                      <input 
                        type="number" 
                        v-model.number="delayPicker.minutes" 
                        min="0" 
                        max="59"
                        @click.stop
                      />
                    </div>
                  </div>
                </div>
                
                <div class="delay-picker-actions">
                  <b-button variant="link" class="cancel-btn" @click.stop="closeDropdown">
                    Cancel
                  </b-button>
                  <b-button variant="primary" class="save-btn" @click.stop="saveDelay(draft.id)">
                    Save
                  </b-button>
                </div>
              </div>
            </div>
          </div>

          <div class="step-content">
            <div class="action-card">
              <div class="step-status done">
                <div class="check-circle">
                  <SvgIcon name="check" />
                </div>
                Generated
              </div>
              <div :class="['action-icon', draft.channel]">
                <SvgIcon :name="getChannelIcon(draft.channel)" />
              </div>
              <div class="action-details">
                <h5>{{ getDraftTitle(draft) }}</h5>
                <p>{{ truncate(getDraftContent(draft), 150) }}</p>
              </div>
              <div class="action-controls">
                <button class="icon-btn" @click="openEditModal(draft)" title="Edit">
                  <SvgIcon name="pen" />
                </button>
                <button
                  v-if="drafts.length > 1"
                  class="icon-btn delete-btn"
                  @click="deleteDraft(draft.id)"
                  title="Delete"
                >
                  <SvgIcon name="trash" />
                </button>
              </div>
            </div>
          </div>

          <button v-if="index < drafts.length - 1" class="add-step-between" @click="addStepBetween(index)">
            <SvgIcon name="plus-white" />
          </button>
        </div>

        <!-- Add Step Button at Bottom -->
        <div class="add-step-bottom">
          <button class="add-step-btn-large" @click="addStep">
            <SvgIcon name="plus" />
            Add Step
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📧</div>
        <h3>No campaign drafts yet</h3>
        <p>Go back and complete the previous steps, or the campaign is still generating.</p>
      </div>
    </div>
  </div>
</template>

<script>
import EmailEditorModalV2 from '~/components/CampaignV2/EmailEditorModalV2'

export default {
  name: 'DesignSequenceStep',

  components: {
    EmailEditorModalV2,
  },

  data() {
    return {
      drafts: [],
      loading: true,
      loadingStep: 1,
      dropdownOpen: null,
      editingDraft: null,
      editingDraftData: {},
      selectedChannel: 'email',
      pollingInterval: null,
      pollAttempts: 0,
      maxPollAttempts: 60, // 3 minutes (60 * 3 seconds)
      errorCount: 0,
      maxErrors: 3,
      hasTimedOut: false,
      delayPicker: {
        days: 0,
        hours: 0,
        minutes: 0,
      },
      currentEditingDraftId: null,
    }
  },
  
  computed: {
    agentDisplayName() {
      const name = this.$store.state.campaignV2?.campaign?.agentName
      return name && name.trim() ? name.trim() : 'Your Agent'
    },
  },

  mounted() {
    this.startGeneration()
  },

  beforeDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }
  },

  methods: {
    getDraftTitle(draft) {
      // Return appropriate title based on channel
      if (draft.channel === 'whatsapp') {
        return draft.subject || 'WhatsApp Message'
      } else if (draft.channel === 'linkedin') {
        return draft.subject || 'LinkedIn Message'
      } else if (draft.channel === 'call' || draft.channel === 'phone' || draft.channel === 'ai_call') {
        return draft.subject || 'Call Script'
      } else if (draft.channel === 'email') {
        return draft.subject || 'Email'
      }
      return draft.subject || `${draft.channel} Message`
    },

    getDraftContent(draft) {
      // Return appropriate content based on channel
      if (draft.channel === 'whatsapp') {
        return draft.whatsapp || draft.body || ''
      } else if (draft.channel === 'linkedin') {
        return draft.linkedin || draft.body || ''
      } else {
        return draft.body || ''
      }
    },

    getChannelIcon(channel) {
      // Return appropriate icon for each channel
      const iconMap = {
        email: 'email-alt',
        whatsapp: 'whatsapp',
        linkedin: 'linkedin',
        call: 'phone',
        phone: 'phone',
        ai_call: 'phone',
        sms: 'message',
      }
      return iconMap[channel] || 'email-alt'
    },

    async startGeneration() {
      const campaignId = this.$store.state.campaignV2?.campaign?.id

      if (!campaignId) {
        this.loading = false
        return
      }

      // Simulate loading steps
      setTimeout(() => { this.loadingStep = 2 }, 10000)
      setTimeout(() => { this.loadingStep = 3 }, 20000)

      // Start polling for drafts
      this.pollForDrafts()
    },

    async pollForDrafts() {
      const campaignId = this.$store.state.campaignV2?.campaign?.id

      if (!campaignId) {
        this.loading = false
        return
      }

      const poll = async () => {
        // Check timeout
        this.pollAttempts++
        
        if (this.pollAttempts > this.maxPollAttempts) {
          this.handleTimeout()
          return
        }

        try {
          const { data } = await this.$apollo.query({
            query: require('~/graphql/campaignV2/queries').GET_CAMPAIGN_DRAFTS,
            variables: { campaignId },
            fetchPolicy: 'network-only',
          })

          if (data.getCampaignDrafts && data.getCampaignDrafts.length > 0) {
            this.drafts = data.getCampaignDrafts
            this.loading = false
            this.errorCount = 0 // Reset error count on success

            // Stop polling
            if (this.pollingInterval) {
              clearInterval(this.pollingInterval)
            }

            this.$notify({
              group: 'main',
              type: 'success',
              text: `Campaign generated successfully! ${this.drafts.length} emails created.`,
            })
          }
        } catch (error) {
          console.error('Poll drafts error:', error)
          this.errorCount++

          // Stop polling after max errors
          if (this.errorCount >= this.maxErrors) {
            this.handleError()
          }
        }
      }

      // Poll immediately
      await poll()

      // Continue polling every 3 seconds if still loading
      if (this.loading && !this.hasTimedOut) {
        this.pollingInterval = setInterval(poll, 3000)
      }
    },

    handleTimeout() {
      this.loading = false
      this.hasTimedOut = true

      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
      }

      this.$notify({
        group: 'main',
        type: 'error',
        title: 'Generation Timeout',
        text: 'Campaign generation is taking longer than expected. Please try regenerating or contact support.',
        duration: 10000,
      })
    },

    handleError() {
      this.loading = false

      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
      }

      this.$notify({
        group: 'main',
        type: 'error',
        title: 'Generation Failed',
        text: 'Failed to load campaign drafts after multiple attempts. Please refresh the page or try regenerating.',
        duration: 10000,
      })
    },

    retryGeneration() {
      // Reset state
      this.loading = true
      this.loadingStep = 1
      this.pollAttempts = 0
      this.errorCount = 0
      this.hasTimedOut = false
      this.drafts = []

      // Restart generation
      this.startGeneration()

      this.$notify({
        group: 'main',
        type: 'info',
        text: 'Retrying campaign generation...',
      })
    },

    toggleDropdown(draftId) {
      if (this.dropdownOpen === draftId) {
        this.dropdownOpen = null
        this.currentEditingDraftId = null
      } else {
        const draft = this.drafts.find(d => d.id === draftId)
        if (draft) {
          // Parse existing delay from draft
          this.parseDelayFromDraft(draft)
          this.currentEditingDraftId = draftId
        }
        this.dropdownOpen = draftId
      }
    },

    parseDelayFromDraft(draft) {
      // Parse timing string to extract days, hours, minutes
      // Assuming draft has delayDays, delayHours, delayMinutes properties
      this.delayPicker.days = draft.delayDays || 0
      this.delayPicker.hours = draft.delayHours || 0
      this.delayPicker.minutes = draft.delayMinutes || 0
    },

    formatDelay(draft) {
      // Format delay for display
      const days = draft.delayDays || 0
      const hours = draft.delayHours || 0
      const minutes = draft.delayMinutes || 0
      
      if (days === 0 && hours === 0 && minutes === 0) {
        return 'Right Away'
      }
      
      const parts = []
      if (days > 0) parts.push(`${days}d`)
      if (hours > 0) parts.push(`${hours}h`)
      if (minutes > 0) parts.push(`${minutes}m`)
      
      return parts.join(' ') + ' later'
    },

    closeDropdown() {
      this.dropdownOpen = null
      this.currentEditingDraftId = null
    },

    async saveDelay(draftId) {
      const draft = this.drafts.find(d => d.id === draftId)
      const oldDelay = draft ? {
        delayDays: draft.delayDays,
        delayHours: draft.delayHours,
        delayMinutes: draft.delayMinutes
      } : null
      
      // Update draft with new delay
      if (draft) {
        draft.delayDays = this.delayPicker.days
        draft.delayHours = this.delayPicker.hours
        draft.delayMinutes = this.delayPicker.minutes
      }
      
      this.closeDropdown()

      try {
        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').UPDATE_CAMPAIGN_DRAFT,
          variables: { 
            id: draftId, 
            delayDays: this.delayPicker.days,
            delayHours: this.delayPicker.hours,
            delayMinutes: this.delayPicker.minutes
          },
        })

        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Timing updated',
          duration: 2000,
        })
      } catch (error) {
        console.error('Update timing error:', error)
        
        // Rollback on error
        if (draft && oldDelay) {
          draft.delayDays = oldDelay.delayDays
          draft.delayHours = oldDelay.delayHours
          draft.delayMinutes = oldDelay.delayMinutes
        }

        this.$notify({
          group: 'main',
          type: 'error',
          text: 'Failed to update timing. Please try again.',
          duration: 5000,
        })
      }
    },

    openEditModal(draft) {
      this.editingDraft = { ...draft }
      this.selectedChannel = draft.channel || 'email'
      
      console.log('Opening modal for channel:', draft.channel)
      console.log('Draft data:', draft)
      
      // Prepare data based on channel type
      if (draft.channel === 'email') {
        this.editingDraftData = {
          subject: draft.subject || '',
          body: draft.body || '',
        }
      } else if (draft.channel === 'call') {
        this.editingDraftData = {
          scriptName: draft.subject || 'Call Script',
          script: draft.body || '',
        }
      } else if (draft.channel === 'whatsapp') {
        this.editingDraftData = {
          messageTitle: draft.subject || 'WhatsApp Message',
          messageTemplate: draft.whatsapp || draft.body || '',
        }
      } else if (draft.channel === 'linkedin') {
        this.editingDraftData = {
          messageTitle: draft.subject || 'LinkedIn Message',
          messageTemplate: draft.linkedin || draft.body || '',
        }
      }
      
      console.log('Prepared data:', this.editingDraftData)
      console.log('Selected channel:', this.selectedChannel)
      
      // Open the modal
      this.$bvModal.show('EmailEditorModalV2')
    },

    async saveDraft(updatedData) {
      try {
        console.log('Saving draft with data:', updatedData)
        
        // Merge with existing draft to preserve ID and other properties
        const draftToSave = {
          ...this.editingDraft,
          ...updatedData,
        }
        
        console.log('Draft to save:', draftToSave)
        
        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').UPDATE_CAMPAIGN_DRAFT,
          variables: {
            id: draftToSave.id,
            subject: draftToSave.subject,
            body: draftToSave.body,
            whatsapp: draftToSave.whatsapp,
            linkedin: draftToSave.linkedin,
          },
        })

        // Update local state
        const index = this.drafts.findIndex(d => d.id === draftToSave.id)
        if (index !== -1) {
          this.drafts[index] = { ...this.drafts[index], ...updatedData }
        }

        this.editingDraft = null
        this.editingDraftData = {}
        
        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Draft saved successfully',
          duration: 3000,
        })
      } catch (error) {
        console.error('Save draft error:', error)
        
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Save Failed',
          text: 'Failed to save draft. Please try again.',
          duration: 5000,
        })
      }
    },

    async addStep() {
      const campaignId = this.$store.state.campaignV2?.campaign?.id
      const nextStepNumber = this.drafts.length + 1

      try {
        const { data } = await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').ADD_CAMPAIGN_DRAFT_STEP,
          variables: {
            campaignId,
            stepNumber: nextStepNumber,
            timing: 'Right Away',
          },
        })

        this.drafts.push(data.addCampaignDraftStep)
        
        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Step added',
          duration: 3000,
        })
      } catch (error) {
        console.error('Add step error:', error)
        
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Add Step Failed',
          text: 'Failed to add step. Please try again.',
          duration: 5000,
        })
      }
    },

    async addStepBetween(index) {
      // Add step between current and next
      const campaignId = this.$store.state.campaignV2?.campaign?.id
      const nextStepNumber = this.drafts[index].stepNumber + 1

      try {
        const { data } = await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').ADD_CAMPAIGN_DRAFT_STEP,
          variables: {
            campaignId,
            stepNumber: nextStepNumber,
            timing: '1 Day Later',
          },
        })

        // Insert at the right position
        this.drafts.splice(index + 1, 0, data.addCampaignDraftStep)
        
        // Renumber steps
        this.drafts.forEach((draft, idx) => {
          draft.stepNumber = idx + 1
        })

        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Step inserted successfully',
          duration: 3000,
        })
      } catch (error) {
        console.error('Add step error:', error)
        
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Insert Step Failed',
          text: 'Failed to insert step. Please try again.',
          duration: 5000,
        })
      }
    },

    async deleteDraft(draftId) {
      if (!confirm('Are you sure you want to delete this step?')) {
        return
      }

      try {
        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').DELETE_CAMPAIGN_DRAFT,
          variables: { id: draftId },
        })

        this.drafts = this.drafts.filter(d => d.id !== draftId)
        this.$toast.success('Step deleted')
      } catch (error) {
        console.error('Delete draft error:', error)
        this.$toast.error('Failed to delete step')
      }
    },

    async regenerateCampaign() {
      if (!confirm('This will replace all emails with new AI-generated content. Continue?')) {
        return
      }

      const campaignId = this.$store.state.campaignV2?.campaign?.id

      try {
        // Delete all existing drafts
        await Promise.all(
          this.drafts.map(d => 
            this.$apollo.mutate({
              mutation: require('~/graphql/campaignV2/mutations').DELETE_CAMPAIGN_DRAFT,
              variables: { id: d.id },
            })
          )
        )

        this.drafts = []
        this.loading = true
        this.loadingStep = 1

        // Trigger new generation
        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').GENERATE_CAMPAIGN_DRAFTS,
          variables: { campaignId },
        })

        this.$toast.success('Regenerating campaign...')
        this.startGeneration()
      } catch (error) {
        console.error('Regenerate error:', error)
        this.$toast.error('Failed to regenerate campaign')
        this.loading = false
      }
    },

    getDayNumber(timing) {
      const match = timing.match(/(\d+)/)
      return match ? match[1] : '1'
    },

    truncate(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.design-sequence-step {
  padding: 20px 0;

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    padding: 60px 20px;

    .loading-content {
      text-align: center;
      max-width: 500px;

      .spinner-container {
        margin-bottom: 30px;

        .spinner {
          width: 60px;
          height: 60px;
          margin: 0 auto;
          border: 4px solid #f3f3f3;
          border-top: 4px solid $primary;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }

      h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 12px;
      }

      p {
        font-size: 1rem;
        color: $gray-600;
        margin-bottom: 40px;
      }

      .loading-steps {
        display: flex;
        flex-direction: column;
        gap: 16px;
        text-align: left;

        .loading-step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: $white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          transition: all 0.3s ease;

          &.active {
            border-color: $primary;
            background: rgba($primary, 0.05);

            .step-icon {
              background: $primary;
              color: $white;
            }
          }

          .step-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
          }

          span {
            font-size: 0.95rem;
            color: $gray-700;
            font-weight: 500;
          }
        }
      }
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: $gray-800;
      margin-bottom: 12px;
    }

    p {
      font-size: 1rem;
      color: $gray-600;
    }
  }

  .draft-count {
    font-size: 0.9rem;
    color: $gray-600;
    margin: 4px 0 0 0;
  }

  .regenerate-btn {
    padding: 10px 20px;
    background: transparent;
    border: 1px solid #ff9800;
    border-radius: 8px;
    color: #ff9800;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(#ff9800, 0.1);
    }
  }

  .delete-btn {
    &:hover {
      color: #f44336 !important;
    }
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    .header-left {
      h3 {
        font-size: 1.3rem;
        font-weight: 600;
        color: $gray-800;
        margin: 0;
      }
    }

    .header-right {
      display: flex;
      gap: 12px;

      .add-step-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: transparent;
        border: 1px solid $primary;
        border-radius: 8px;
        color: $primary;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba($primary, 0.05);
        }
      }

      .default-btn {
        padding: 10px 20px;
        background: #f5f5f5;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        color: $gray-700;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #e5e5e5;
        }
      }
    }
  }

  .steps-list {
    .step-item {
      margin-bottom: 20px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 40px;
        width: 2px;
        height: calc(100% - 20px);
        background-color: #2f2f41;
        z-index: 0;
      }

      &:last-child::before {
        display: none;
      }

      .step-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
        border: $gray-400;

        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #000;
          border: 2px solid $gray-400;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          padding: 4px;

          .inner-circle {
            width: 80%;
            height: 80%;
            border-radius: 50%;
            background: #3a3a3a;
            border: 1px solid #fff;
          }
        }

        .step-badge {
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 900;
          background: #d0f56b;
          color: #2f2f41;
        }

        .step-timing {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: $white;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-size: 0.85rem;
          color: $gray-700;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;

          &:hover {
            border-color: $primary;
          }

          .delay-picker-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            min-width: 420px;
            background: $white;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            z-index: 100;
            padding: 20px;

            .delay-picker-header {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 20px;
              padding-bottom: 16px;
              border-bottom: 1px solid #e5e5e5;

              .header-icon {
                width: 20px;
                height: 20px;
                color: $gray-600;
              }

              .header-title {
                font-size: 1rem;
                font-weight: 600;
                color: $gray-800;
              }
            }

            .delay-inputs {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin-bottom: 20px;

              .input-group {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .input-label {
                  font-size: 0.85rem;
                  font-weight: 500;
                  color: $gray-600;
                  margin: 0;
                }

                .number-input {
                  position: relative;
                  display: flex;
                  align-items: center;

                  input {
                    width: 100%;
                    padding: 10px 32px 10px 12px;
                    border: 1px solid #e5e5e5;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 500;
                    color: $gray-800;
                    transition: all 0.2s ease;

                    &:focus {
                      outline: none;
                      border-color: $primary;
                      box-shadow: 0 0 0 3px rgba($primary, 0.1);
                    }

                    &::-webkit-inner-spin-button,
                    &::-webkit-outer-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }

                    -moz-appearance: textfield;
                  }

                  .input-arrow {
                    position: absolute;
                    right: 12px;
                    width: 14px;
                    height: 14px;
                    color: $gray-500;
                    pointer-events: none;
                  }
                }
              }
            }

            .delay-picker-actions {
              display: flex;
              justify-content: flex-end;
              gap: 12px;
              padding-top: 16px;
              border-top: 1px solid #e5e5e5;

              .cancel-btn {
                padding: 8px 20px;
                font-size: 0.9rem;
                font-weight: 600;
                color: $gray-600;
                text-decoration: none;

                &:hover {
                  color: $gray-800;
                  text-decoration: none;
                }
              }

              .save-btn {
                padding: 8px 24px;
                font-size: 0.9rem;
                font-weight: 600;
                background: $primary;
                border: none;
                border-radius: 8px;
                color: #000;

                &:hover {
                  background: darken($primary, 5%);
                }
              }
            }
          }
        }
      }

      .step-content {
        padding-left: 44px;

        .action-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: $white;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          margin-bottom: 12px;
          position: relative;

          .action-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 1px solid $gray-200;

            &.email {
            background: #fff;
              color: #fff;
            }

            &.todo {
              background: #fff;
              color: #fff;
            }

            &.call {
              background: #fff;
              color: #fff;
            }

            svg {
              width: 38px !important;
              height: 38px !important;
              fill: currentColor !important;
              stroke: currentColor !important;

              * {
                fill: currentColor !important;
                stroke: currentColor !important;
              }

              path,
              circle,
              rect,
              line,
              polyline,
              polygon {
                fill: currentColor !important;
                stroke: currentColor !important;
              }
            }
          }

          .step-status {
            position: absolute;
            top: -16px;
            right: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            z-index: 10;

            &.done {
              background: $primary;
              color: $white;

              .check-circle {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: $white;
                display: flex;
                align-items: center;
                justify-content: center;
                color: $primary;

                svg {
                  width: 12px;
                  height: 12px;
                }
              }
            }
          }

          .action-details {
            flex: 1;

            h5 {
              font-size: 1rem;
              font-weight: 600;
              color: $gray-800;
              margin: 0 0 6px 0;
            }

            p {
              font-size: 0.9rem;
              color: $gray-600;
              margin: 0;
              line-height: 1.5;
            }
          }

          .add-action-btn {
            width: 32px;
            height: 32px;
            background: $gray-800;
            color: $white;
            border: none;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: $gray-700;
            }
          }

          .action-controls {
            display: flex;
            gap: 8px;

            .icon-btn {
              width: 32px;
              height: 32px;
              background: transparent;
              border: none;
              color: $gray-500;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                color: $gray-700;
              }
            }
          }
        }
      }

      .add-step-between {
        position: absolute;
        bottom: -29px;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 32px;
        background: $gray-800;
        color: $white;
        border: none;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 10;

        &:hover {
          background: $gray-700;
        }
      }
    }

    .add-step-bottom {
      padding: 40px 0 20px;
      text-align: center;

      .add-step-btn-large {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: transparent;
        border: 1px solid $gray-400;
        border-radius: 8px;
        color: $gray-700;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: $gray-100;
          border-color: $gray-500;
        }
      }
    }
  }
}
</style>
