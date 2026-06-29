<template>
  <div class="inbox-tab">
    <div class="inbox-layout">
      <!-- Left Sidebar -->
      <div class="inbox-sidebar">
        <!-- Filter Dropdown -->
        <div class="filter-section">
          <div class="filter-content">
            <span class="filter-label">Filter:</span>
            <span class="filter-value">Channel</span>
          </div>
          <SvgIcon name="chevron-down-2" class="chevron-icon" />
        </div>

        <!-- Categories -->
        <div class="categories-section">
          <h3 class="section-title">Categories</h3>
          <div class="category-list">
            <div 
              v-for="category in inboxCategories" 
              :key="category.id"
              class="category-item"
              :class="{ active: selectedCategory === category.id }"
              @click="selectedCategory = category.id"
            >
              {{ category.title }}
            </div>
          </div>
        </div>

        <!-- All Messages -->
        <div class="messages-section">
          <div class="section-header">
            <h3 class="section-title">All Messages</h3>
            <SvgIcon name="message-circle" class="section-icon" />
          </div>
          <div class="message-list">
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="message-item"
              :class="{ active: selectedMessage === message.id }"
              @click="selectMessage(message)"
            >
              <div class="message-avatar">
                <img :src="message.avatar" :alt="message.name" />
                <span v-if="message.verified" class="verified-badge">
                  <SvgIcon name="check-circle" />
                </span>
              </div>
              <div class="message-info">
                <div class="message-header">
                  <span class="message-name">{{ message.name }}</span>
                  <span class="message-time">{{ message.time }}</span>
                </div>
                <div class="message-preview">{{ message.preview }}</div>
              </div>
              <div class="message-status">
                <SvgIcon v-if="message.status === 'read'" name="check-double" class="status-icon read" />
                <SvgIcon v-else name="check" class="status-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div class="chat-area">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-user-info">
            <div class="chat-avatar">
              <img :src="currentChat.avatar" :alt="currentChat.name" />
              <span class="online-indicator"></span>
              <span v-if="currentChat.verified" class="verified-badge">
                <SvgIcon name="check-circle" />
              </span>
            </div>
            <div class="chat-user-details">
              <div class="user-name-row">
                <h3 class="chat-user-name">{{ currentChat.name }}</h3>
                <span v-if="currentChat.verified" class="verified-icon">
                  <SvgIcon name="check-circle" />
                </span>
              </div>
              <p v-if="currentChat.isTyping" class="chat-user-status typing">{{ currentChat.name }} is typing...</p>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-icon-btn">
              <SvgIcon name="pin" />
            </button>
            <button class="action-icon-btn">
              <SvgIcon name="phone-call-alt" />
            </button>
            <button class="action-icon-btn">
              <SvgIcon name="list-dashes" />
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages" ref="chatMessages">
          <div class="date-divider">
            <span>Today</span>
          </div>

          <div 
            v-for="msg in currentChat.messages" 
            :key="msg.id"
            class="chat-message"
            :class="{ 'message-sent': msg.sent, 'message-received': !msg.sent }"
          >
            <!-- Received Messages (Left) -->
            <template v-if="!msg.sent">
              <div class="message-avatar-small">
                <img :src="currentChat.avatar" :alt="currentChat.name" />
                <span class="verified-badge-small">
                  <SvgIcon name="check-circle" />
                </span>
              </div>
              <div class="message-content">
                <div class="message-header-info">
                  <span class="sender-name">{{ currentChat.name }}</span>
                  <span class="message-time">{{ msg.time }}</span>
                </div>
                <div class="message-bubble received">
                  <p class="message-text">{{ msg.text }}</p>
                </div>
              </div>
              <button class="message-more-btn">
                <SvgIcon name="vertical-dots" />
              </button>
            </template>

            <!-- Sent Messages (Right) -->
            <template v-else>
              <button class="message-more-btn">
                <SvgIcon name="vertical-dots" />
              </button>
              <div class="message-content sent">
                <div class="message-header-info sent">
                  <span class="sender-name">You</span>
                  <span class="message-time">{{ msg.time }}</span>
                  <SvgIcon name="check-double" class="status-icon-blue" />
                </div>
                <div class="message-bubble sent">
                  <p class="message-text">{{ msg.text }}</p>
                  <div v-if="msg.images" class="message-images">
                    <div 
                      v-for="(image, index) in msg.images" 
                      :key="index"
                      class="image-preview"
                    >
                      <img :src="image" alt="Attachment" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Typing Indicator -->
          <div v-if="currentChat.isTyping" class="typing-indicator">
            <div class="message-avatar-small">
              <img :src="currentChat.avatar" :alt="currentChat.name" />
              <span class="verified-badge-small">
                <SvgIcon name="check-circle" />
              </span>
            </div>
            <div class="typing-bubble">
              <span class="typing-text">{{ currentChat.name }} is typing...</span>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-area">
          <button class="input-icon-btn emoji-btn">
            <SvgIcon name="smile" />
          </button>
          <textarea 
            ref="messageInput"
            class="chat-input" 
            placeholder="Type a message..."
            v-model="messageInput"
            @keydown="handleKeyDown"
            rows="1"
          ></textarea>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept="image/*"
            style="display: none;"
          />
          <button class="input-icon-btn attach-btn" @click="$refs.fileInput.click()">
            <SvgIcon name="import" />
          </button>
          <button class="send-btn" @click="sendMessage">
            <SvgIcon name="send" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EMAIL_CATEGORIES_QUERY, EMAIL_THREADS_QUERY } from '~/graphql/campaign/inbox/queries'
