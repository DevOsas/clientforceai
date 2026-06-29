<template>
  <div class="routing-tab">
    <!-- Left: Routing Section -->
    <div class="routing-section">
      <div class="routing-card">
        <h2 class="section-title">Routing</h2>

        <!-- Target Agent -->
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Target Agent</label>
            <div class="agent-select">
              <div class="agent-info">
                <div class="agent-avatar">
                  <img :src="targetAgent.avatar" alt="Agent" />
                </div>
                <div class="agent-details">
                  <div class="agent-name">{{ targetAgent.name }}</div>
                  <div class="agent-date">{{ targetAgent.date }}</div>
                </div>
              </div>
              <SvgIcon name="chevron-down-2" class="dropdown-icon" />
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-group">
          <label class="form-label">Tags</label>
          <input
            v-model="tags"
            type="text"
            class="form-input"
            placeholder="Enter tags"
          />
        </div>

        <!-- Owner Assign -->
        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label">Owner Assign</label>
            <CustomSelect
              v-model="ownerAssign"
              :options="ownerOptions"
              placeholder="Select owner"
            />
          </div>
        </div>

        <!-- After-Submit Actions -->
        <div class="actions-section">
          <h3 class="actions-title">After- Submit Actions (Ordered)</h3>
          
          <div class="actions-list">
            <div
              v-for="(action, index) in actions"
              :key="index"
              class="action-item"
            >
              <div class="action-content">
                <span class="action-number">{{ action.number }}</span>
                <span class="action-text">{{ action.text }}</span>
              </div>
              <span class="action-badge">{{ action.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Flow Preview Section -->
    <div class="preview-section">
      <div class="preview-card">
        <h2 class="section-title">Flow Preview</h2>

        <div class="preview-list">
          <div
            v-for="(action, index) in actions"
            :key="index"
            class="preview-item"
          >
            <span class="preview-number">{{ action.number }}</span>
            <span class="preview-text">{{ action.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from '@/components/CampaignV2/CustomSelect.vue'

export default {
  name: 'RoutingTab',

  components: {
    CustomSelect
  },

  data() {
    return {
      targetAgent: {
        name: 'Dental USA - Outbound',
        date: '5 SP 2020',
        avatar: 'https://i.pravatar.cc/40?img=3'
      },
      tags: 'Inbound widget, Pricing',
      ownerAssign: 'Goodwill',
      ownerOptions: ['Goodwill', 'John Doe', 'Jane Smith'],
      actions: [
        { number: 1, text: 'Start Sequence step 1', status: 'Always' },
        { number: 2, text: 'Offer "Call me now"', status: 'Always' },
        { number: 3, text: 'Send Proposal', status: 'Always' },
        { number: 4, text: 'Send Payment Link', status: 'Always' },
        { number: 5, text: 'Notify sales', status: 'Always' },
        { number: 6, text: 'Webhooks + CRM', status: 'Always' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.routing-tab {
  display: grid;
  grid-template-columns: 550px 1fr;
  gap: 32px;
}

.routing-section,
.preview-section {
  .routing-card,
  .preview-card {
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

// Routing Section Styles
.routing-section {
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

      .agent-select,
      .form-input {
        flex: 1;
      }
    }

    .form-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      color: #2f2f41;
      margin-bottom: 8px;
    }
  }

  // Override CustomSelect background
  ::v-deep .custom-select-wrapper {
    .custom-select-trigger {
      background-color: #fff !important;
    }
  }

    .agent-select {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #d0d0d0;
      }

      .agent-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .agent-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .agent-details {
          .agent-name {
            font-size: 0.9rem;
            font-weight: 500;
            color: #000;
            margin-bottom: 2px;
          }

          .agent-date {
            font-size: 0.8rem;
            color: #9ca3af;
          }
        }
      }

      .dropdown-icon {
        color: #9ca3af;
        font-size: 1.2rem;
      }
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

    .form-select {
      width: 100%;
      padding: 12px 16px;
      font-size: 0.9rem;
      color: #2f2f41;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: $primary;
      }
    }
  }

  .actions-section {
    margin-top: 32px;
    padding-top: 28px;
    border-top: 1px solid #e5e5e5;

    .actions-title {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 20px 0;
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .action-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: #f9fafb;
        }

        .action-content {
          display: flex;
          align-items: center;
          gap: 12px;

          .action-number {
            font-size: 0.9rem;
            font-weight: 600;
            color: #000;
            min-width: 24px;
          }

          .action-text {
            font-size: 0.9rem;
            color: #2f2f41;
            font-weight: 600;

          }
        }

        .action-badge {
          padding: 6px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #2f2f41;
          background: #f3f4f6;
          border-radius: 6px;
        }
      }
    }
  }


// Preview Section Styles
.preview-section {
  .preview-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 80px;


    .preview-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: #f9fafb;
      }

      .preview-number {
        font-size: 0.9rem;
        font-weight: 600;
        color: #000;
        min-width: 24px;
      }

      .preview-text {
        font-size: 0.9rem;
        color: #2f2f41;
        font-weight: 600;
      }
    }
  }
}
</style>
