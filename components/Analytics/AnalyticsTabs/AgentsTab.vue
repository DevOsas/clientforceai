<template>
  <div class="analytics-agents-tab">
    <div class="agents-table-card">
      <h3 class="section-title">By Agent Table</h3>
      
      <div class="table-wrapper">
        <div class="agents-table">
          <!-- Table Header -->
          <div class="table-header">
            <div class="table-row">
              <div class="table-cell agent-cell">Agents</div>
              <div class="table-cell">Sends</div>
              <div class="table-cell">Replies</div>
              <div class="table-cell">Qualified Calls</div>
              <div class="table-cell">Bookings</div>
              <div class="table-cell">Payments</div>
              <div class="table-cell">Cost</div>
              <div class="table-cell">CPA (Proxy)</div>
            </div>
          </div>

          <!-- Table Body -->
          <div class="table-body">
            <div 
              v-for="(agent, index) in agentsData" 
              :key="index"
              class="table-row"
              :class="{ 'alternate': index % 2 === 1 }"
            >
              <div class="table-cell agent-cell">
                <div class="agent-info">
                  <img :src="agent.avatar" alt="Agent" class="agent-avatar" />
                  <div class="agent-details">
                    <div class="agent-name">{{ agent.name }}</div>
                    <div class="agent-id">{{ agent.id }}</div>
                  </div>
                </div>
              </div>
              <div class="table-cell">{{ agent.sends }}</div>
              <div class="table-cell">{{ agent.replies }}</div>
              <div class="table-cell">{{ agent.qualifiedCalls }}</div>
              <div class="table-cell">{{ agent.bookings }}</div>
              <div class="table-cell">{{ agent.payments }}</div>
              <div class="table-cell">{{ agent.cost }}</div>
              <div class="table-cell">{{ agent.cpa }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnalyticsAgentsTab',

  data() {
    return {
      agentsData: [
        {
          avatar: 'https://i.pravatar.cc/80?img=11',
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cost: '$12.4k',
          cpa: '$12.4k'
        },
        {
          avatar: 'https://i.pravatar.cc/80?img=12',
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cost: '$12.4k',
          cpa: '$12.4k'
        },
        {
          avatar: 'https://i.pravatar.cc/80?img=13',
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cost: '$12.4k',
          cpa: '$12.4k'
        },
        {
          avatar: 'https://i.pravatar.cc/80?img=14',
          name: 'Dental USA - Outbound',
          id: 'ID: SP 2020',
          sends: '2,150',
          replies: '%2.1',
          qualifiedCalls: '62',
          bookings: '44',
          payments: '$12.4k',
          cost: '$12.4k',
          cpa: '$12.4k'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.analytics-agents-tab {
  margin-top: 32px;

  .agents-table-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 24px;

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 20px 0;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e5e5;
    }

    .table-wrapper {
      overflow-x: auto;

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

    .agents-table {
      width: 100%;

      .table-header {
        background: #fff;

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.2fr;
          align-items: center;
          padding: 0;
          border-bottom: 1.5px solid #e5e5e5;
          width: 100%;

          .table-cell {
            padding: 16px 12px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #000;
            border-right: 1px solid #f0f0f0;

            &:first-child {
              padding-left: 0;
            }

            &:last-child {
              padding-right: 0;
              border-right: none;
            }
          }
        }
      }

      .table-body {
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.2fr;
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
            padding: 16px 12px;
            font-size: 0.9rem;
            color: #2f2f41;

            &:first-child {
              padding-left: 0;
            }

            &:last-child {
              padding-right: 0;
            }
          }

          .agent-cell {
            .agent-info {
              display: flex;
              align-items: center;
              gap: 12px;

              .agent-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
              }

              .agent-details {
                .agent-name {
                  font-size: 0.9rem;
                  font-weight: 600;
                  color: #000;
                  margin-bottom: 2px;
                }

                .agent-id {
                  font-size: 0.75rem;
                  color: #9ca3af;
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
