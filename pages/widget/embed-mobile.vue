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
   
         <!-- Mobile Preview -->
         <div class="mobile-preview-wrapper">
           <div class="mobile-frame">
             <!-- Mobile Preview Header -->
             <div class="mobile-header">
               <SvgIcon name="mobile" class="mobile-icon" />
               <span class="mobile-text">Mobile Preview</span>
             </div>
   
             <!-- Mobile Widget Content -->
             <div class="mobile-widget">
               <!-- Agent Card -->
               <div class="agent-card">
                 <div class="agent-avatar">
                   <img src="https://i.pravatar.cc/40?img=3" alt="Agent" />
                 </div>
                 <div class="agent-info">
                   <div class="agent-name">Dental USA - Outbound</div>
                   <div class="agent-id">ID: SP 2020</div>
                 </div>
               </div>
   
               <!-- Message -->
               <p class="message-text">Hi, I can book a call and send a proposal.</p>
   
               <!-- Form Fields -->
               <div class="mobile-form">
                 <input
                   type="email"
                   class="mobile-input"
                   placeholder="Email"
                 />
                 <input
                   type="tel"
                   class="mobile-input"
                   placeholder="Phone"
                 />
   
                 <!-- Checkboxes -->
                 <div class="checkbox-row">
                   <label class="checkbox-label">
                     <input type="checkbox" class="checkbox-input" />
                     <span class="checkbox-text">Whatsapp Opt-In</span>
                   </label>
                   <label class="checkbox-label">
                     <input type="checkbox" class="checkbox-input" />
                     <span class="checkbox-text">Phone consent</span>
                   </label>
                 </div>
   
                 <!-- Consent Text -->
                 <p class="consent-text">
                   By submitting, you agree to be contact via Whatsapp/Phone
                 </p>
   
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
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
  </div>
</template>

<script>
export default {
  name: 'WidgetEmbedMobile',

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
    min-height: calc(100vh - 140px);
    position: relative;
    overflow: auto;

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

    .mobile-preview-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 60px 80px 80px 80px;

      .mobile-frame {
        width: 320px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;

        .mobile-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 20px;
          background: #fff;
          border-bottom: 1px solid #e5e5e5;

          .mobile-icon {
            font-size: 1.1rem;
            color: #2f2f41;
          }

          .mobile-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: #2f2f41;
          }
        }

        .mobile-widget {
          padding: 20px;

          .agent-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f9fafb;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            margin-bottom: 16px;

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

            .agent-info {
              .agent-name {
                font-size: 0.85rem;
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

          .message-text {
            font-size: 0.85rem;
            color: #2f2f41;
            line-height: 1.5;
            margin: 0 0 16px 0;
          }

          .mobile-form {
            .mobile-input {
              width: 100%;
              padding: 10px 12px;
              font-size: 0.85rem;
              color: #2f2f41;
              border: 1px solid #e5e5e5;
              border-radius: 6px;
              background: #fff;
              margin-bottom: 12px;
              transition: all 0.2s ease;

              &:focus {
                outline: none;
                border-color: $primary;
              }

              &::placeholder {
                color: #9ca3af;
              }
            }

            .checkbox-row {
              display: flex;
              gap: 16px;
              margin-bottom: 12px;

              .checkbox-label {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;

                .checkbox-input {
                  width: 16px;
                  height: 16px;
                  cursor: pointer;
                  border-radius: 4px;
                  border: 2px solid #e5e5e5;
                  appearance: none;
                  transition: all 0.2s ease;
                  position: relative;
                  flex-shrink: 0;

                  &:checked {
                    background-color: $primary;
                    border-color: $primary;
                  }

                  &:checked::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #000;
                    font-size: 11px;
                    font-weight: bold;
                  }

                  &:hover {
                    border-color: $primary;
                  }
                }

                .checkbox-text {
                  font-size: 0.75rem;
                  color: #2f2f41;
                }
              }
            }

            .consent-text {
              font-size: 0.7rem;
              color: #6b7280;
              line-height: 1.4;
              margin: 0 0 16px 0;
            }

            .action-buttons {
              display: flex;
              gap: 10px;

              .call-now-btn,
              .pick-time-btn {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 10px 12px;
                font-size: 0.8rem;
                font-weight: 600;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;

                .btn-icon {
                  font-size: 0.85rem;
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
          }
        }
      }
    }
  }
}
</style>
