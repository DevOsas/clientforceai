<template>
  <div class="campaign-preview">
    <!-- Steps Completed Section -->
    <div class="preview-card steps-card">
      <div class="card-header">
        <h3 class="card-title">Steps completed</h3>
        <div class="check-icon">
          <SvgIcon name="check" />
        </div>
      </div>
      <div class="card-content">
        <p class="steps-text">
          <strong>{{ completedSteps }} of {{ totalSteps }}</strong> steps completed
        </p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="missing-step-alert">
          <SvgIcon name="warning-triangle" class="alert-icon" />
          <span class="alert-text">Missing step</span>
          <button class="view-btn">View</button>
        </div>
      </div>
    </div>

    <!-- Schedule Section -->
    <div class="preview-card schedule-card">
      <div class="card-header">
        <h3 class="card-title">Schedule</h3>
        <div class="check-icon">
          <SvgIcon name="check" />
        </div>
      </div>
      <div class="card-content">
        <div class="schedule-stats-container">
          <div class="stats-row">
            <div class="stat-box yellow-box">
              <div class="stat-number">{{ estimatedSendsPerDay }}</div>
              <div class="stat-label">EST Send/Day</div>
            </div>
            <div class="stat-box cyan-box">
              <div class="stat-number">{{ estimatedCallsPerDay }}</div>
              <div class="stat-label">EST Calls/Day</div>
            </div>
            <div class="stat-box pink-box">
              <div class="stat-number">{{ estimatedRepliesPerDay }}</div>
              <div class="stat-label">EST Replies/Day</div>
            </div>
          </div>

          <div class="duration-section">
            <p class="duration-label">Duration:</p>
            <p class="duration-text">
              This approximation of your sequence will be <strong class="duration-value">{{ estimatedDuration }}</strong>
            </p>
          </div>
        </div>

        <div class="agent-section">
          <div class="agent-header">
            <img :src="agentAvatarUrl" alt="Agent" class="agent-avatar" />
            <span class="agent-name">{{ agentName }}</span>
            <div class="check-icon-small">
              <SvgIcon name="check" />
            </div>
          </div>

          <p class="schedule-info">
            This campaign will use your {{ campaign.schedule ? 'custom' : 'default' }} schedule.
          </p>

          <p class="schedule-days">
            Emails will be sent on <strong>{{ scheduleDays }}</strong>
          </p>

          <div class="days-row">
            <div class="day-circle inactive">SUN</div>
            <div class="day-circle active">MON</div>
            <div class="day-circle active">TUE</div>
            <div class="day-circle active">WED</div>
            <div class="day-circle active">THU</div>
            <div class="day-circle active">FRI</div>
            <div class="day-circle inactive">SAT</div>
          </div>
        </div>
      </div>
    </div>

    <!-- People Section -->
    <div class="preview-card people-card">
      <div class="card-header">
        <h3 class="card-title">People</h3>
        <div class="check-icon">
          <SvgIcon name="check" />
        </div>
      </div>
      <div class="card-content">
        <p class="people-text">
          This campaign includes overall <strong>{{ people.length }} people</strong>
        </p>

        <div class="people-list">
          <div v-for="person in people" :key="person.id" class="person-item">
            <div class="person-avatar">
              <SvgIcon name="user" />
            </div>
            <span class="person-company">{{ person.company }}</span>
            <span class="person-email">{{ person.email }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CampaignPreview',
  data() {
    return {
      totalSteps: 6,
      emailAccounts: [],
      isLoading: false,
    }
  },
  computed: {
    ...mapState('campaignV2', ['campaign']),
    
    completedSteps() {
      let count = 0
      
      // Step 1: Setup Agent (agent name + campaign name)
      if (this.campaign.agentName && this.campaign.campaignName) count++
      
      // Step 2: Knowledge Sources (business name or uploaded docs)
      if (this.campaign.businessName || (this.campaign.knowledgeSources && this.campaign.knowledgeSources.length > 0)) count++
      
      // Step 3: Wizard (campaign details gathered)
      if (this.campaign.wizardCompleted || this.campaign.primaryGoal) count++
      
      // Step 4: Design Sequence (drafts created)
      if (this.campaign.drafts && this.campaign.drafts.length > 0) count++
      
      // Step 5: Add Contacts (contacts selected)
      if (this.selectedContacts.length > 0) count++
      
      // Step 6: Guardrails & Account (schedule + email config)
      if (this.hasScheduleConfig && this.campaign.emailAccountIds && this.campaign.emailAccountIds.length > 0) count++
      
      return count
    },
    
    progressPercentage() {
      return (this.completedSteps / this.totalSteps) * 100
    },
    
    selectedContacts() {
      if (!this.campaign.contacts || !Array.isArray(this.campaign.contacts)) {
        return []
      }
      return this.campaign.contacts.filter(c => c && c.selected)
    },
    
    people() {
      return this.selectedContacts.map(contact => ({
        id: contact.id,
        company: contact.company || 'N/A',
        email: contact.email || contact.primaryEmail || 'N/A',
      }))
    },
    
    hasScheduleConfig() {
      return this.campaign.schedule || this.campaign.timezone
    },
    
    scheduleDays() {
      if (this.campaign.schedule && this.campaign.schedule.plan) {
        return this.campaign.schedule.plan.map(p => p.weekDay).join(', ')
      }
      return 'Monday, Tuesday, Wednesday, Thursday, Friday'
    },
    
    agentName() {
      return this.campaign.agentName || 'AI Agent'
    },
    
    agentAvatarUrl() {
      if (this.campaign.agentAvatar) {
        if (typeof this.campaign.agentAvatar === 'string') {
          return this.campaign.agentAvatar
        }
      }
      return 'https://i.pravatar.cc/40?img=5'
    },
    
    estimatedSendsPerDay() {
      return this.campaign.emailsPerDay || 50
    },
    
    estimatedCallsPerDay() {
      return this.campaign.callsPerDay || 3
    },
    
    estimatedRepliesPerDay() {
      return Math.round(this.estimatedSendsPerDay * 0.3)
    },
    
    estimatedDuration() {
      const totalContacts = this.selectedContacts.length
      const sendsPerDay = this.estimatedSendsPerDay
      if (totalContacts === 0 || sendsPerDay === 0) return '0 days'
      const days = Math.ceil(totalContacts / sendsPerDay)
      return `${days} day${days !== 1 ? 's' : ''}`
    },
  },
  async mounted() {
    await this.loadEmailAccounts()
  },
  methods: {
    async loadEmailAccounts() {
      try {
        this.isLoading = true
        const { data } = await this.$apollo.query({
          query: require('~/graphql/email-account/queries').ALL_EMAIL_ACCOUNTS_QUERY,
          fetchPolicy: 'network-only',
        })
        this.emailAccounts = data.emailAccounts || []
      } catch (error) {
        console.error('Failed to load email accounts:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';

.campaign-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1200px;
  margin-left: 3rem;
  margin-right: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .preview-card {
    background: $white;
    border: 1px solid $gray-200;
    border-radius: 12px;
    padding: 24px;

    &.people-card {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      background: #ffe7fd;

      @media (max-width: 768px) {
        grid-column: 1;
        grid-row: auto;
      }
    }

    &.schedule-card {
      grid-column: 2 / 3;
      grid-row: 1 / 3;

      @media (max-width: 768px) {
        grid-column: 1;
        grid-row: auto;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      background-color: transparent !important;
      border-bottom: 1px solid $gray-300;

      .card-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: $gray-900;
        margin: 0;
      }

      .check-icon {
        width: 24px;
        height: 24px;
        background: $primary;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white;
        flex-shrink: 0;
        border: 2px solid $gray-200;
        padding: 6px;
      }
    }

    .card-content {
      .steps-text {
        font-size: 0.95rem;
        color: $gray-900;
        margin-bottom: 12px;

        strong {
          font-weight: 600;
        }
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e5e5e5;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 16px;

        .progress-fill {
          height: 100%;
          background: $primary;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
      }

      .missing-step-alert {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #d1f4f7;
        border-radius: 8px;

        .alert-icon {
          width: 20px;
          height: 20px;
          color: $gray-900;
        }

        .alert-text {
          flex: 1;
          font-size: 0.9rem;
          font-weight: 500;
          color: $gray-900;
        }

        .view-btn {
          padding: 6px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          border: none;
          background: $white;
          color: $gray-900;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: $gray-100;
          }
        }
      }

      .schedule-stats-container {
        padding: 16px;
        border: 1px solid $gray-200;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .stats-row {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;

        .stat-box {
          flex: 1;
          padding: 20px 16px;
          border-radius: 8px;
          text-align: center;

          &.yellow-box {
            background: #f4f7d1;
          }

          &.cyan-box {
            background: #d1f4f7;
          }

          &.pink-box {
            background: #f7d1f4;
          }

          .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: $gray-900;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 0.8rem;
            color: $gray-900;
            font-weight: 500;
          }
        }
      }

      .duration-section {
        margin-bottom: 0;

        .duration-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: $gray-900;
          margin-bottom: 4px;
        }

        .duration-text {
          font-size: 0.9rem;
          color: $gray-700;
          margin: 0;

          .duration-value {
            color: $primary;
            font-weight: 600;
          }
        }
      }

      .people-text {
        font-size: 0.95rem;
        color: $gray-900;
        margin-bottom: 16px;

        strong {
          font-weight: 600;
        }
      }

      .agent-section {
        padding: 16px;
        border: 1px solid $gray-200;
        border-radius: 8px;

        .agent-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;

          .agent-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }

          .agent-name {
            flex: 1;
            font-size: 0.95rem;
            font-weight: 600;
            color: $gray-900;
          }

          .check-icon-small {
            width: 24px;
            height: 24px;
            background: $primary;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $white;
            flex-shrink: 0;
            border: 2px solid $gray-200;
            padding: 6px;
          }
        }

        .schedule-info {
          font-size: 0.9rem;
          color: $gray-700;
          margin-bottom: 8px;
        }

        .schedule-days {
          font-size: 0.9rem;
          color: $gray-700;
          margin-bottom: 26px;

          strong {
            font-weight: 600;
            color: $gray-900;
          }
        }

        .days-row {
          display: flex;
          gap: 8px;
          justify-content: center;

          .day-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: 600;
            transition: all 0.2s ease;

            &.active {
              background: $primary;
              color: $white;
            }

            &.inactive {
              background: $white;
              border: 1px solid #e5e5e5;
              color: $gray-600;
            }
          }
        }
      }

      .people-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 300px;
        overflow-y: auto;
        padding-right: 8px;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: #d0d0d0;
          border-radius: 3px;

          &:hover {
            background: #b0b0b0;
          }
        }

        .person-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: $white;
          border-radius: 8px;

          .person-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: $white;
            border: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $gray-600;

            svg {
              width: 18px;
              height: 18px;
            }
          }

          .person-company {
            font-size: 0.9rem;
            font-weight: 600;
            color: $gray-900;
            min-width: 80px;
          }

          .person-email {
            font-size: 0.9rem;
            color: $gray-700;
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
