<template>
  <div class="campaign-v2-setup-page">
    <div class="setup-header">
      <div class="header-left">
        <!-- <div class="agent-info" v-if="campaign.agentName">
          <div class="agent-avatar-small">
            <img :src="agentAvatarUrl" alt="Agent Avatar" />
          </div>
          <div class="agent-details">
            <span class="agent-name">{{ campaign.agentName }}</span>
            <span class="campaign-name">{{ campaign.campaignName || 'Untitled Campaign' }}</span>
          </div>
        </div> -->
        <div>
          <h2 class="setup-title">{{ currentStepData.title }}</h2>
          <p class="setup-subtitle">{{ currentStepData.subtitle }}</p>
        </div>
      </div>
      <div class="header-right">
        <b-button variant="outline-dark" size="md" @click="saveDraft">
          <SvgIcon name="plus" class="mr-2" />
          Save Draft
        </b-button>
        <b-button variant="outline-dark" size="md" @click="showHelp">
          Help
        </b-button>
      </div>
    </div>

    <div class="setup-content" :class="{ 'preview-mode': showPreview, 'hide-summary': hideSummary }">
      <!-- Left Sidebar - Steps -->
      <div class="setup-sidebar">
        <div class="steps-list">
          <div
            v-for="step in steps"
            :key="step.id"
            class="step-item"
            :class="{ 
              active: showPreview ? isLastStep && step.id === steps[steps.length - 1].id : currentStep === step.id, 
              completed: isStepCompleted(step.id),
              disabled: !canNavigateToStep(step.id)
            }"
            @click="handleStepClick(step.id)"
          >
            <div class="step-indicator">
              <div v-if="isStepCompleted(step.id)" class="step-check">
                <SvgIcon name="check" />
              </div>
              <div v-else class="step-circle"></div>
            </div>
            <div class="step-label">{{ step.label }}</div>
          </div>
        </div>
        <div class="form-actions ">
          <b-button variant="outline-secondary" @click="handlePreviousStep" class=" ">
            <SvgIcon name="arrow-left" class="mr-1" />
            Back
          </b-button>
          <b-button 
            :variant="showPreview ? 'primary' : (isLastStep ? 'dark' : 'outline-secondary')" 
            @click="showPreview ? launchCampaign() : handleNext()" 
            :class="['next-btn',  { 'preview-btn': isLastStep && !showPreview, 'save-send-btn': showPreview }]"
            :disabled="isAdvancing"
          >
            <SvgIcon v-if="isLastStep && !showPreview && !isAdvancing" name="eye" class="mr-1" />
            <b-spinner v-if="isAdvancing" small class="mr-2" />
            {{ showPreview ? 'Save & Send' : (isLastStep ? 'Preview' : 'Next') }}
            <SvgIcon v-if="!isLastStep && !showPreview && !isAdvancing" name="arrow-right" class="ml-1" />
          </b-button>
        </div>
      </div>

      <!-- Middle Section-->
      <div class="setup-main">
        <!-- Preview Mode -->
        <CampaignPreview v-if="showPreview" />

        <!-- Normal Step Content -->
        <component 
          v-else 
          :is="currentStepComponent" 
          ref="currentStepRef"
          @next="handleNext" 
          @cancel="handlePreviousStep" 
          @toggle-sidebar="handleToggleSidebar" 
        />
      </div>

      <!-- Right Sidebar - Live Summary -->
      <div v-if="!showPreview && !hideSummary" class="setup-summary">
        <div class="summary-header">
          <SvgIcon name="file" class="mr-2" size="md" />
          <span>Live Summary</span>
        </div>

        <div class="summary-content">
          <div class="summary-section">
            <label>Agent Name</label>
            <p>{{ campaign.agentName || '-' }}</p>
          </div>

          <div class="summary-section">
            <label>Campaign Name</label>
            <p>{{ campaign.campaignName || '-' }}</p>
          </div>

          <div class="summary-section">
            <label>Agent Tone</label>
            <p>{{ campaign.agentTone || '-' }}</p>
          </div>

          <div class="summary-section">
            <label>Voice Persona</label>
            <p>{{ campaign.voicePersona || '-' }}</p>
          </div>

          <div class="summary-section">
            <label>Role</label>
            <p>{{ campaign.role || '-' }}</p>
          </div>

          <div class="summary-section">
            <label>Business Name</label>
            <p>{{ campaign.businessName || '-' }}</p>
          </div>

          <div class="summary-section">
            <label>Industry</label>
            <p>{{ campaign.industry || '-' }}</p>
          </div>

          <div class="summary-section">
            <label>Business Description</label>
            <p>{{ campaign.businessDescription || '-' }}</p>
          </div>

          <div v-if="campaign.brandLogo" class="summary-section">
            <label>Brand Logo</label>
            <div class="logo-preview-summary">
              <img :src="brandLogoUrl" alt="Brand Logo" />
            </div>
          </div>

          <div class="summary-section">
            <label>Channels</label>
            <div class="channels-list">
              <span v-for="channel in campaign.channels" :key="channel" class="channel-tag">
                {{ channel }}
                <SvgIcon name="close" class="ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SetupAgentStep from '~/components/CampaignV2/Steps/SetupAgentStep'
