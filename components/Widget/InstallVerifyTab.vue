<template>
  <div class="install-verify-tab">
    <div class="install-card">
      <h2 class="section-title">Embed Widget</h2>

      <!-- Widget Name -->
      <div class="form-group">
        <label class="form-label">Widget Name</label>
        <input
          v-model="widgetName"
          type="text"
          class="form-input"
          placeholder="Enter widget name"
        />
      </div>

      <!-- Code Snippet -->
      <div class="code-section">
        <pre class="code-block">{{ codeSnippet }}</pre>
      </div>

      <!-- Actions -->
      <div class="actions-row">
        <label class="toggle-switch">
          <input type="checkbox" v-model="isEnabled" />
          <span class="toggle-slider"></span>
        </label>
        <button class="copy-btn" :class="{ copied: isCopied }" @click="copyCode">
          <SvgIcon :name="isCopied ? 'check' : 'copy'" class="copy-icon" />
          {{ isCopied ? 'Copied' : 'Copy' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstallVerifyTab',

  data() {
    return {
      widgetName: '',
      isEnabled: false,
      isCopied: false,
      codeSnippet: `function createWidget() { const widget =
document.createElement('div'); widget.className = 'widget';
widget.innerHTML = '<h2>Widget</h2>';
document.body.appendChild(widget)
}`
    }
  },

  beforeDestroy() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout)
    }
  },

  methods: {
    copyCode() {
      navigator.clipboard.writeText(this.codeSnippet)
      this.isCopied = true
      
      // Reset after 2 seconds
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout)
      }
      this.copyTimeout = setTimeout(() => {
        this.isCopied = false
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.install-verify-tab {
  display: flex;
  justify-content: center;

  .install-card {
    width: 100%;
    max-width: 700px;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 32px;

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 28px 0;
    }

    .form-group {
      margin-bottom: 24px;

      .form-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 500;
        color: #2f2f41;
        margin-bottom: 8px;
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
    }

    .code-section {
      margin-bottom: 20px;

      .code-block {
        padding: 16px;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        line-height: 1.6;
        color: #6b7280;
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 0;
      }
    }

    .actions-row {
      display: flex;
      align-items: center;
      gap: 16px;

      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;

        input {
          opacity: 0;
          width: 0;
          height: 0;

          &:checked + .toggle-slider {
            background-color: $primary;
          }

          &:checked + .toggle-slider:before {
            transform: translateX(24px);
          }
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e5e5e5;
          transition: 0.3s;
          border-radius: 24px;

          &:before {
            position: absolute;
            content: '';
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
          }
        }
      }

      .copy-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        font-size: 0.9rem;
        font-weight: 500;
        color: #2f2f41;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;

        .copy-icon {
          font-size: 0.9rem;
        }

        &:hover {
          background: #f9fafb;
          border-color: #d0d0d0;
        }

        &.copied {
          color: #10b981;
          border-color: #10b981;
          background: #f0fdf4;

          .copy-icon {
            color: #10b981;
          }
        }
      }
    }
  }
}
</style>
