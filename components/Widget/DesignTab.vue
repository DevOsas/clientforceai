<template>
  <div class="design-tab">
    <!-- Left: Appearance Settings -->
    <div class="appearance-section">
      <div class="section-card">
        <h2 class="section-title">Appearance</h2>

        <!-- Brand Color -->
        <div class="form-group">
          <label class="form-label">Brand Color</label>
          <div class="color-picker-group">
            <button
              v-for="color in brandColors"
              :key="color"
              class="color-btn"
              :class="{ active: selectedColor === color }"
              :style="{ background: color }"
              @click="selectedColor = color"
            ></button>
            <input
              v-model="customColor"
              type="text"
              class="color-input"
              placeholder="#000015"
              @input="selectedColor = customColor"
            />
          </div>
        </div>

        <!-- Launcher -->
        <div class="form-group">
          <label class="form-label">Launcher</label>
          <input
            v-model="launcherText"
            type="text"
            class="text-input"
            placeholder="Chat with our AI Sales Agent"
          />
        </div>

        <!-- Show Unread Badge -->
        <div class="form-group toggle-group">
          <label class="form-label">Show Unread badge</label>
          <label class="toggle-switch">
            <input type="checkbox" v-model="showUnreadBadge" />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <!-- Avatar -->
        <div class="form-group">
          <label class="form-label">Avatar</label>
          <div class="avatar-upload">
            <div class="avatar-preview">
              <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
            </div>
            <button class="upload-btn" @click="$refs.avatarInput.click()">
              + Upload
            </button>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarUpload"
            />
          </div>
        </div>

        <!-- Theme -->
        <div class="form-group">
          <label class="form-label">Theme</label>
          <div class="theme-options">
            <button
              v-for="theme in themes"
              :key="theme.value"
              class="theme-btn"
              :class="{ active: selectedTheme === theme.value }"
              @click="selectedTheme = theme.value"
            >
              <span class="radio-circle"></span>
              {{ theme.label }}
            </button>
          </div>
        </div>

        <!-- Corners - Shadow -->
        <div class="form-group">
          <label class="form-label">Corners - Shadow</label>
          <div class="corners-shadow-group">
            <CustomSelect
              v-model="cornerRadius"
              :options="radiusOptionsArray"
              placeholder="Radius: 34px"
            />
            <CustomSelect
              v-model="shadowType"
              :options="shadowOptionsArray"
              placeholder="Shadow: Soft"
            />
          </div>
        </div>

        <!-- Positions -->
        <div class="form-group">
          <label class="form-label">Positions</label>
          <div class="position-options">
            <button
              v-for="position in positions"
              :key="position.value"
              class="position-btn"
              :class="{ active: selectedPosition === position.value }"
              @click="selectedPosition = position.value"
            >
              {{ position.label }}
            </button>
          </div>
        </div>

        <!-- Open After 4s & Exit-intent trigger -->
        <div class="form-group toggle-row">
          <div class="toggle-item">
            <label class="form-label">Open After 4s</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="openAfter4s" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="toggle-item">
            <label class="form-label">Exit-intent trigger</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="exitIntentTrigger" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Live Preview -->
    <div class="preview-section">
      <div class="preview-card">
        <h2 class="preview-title">Live Preview</h2>

        <!-- Website Page Preview -->
        <div class="website-preview">
          <div class="preview-header">
            <SvgIcon name="monitor" class="preview-icon" />
            <h3 class="preview-heading">Website Page Preview</h3>
          </div>
          <div class="preview-divider"></div>
          <div class="preview-content">
            <div class="widget-chat-preview">
              <div class="chat-header">
                <img src="https://i.pravatar.cc/40?img=5" alt="Avatar" class="chat-avatar" />
                <div class="chat-info">
                  <h4 class="chat-name">Dental USA - Outbound</h4>
                  <p class="chat-id">ID: SP 2020</p>
                </div>
              </div>
              <div class="chat-body">
                <p class="chat-message">Hi, i can book a call and send a proposal.</p>
                <div class="quick-replies">
                  <p class="quick-replies-label">Quick Replies</p>
                  <div class="reply-buttons">
                    <button class="reply-btn">Book a call</button>
                    <button class="reply-btn">Get a proposal</button>
                  </div>
                </div>
              </div>
              <div class="chat-input-wrapper">
                <input type="text" class="chat-input" placeholder="Type your message.." />
              </div>
            </div>
            <div class="widget-launcher">
              <SvgIcon name="sparkles" size="lg" class="sparkles-icon" />
            </div>
          </div>
        </div>

        <!-- Mobile Preview -->
        <div class="mobile-preview-section">
        
          <div class="mobile-preview-content">
            <div class="mobile-phone-mockup">
               <div class="mobile-preview-header">
            <SvgIcon name="mobile" class="mobile-preview-icon" />
            <h3 class="mobile-preview-heading">Mobile Preview</h3>
          </div>
              <div class="mobile-widget-container">
                <div class="mobile-widget-header">
                  <img src="https://i.pravatar.cc/40?img=5" alt="Avatar" class="mobile-avatar" />
                  <div class="mobile-header-info">
                    <h4 class="mobile-agent-name">Dental USA - Outbound</h4>
                    <p class="mobile-agent-id">ID: SP 2020</p>
                  </div>
                </div>
                <div class="mobile-widget-body">
                  <p class="mobile-message">Hi, i can book a call and send a proposal.</p>
                  <div class="mobile-quick-replies">
                    <p class="mobile-replies-label">Quick Replies</p>
                    <div class="mobile-reply-buttons">
                      <button class="mobile-reply-btn">Book a call</button>
                      <button class="mobile-reply-btn">Get a proposal</button>
                    </div>
                  </div>
                </div>
                <div class="mobile-input-container">
                  <input type="text" class="mobile-input" placeholder="Type your message.." readonly />
                </div>
              </div>
              <div class="mobile-launcher-btn">
                <SvgIcon name="sparkles" size="lg" class="mobile-launcher-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from '@/components/CampaignV2/CustomSelect.vue'

