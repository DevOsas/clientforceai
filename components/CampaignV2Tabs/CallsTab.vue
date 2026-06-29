<template>
  <div class="calls-tab">
    <div class="calls-layout">
      <!-- Left Panel: Live Feed / Queue -->
      <aside class="calls-sidebar">
        <div class="sidebar-header">
          <div class="header-icon">
            <SvgIcon name="Play Stream" />
          </div>
          <h2>Live Feed / Queue</h2>
        </div>

        <div class="live-items">
          <div 
            v-for="call in liveCalls" 
            :key="call.id" 
            class="live-item" 
            :class="{ active: call.isActive }"
          >
            <div class="live-content">
              <SvgIcon name="phone" class="call-icon" />
              <span class="live-text">Call with {{ call.contact }}</span>
            </div>
            <div v-if="call.isActive" class="live-actions">
              <button class="action-btn mute">
                <SvgIcon name="mute" />
              </button>
              <button class="action-btn end">
                <SvgIcon name="downward-phone" />
              </button>
              <button class="action-btn add">
                <SvgIcon name="plus-white" />
              </button>
              <div class="live-badge">
                <span class="live-dot"></span>
                <span class="live-text">Live</span>
              </div>
            </div>
            <div v-else class="live-meta">
              <span class="live-time">{{ call.time }}</span>
              <span class="live-status">{{ call.status }}</span>
            </div>
          </div>
        </div>

        <!-- History Section -->
        <div class="history-section">
          <h3>History</h3>

          <div class="history-items">
            <div 
              v-for="item in callHistory" 
              :key="item.id" 
              class="history-item"
            >
              <div class="history-avatar">
                <img :src="item.avatar" :alt="item.name" />
                <span class="online-dot" :class="{ online: item.isOnline }"></span>
              </div>
              <div class="history-info">
                <div class="history-name">
                  {{ item.name }}
                  <SvgIcon v-if="item.isVerified" name="check-circle" class="verified" />
                </div>
                <div class="history-details">
                  <span class="history-status" :class="item.callStatus">{{ item.statusText }}</span>
                  <span class="history-time">{{ item.time }}</span>
                </div>
              </div>
              <button class="history-action" :class="item.callStatus">
                <SvgIcon :name="item.callStatus === 'missed' ? 'phone-missed' : 'phone'" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Panel: Active Call Interface -->
      <main class="call-interface">
        <div class="call-interface-header">
          <span class="live-badge">
            <span class="live-dot"></span>
            Live
          </span>
          <div class="user-avatar-small">
            <img src="https://i.pravatar.cc/150?img=12" alt="User" />
            <div class="mute-overlay">
              <SvgIcon name="mute" />
            </div>
          </div>
        </div>

        <div class="call-interface-content">
          <div class="avater-container">

            <div class="caller-avatar">
              <img src="https://i.pravatar.cc/300?img=9" alt="Mila Rabbener" />
            </div>
          </div>
          <h2 class="caller-name">Mila Rabbener</h2>
          <div class="call-timer">00:64</div>
          <div class="call-status-text">Muted</div>
        </div>

        <div class="call-controls">
          <button class="control-btn unmute">
            <div class="btn-circle">
              <SvgIcon name="mute" />
            </div>
            <span>Unmute</span>
          </button>
          <button class="control-btn end-call">
            <div class="btn-circle">
              <SvgIcon name="downward-phone" />
            </div>
            <span>End Call</span>
          </button>
          <button class="control-btn add-user">
            <div class="btn-circle">
              <SvgIcon name="plus-white" />
            </div>
            <span>Add User</span>
          </button>
          <button class="control-btn link">
            <div class="btn-circle">
              <SvgIcon name="link" />
            </div>
            <span>Link</span>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallsTab',

  data() {
    return {
      // Active call data
      activeCall: {
        name: 'Mila Rabbener',
        duration: '00:64',
        status: 'Muted',
        avatar: 'https://i.pravatar.cc/300?img=9'
      },

      // Live feed / Queue data
      liveCalls: [
        { 
          id: 1, 
          contact: '@Chris Adol', 
          status: 'live', 
          time: null, 
          isActive: true 
        },
        { 
          id: 2, 
          contact: '@Mark Miller', 
          status: 'Next', 
          time: '03:01 AM', 
          isActive: false 
        },
        { 
          id: 3, 
          contact: '@Greg Noman', 
          status: 'Queue', 
          time: '03:01 AM', 
          isActive: false 
        }
      ],

      // Call history data
      callHistory: [
        {
          id: 1,
          name: 'Victoria Wills',
          avatar: 'https://i.pravatar.cc/150?img=5',
          isOnline: true,
          isVerified: true,
          callStatus: 'missed',
          statusText: 'Missed call',
          time: '03:01 AM'
        },
        {
          id: 2,
          name: 'Victoria Wills',
          avatar: 'https://i.pravatar.cc/150?img=5',
          isOnline: true,
          isVerified: true,
          callStatus: 'completed',
          statusText: 'Completed call',
          time: '03:01 AM'
        }
      ]
    }
  },

  mounted() {
    console.log('Calls tab mounted')
    // TODO: Fetch live calls and history from API
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.calls-tab {
  background: #f5f5f5;
  // min-height: calc(100vh - 120px);
  padding: 20px 0px;
}

.calls-layout {
  display: flex;
  height: calc(100vh - 160px);
  gap: 20px;
}

// Left Sidebar
.calls-sidebar {
  flex: 0 0 520px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid #e5e5e5;
  padding: 25px;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  .header-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    ::v-deep svg {
      width: 20px;
      height: 20px;
      fill: none !important;
      stroke: #000 !important;
    }
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #000;
    margin: 0;
  }
}

