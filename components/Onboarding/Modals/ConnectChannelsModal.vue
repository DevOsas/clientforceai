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
          <h1 class="modal-title">Connect Your Sending channels</h1>
        </div>

        <!-- Channels Section -->
        <div class="channels-section">
          <label class="section-label">Channels</label>
          
          <!-- Channel Dropdown -->
          <div class="channel-dropdown">
            <div class="channel-display">
              <span class="channel-icon">📧</span>
              <CustomSelect
                v-model="selectedChannel"
                :options="channelOptions"
                placeholder="Select channel"
                class="channel-select"
              />
            </div>
          </div>

          <!-- Provider Cards -->
          <div class="providers-grid">
            <div
              v-for="provider in providers"
              :key="provider.id"
              class="provider-card"
              :class="{ selected: selectedProvider === provider.id }"
              @click="selectProvider(provider.id)"
            >
              <div class="provider-icon-wrapper">
                <img :src="provider.icon" :alt="provider.name" class="provider-icon" />
              </div>
              <h3 class="provider-name">{{ provider.name }}</h3>
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
            class="add-account-btn"
            :disabled="!selectedProvider"
            @click="handleAddAccount"
          >
            Add Account
            <SvgIcon name="arrow-right" class="ml-2" />
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from '~/components/CampaignV2/CustomSelect.vue'

export default {
  name: 'ConnectChannelsModal',

  components: {
    CustomSelect
  },

  data() {
    return {
      selectedChannel: 'Email',
      selectedProvider: null,
      channelOptions: ['Email', 'SMS', 'WhatsApp', 'Voice'],
      providers: [
        {
          id: 'outlook',
          name: 'Outlook',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg'
        },
        {
          id: 'gmail',
          name: 'Gmail',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg'
        },
        {
          id: 'smtp',
          name: 'SMTP',
          icon: '📧'
        }
      ]
    }
  },

  methods: {
    selectProvider(providerId) {
      this.selectedProvider = providerId
    },

    handleAddAccount() {
      if (!this.selectedProvider) return

      const selectedProviderData = this.providers.find(p => p.id === this.selectedProvider)

      // Emit complete event with selected data
      this.$emit('complete', {
        channel: this.selectedChannel,
        provider: this.selectedProvider,
        providerData: selectedProviderData
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
        margin-bottom: 50px;

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000;
          margin-bottom: 0;
          line-height: 1.2;
        }
      }

      .channels-section {
        padding: 0 50px;
        margin-bottom: 60px;

        .section-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .channel-dropdown {
          margin-bottom: 40px;

          .channel-display {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;

            .channel-icon {
              position: absolute;
              left: 20px;
              top: 50%;
              transform: translateY(-50%);
              font-size: 1.5rem;
              z-index: 1;
              pointer-events: none;
            }

            .channel-select {
              flex: 1;

              ::v-deep .custom-select-trigger {
                height: 60px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding-left: 60px;
                padding-right: 20px;
                background: #fff;

                &:hover {
                  border-color: #d1d5db;
                }

                &.open {
                  border-color: $primary;
                  box-shadow: 0 0 0 3px rgba($primary, 0.1);
                }

                .selected-text {
                  font-size: 1rem;
                  color: #000;
                  font-weight: 500;
                }
              }
            }
          }
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;

          .provider-card {
            background: #fff;
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            padding: 32px 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 180px;

            &:hover {
              border-color: #d1d5db;
              transform: translateY(-2px);
            }

            &.selected {
              border-color: $primary;
              background: #f0f9ff;
              box-shadow: 0 4px 12px rgba($primary, 0.15);
            }

            .provider-icon-wrapper {
              margin-bottom: 20px;

              .provider-icon {
                width: 64px;
                height: 64px;
                object-fit: contain;
              }
            }

            .provider-name {
              font-size: 1.1rem;
              font-weight: 600;
              color: #000;
              margin: 0;
              text-align: center;
            }
          }
        }
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
          }

          &:focus {
            box-shadow: none;
          }
        }

        .add-account-btn {
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
        .channels-section {
          padding: 0 20px;

          .providers-grid {
            grid-template-columns: 1fr;
          }
        }

        .modal-footer {
          flex-direction: column;
          gap: 12px;
          padding: 20px;

          .back-btn,
          .add-account-btn {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