export default {
  name: 'DesignTab',

  components: {
    CustomSelect
  },

  data() {
    return {
      brandColors: [
        '#C4FF33',
        '#FF0099',
        '#FF6B6B',
        '#6B5FFF',
        '#33D9FF',
        '#CC33FF',
        '#9E9E9E'
      ],
      selectedColor: '#C4FF33',
      customColor: '#000015',
      launcherText: 'Chat with our AI Sales Agent',
      showUnreadBadge: false,
      avatarUrl: null,
      selectedTheme: 'light',
      themes: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'auto', label: 'Auto' }
      ],
      cornerRadius: 'Radius: 34px',
      radiusOptionsArray: [
        'Radius: 34px',
        'Radius: 24px',
        'Radius: 16px',
        'Radius: 8px',
        'Radius: 0px'
      ],
      shadowType: 'Shadow: Soft',
      shadowOptionsArray: [
        'Shadow: Soft',
        'Shadow: Medium',
        'Shadow: Hard',
        'Shadow: None'
      ],
      selectedPosition: 'bottom-right',
      positions: [
        { value: 'bottom-right', label: 'Bottom Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'inline', label: 'Inline' }
      ],
      openAfter4s: false,
      exitIntentTrigger: false
    }
  },

  methods: {
    handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.avatarUrl = URL.createObjectURL(file)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.design-tab {
  display: grid;
  grid-template-columns: 550px 1fr;
  gap: 32px;
}

.appearance-section {
  .section-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 32px;

    .section-title {
      font-size: 1.1rem;
      font-weight: 400;
      color: #000;
      padding: 0 0px 26px 0;
      border-bottom: 1px solid $gray-200;
    }

    .form-group {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 0;
      }

      .form-label {
        display: block;
        font-size: 0.95rem;
        font-weight: 600;
        color: #000;
        margin-bottom: 12px;
      }

      // Brand Color
      .color-picker-group {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;

        .color-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            transform: scale(1.05);
          }

          &.active {
            // border-color: $primary;
            box-shadow: 0 0 0 2px #fff, 0 0 0 4px $primary;
          }
        }

        .color-input {
          flex: 1;
          min-width: 120px;
          padding: 12px 16px;
          font-size: 0.9rem;
          color: #000;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: #fff;

          &:focus {
            outline: none;
            border-color: $primary;
          }
        }
      }

      // Text Input
      .text-input {
        width: 100%;
        padding: 14px 16px;
        font-size: 0.95rem;
        font-style: italic;
        color: #000;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        background: #fff;

        &:focus {
          outline: none;
          border-color: $primary;
        }
      }

      // Toggle Group
      &.toggle-group {
        display: flex;
        gap: 18px;
        // justify-content: space-between;
        // align-items: center;

        .form-label {
          margin-bottom: 0;
        }
      }

      // Avatar Upload
      .avatar-upload {
        display: flex;
        align-items: center;
        gap: 20px;

        .avatar-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .upload-btn {
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #000;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }
        }
      }

      // Theme Options
      .theme-options {
        display: flex;
        gap: 12px;

        .theme-btn {
          flex: 1;
          padding: 12px 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6b7280;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;

          .radio-circle {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid #d1d5db;
            position: relative;
            transition: all 0.2s ease;
          }

          &.active {
            border-color: $primary;
            color: #000;

            .radio-circle {
              border-color: $primary;

              &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: $primary;
              }
            }
          }

          &:hover:not(.active) {
            border-color: #d1d5db;
          }
        }
      }

      // Corners Shadow Group
      .corners-shadow-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;

        ::v-deep .custom-select-trigger {
          background-color: #fff;
        }
      }

      // Position Options
      .position-options {
        display: flex;
        gap: 12px;

        .position-btn {
          flex: 1;
          padding: 12px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6b7280;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;

          &.active {
            border-color: $primary;
            color: #000;
            background: rgba($primary, 0.05);
          }

          &:hover:not(.active) {
            border-color: #d1d5db;
          }
        }
      }

      // Toggle Row
      &.toggle-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;

        .toggle-item {
          display: flex;
          gap: 18px;
          // justify-content: space-between;
          // align-items: center;

          .form-label {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

// Toggle Switch
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
      background: $primary;

      &:before {
        transform: translateX(20px);
      }
    }
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #d1d5db;
    border-radius: 34px;
    transition: 0.3s;

    &:before {
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background: #fff;
      border-radius: 50%;
      transition: 0.3s;
    }
  }
}