export default {
  name: 'InboxTab',
  props: {
    campaignId: { type: Number, required: true },
    range: { type: String, default: '30days' },
  },

  apollo: {
    inboxCategories: {
      query: EMAIL_CATEGORIES_QUERY,
      variables() { return { campaignId: this.campaignId } },
      update(data) { return data.inboxCategories || [] },
      error() { return false },
    },
    threads: {
      query: EMAIL_THREADS_QUERY,
      variables() { return { campaignId: this.campaignId, categoryId: this.selectedCategory || null } },
      update(data) { return data.threads || [] },
      error() { return false },
    },
  },

  data() {
    return {
      selectedCategory: null,
      selectedMessage: null,
      messageInput: '',
      inboxCategories: [],
      threads: [],
      messages: [],

      currentChat: {
        name: '',
        avatar: '',
        verified: false,
        isTyping: false,
        messages: []
      }
    }
  },

  methods: {
    selectMessage(message) {
      this.selectedMessage = message.id
      const thread = this.threads.find(t => t.id === message.id)
      if (!thread) return
      const replies = Array.isArray(thread.replies) ? thread.replies : []
      this.currentChat = {
        name: message.name,
        avatar: message.avatar,
        verified: true,
        isTyping: false,
        messages: replies.map((r, idx) => ({
          id: r.id || idx+1,
          text: r.textBody || r.subject || '',
          time: r.date || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sent: !r.fromEmail // when fromEmail is null, it's our sent email
        }))
      }
    },

    handleKeyDown(event) {
      // Send message on Enter, new line on Shift+Enter
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage()
      }
    },

    sendMessage() {
      if (!this.messageInput.trim()) return

      const newMessage = {
        id: this.currentChat.messages.length + 1,
        text: this.messageInput,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sent: true
      }

      this.currentChat.messages.push(newMessage)
      this.messageInput = ''

      // Auto-resize textarea
      this.$nextTick(() => {
        if (this.$refs.messageInput) {
          this.$refs.messageInput.style.height = 'auto'
        }
      })

      // Scroll to bottom
      this.$nextTick(() => {
        if (this.$refs.chatMessages) {
          this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight
        }
      })
    },

    handleFileSelect(event) {
      const files = event.target.files
      if (!files || files.length === 0) return

      const imageUrls = []
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          imageUrls.push(e.target.result)
          
          // Send message with images
          if (imageUrls.length === files.length) {
            const newMessage = {
              id: this.currentChat.messages.length + 1,
              text: this.messageInput || '',
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              sent: true,
              images: imageUrls
            }

            this.currentChat.messages.push(newMessage)
            this.messageInput = ''

            // Scroll to bottom
            this.$nextTick(() => {
              if (this.$refs.chatMessages) {
                this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight
              }
            })
          }
        }
        reader.readAsDataURL(file)
      })

      // Reset file input
      event.target.value = ''
    }
  },

  mounted() {
    console.log('Inbox tab mounted')
    // default to first category once loaded
    this.$watch('inboxCategories', (cats) => {
      if (Array.isArray(cats) && cats.length && !this.selectedCategory) {
        this.selectedCategory = cats[0].id
      }
    }, { immediate: true })

    // map threads to left messages list
    this.$watch('threads', (list) => {
      const threads = Array.isArray(list) ? list : []
      this.messages = threads.map((t, i) => {
        const last = (Array.isArray(t.replies) && t.replies.length) ? t.replies[t.replies.length - 1] : null
        const name = last?.prospectName || last?.fromName || 'Contact'
        const preview = last?.textBody || t.subject || ''
        const time = last?.date || ''
        return {
          id: t.id,
          name,
          avatar: `https://i.pravatar.cc/150?u=${t.id}`,
          time,
          preview,
          verified: !!last?.prospectEmail,
          status: 'read',
        }
      })
      if (this.messages.length) {
        this.selectMessage(this.messages[0])
      }
    }, { immediate: true })

    // refetch threads when category changes
    this.$watch('selectedCategory', () => {
      if (this.$apollo && this.$apollo.queries && this.$apollo.queries.threads) {
        this.$apollo.queries.threads.refetch()
      }
    })

    // Auto-resize textarea on input
    if (this.$refs.messageInput) {
      this.$refs.messageInput.addEventListener('input', (e) => {
        e.target.style.height = 'auto'
        e.target.style.height = e.target.scrollHeight + 'px'
      })
    }

    // Scroll to bottom of chat
    if (this.$refs.chatMessages) {
      this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.inbox-tab {
  .inbox-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 1rem;
    height: calc(100vh - 180px);
    // background: #fff;
    border-radius: 12px;
    overflow: hidden;
  }

  .inbox-sidebar {
    background: #fff;
    border-right: 1px solid #e5e5e5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 12px;

    .filter-section {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: #fafafa;
      }

      .filter-content {
        display: flex;
        gap: 6px;

        .filter-label {
          font-size: 0.95rem;
          font-weight: 400;
          color: #9ca3af;
        }

        .filter-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: #000;
        }
      }

      .chevron-icon {
        width: 18px;
        height: 18px;
        color: #6b7280;
      }
    }

    .categories-section {
      padding: 24px;
      border-bottom: 1px solid #e5e5e5;

      .section-title {
        font-size: 1rem;
        font-weight: 700;
        color: #000;
        padding-bottom: 6px;
        border-bottom: 1px solid $gray-200;
        margin: 0 0 20px 0;
      }

      .category-list {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .category-item {
          padding: 5px 0;
          font-size: 0.95rem;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            color: #6b7280;
          }

          &.active {
            color: #000;
            font-weight: 500;
          }
        }
      }
    }

    .messages-section {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .section-header {
        padding: 20px 24px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f7f7f7;

        .section-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #9ca3af;
          margin: 0;
        }

        .section-icon {
          width: 22px;
          height: 22px;
          color: #9ca3af;
        }
      }

      .message-list {
        flex: 1;
        overflow-y: auto;
        padding: 0 10px 10px;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        &::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;

          &:hover {
            background: #9ca3af;
          }
        }

        .message-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          border-bottom: 1px solid #f3f4f6;

          &:hover {
            background: #fafafa;
          }

          &.active {
            background: #f9fafb;
          }

          .message-avatar {
            position: relative;
            flex-shrink: 0;

            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              object-fit: cover;
            }

            .verified-badge {
              position: absolute;
              bottom: -2px;
              right: -2px;
              width: 18px;
              height: 18px;
              background: #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              ::v-deep svg {
                width: 16px;
                height: 16px;
                color: #3b82f6;
              }
            }
          }

          .message-info {
            flex: 1;
            min-width: 0;
            padding-top: 2px;

            .message-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 6px;

              .message-name {
                font-size: 0.95rem;
                font-weight: 600;
                color: #000;
                display: flex;
                align-items: center;
                gap: 6px;
              }

              .message-time {
                font-size: 0.8rem;
                color: #9ca3af;
                white-space: nowrap;
              }
            }

            .message-preview {
              font-size: 0.9rem;
              color: #9ca3af;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 1.4;
            }
          }

          .message-status {
            position: absolute;
            bottom: 16px;
            right: 14px;

            .status-icon {
              width: 18px;
              height: 18px;
              color: #d1d5db;

              &.read {
                color: #3b82f6;
              }
            }
          }
        }
      }
    }
  }

  .chat-area {
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
    border-radius: 12px;

    .chat-header {
      padding: 15px 30px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .chat-user-info {
        display: flex;
        align-items: center;
        gap: 15px;

        .chat-avatar {
          position: relative;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
          }

          .online-indicator {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 14px;
            height: 14px;
            background: #10b981;
            border: 2px solid #fff;
            border-radius: 50%;
          }

          .verified-badge {
            display: none;
          }
        }

        .chat-user-details {
          .user-name-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 4px;

            .chat-user-name {
              font-size: 1.05rem;
              font-weight: 600;
              color: #000;
              margin: 0;
            }

            .verified-icon {
              display: flex;
              align-items: center;
              justify-content: center;

              ::v-deep svg {
                width: 18px;
                height: 18px;
                color: #3b82f6;
              }
            }
          }

          .chat-user-status {
            font-size: 0.85rem;
            margin: 0;

            &.typing {
              color: #10b981;
            }
          }
        }
      }

      .chat-actions {
        display: flex;
        gap: 15px;

        .action-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #f3f4f6;
          }

          ::v-deep svg {
            width: 20px;
            height: 20px;
            color: #6b7280;
            fill: none !important;
          }
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 30px;
      background: #fff;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 10px;

        &:hover {
          background: #9ca3af;
        }
      }

      .date-divider {
        text-align: center;
        margin-bottom: 25px;

        span {
          font-size: 0.8rem;
          color: #9ca3af;
          background: #fff;
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #e5e5e5;
        }
      }

      .chat-message {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 25px;

        // Received messages (left side)
        &.message-received {
          .message-avatar-small {
            position: relative;
            flex-shrink: 0;

            img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              object-fit: cover;
            }

            .verified-badge-small {
              position: absolute;
              bottom: -2px;
              right: -2px;
              width: 16px;
              height: 16px;
              background: #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              ::v-deep svg {
                width: 14px;
                height: 14px;
                color: #3b82f6;
              }
            }
          }

          .message-content {
            flex: 1;
            max-width: 60%;

            .message-header-info {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 6px;

              .sender-name {
                font-size: 0.85rem;
                font-weight: 500;
                color: #6b7280;
              }

              .message-time {
                font-size: 0.8rem;
                color: #9ca3af;
              }
            }

            .message-bubble.received {
              background: transparent;
              padding: 14px 18px;
              border-radius: 12px;
              border: 1px solid #e5e5e5;

              .message-text {
                font-size: 0.9rem;
                color: #000;
                margin: 0;
                line-height: 1.6;
              }
            }
          }

          .message-more-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 1;
            transition: all 0.2s ease;
            flex-shrink: 0;
            margin-top: 28px;

            &:hover {
              background: #f3f4f6;
            }

            ::v-deep svg {
              width: 16px;
              height: 16px;
              color: #6b7280;
            }
          }

          &:hover .message-more-btn {
            opacity: 1;
          }
        }

        // Sent messages (right side)
        &.message-sent {
          justify-content: flex-end;

          .message-more-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 1;
            transition: all 0.2s ease;
            flex-shrink: 0;
            margin-top: 28px;

            &:hover {
              background: #f3f4f6;
            }

            ::v-deep svg {
              width: 16px;
              height: 16px;
              color: #6b7280;
            }
          }

          .message-content.sent {
            max-width: 60%;

            .message-header-info.sent {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              gap: 8px;
              margin-bottom: 6px;

              .sender-name {
                font-size: 0.85rem;
                font-weight: 500;
                color: #6b7280;
              }

              .message-time {
                font-size: 0.8rem;
                color: #9ca3af;
              }

              .status-icon-blue {
                width: 16px;
                height: 16px;
                color: #3b82f6;
              }
            }

            .message-bubble.sent {
              background: #e3f2fd;
              padding: 14px 18px;
              border-radius: 12px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

              .message-text {
                font-size: 0.9rem;
                color: #000;
                margin: 0;
                line-height: 1.6;
              }

              .message-images {
                display: flex;
                gap: 12px;
                margin-top: 12px;

                .image-preview {
                  width: 180px;
                  height: 240px;
                  border-radius: 12px;
                  overflow: hidden;
                  background: #f5f5f5;

                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
              }
            }
          }

          &:hover .message-more-btn {
            opacity: 1;
          }
        }
      }

      .typing-indicator {
        display: flex;
        gap: 10px;
        align-items: center;

        .message-avatar-small {
          position: relative;
          flex-shrink: 0;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }

          .verified-badge-small {
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            ::v-deep svg {
              width: 14px;
              height: 14px;
              color: #3b82f6;
            }
          }
        }

        .typing-bubble {
          background: transparent;
          padding: 12px 18px;
          border-radius: 12px;
          // border: 1px solid #e5e5e5;

          .typing-text {
            font-size: 0.85rem;
            color: #9ca3af;
            font-style: italic;
          }
        }
      }
    }

    .chat-input-area {
      padding: 20px 30px;
      border-top: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;

      .input-icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;

        &.emoji-btn {
          ::v-deep svg {
            width: 24px;
            height: 24px;
            color: #6b7280;
          }
        }

        &.attach-btn {
          background: #f3f4f6;
          
          &:hover {
            background: #e5e7eb;
          }

          ::v-deep svg {
            width: 20px;
            height: 20px;
            color: #6b7280;
            fill: none !important;
          }
        }

        &:hover {
          background: #f3f4f6;
        }

        ::v-deep svg {
          width: 22px;
          height: 22px;
          color: #6b7280;
                      fill: none !important;

        }
      }

      .chat-input {
        flex: 1;
        padding: 12px 18px;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        font-size: 0.9rem;
        outline: none;
        transition: all 0.2s ease;
        resize: none;
        font-family: inherit;
        line-height: 1.5;
        min-height: 44px;
        max-height: 120px;

        &:focus {
          border-color: #d1d5db;
        }

        &::placeholder {
          color: #9ca3af;
        }

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
      }

      .send-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: none;
        background: $primary;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;

        &:hover {
          background: #04e29c;
          transform: scale(1.05);
        }

        &:active {
          transform: scale(0.95);
        }

        ::v-deep svg {
          width: 20px;
          height: 20px;
          color: #fff;
                      fill: none !important;

        }
      }
    }
  }
}
</style>
