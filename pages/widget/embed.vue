<template>
  <div class="widget-embed-page">
    <!-- Header -->
    <div class="embed-header">
      <h1 class="page-title">Widget - Embed (Chat Bubble Desktop)</h1>
      <div class="header-actions">
        <button class="save-draft-btn" @click="saveDraft">
          + Save Draft
        </button>
        <button class="publish-btn" @click="publish">
          Publish
        </button>
      </div>
    </div>

    <!-- Preview Container -->
     <div class="main-preview-container">

       <div class="preview-container">
         <!-- Mobile Drawer Toggle -->
         <div class="drawer-toggle">
           <SvgIcon name="mobile" class="drawer-icon" />
           <span class="drawer-text">Mobile Drawer</span>
           <div class="drawer-dots">
             <span class="dot"></span>
             <span class="dot"></span>
             <span class="dot"></span>
           </div>
         </div>
   
         <!-- Chat Widget Preview -->
         <div class="chat-widget-preview">
           <div class="chat-bubble">
             <!-- Agent Card -->
             <div class="agent-card">
               <div class="agent-avatar">
                 <img src="https://i.pravatar.cc/50?img=3" alt="Agent" />
               </div>
               <div class="agent-info">
                 <div class="agent-name">Dental USA - Outbound</div>
                 <div class="agent-id">ID: SP 2020</div>
               </div>
             </div>
   
             <!-- Chat Messages -->
             <div class="chat-messages">
               <div class="message agent-message">
                 Hi, I can book a call and send a proposal.
               </div>
               <div class="message user-message">
                 Yes. I'd like a proposal
               </div>
               <div class="message agent-message">
                 Great, what's your email and phone so I can confirm?
               </div>
             </div>
   
             <!-- Action Buttons -->
             <div class="action-buttons">
               <button class="call-now-btn">
                 <SvgIcon name="phone" class="btn-icon" />
                 Call me Now!
               </button>
               <button class="pick-time-btn">
                 <SvgIcon name="clock" class="btn-icon" />
                 Pick A Time
               </button>
             </div>
   
             <!-- Message Input -->
             <div class="message-input-wrapper">
               <input
                 type="text"
                 class="message-input"
                 placeholder="Type your message..."
               />
             </div>
           </div>
   
           <!-- Sparkle Button -->
           <button class="sparkle-btn">
             <SvgIcon name="sparkles" class="sparkle-icon" />
           </button>
         </div>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'WidgetEmbed',

  methods: {
    saveDraft() {
      console.log('Saving draft...')
      this.$toast?.success('Draft saved!')
    },
    publish() {
      console.log('Publishing widget...')
      this.$toast?.success('Widget published!')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.widget-embed-page {
  min-height: 100vh;
  // background: #f9fafb;
  padding: 24px;

  .embed-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 22px;
    border-bottom: 1px solid $gray-200;

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #000;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;

      .save-draft-btn,
      .publish-btn {
        padding: 10px 24px;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .save-draft-btn {
        color: #2f2f41;
        background: #fff;
        border: 1px solid #e5e5e5;

        &:hover {
          background: #f9fafb;
          border-color: #d0d0d0;
        }
      }

      .publish-btn {
        color: #fff;
        background: #000;
        border: 1px solid #000;

        &:hover {
          background: #2f2f41;
        }
      }
    }
  }

  .main-preview-container{
    padding: 0 60px;
    margin-top: 20px;
  }

  .preview-container {
    background: #f5f5f6;
    border: 1.5px solid $gray-400;
    border-radius: 12px;
    padding: 0;
    height: calc(100vh - 140px);
    position: relative;
    overflow: hidden;

    .drawer-toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      background: #f5f5f6;
      border-bottom: 1.5px solid $gray-400;
      width: 100%;

      .drawer-icon {
        font-size: 1.2rem;
        color: #2f2f41;
      }

      .drawer-text {
        font-size: 0.9rem;
        font-weight: 500;
        color: #2f2f41;
      }

      .drawer-dots {
        display: flex;
        gap: 8px;
        margin-left: auto;

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #9fa0a2;
        }
      }
    }

    .chat-widget-preview {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      gap: 20px;
      padding: 60px 40px 40px 40px;
      height: calc(100% - 60px);

      .chat-bubble {
        width: 380px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;

        .agent-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: #fff;
          border-bottom: 1px solid #e5e5e5;

          .agent-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .agent-info {
            .agent-name {
              font-size: 0.95rem;
              font-weight: 600;
              color: #000;
              margin-bottom: 4px;
            }

            .agent-id {
              font-size: 0.8rem;
              color: #9ca3af;
            }
          }
        }

        .chat-messages {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 200px;
          overflow-y: auto;

          .message {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.8rem;
            line-height: 1;
            max-width: 80%;
          }

          .agent-message {
            align-self: flex-start;
            background: #f3f4f6;
            color: #2f2f41;
          }

          .user-message {
            align-self: flex-end;
            background: #e5e7eb;
            color: #2f2f41;
          }
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          padding: 0 20px 20px 20px;

          .call-now-btn,
          .pick-time-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            font-size: 0.85rem;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;

            .btn-icon {
              font-size: 0.9rem;
            }
          }

          .call-now-btn {
            color: #fff;
            background: #000;
            border: 1px solid #000;

            .btn-icon {
              color: #fff;
            }

            &:hover {
              background: #2f2f41;
            }
          }

          .pick-time-btn {
            color: #2f2f41;
            background: #fff;
            border: 1px solid #e5e5e5;

            &:hover {
              background: #f9fafb;
            }
          }
        }

        .message-input-wrapper {
          padding: 0 20px 20px 20px;

          .message-input {
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
              font-style: italic;
            }
          }
        }
      }

      .sparkle-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid #e5e5e5;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        .sparkle-icon {
          font-size: 1.5rem;
          color: #2f2f41;
        }

        &:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
}
</style>