// Preview Section
.preview-section {
  .preview-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 32px;

    .preview-title {
      font-size: 1.1rem;
      font-weight: 400;
      color: #000;
      padding-bottom: 18px;
    
    }
  }

  .website-preview,
  .mobile-preview {
    margin-bottom: 24px;
    border: 1px solid #e5e5e5;
    border-radius: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: #f5f5f5;

      .preview-icon {
        width: 20px;
        height: 20px;
        color: #000;
      }

      .preview-heading {
        font-size: 1rem;
        font-weight: 600;
        color: #000;
        margin: 0;
      }
    }

    .preview-divider {
      height: 1px;
      background: #e5e5e5;
      margin: 0;
    }
  }

  .website-preview {
    .preview-content {
      background: #f5f5f5;
      border-radius: 0 0 12px 12px;
      padding: 40px;
      min-height: 400px;
      position: relative;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      padding-bottom: 80px;

      .widget-chat-preview {
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 320px;
        overflow: hidden;

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;

          .chat-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }

          .chat-info {
            flex: 1;

            .chat-name {
              font-size: 0.9rem;
              font-weight: 600;
              color: #000;
              margin: 0 0 2px 0;
            }

            .chat-id {
              font-size: 0.75rem;
              color: #9ca3af;
              margin: 0;
            }
          }
        }

        .chat-body {
          padding: 16px;

          .chat-message {
            font-size: 0.9rem;
            color: #2f2f41;
            margin: 0 0 16px 0;
            line-height: 1.5;
          }

          .quick-replies {
            .quick-replies-label {
              font-size: 0.85rem;
              font-weight: 600;
              color: #000;
              margin: 0 0 10px 0;
            }

            .reply-buttons {
              display: flex;
              gap: 8px;

              .reply-btn {
                padding: 8px 16px;
                font-size: 0.85rem;
                color: #6b7280;
                background: #f3f4f6;
                border: 1px solid #e5e5e5;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                  background: #e5e7eb;
                }
              }
            }
          }
        }

        .chat-input-wrapper {
          padding: 12px 16px;
          border-top: 1px solid #f0f0f0;

          .chat-input {
            width: 100%;
            padding: 10px 12px;
            font-size: 0.85rem;
            font-style: italic;
            color: #9ca3af;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            background: #fff;

            &:focus {
              outline: none;
              border-color: $primary;
            }
          }
        }
      }

      .widget-launcher {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 56px;
        height: 56px;
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.2s ease;

        .sparkles-icon {
          width: 28px;
          height: 28px;
          color: #fff;
        }

        &:hover {
          transform: scale(1.05);
        }
      }
    }

  }

  // Mobile Preview Section
  .mobile-preview-section {
    margin-bottom: 0;

    .mobile-preview-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 16px;
      border-bottom: 1px solid $gray-200;
      .mobile-preview-icon {
        width: 20px;
        height: 20px;
        color: #000;
      }

      .mobile-preview-heading {
        font-size: 1rem;
        font-weight: 600;
        color: #000;
        margin: 0;
      }
    }

    

    .mobile-preview-content {
      background: #fff;
      // padding: 40px 24px;
      min-height: 500px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .mobile-phone-mockup {
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        width: 320px;
        padding: 32px 20px;
        padding-bottom: 70px;
        position: relative;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        .mobile-widget-container {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          overflow: hidden;
          margin-top: 10px;

          .mobile-widget-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #fff;
            border-bottom: 1px solid #f0f0f0;

            .mobile-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }

            .mobile-header-info {
              flex: 1;

              .mobile-agent-name {
                font-size: 0.9rem;
                font-weight: 600;
                color: #000;
                margin: 0 0 2px 0;
              }

              .mobile-agent-id {
                font-size: 0.75rem;
                color: #9ca3af;
                margin: 0;
              }
            }
          }

          .mobile-widget-body {
            padding: 16px;
            background: #fff;

            .mobile-message {
              font-size: 0.9rem;
              color: #2f2f41;
              margin: 0 0 16px 0;
              line-height: 1.5;
            }

            .mobile-quick-replies {
              .mobile-replies-label {
                font-size: 0.85rem;
                font-weight: 600;
                color: #000;
                margin: 0 0 10px 0;
              }

              .mobile-reply-buttons {
                display: flex;
                gap: 8px;

                .mobile-reply-btn {
                  padding: 8px 16px;
                  font-size: 0.8rem;
                  color: #6b7280;
                  background: #f3f4f6;
                  border: 1px solid #e5e5e5;
                  border-radius: 20px;
                  cursor: pointer;
                  transition: all 0.2s ease;

                  &:hover {
                    background: #e5e7eb;
                  }
                }
              }
            }
          }

          .mobile-input-container {
            padding: 12px 16px;
            background: #fff;
            border-top: 1px solid #f0f0f0;

            .mobile-input {
              width: 100%;
              padding: 10px 12px;
              font-size: 0.85rem;
              font-style: italic;
              color: #9ca3af;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              background: #fff;

              &:focus {
                outline: none;
              }
            }
          }
        }

        .mobile-launcher-btn {
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 52px;
          height: 52px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 0.2s ease;

          .mobile-launcher-icon {
            width: 24px;
            height: 24px;
            color: #fff;
          }

          &:hover {
            transform: translateX(-50%) scale(1.05);
          }
        }
      }
    }
  }
}
</style>

