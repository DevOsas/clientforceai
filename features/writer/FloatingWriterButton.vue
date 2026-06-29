<template>
  <div v-if="isEnabled" class="writer-agent">
    <!-- Floating Action Button -->
    <div 
      class="writer-fab" 
      :class="{ 'writer-fab--open': isOpen }"
      @click="togglePanel"
      title="AI Writing Assistant"
    >
      <svg v-if="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>

    <!-- Writer Panel -->
    <transition name="writer-panel">
      <div v-if="isOpen" class="writer-panel">
        <div class="writer-panel__header">
          <h3>AI Writing Assistant</h3>
          <button @click="isOpen = false" class="writer-panel__close">×</button>
        </div>

        <div class="writer-panel__body">
          <!-- Intent Selector -->
          <div class="writer-field">
            <label>What do you want to do?</label>
            <select v-model="intent" class="writer-select">
              <option value="write">Write from scratch</option>
              <option value="improve">Improve selected text</option>
              <option value="summarize">Summarize</option>
              <option value="expand">Expand</option>
              <option value="tone">Change tone</option>
              <option value="translate">Translate</option>
            </select>
          </div>

          <!-- Prompt Input -->
          <div class="writer-field">
            <label>{{ promptLabel }}</label>
            <textarea 
              v-model="prompt" 
              :placeholder="promptPlaceholder"
              class="writer-textarea"
              rows="3"
            ></textarea>
          </div>

          <!-- Controls Row -->
          <div class="writer-controls">
            <div class="writer-field writer-field--inline">
              <label>Tone</label>
              <select v-model="tone" class="writer-select writer-select--sm">
                <option value="Neutral">Neutral</option>
                <option value="Friendly">Friendly</option>
                <option value="Formal">Formal</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Casual">Casual</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div class="writer-field writer-field--inline">
              <label>Length</label>
              <select v-model="length" class="writer-select writer-select--sm">
                <option value="Short">Short</option>
                <option value="Medium">Medium</option>
                <option value="Long">Long</option>
              </select>
            </div>

            <div class="writer-field writer-field--inline">
              <label>Format</label>
              <select v-model="targetFormat" class="writer-select writer-select--sm">
                <option value="email">Email</option>
                <option value="proposal">Proposal</option>
                <option value="note">Note</option>
                <option value="generic">Generic</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="writer-actions">
            <button 
              @click="generate" 
              :disabled="loading || !canGenerate"
              class="writer-btn writer-btn--primary"
            >
              <span v-if="loading">Generating...</span>
              <span v-else>Generate</span>
            </button>

            <button 
              @click="applyDraft" 
              :disabled="!draft || loading"
              class="writer-btn writer-btn--success"
            >
              Fill Fields
            </button>

            <button 
              @click="undo" 
              :disabled="!canUndo"
              class="writer-btn writer-btn--secondary"
            >
              Undo
            </button>
          </div>

          <!-- Preview -->
          <div v-if="draft" class="writer-preview">
            <div class="writer-preview__header">
              <strong>Preview</strong>
              <span v-if="draft.safety?.blocked" class="writer-badge writer-badge--danger">
                Blocked
              </span>
            </div>
            <div class="writer-preview__content">
              <div v-if="draft.parts.subject" class="writer-preview__part">
                <label>Subject:</label>
                <div>{{ draft.parts.subject }}</div>
              </div>
              <div v-if="draft.parts.intro" class="writer-preview__part">
                <label>Intro:</label>
                <div v-html="draft.parts.intro"></div>
              </div>
              <div v-if="draft.parts.body" class="writer-preview__part">
                <label>Body:</label>
                <div v-html="draft.parts.body"></div>
              </div>
              <div v-if="draft.parts.bullets && draft.parts.bullets.length" class="writer-preview__part">
                <label>Bullets:</label>
                <ul>
                  <li v-for="(bullet, idx) in draft.parts.bullets" :key="idx">{{ bullet }}</li>
                </ul>
              </div>
              <div v-if="draft.parts.cta" class="writer-preview__part">
                <label>CTA:</label>
                <div>{{ draft.parts.cta }}</div>
              </div>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="writer-error">
            {{ error }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import WriterBus from './writerBus'

export default {
  name: 'FloatingWriterButton',
  
  data() {
    return {
      isOpen: false,
      isEnabled: false,
      
      // Form state
      intent: 'write',
      prompt: '',
      tone: 'Neutral',
      length: 'Medium',
      targetFormat: 'generic',
      
      // Generation state
      loading: false,
      draft: null,
      error: null,
      
      // Undo state
      snapshots: [],
      currentDraftId: null
    }
  },

  computed: {
    promptLabel() {
      const labels = {
        write: 'What do you want to write?',
        improve: 'How should we improve it?',
        summarize: 'What to summarize? (or select text)',
        expand: 'What to expand? (or select text)',
        tone: 'Selected text will be rewritten',
        translate: 'Target language'
      }
      return labels[this.intent] || 'Prompt'
    },

    promptPlaceholder() {
      const placeholders = {
        write: 'E.g., "Write a follow-up email after yesterday\'s demo..."',
        improve: 'E.g., "Make it more concise and professional"',
        summarize: 'Select text on the page or describe what to summarize',
        expand: 'Select text on the page or describe what to expand',
        tone: 'The selected text will be rewritten in the chosen tone',
        translate: 'E.g., "Spanish", "French", "German"'
      }
      return placeholders[this.intent] || ''
    },

    canGenerate() {
      if (this.intent === 'write') {
        return this.prompt.trim().length > 0
      }
      return true // Other intents can work with selection
    },

    canUndo() {
      return this.snapshots.length > 0
    }
  },

  async mounted() {
    // Check if feature is enabled
    await this.checkFeatureEnabled()
    
    // Auto-detect format based on route
    this.detectFormat()
  },

  methods: {
    async checkFeatureEnabled() {
      try {
        // Check user settings or feature flags
        // For now, we'll enable it by default in development
        // In production, this should check tenant settings
        this.isEnabled = true
        
        // TODO: Replace with actual API call to check tenant settings
        // const response = await this.$axios.get('/api/writer/settings')
        // this.isEnabled = response.data.enabled
      } catch (error) {
        console.error('Failed to check writer feature status:', error)
        this.isEnabled = false
      }
    },

    togglePanel() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.detectFormat()
      }
    },

    detectFormat() {
      const routeName = this.$route?.name || ''
      
      if (routeName.includes('email') || routeName.includes('campaign')) {
        this.targetFormat = 'email'
      } else if (routeName.includes('proposal')) {
        this.targetFormat = 'proposal'
      } else if (routeName.includes('note')) {
        this.targetFormat = 'note'
      } else {
        this.targetFormat = 'generic'
      }
    },

    getPageContext() {
      const selection = window.getSelection()?.toString() || ''
      const routeName = this.$route?.name
      const params = this.$route?.params || {}
      const query = this.$route?.query || {}
      
      // Gather all data-ai-slot elements
      const slots = [...document.querySelectorAll('[data-ai-slot]')].map(el => ({
        slot: el.getAttribute('data-ai-slot'),
        tag: el.tagName,
        placeholder: el.placeholder || '',
        name: el.name || '',
        label: el.id ? (document.querySelector(`label[for="${el.id}"]`)?.innerText || '') : '',
        path: WriterBus.domPath(el)
      }))

      // Extract variables from route/context
      const variables = {}
      
      // You can enhance this based on your app structure
      // For example, extract lead/company info from Vuex store
      
      return {
        routeName,
        params,
        query,
        selection,
        slots,
        variables
      }
    },

    async generate() {
      this.loading = true
      this.error = null
      this.draft = null

      try {
        const context = this.getPageContext()
        
        const response = await this.$axios.post('/api/writer/generate', {
          intent: this.intent,
          prompt: this.prompt,
          tone: this.tone,
          length: this.length,
          target_format: this.targetFormat,
          language: this.intent === 'translate' ? this.prompt : 'en',
          context
        })

        this.draft = response.data
        this.currentDraftId = response.data.draft_id

        if (this.draft.safety?.blocked) {
          this.error = 'Content was blocked: ' + (this.draft.safety.reasons?.join(', ') || 'Safety violation')
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to generate content. Please try again.'
        console.error('Generation error:', err)
      } finally {
        this.loading = false
      }
    },

    async applyDraft() {
      if (!this.draft) return

      // Take snapshot before filling
      const snapshot = WriterBus.snapshotAll()
      this.snapshots.push(snapshot)

      // Fill fields
      const filled = WriterBus.fill(this.draft)

      // Record fill operation for audit
      try {
        await this.$axios.post('/api/writer/record-fill', {
          draft_id: this.currentDraftId,
          page_url: window.location.href,
          route: this.$route?.name,
          fields_changed: filled,
          snapshot
        })
      } catch (err) {
        console.error('Failed to record fill operation:', err)
      }

      // Show success message
      if (this.$notify) {
        this.$notify({
          group: 'main',
          type: 'success',
          title: 'Success',
          text: 'Fields filled! Review before saving.'
        })
      }
      
      // Optionally close panel
      // this.isOpen = false
    },

    undo() {
      const snapshot = this.snapshots.pop()
      if (snapshot) {
        WriterBus.restoreSnapshot(snapshot)
        if (this.$notify) {
          this.$notify({
            group: 'main',
            type: 'info',
            title: 'Undo',
            text: 'Undo successful'
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.writer-agent {
  position: fixed;
  z-index: 9999;
}

.writer-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 10000;
}

.writer-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.writer-fab--open {
  background: #e53e3e;
}

.writer-panel {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: min(520px, calc(100vw - 40px));
  max-height: calc(100vh - 120px);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.writer-panel__header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.writer-panel__header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.writer-panel__close {
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.writer-panel__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.writer-panel__body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.writer-field {
  margin-bottom: 16px;
}

.writer-field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
}

.writer-select,
.writer-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.writer-select:focus,
.writer-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.writer-textarea {
  resize: vertical;
  min-height: 80px;
}

.writer-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.writer-field--inline label {
  font-size: 12px;
}

.writer-select--sm {
  padding: 8px 10px;
  font-size: 13px;
}

.writer-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.writer-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.writer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.writer-btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.writer-btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.writer-btn--success {
  background: #48bb78;
  color: white;
}

.writer-btn--success:hover:not(:disabled) {
  background: #38a169;
}

.writer-btn--secondary {
  background: #edf2f7;
  color: #4a5568;
}

.writer-btn--secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.writer-preview {
  background: #f7fafc;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.writer-preview__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.writer-preview__content {
  font-size: 13px;
}

.writer-preview__part {
  margin-bottom: 12px;
}

.writer-preview__part:last-child {
  margin-bottom: 0;
}

.writer-preview__part label {
  font-weight: 600;
  color: #2d3748;
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.writer-preview__part div,
.writer-preview__part ul {
  color: #4a5568;
  line-height: 1.6;
}

.writer-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.writer-badge--danger {
  background: #fed7d7;
  color: #c53030;
}

.writer-error {
  background: #fed7d7;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-top: 12px;
}

/* Transitions */
.writer-panel-enter-active,
.writer-panel-leave-active {
  transition: all 0.3s ease;
}

.writer-panel-enter,
.writer-panel-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
