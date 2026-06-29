<template>
  <div class="onboarding-modal">
    <div class="modal-card">
      <!-- Close Button -->
      <div class="modal-close-btn" @click="$emit('close')">
        <SvgIcon name="close-2" />
      </div>

      <!-- Modal Content -->
      <div class="modal-content-wrapper">
        <div class="modal-header-section">
          <h1 class="modal-title">Choose your first agent</h1>
          <p class="modal-subtitle">
            Follow these steps to launch your AI Agent, it only takes a few mins
          </p>
        </div>

        <!-- Agent Cards Grid -->
        <div class="agents-grid">
          <div
            v-for="agent in agents"
            :key="agent.id"
            class="agent-card"
            :class="{ selected: selectedAgent === agent.id }"
            @click="selectAgent(agent.id)"
          >
            <!-- Icon -->
            <div class="agent-icon-wrapper">
              <div class="agent-icon" :style="{ background: agent.iconBg }">
                <SvgIcon :name="agent.icon" class="icon" />
              </div>
            </div>

            <!-- Activated Badge / Activate Button -->
            <div class="agent-status">
              <div v-if="selectedAgent === agent.id" class="activated-badge">
                <SvgIcon name="check-circle" class="check-icon" />
                Activated
              </div>
              <button v-else class="activate-btn">
                <span class="radio-circle"></span>
                Activate
              </button>
            </div>

            <!-- Agent Info -->
            <div class="agent-info">
              <h3 class="agent-name">{{ agent.name }}</h3>
              <p class="agent-channels">{{ agent.channels }}</p>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="modal-footer">
          <b-button variant="outline-secondary" class="back-btn" @click="$emit('skip')">
            Back
          </b-button>
          <b-button
            variant="primary"
            class="continue-btn"
            :disabled="!selectedAgent"
            @click="handleContinue"
          >
            Continue
            <SvgIcon name="arrow-right" class="ml-2" />
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseAgentModal',

  data() {
    return {
      selectedAgent: null, // No default selection
      agents: [
        {
          id: 'demo-booking',
          name: 'Demo Booking Agent',
          channels: 'Channels, Emails, Whatsapp,Voice',
          icon: 'calender',
          iconBg: '#f3f4f6'
        },
        {
          id: 'local-business',
          name: 'Local Business Outreach',
          channels: 'Channels, Emails, Whatsapp, Voice',
          icon: 'briefcase',
          iconBg: '#f3f4f6'
        },
        {
          id: 'trial-conversion',
          name: 'Trial Conversion',
          channels: 'Channels, Emails, Whatsapp,Voice',
          icon: 'funnel',
          iconBg: '#f3f4f6'
        },
        {
          id: 'custom-scratch',
          name: 'Custom Scratch Setup',
          channels: 'Channels, Emails, Whatsapp,Voice',
          icon: 'rocket',
          iconBg: '#f3f4f6'
        }
      ]
    }
  },

  methods: {
    selectAgent(agentId) {
      this.selectedAgent = agentId
    },

    handleContinue() {
      if (!this.selectedAgent) return

      const selectedAgentData = this.agents.find(a => a.id === this.selectedAgent)

      // Emit complete event with selected agent data
      this.$emit('complete', {
        selectedAgent: this.selectedAgent,
        agentData: selectedAgentData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.onboarding-modal {
  position: relative;
  z-index: 10000;
  max-width: 900px;
  width: 90%;
  margin: 0 auto;

  .modal-card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    padding: 20px 20px;
    animation: modalSlideUp 0.3s ease;

    .modal-close-btn {
      position: absolute;
      top: 15px;
      right: 25px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: $gray-500;
      font-size: 20px;
      transition: all 0.2s ease;

      &:hover {
        color: $gray-700;
        transform: scale(1.1);
      }

      .icon {
        font-size: 1rem;
      }
    }

    .modal-content-wrapper {
      padding: 0 30px;

      .modal-header-section {
        margin-bottom: 40px;

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .modal-subtitle {
          font-size: 1rem;
          color: $gray-600;
          margin-bottom: 0;
          font-weight: 400;
        }
      }

      .agents-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-bottom: 30px;
        padding: 0 50px;
        border-bottom: none;

        .agent-card {
          background: #fff;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          // min-height: 250px;
          display: flex;
          flex-direction: column;

          &:hover {
            border-color: #d1d5db;
          }

          &.selected {
            border-color: $primary;
            background: #f0fdf4;

            .agent-icon-wrapper .agent-icon {
              background: $primary !important;

              // ::v-deep svg {
              //   color: #fff;
              // }
            }
          }

          .agent-icon-wrapper {
            margin-bottom: 20px;

            .agent-icon {
              width: 80px;
              height: 80px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;

              ::v-deep svg {
                width: 48px;
                height: 48px;
                color: #000;
                fill: none;
                stroke: currentColor;
                stroke-width: 1;
              }
            }
          }

          .agent-status {
            position: absolute;
            top: 20px;
            right: 20px;

            .activated-badge {
              background: #000;
              color: #fff;
              padding: 6px 16px;
              border-radius: 8px;
              font-size: 0.85rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 6px;

              // .check-icon {
               
              //   background: $primary;
              //   border-radius: 50%;
              //   color: #fff;
              // }
            }

            .activate-btn {
              background: #fff;
              border: 2px solid #e5e7eb;
              color: #9ca3af;
              padding: 6px 16px;
              border-radius: 8px;
              font-size: 0.85rem;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                border-color: #d1d5db;
                color: #6b7280;
              }

              .radio-circle {
                width: 16px;
                height: 16px;
                border: 2px solid #d1d5db;
                border-radius: 50%;
                display: inline-block;
              }
            }
          }

          .agent-info {
            .agent-name {
              font-size: 1.1rem;
              font-weight: 700;
              color: #000;
              margin: 0 0 8px 0;
            }

            .agent-channels {
              font-size: 0.9rem;
              color: #6b7280;
              margin: 0;
              line-height: 1.4;
            }
          }
        }
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // padding: 20px 0 30px 0;
        padding: 20px 50px;
        border-top: none !important;

        .back-btn {
          padding: 12px 32px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          border: none !important;
          background: #fff;
          color: #6b7280;

          &:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }

          &:focus {
            box-shadow: none;
          }
        }

        .continue-btn {
          background: linear-gradient(-120deg, #3bdcb8 0%, #35e834 20%);
          border: none;
          border-radius: 12px;
          padding: 12px 40px;
          font-size: 1rem;
          font-weight: 600;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
          outline: none !important;

          .icon {
            font-size: 1.2rem;
            margin-left: 8px;
          }

          &:focus {
            outline: none !important;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3) !important;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
          }

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        }
      }
    }
  }
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .onboarding-modal {
    .modal-card {
      .modal-content-wrapper {
        .agents-grid {
          grid-template-columns: 1fr;
        }

        .modal-footer {
          flex-direction: column;
          gap: 12px;

          .back-btn,
          .continue-btn {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
