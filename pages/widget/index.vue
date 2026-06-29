<template>
  <div class="widget-page">
    <!-- Header -->
    <div class="widget-header">
      <h1 class="widget-title">Widget</h1>
      <button class="create-widget-btn" @click="goToCreate">
        + Create Widget
      </button>
    </div>

    <!-- Widget List -->
    <div class="widget-list">
      <div v-for="widget in widgets" :key="widget.id" class="widget-card">
        <h3 class="widget-name">{{ widget.name }}</h3>
        
        <div class="widget-code-wrapper">
          <pre class="widget-code">{{ widget.embedCode }}</pre>
          <button class="copy-btn" @click="copyCode(widget.id)">
            <SvgIcon :name="widget.copied ? 'check' : 'copy'" />
            {{ widget.copied ? 'Copied' : 'Copy' }}
          </button>
        </div>

        <label class="toggle-switch">
          <input 
            type="checkbox" 
            v-model="widget.isActive"
            @change="toggleWidget(widget.id)"
          />
          <span class="toggle-slider"></span>
        </label>

        <div class="widget-actions">
          <button class="icon-btn edit-btn" @click="editWidget(widget.id)">
            <SvgIcon name="edit-2" />
          </button>
          <button class="icon-btn delete-btn" @click="deleteWidget(widget.id)">
            <SvgIcon name="delete" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WidgetPage',

  data() {
    return {
      widgets: [
        {
          id: 1,
          name: 'Widget Name',
          embedCode: `function createWidget() { const widget = document.createElement('div');\nwidget.className = 'widget'; widget.innerHTML = '<h2>Widget</h2>';\ndocument.body.appendChild(widget);\n}`,
          isActive: true,
          copied: false
        },
        {
          id: 2,
          name: 'Widget Name 2',
          embedCode: `function createWidget() { const widget = document.createElement('div');\nwidget.className = 'widget'; widget.innerHTML = '<h2>Widget</h2>';\ndocument.body.appendChild(widget);\n}`,
          isActive: false,
          copied: false
        },
        {
          id: 3,
          name: 'Widget Name',
          embedCode: `function createWidget() { const widget = document.createElement('div');\nwidget.className = 'widget'; widget.innerHTML = '<h2>Widget</h2>';\ndocument.body.appendChild(widget);\n}`,
          isActive: false,
          copied: false
        }
      ]
    }
  },

  methods: {
    goToCreate() {
      this.$router.push('/widget/create')
    },
    copyCode(widgetId) {
      const widget = this.widgets.find(w => w.id === widgetId)
      if (!widget) return

      navigator.clipboard.writeText(widget.embedCode).then(() => {
        widget.copied = true
        console.log('Code copied to clipboard')
        
        // Reset after 2 seconds
        setTimeout(() => {
          widget.copied = false
        }, 2000)
      })
    },
    toggleWidget(widgetId) {
      const widget = this.widgets.find(w => w.id === widgetId)
      console.log(`Widget ${widgetId} toggled to:`, widget.isActive)
      // TODO: Update widget status via API
    },
    editWidget(widgetId) {
      this.$router.push(`/widget/${widgetId}/edit`)
    },
    deleteWidget(widgetId) {
      if (confirm('Are you sure you want to delete this widget?')) {
        this.widgets = this.widgets.filter(w => w.id !== widgetId)
        console.log('Widget deleted:', widgetId)
        // TODO: Delete widget via API
      }
    }
  },

  mounted() {
    console.log('Widget page mounted')
    // TODO: Fetch widgets from API
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.widget-page {
  background: #fff;
  min-height: calc(100vh - 100px);
  padding: 30px 40px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e5e5e5;

  .widget-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin: 0;
  }

  .create-widget-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    background: #000;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #333;
    }

    &:active {
      transform: scale(0.98);
    }
  }
}

.widget-list {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .widget-card {
    background: #fff;
    border: 1px solid $gray-300;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 24px 28px;
    gap: 32px;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .widget-name {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      margin: 0;
      min-width: 120px;
      flex-shrink: 0;
    }

    .widget-code-wrapper {
      // flex: 1;
      // display: flex;
      flex-direction: column;
      // align-items: center;
      // justify-content: center;
      gap: 12px;

      .widget-code {
        background: transparent;
        border: none;
        padding: 0;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        line-height: 1.5;
        color: #9ca3af;
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        // text-align: center;
      }

      .copy-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        font-size: 0.85rem;
        font-weight: 500;
        color: #6b7280;
        background: #f9fafb;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;

        ::v-deep svg {
          width: 14px;
          height: 14px;
        }

        &:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #000;
        }
      }
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 28px;
      flex-shrink: 0;

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

    .widget-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;

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

      .icon-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        ::v-deep svg {
          width: 18px;
          height: 18px;
          color: #6b7280;
        }

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;

          ::v-deep svg {
            color: #000;
          }
        }

        &.delete-btn:hover {
          background: #fee;
          border-color: #fcc;

          ::v-deep svg {
            color: #ef4444;
          }
        }
      }
    }
  }
}
</style>
