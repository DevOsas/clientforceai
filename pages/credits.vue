<template>
  <div class="credits-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Credits & usage</h1>
        <p class="page-subtitle">Monitor and manage your credits for email, calls and AI actions</p>
      </div>
      <button class="add-credit-btn" @click="openAddCreditsModal">
        + Add Credit
      </button>
    </div>

    <!-- Credit Cards -->
    <div class="credit-cards">
      <!-- Email Verification Credits -->
      <div class="credit-card">
        <h3 class="card-title">Email Verification Credits</h3>
        <p class="card-description">Used for verifying leads before campaign</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: '60%' }"></div>
        </div>
        <div class="card-footer">
          <div class="balance-info">
            <span class="balance-label">Balance:</span>
            <span class="balance-value">1,250</span>
          </div>
          <button class="add-credit-btn-small" @click="openAddCreditsModal">
            + Add Credit
          </button>
        </div>
      </div>

      <!-- Call Credits (Voice) - First -->
      <div class="credit-card">
        <h3 class="card-title">Call Credits (Voice)</h3>
        <p class="card-description">Consumed during AI voice calls, ans outbound Dialing</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: '60%' }"></div>
        </div>
        <div class="card-footer">
          <div class="balance-info">
            <span class="balance-label">Balance:</span>
            <span class="balance-value">1,250</span>
          </div>
          <button class="add-credit-btn-small" @click="openAddCreditsModal">
            + Add Credit
          </button>
        </div>
      </div>

      <!-- Call Credits (Voice) - Second -->
      <div class="credit-card">
        <h3 class="card-title">Call Credits (Voice)</h3>
        <p class="card-description">Consumed during AI voice calls, ans outbound Dialing</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: '60%' }"></div>
        </div>
        <div class="card-footer">
          <div class="balance-info">
            <span class="balance-label">Balance:</span>
            <span class="balance-value">1,250</span>
          </div>
          <button class="add-credit-btn-small" @click="openAddCreditsModal">
            + Add Credit
          </button>
        </div>
      </div>
    </div>

    <!-- Usage History Section -->
    <div class="usage-history-section">
      <h2 class="section-title">Usage History</h2>

      <div class="table-wrapper">
        <div class="usage-table">
          <!-- Table Header -->
          <div class="table-header">
            <div class="table-row">
              <div class="table-cell">Amount Used</div>
              <div class="table-cell">Type</div>
              <div class="table-cell">Description</div>
              <div class="table-cell">Date</div>
              <div class="table-cell">Remaining Balance</div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="table-body">
            <div 
              v-for="(item, index) in usageHistory" 
              :key="index"
              class="table-row"
              :class="{ 'alternate': index % 2 === 1 }"
            >
              <div class="table-cell">{{ item.amountUsed }}</div>
              <div class="table-cell">{{ item.type }}</div>
              <div class="table-cell">{{ item.description }}</div>
              <div class="table-cell">{{ item.date }}</div>
              <div class="table-cell">{{ item.remainingBalance }}</div>
            </div>

            <!-- Empty State -->
            <div v-if="usageHistory.length === 0" class="empty-state">
              <div class="table-row">
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
              </div>
              <div class="table-row alternate">
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
                <div class="table-cell">--</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Credits Modal -->
    <AddCreditsModal />
  </div>
</template>

<script>
import AddCreditsModal from '@/components/Credits/AddCreditsModal.vue'

export default {
  name: 'CreditsPage',

  components: {
    AddCreditsModal
  },

  middleware: ['auth', 'setup'],

  layout: 'dashboard',

  data() {
    return {
      usageHistory: [
        // Example data - empty for now to show "--" state
      ]
    }
  },

  methods: {
    openAddCreditsModal() {
      this.$bvModal.show('AddCreditsModal')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.credits-page {
  padding: 32px;
  background: #fff;
  min-height: 100vh;

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e5e5;

    .header-content {
      .page-title {
        font-size: 1.75rem;
        font-weight: 600;
        color: #000;
        margin: 0 0 8px 0;
      }

      .page-subtitle {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0;
      }
    }

    .add-credit-btn {
      padding: 12px 24px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #000;
      background: $primary;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: darken($primary, 10%);
      }
    }
  }

  .credit-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 48px;

    .credit-card {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 24px;

      .card-title {
        font-size: 1rem;
        font-weight: 600;
        color: #000;
        margin: 0 0 8px 0;
      }

      .card-description {
        font-size: 0.85rem;
        color: #6b7280;
        margin: 0 0 20px 0;
        line-height: 1.4;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e5e5e5;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 20px;

        .progress-fill {
          height: 100%;
          background: $primary;
          transition: width 0.3s ease;
        }
      }

      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .balance-info {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #d5f3f6;
          padding: 8px;
          border-radius: 8px;


          .balance-label {
            font-size: 0.9rem;
            color: #000;
            font-weight: 600;

          }

          .balance-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: #000;
            padding: 4px 16px;
            background: #fff;
            border-radius: 6px;
          }
        }

        .add-credit-btn-small {
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
          background: #000;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #2f2f41;
          }
        }
      }
    }
  }

  .usage-history-section {
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 24px 0;
    }

    .table-wrapper {
      overflow-x: auto;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      background: #fff;

      &::-webkit-scrollbar {
        height: 8px;
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

    .usage-table {
      width: 100%;

      .table-header {
        background: #fff;

        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 2fr 1fr 1.5fr;
          align-items: center;
          padding: 0;
          border-bottom: 1.5px solid #e5e5e5;
          width: 100%;

          .table-cell {
            padding: 16px 20px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #000;
            border-right: 1px solid #f0f0f0;

            &:last-child {
              border-right: none;
            }
          }
        }
      }

      .table-body {
        .table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 2fr 1fr 1.5fr;
          align-items: center;
          padding: 0;
          transition: background 0.2s ease;
          width: 100%;

          &.alternate {
            background: #fafafa;
          }

          &:hover {
            background: #f5f5f5;
          }

          .table-cell {
            padding: 20px;
            font-size: 0.9rem;
            color: #2f2f41;
          }
        }

        .empty-state {
          .table-cell {
            text-align: center;
            color: #9ca3af;
          }
        }
      }
    }
  }
}
</style>