.live-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;

    &:hover {
      background: #9ca3af;
    }
  }

  .live-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    border-radius: 12px;
    border: 1px solid #e5e5e5;
    background: #fff;
    transition: all 0.2s ease;

    &.active {
      background: #d1fae5;
      border-color: #10b981;
    }

    .live-content {
      display: flex;
      align-items: center;
      gap: 10px;

      .call-icon {
        width: 18px;
        height: 18px;
        color: #000;
      }

      .live-text {
        font-size: 0.9rem;
        font-weight: 500;
        color: #000;
      }
    }

    .live-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;

        &.mute {
          background: #000;
          color: #fff;

          &:hover {
            background: #1f2937;
          }
        }

        &.end {
          background: #ef4444;
          color: #fff;

          &:hover {
            background: #dc2626;
          }
        }

        &.add {
          background: #10b981;
          color: #fff;

          &:hover {
            background: #059669;
          }
        }

        ::v-deep svg {
          width: 12px;
          height: 12px;
        }
      }

      .live-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: #fff;
        border-radius: 25px;
        border: 1px solid #e5e5e5;

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          animation: pulse 2s infinite;
        }

        .live-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #000;
        }
      }
    }

    .live-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .live-time {
        font-size: 0.85rem;
        color: #6b7280;
      }

      .live-status {
        font-size: 0.85rem;
        font-weight: 500;
        color: #6b7280;
        border: 1px solid $gray-200;
        padding: 4px 8px;
        border-radius: 5px;
      }
    }
  }
}

.history-section {
  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #000;
    margin: 0 0 20px 0;
  }

  .history-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 10px;

      &:hover {
        background: #9ca3af;
      }
    }
  }
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  background: #fff;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .history-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .online-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #fff;

      &.online {
        background: #10b981;
      }

      &.offline {
        background: #9ca3af;
      }
    }
  }

  .history-info {
    flex: 1;
    min-width: 0;

    .history-name {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #000;
      margin-bottom: 4px;

      .verified {
        width: 16px;
        height: 16px;
        color: #3b82f6;
      }
    }

    .history-details {
      display: flex;
      align-items: center;
      gap: 8px;

      .history-status {
        font-size: 0.85rem;
        font-weight: 500;

        &.missed {
          color: #ef4444;
        }

        &.completed {
          color: #10b981;
        }
      }

      .history-time {
        font-size: 0.85rem;
        color: #9ca3af;
      }
    }
  }

  .history-action {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &.missed {
      background: transparent;
      color: #ef4444;

      &:hover {
        background: #fef2f2;
      }
    }

    &.completed {
      background: transparent;
      color: #10b981;

      &:hover {
        background: #ecfdf5;
      }
    }

    ::v-deep svg {
      width: 18px;
      height: 18px;
    }
  }
}

// Right Panel: Call Interface
.call-interface {
  flex: 1;
  background: #000000;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  height: fit-content;
}

.call-interface-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  z-index: 10;

  .live-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: #1a1a1a;
    border-radius: 24px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #ffffff;

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      animation: pulse 2s infinite;
    }
  }

  .user-avatar-small {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    background: #c8f56b;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .mute-overlay {
      position: absolute;
      bottom: -5px;
      left: 0px;
      width: 30px;
      height: 30px;
      background: #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 2px solid #c8f56b;

      ::v-deep svg {
        width: 16px;
        height: 16px;

        path {
          fill: #ffffff !important;
        }
      }
    }
  }
}

.call-interface-content {
  // flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  margin-top: 50px;

  .avater-container {
    position: relative;
    background:#02250f;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
  }

  .caller-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .caller-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 12px 0;
  }

  .call-timer {
    font-size: 2rem;
    font-weight: 300;
    color: #ffffff;
    margin: 0 0 12px 0;
    letter-spacing: 3px;
  }

  .call-status-text {
    font-size: 1rem;
    color: #9ca3af;
    font-weight: 400;
  }
}

.call-controls {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  padding: 0 50px 40px 40px;
  

  .control-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    .btn-circle {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      ::v-deep svg {
        width: 24px;
        height: 24px;

        path {
          fill: #ffffff !important;
          // stroke: none !important;
        }
      }
    }

    span {
      font-size: 0.9rem;
      font-weight: 500;
      color: #9ca3af;
    }

    &.unmute {
      .btn-circle {
        background: #374151;
      }

      &:hover .btn-circle {
        background: #4b5563;
        transform: scale(1.05);
      }
    }

    &.end-call {
      .btn-circle {
        background: #b91c1c;
      }

      &:hover .btn-circle {
        background: #991b1b;
        transform: scale(1.05);
      }
    }

    &.add-user {
      .btn-circle {
        background: #15803d;
      }

      &:hover .btn-circle {
        background: #166534;
        transform: scale(1.05);
      }
    }

    &.link {
      .btn-circle {
        background: #0e7490;
      }

      &:hover .btn-circle {
        background: #155e75;
        transform: scale(1.05);
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 1200px) {
  .calls-layout {
    flex-direction: column;
  }

  .calls-sidebar {
    flex: 0 0 auto;
    max-height: 400px;
  }
}
</style>
