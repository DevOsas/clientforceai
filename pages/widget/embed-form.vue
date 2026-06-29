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
   
         <!-- Widget Form Preview -->
         <div class="widget-form-preview">
           <div class="form-card">
             <!-- Form Header -->
             <div class="form-header">
               <h3 class="form-title">Talk to our AI sales agent</h3>
               <p class="form-subtitle">Get a call back in 2 mins (Business Hours)</p>
             </div>
   
             <!-- Form Fields -->
             <div class="form-fields">
               <!-- Name -->
               <div class="form-group">
                 <label class="field-label">Name</label>
                 <input
                   type="text"
                   class="field-input"
                   placeholder=""
                 />
               </div>
   
               <!-- Email -->
               <div class="form-group">
                 <label class="field-label">Email</label>
                 <input
                   type="email"
                   class="field-input"
                   placeholder=""
                 />
               </div>
   
               <!-- Phone -->
               <div class="form-group">
                 <label class="field-label">Phone</label>
                 <input
                   type="tel"
                   class="field-input"
                   placeholder=""
                 />
               </div>
   
               <!-- Company -->
               <div class="form-group">
                 <label class="field-label">Company</label>
                 <input
                   type="text"
                   class="field-input"
                   placeholder=""
                 />
               </div>
   
               <!-- Checkboxes -->
               <div class="checkbox-group">
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
                   Call me Now
                 </button>
                 <button class="pick-time-btn">
                   <SvgIcon name="clock" class="btn-icon" />
                   Pick A Time
                 </button>
                 <span class="eta-text">ETA: 2 - 4 mins - Queue 3 Ahead</span>
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
  name: 'WidgetEmbedForm',

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

    .widget-form-preview {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 60px 80px 80px 80px;

      .form-card {
        width: 450px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;

        .form-header {
          padding: 24px 24px 20px 24px;

          .form-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #000;
            margin: 0 0 8px 0;
          }

          .form-subtitle {
            font-size: 0.85rem;
            color: #6b7280;
            margin: 0;
          }
        }

        .form-fields {
          padding: 0 24px 24px 24px;

          .form-group {
            margin-bottom: 16px;

            .field-label {
              display: block;
              font-size: 0.85rem;
              font-weight: 500;
              color: #2f2f41;
              margin-bottom: 6px;
            }

            .field-input {
              width: 100%;
              padding: 10px 14px;
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
          }

          .checkbox-group {
            display: flex;
            gap: 20px;
            margin-bottom: 12px;

            .checkbox-label {
              display: flex;
              align-items: center;
              gap: 8px;
              cursor: pointer;

              .checkbox-input {
                width: 18px;
                height: 18px;
                cursor: pointer;
                border-radius: 4px;
                border: 2px solid #e5e5e5;
                appearance: none;
                transition: all 0.2s ease;
                position: relative;

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
                  font-size: 12px;
                  font-weight: bold;
                }

                &:hover {
                  border-color: $primary;
                }
              }

              .checkbox-text {
                font-size: 0.85rem;
                color: #2f2f41;
              }
            }
          }

          .consent-text {
            font-size: 0.8rem;
            color: #6b7280;
            margin: 0 0 20px 0;
            line-height: 1.4;
          }

          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;

            .call-now-btn,
            .pick-time-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 10px 20px;
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

            .eta-text {
              font-size: 0.8rem;
              color: #6b7280;
              width: 100%;
              margin-top: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