import KnowledgeSourcesStep from '~/components/CampaignV2/Steps/KnowledgeSourcesStep'
import ChooseStartingPointStep from '~/components/CampaignV2/Steps/ChooseStartingPointStep'
import DesignSequenceStep from '~/components/CampaignV2/Steps/DesignSequenceStep'
import AddContactsStep from '~/components/CampaignV2/Steps/AddContactsStep'
import EnableLeadCaptureStep from '~/components/CampaignV2/Steps/EnableLeadCaptureStep'
import GuardrailsAccountStep from '~/components/CampaignV2/Steps/GuardrailsAccountStep'
import CampaignPreview from '~/components/CampaignV2/CampaignPreview'

export default {
  components: {
    CampaignPreview,
  },
  middleware: ['auth', 'setup'],

  data() {
    return {
      currentStep: 'setup-agent',
      completedSteps: [],
      hideSummary: false,
      showPreview: false,
      isAdvancing: false,
      steps: [
        { 
          id: 'setup-agent', 
          label: 'Setup Agent',
          title: 'Setup Agent',
          subtitle: 'Follow these steps to launch your AI Agent, it only takes a few mins',
          required: true
        },

        { 
          id: 'knowledge-sources', 
          label: 'Knowledge Sources',
          title: 'Teach Your Agent About Your Business',
          subtitle: 'Upload or connect your business resources so your agent knows what to do, how you sell, and how to talk to your customers',
          required: true
        },
        { 
          id: 'choose-starting-point', 
          label: 'Choose starting point',
          title: 'Pick How To Start',
          subtitle: 'Follow these steps to launch your AI Agent, it only takes a few mins',
          required: true
        },
        
        { 
          id: 'design-sequence', 
          label: 'Design sequence',
          title: 'Design Sequence',
          subtitle: 'Review and customize your AI-generated email sequence'
        },
        { 
          id: 'add-contacts', 
          label: 'Add contacts',
          title: 'Add Contacts',
          subtitle: 'Easily manage and organize your contacts.'
        },
        { 
          id: 'enable-lead-capture', 
          label: 'Enable lead capture',
          title: 'Enable Lead Capture',
          subtitle: 'Follow these steps to launch your AI Agent, it only takes a few mins'
        },
        { 
          id: 'guardrails-account', 
          label: 'Guardrails & Account',
          title: 'Guardrails & Account',
          subtitle: 'Configure safety rules and account settings for your campaign'
        },
      ],
    }
  },

  computed: {
    ...mapState('campaignV2', ['campaign']),

    currentStepData() {
      return this.steps.find((step) => step.id === this.currentStep) || this.steps[0]
    },

    currentStepComponent() {
      const componentMap = {
        'setup-agent': SetupAgentStep,
        'knowledge-sources': KnowledgeSourcesStep,
        'choose-starting-point': ChooseStartingPointStep,
        'design-sequence': DesignSequenceStep,
        'add-contacts': AddContactsStep,
        'enable-lead-capture': EnableLeadCaptureStep,
        'guardrails-account': GuardrailsAccountStep,
      }
      return componentMap[this.currentStep] || SetupAgentStep
    },

    agentAvatarUrl() {
      if (this.campaign.agentAvatar) {
        // If it's a File object, create object URL
        if (this.campaign.agentAvatar instanceof File) {
          return URL.createObjectURL(this.campaign.agentAvatar)
        }
        // If it's already a URL string
        return this.campaign.agentAvatar
      }
      // Default avatar
      return require('@/assets/images/default.png')
    },

    isLastStep() {
      const currentIndex = this.steps.findIndex((step) => step.id === this.currentStep)
      return currentIndex === this.steps.length - 1
    },

    brandLogoUrl() {
      if (this.campaign.brandLogo) {
        if (this.campaign.brandLogo instanceof File) {
          return URL.createObjectURL(this.campaign.brandLogo)
        }
        return this.campaign.brandLogo
      }
      return null
    },
  },

  methods: {
    isStepCompleted(stepId) {
      return this.completedSteps.includes(stepId)
    },

    canNavigateToStep(stepId) {
      // Can only navigate to completed steps or the current step
      return this.isStepCompleted(stepId) || stepId === this.currentStep
    },

    handleStepClick(stepId) {
      // Disable direct navigation - do nothing
      // Only Next/Back buttons can change steps
      return
    },

    goToStep(stepId) {
      this.currentStep = stepId
      this.showPreview = false
    },

    validateCurrentStep() {
      // Check if current step is required and has necessary data
      const currentStepData = this.steps.find(s => s.id === this.currentStep)
      
      if (!currentStepData || !currentStepData.required) {
        return true // Not required, can proceed
      }

      // Validate based on step
      switch (this.currentStep) {
        case 'setup-agent':
          return this.campaign.agentName && this.campaign.campaignName
        case 'knowledge-sources':
          return this.campaign.businessName && this.campaign.industry
        case 'choose-starting-point':
          return this.campaign.startingPoint != null
          // Wizard completion is handled by the wizard component itself
        default:
          return true
      }
    },

    async handleNext() {
      if (this.isAdvancing) return
      if (!this.validateCurrentStep()) {
        this.$notify({
          group: 'main',
          type: 'error',
          text: 'Please complete this step before proceeding',
        })
        return
      }

      this.isAdvancing = true
      try {
        if (this.currentStep === 'knowledge-sources') {
          try {
            this.$notify({
              group: 'main',
              type: 'info',
              text: 'Saving and indexing your business information...',
            })

            const knowledgeStep = this.$refs.currentStepRef
            if (knowledgeStep && typeof knowledgeStep.saveBusinessInfo === 'function') {
              await knowledgeStep.saveBusinessInfo()
            }

            await this.waitForDocumentIndexing()

            this.$notify({
              group: 'main',
              type: 'success',
              text: 'Business information saved and ready!',
            })
          } catch (error) {
            console.error('Error saving Step 2 data:', error)
            this.$notify({
              group: 'main',
              type: 'error',
              text: 'Failed to save business information. Please try again.',
            })
            return
          }
        }

        if (!this.completedSteps.includes(this.currentStep)) {
          this.completedSteps.push(this.currentStep)
        }

        await this.saveCampaignData()

        if (this.currentStep === 'choose-starting-point') {
          await this.triggerCampaignGeneration()
        }

        const currentIndex = this.steps.findIndex((step) => step.id === this.currentStep)
        if (currentIndex < this.steps.length - 1) {
          this.currentStep = this.steps[currentIndex + 1].id
        } else {
          this.showPreview = true
        }
      } finally {
        this.isAdvancing = false
      }
    },

    handlePreviousStep() {
      if (this.showPreview) {
        this.showPreview = false
        return
      }

      const currentIndex = this.steps.findIndex((step) => step.id === this.currentStep)
      if (currentIndex > 0) {
        this.currentStep = this.steps[currentIndex - 1].id
      } else {
        this.$router.push({ name: 'dashboardv2' })
      }
    },

    async triggerCampaignGeneration() {
      const campaignId = this.campaign.id || this.$route.params.id
      if (!campaignId || campaignId === 'new' || campaignId === '0') {
        return
      }

      try {
        // Ensure all documents are indexed before generating campaign
        this.$notify({
          group: 'main',
          type: 'info',
          text: 'Verifying knowledge base is ready...',
        })
        
        await this.waitForDocumentIndexing()
        
        this.$notify({
          group: 'main',
          type: 'info',
          text: 'Starting campaign generation with your knowledge base...',
        })

        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').GENERATE_CAMPAIGN_DRAFTS,
          variables: {
            campaignId,
          },
        })

        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Campaign generation started! Your drafts will be ready shortly.',
          duration: 5000,
        })
      } catch (error) {
        console.error('Trigger generation error:', error)
        this.$notify({
          group: 'main',
          type: 'error',
          text: error.message || 'Unable to start campaign generation right now',
        })
      }
    },

    async waitForDocumentIndexing() {
      const agentInstanceId = this.campaign.agentInstanceId
      if (!agentInstanceId) {
        console.log('No agent instance ID, skipping indexing wait')
        return
      }

      const maxAttempts = 60 // 60 attempts * 2 seconds = 120 seconds max (2 minutes)
      let attempts = 0
      let lastNotificationTime = 0

      while (attempts < maxAttempts) {
        try {
          const { data } = await this.$apollo.query({
            query: require('~/graphql/campaignV2/queries').GET_AGENT_DOCUMENTS,
            variables: { agentInstanceId },
            fetchPolicy: 'network-only', // Always fetch fresh data
          })

          const documents = data.getAgentDocuments || []
          
          // Only check selected documents (those that will be used in generation)
          const selectedDocuments = documents.filter(doc => doc.isSelected)
          
          if (selectedDocuments.length === 0) {
            console.log('No selected documents to index')
            return
          }
          
          // Check if all selected documents are indexed or failed
          const allProcessed = selectedDocuments.every(doc => 
            doc.status === 'indexed' || doc.status === 'failed'
          )

          if (allProcessed) {
            const indexedCount = selectedDocuments.filter(doc => doc.status === 'indexed').length
            const failedCount = selectedDocuments.filter(doc => doc.status === 'failed').length
            
            console.log(`✅ All selected documents processed: ${indexedCount} indexed, ${failedCount} failed`)
            
            if (failedCount > 0) {
              this.$notify({
                group: 'main',
                type: 'warning',
                text: `${failedCount} document(s) failed to index. Continuing with ${indexedCount} indexed document(s).`,
                duration: 5000,
              })
            }
            
            return
          }

          // Still processing, wait and retry
          const processingDocs = selectedDocuments.filter(doc => 
            doc.status === 'processing' || doc.status === 'ready'
          )
          
          const processingCount = processingDocs.length
          
          console.log(`⏳ ${processingCount} document(s) still processing... (attempt ${attempts + 1}/${maxAttempts})`)
          
          // Show progress notification every 10 seconds
          const now = Date.now()
          if (now - lastNotificationTime > 10000) {
            this.$notify({
              group: 'main',
              type: 'info',
              text: `Still indexing ${processingCount} document(s)... Please wait.`,
              duration: 3000,
            })
            lastNotificationTime = now
          }
          
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
          attempts++
        } catch (error) {
          console.error('Error checking document status:', error)
          // Continue anyway after a few attempts
          if (attempts > 5) {
            console.log('Continuing despite indexing check errors')
            this.$notify({
              group: 'main',
              type: 'warning',
              text: 'Unable to verify document indexing status. Continuing anyway.',
              duration: 5000,
            })
            return
          }
          attempts++
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }

      console.log('⚠️ Indexing timeout reached after 2 minutes, continuing anyway')
      this.$notify({
        group: 'main',
        type: 'warning',
        text: 'Document indexing is taking longer than expected. Continuing anyway.',
        duration: 5000,
      })
    },

    async saveDraft() {
      try {
        await this.saveCampaignData()
        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Draft saved successfully!',
        })
      } catch (error) {
        console.error('Save draft error:', error)
        this.$notify({
          group: 'main',
          type: 'error',
          text: error.message || 'Failed to save draft',
        })
      }
    },

    async saveCampaignData() {
      try {
        const campaignData = { ...this.campaign }
        const campaignId = this.$route.params.id
        
        // Remove avatar from campaign data (it's uploaded separately)
        const avatarFile = campaignData.agentAvatar
        delete campaignData.agentAvatar

        // Check if this is a new campaign (id is 'new', 0, or campaign doesn't have an ID yet)
        if (campaignId === 'new' || campaignId === '0' || !this.campaign.id) {
          // Create new campaign
          const { data } = await this.$apollo.mutate({
            mutation: require('~/graphql/campaignV2/mutations').CREATE_CAMPAIGN_V2,
            variables: campaignData,
          })

          const result = data.createCampaignV2
          
          // Update store with IDs
          this.$store.dispatch('campaignV2/updateCampaign', {
            id: result.id,
            agentInstanceId: result.agentInstanceId,
          })

          // Upload avatar if provided
          if (avatarFile && avatarFile instanceof File) {
            await this.uploadAvatar(result.agentInstanceId, avatarFile)
          }

          // Update route to use real ID
          this.$router.replace({
            name: 'campaign-v2-id-setup',
            params: { id: result.id },
          })
        } else {
          // Update existing campaign
          await this.$apollo.mutate({
            mutation: require('~/graphql/campaignV2/mutations').UPDATE_CAMPAIGN_V2,
            variables: {
              campaignId: this.campaign.id || campaignId,
              ...campaignData,
            },
          })

          // Upload avatar if provided and it's a new file
          if (avatarFile && avatarFile instanceof File && this.campaign.agentInstanceId) {
            await this.uploadAvatar(this.campaign.agentInstanceId, avatarFile)
          }
        }
      } catch (error) {
        console.error('Save campaign error:', error)
        throw error
      }
    },

    async uploadAvatar(agentInstanceId, file) {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').UPLOAD_AGENT_AVATAR,
          variables: {
            agentInstanceId,
            file,
          },
        })

        // Update store with avatar URL
        this.$store.dispatch('campaignV2/updateCampaign', {
          agentAvatar: data.uploadAgentAvatar,
        })
      } catch (error) {
        console.error('Avatar upload error:', error)
        throw error
      }
    },

    handleToggleSidebar(show) {
      this.hideSummary = !show
    },

    showHelp() {
      // Show help modal or redirect
      alert('Help documentation coming soon!')
    },

    async launchCampaign() {
      if (this.isAdvancing) return
      this.isAdvancing = true
      try {
        // Save final data
        await this.saveCampaignData()

        // Persist selected contacts to campaign (if any)
        try {
          const contacts = (this.campaign && Array.isArray(this.campaign.contacts)) ? this.campaign.contacts : []
          const leadIds = contacts
            .filter(c => c && c.selected && c.id !== undefined && c.id !== null)
            .map(c => parseInt(c.id, 10))
            .filter(id => Number.isInteger(id))

          if (leadIds.length > 0 && this.campaign.id) {
            await this.$apollo.mutate({
              mutation: require('~/graphql/campaignV2/campaignExecution').ADD_CONTACTS_TO_CAMPAIGN_V2,
              variables: {
                campaignId: parseInt(this.campaign.id, 10),
                leadIds,
              },
            })
          }
        } catch (e) {
          console.error('Add contacts to campaign error:', e)
          // Non-blocking; continue to activation
        }

        // Exit preview, open Guardrails step, and attempt activation through the step's API
        this.showPreview = false
        this.currentStep = 'guardrails-account'
        await this.$nextTick()
        const guardrails = this.$refs.currentStepRef
        if (guardrails && typeof guardrails.activateCampaign === 'function') {
          await guardrails.activateCampaign()
          // Child step handles notifications and redirect
          return
        }

        // Fallback: finalize and activate directly if child API is unavailable
        const campaignId = this.campaign.id || this.$route.params.id
        if (!campaignId) {
          throw new Error('Missing campaign ID for activation')
        }

        try {
          this.$notify({ group: 'main', type: 'info', text: 'Finalizing campaign content...' })
          await this.$apollo.mutate({
            mutation: require('~/graphql/campaignV2/campaignExecution').CONVERT_DRAFTS_TO_STEPS,
            variables: { campaignId: parseInt(campaignId, 10), autoApprove: true },
          })
        } catch (e) {
          console.warn('Convert drafts step failed or not needed:', e)
        }

        this.$notify({ group: 'main', type: 'info', text: 'Activating campaign...' })
        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/campaignExecution').ACTIVATE_CAMPAIGN_V2,
          variables: { campaignId: parseInt(campaignId, 10) },
        })
        this.$notify({
          group: 'main',
          type: 'success',
          text: 'Campaign activated! Emails will start sending according to schedule.',
        })
        this.$router.push({ 
          name: 'campaign-v2-id',
          params: { id: campaignId }
        })
      } catch (error) {
        console.error('Launch campaign error:', error)
        this.$notify({
          group: 'main',
          type: 'error',
          text: error.message || 'Failed to activate campaign',
        })
      } finally {
        this.isAdvancing = false
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-v2-setup-page {
  height: calc( 100vh - 70px);
  background-color: #fff;
  padding:  30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 1200px) {
    max-width: 1140px;
  }
  
  @media (min-width: 1400px) {
    max-width: 1520px;
  }

  .setup-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 30px;
    border-bottom: 1px solid #efefef;
    flex-shrink: 0;
    .header-left {
      .agent-info {
        display: flex;
        align-items: center;
        gap: 15px;

        .agent-avatar-small {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid $primary;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .agent-details {
          display: flex;
          flex-direction: column;

          .agent-name {
            font-size: 1.1rem;
            font-weight: 700;
            color: #000;
            line-height: 1.3;
          }

          .campaign-name {
            font-size: 0.9rem;
            color: $gray-600;
            line-height: 1.3;
          }
        }
      }

      .setup-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 5px;
        color: #000;
      }

      .setup-subtitle {
        font-size: 0.95rem;
        color: $gray-600;
        margin-bottom: 0;
      }
    }

    .header-right {
      display: flex;
      gap: 10px;

      .btn {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        font-weight: 500;
        border-radius: 8px;
        outline: none !important;

        &:focus {
          box-shadow: none !important;
        }
      }
    }
  }

  .setup-content {
    display: grid;
    grid-template-columns: 240px 1fr 320px;
    gap: 20px;
    flex: 1;
    overflow: hidden;
    // margin-top: 20px;

    &.preview-mode {
      grid-template-columns: 240px 1fr;
    }

    &.hide-summary {
      grid-template-columns: 240px 1fr;
    }

    .icon {
      font-size: 0.75rem;
    }

    .setup-sidebar {
      background: $white;
      border-radius: 12px;
      padding: 20px 0;
      border-right:   1px solid #efefef;
      padding-right: 20px;
      display: flex;
      flex-direction: column;
      // gap: 3rem;
      



      .steps-list {
        flex: 1;
        .step-item {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          margin-top: 8px;
          background-color: #fcfeff;

          // &::before {
          //   content: '';
          //   position: absolute;
          //   left: 30px;
          //   top: 40px;
          //   width: 2px;
          //   height: 100%;
          //   background-color: #e5e5e5;
          // }

          // &:last-child::before {
          //   display: none;
          // }

          .step-indicator {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            position: relative;
            z-index: 1;

            .step-circle {
              width: 24px;
              height: 24px;
              border: 2px solid #e5e5e5;
              border-radius: 50%;
              background: $white;
            }

            .step-check {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: $white;
              display: flex;
              align-items: center;
              justify-content: center;
              color: $primary;
            }
          }

          .step-label {
            font-size: 0.9rem;
            color: #2f2f41;
            font-weight: 900;
          }

          &.active {
            background-color: rgba($primary, 0.05);

            .step-indicator .step-circle {
              background: $primary;
              padding: 1px;
            }

            .step-label {
              font-weight: 600;
              color: $primary;
            }
          }

          &.completed {
            background-color: $primary;
            border-color: $primary;

            .step-label {
            color: #2f2f41;
            }

            .step-indicator .step-circle {
              border-color: $white;
              background: $white;
            }
          }

          &.disabled {
            cursor: not-allowed;
            opacity: 0.5;
            pointer-events: none;

            &:hover {
              background-color: #fcfeff;
            }
          }

          &:hover:not(.active):not(.disabled) {
            background-color: $gray-100;
          }
        }
      }

      .form-actions {
        // padding: 20px;
        margin-top: 20px;
        display:flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;

        .btn {
          font-size: 0.9rem;
          padding: 10px 20px;
          border-radius: 8px;
          outline: none !important;
          border: 1px solid $gray-400;
          background: transparent;
          color: #2f2f41;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-weight: 600;

          &:focus {
            box-shadow: none !important;
          }

          &:hover {
            background: $gray-100;
            border-color: $gray-500;
            color: $gray-700;
          }

          &.preview-btn {
            background: #000 !important;
            border-color: #000 !important;
            color: #fff !important;

            &:hover {
              background: #333 !important;
              border-color: #333 !important;
              color: #fff !important;
            }
          }

          &.save-send-btn {
            background: $primary !important;
            border-color: $primary !important;
            color: #2f2f41 !important;
            white-space: nowrap;
            font-weight: 900;

            &:hover {
              background: darken($primary, 10%) !important;
              border-color: darken($primary, 10%) !important;
              color: #000 !important;
            }
          }
        }
      }
    }

    .setup-main {
      background: $white;
      border-radius: 12px;
      padding: 30px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d0d0d0;
        border-radius: 4px;

        &:hover {
          background: #b0b0b0;
        }
      }
    }

    .setup-summary {
      background: #fff;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      padding: 20px;
      border-left: 1px solid #efefef;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d0d0d0;
        border-radius: 4px;

        &:hover {
          background: #b0b0b0;
        }
      }

      .summary-header {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 20px;
        color: #000;
        background-color: #fff;
        border-bottom: 1px solid #efefef;
        padding-bottom: 10px;

        

        > .icon {
          font-size: 1.2rem;
        }
      }

      .summary-content {
        background: #eaf3fd;
        flex: 1;
        padding: 20px;
        border-radius: 8px;
        
        .summary-section {
          margin-bottom: 18px;
          position: relative;
          padding-left: 5px;

          // Vertical connecting line
          &::before {
            content: '';
            position: absolute;
            left: 8px;
            top: 20px;
            bottom: -18px;
            width: 1px;
            background: #2d3748;
          }

          // Dot at the start of each section
          &::after {
            content: '';
            position: absolute;
            left: 5.7px;
            top: 20px;
            width: 5px;
            height: 5px;
            background: #2d3748;
            border-radius: 50%;
          }

          // Remove line from last section
          &:last-child::before {
            display: none;
          }

          label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #000;
            margin-bottom: 5px;
            display: block;
          }

          p {
            font-size: 0.9rem;
            color: $gray-600;
            margin-bottom: 0;
            line-height: 1.5;
            padding-left: 20px;
          }

          .logo-preview-summary {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid #e5e5e5;
            background: $white;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }

          .channels-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .channel-tag {
              background: $white;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 0.85rem;
              color: $gray-700;
              display: flex;
              align-items: center;

              .icon {
                font-size: 0.7rem;
                cursor: pointer;
                opacity: 0.6;

                &:hover {
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
