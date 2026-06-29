<template>
  <div class="writer-settings-panel">
    <div class="settings-header">
      <h3>AI Writing Agent Settings</h3>
      <span v-if="settings.enabled" class="badge badge-success">Enabled</span>
      <span v-else class="badge badge-secondary">Disabled</span>
    </div>

    <div class="settings-body">
      <!-- Enable/Disable Toggle -->
      <div class="form-group">
        <label class="form-label">
          <input 
            type="checkbox" 
            v-model="settings.enabled"
            @change="saveSettings"
            class="form-checkbox"
          >
          <span class="label-text">
            <strong>Enable AI Writing Agent</strong>
            <small>Allow users to generate and improve content using AI</small>
          </span>
        </label>
      </div>

      <!-- Advanced Settings (only show when enabled) -->
      <div v-if="settings.enabled" class="advanced-settings">
        
        <!-- Allowed Intents -->
        <div class="form-group">
          <label class="form-label-block">Allowed Actions</label>
          <small class="form-help">Select which AI actions users can perform</small>
          <div class="checkbox-grid">
            <label v-for="intent in availableIntents" :key="intent.value" class="checkbox-item">
              <input 
                type="checkbox" 
                :value="intent.value"
                v-model="selectedIntents"
                @change="updateIntents"
              >
              <span>{{ intent.label }}</span>
            </label>
          </div>
        </div>

        <!-- Brand Voice -->
        <div class="form-group">
          <label class="form-label-block">Brand Voice Instructions</label>
          <small class="form-help">
            Customize how the AI writes for your brand
          </small>
          <textarea 
            v-model="brandVoiceText"
            @blur="updateBrandVoice"
            class="form-textarea"
            rows="4"
            placeholder="E.g., Always use a professional, consultative tone..."
          ></textarea>
        </div>
      </div>

      <!-- Save Status -->
      <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
        {{ saveStatus.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WriterSettingsPanel',

  data() {
    return {
      settings: {
        enabled: false,
        allowed_intents: null,
        brand_voice: null
      },
      
      availableIntents: [
        { value: 'write', label: 'Write from scratch' },
        { value: 'improve', label: 'Improve text' },
        { value: 'summarize', label: 'Summarize' },
        { value: 'expand', label: 'Expand' },
        { value: 'tone', label: 'Change tone' },
        { value: 'translate', label: 'Translate' }
      ],

      selectedIntents: [],
      brandVoiceText: '',
      saveStatus: null
    }
  },

  async mounted() {
    await this.loadSettings()
  },

  methods: {
    async loadSettings() {
      try {
        // TODO: Implement API call
        // const response = await this.$axios.get('/api/admin/writer/settings')
        // this.settings = response.data
        
        this.initializeFormFields()
      } catch (error) {
        console.error('Failed to load writer settings:', error)
      }
    },

    initializeFormFields() {
      this.selectedIntents = this.settings.allowed_intents || 
        this.availableIntents.map(i => i.value)
      
      this.brandVoiceText = this.settings.brand_voice?.instructions || ''
    },

    async saveSettings() {
      try {
        // TODO: Implement API call
        // await this.$axios.put('/api/admin/writer/settings', this.settings)
        
        this.showSaveStatus('success', 'Settings saved successfully')
      } catch (error) {
        console.error('Failed to save settings:', error)
        this.showSaveStatus('error', 'Failed to save settings')
      }
    },

    updateIntents() {
      this.settings.allowed_intents = this.selectedIntents.length === this.availableIntents.length
        ? null
        : this.selectedIntents
      this.saveSettings()
    },

    updateBrandVoice() {
      this.settings.brand_voice = this.brandVoiceText.trim()
        ? { instructions: this.brandVoiceText.trim() }
        : null
      this.saveSettings()
    },

    showSaveStatus(type, message) {
      this.saveStatus = { type, message }
      setTimeout(() => {
        this.saveStatus = null
      }, 3000)
    }
  }
}
</script>

<style scoped>
.writer-settings-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.settings-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-header h3 {
  margin: 0;
  font-size: 20px;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: #48bb78;
}

.badge-secondary {
  background: rgba(255, 255, 255, 0.3);
}

.settings-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.form-checkbox {
  margin-right: 12px;
  margin-top: 2px;
  width: 18px;
  height: 18px;
}

.label-text strong {
  display: block;
  margin-bottom: 4px;
}

.label-text small {
  font-size: 13px;
  color: #718096;
}

.form-label-block {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}

.form-help {
  display: block;
  font-size: 13px;
  color: #718096;
  margin-bottom: 12px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #f7fafc;
  border-radius: 6px;
  cursor: pointer;
}

.checkbox-item:hover {
  background: #edf2f7;
}

.checkbox-item input {
  margin-right: 8px;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-family: inherit;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.advanced-settings {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.save-status {
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
}

.save-status.success {
  background: #c6f6d5;
  color: #22543d;
}

.save-status.error {
  background: #fed7d7;
  color: #742a2a;
}
</style>
