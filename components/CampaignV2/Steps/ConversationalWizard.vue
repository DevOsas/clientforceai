<template>
  <div class="conversational-wizard">
    <!-- Progress Bar / Checklist -->
    <div class="wizard-progress-bar" style="margin-bottom: 12px;">
      <strong>Progress:</strong>
      <span v-for="(v, k) in collectedFields" :key="k" style="margin-right: 10px;">
        <span :style="{color: v ? '#27ae60' : '#aaa'}">{{ v ? '✔' : '○' }}</span> {{ k }}
      </span>
    </div>
    <div class="chat-container">
      <div ref="chatMessages" class="chat-messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="message.type"
        >
          <!-- AGENT MESSAGE -->
          <div v-if="message.type === 'agent'" class="message agent-message">
            <div class="avatar">
              <img :src="agentAvatarUrl" alt="Agent" />
            </div>
            
            <!-- Wizard Frame Message -->
            <div v-if="message.kind === 'wizard_frame'" class="message-bubble wizard-frame">
              <!-- Reflection (if present) -->
              <p v-if="message.reflect" class="reflect-text">
                <em>{{ message.reflect }}</em>
              </p>
              
              <!-- Main Question -->
              <p class="question-text">{{ message.ask }}</p>
              
              <!-- Suggestions (if present) -->
              <div v-if="message.suggestions && message.suggestions.length" class="suggestions">
                <span 
                  v-for="(suggestion, idx) in message.suggestions" 
                  :key="idx"
                  class="suggestion-chip"
                  @click="prefillComposer(suggestion)"
                >
                  {{ suggestion }}
                </span>
              </div>
              
              <!-- Examples (if present) -->
              <!-- <div v-if="message.examples && message.examples.length" class="examples">
                <small>Examples: {{ message.examples.join(', ') }}</small>
              </div> -->
            </div>
            
            <!-- Wizard Complete Message -->
            <div v-else-if="message.kind === 'wizard_complete'" class="message-bubble wizard-complete">
              <p class="completion-text">{{ message.text }}</p>
              
              <!-- Summary (if present) -->
              <div v-if="message.summary" class="summary">
                <strong>Summary:</strong>
                <pre>{{ JSON.stringify(message.summary, null, 2) }}</pre>
              </div>
            </div>
            
            <!-- Plain Text Message -->
            <div v-else class="message-bubble" v-html="renderMarkdown(message.text || '')"></div>
          </div>

          <!-- USER MESSAGE -->
          <div v-else class="message user-message">
            <div class="message-bubble">
              {{ message.text }}
            </div>
            <div class="avatar">
              <img :src="userAvatarUrl" alt="User" />
            </div>
          </div>
        </div>
        <!-- Typing indicator -->
        <div v-if="isTyping" class="message-wrapper agent">
          <div class="message agent-message">
            <div class="avatar">
              <img :src="agentAvatarUrl" alt="Agent" />
            </div>
            <div class="message-bubble typing-indicator">
              <span>Thinking</span>
              <span class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-wrapper">
        <textarea
          ref="chatTextarea"
          v-model="userInput"
          class="chat-input"
          :placeholder="inputPlaceholder"
          :disabled="isTyping"
          rows="1"
          @input="autoResizeTextarea"
          @keydown.enter="handleEnterKey"
        />
        <button class="send-button" :disabled="isTyping || !userInput.trim()" @click="sendMessage" >
          <span>Send</span>
          <SvgIcon name="paper-plane" class="ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()


export default {
  name: 'ConversationalWizard',

  data() {
    return {
      messages: [], // Start empty - first question will come from AI
      userInput: '',
      isTyping: true, // Show typing indicator while waiting for first question
      currentQuestionIndex: 0,
      inputPlaceholder: 'Type your answer...',
      conversationId: null,
      useAI: true,
      conversationCompleted: false,
      serverMessageCount: 0,
      collectedFields: {
        goal: null,
        industry: null,
        audience: null,
        region: null,
        valueProp: null,
        channels: null,
        duration: null,
        cta: null
      },
      wizardComplete: false
    }
  },

  computed: {
    agentAvatarUrl() {
      const campaign = this.$store.state.campaignV2.campaign
      if (campaign.agentAvatar) {
        // If it's a File object, create object URL
        if (campaign.agentAvatar instanceof File) {
          return URL.createObjectURL(campaign.agentAvatar)
        }
        // If it's already a URL string
        return campaign.agentAvatar
      }
      // Default avatar
      return require('@/assets/images/default.png')
    },

    userAvatarUrl() {
      return (this.$auth && this.$auth.user && this.$auth.user.photoUrl)
        ? this.$auth.user.photoUrl
        : require('@/assets/images/default.png')
    }
  },

  async mounted() {
    this.scrollToBottom()
    await this.initializeConversation()
    this.$nextTick(() => {
      this.autoResizeTextarea()
    })
  },

  methods: {
    // Map simple emojis for nicer example bullets
    emojiForExample(text) {
      const t = (text || '').toLowerCase()
      if (t.includes('fitness')) return '🏋️'
      if (t.includes('nutrition') || t.includes('diet')) return '🥗'
      if (t.includes('mental') || t.includes('mindfulness') || t.includes('therapy')) return '🧘'
      if (t.includes('holistic') || t.includes('yoga') || t.includes('herbal')) return '🌿'
      if (t.includes('health') || t.includes('telehealth') || t.includes('supplement')) return '💊'
      return '•'
    },

    // Push agent reply - tolerant parser (handles both text and wizard_frame)
    pushAgentMessage(response) {
      // Handle both string (legacy) and object (new format)
      if (typeof response === 'string') {
        this.messages.push({ type: 'agent', text: response, kind: 'text' })
        this.updateCollectedFields(response)
      } else if (response && typeof response === 'object') {
        // Try to parse wizard_frame from response
        let frame = null
        try {
          if (response.wizardFrame) {
            frame = typeof response.wizardFrame === 'string' 
              ? JSON.parse(response.wizardFrame) 
              : response.wizardFrame
          }
        } catch (e) {
          console.warn('[ConversationalWizard] Failed to parse wizardFrame:', e)
        }

        // If we have a wizard_frame, render it
        if (frame && frame.ask) {
          this.messages.push({
            type: 'agent',
            kind: 'wizard_frame',
            text: response.text || frame.ask,
            ask: frame.ask,
            reflect: frame.reflect,
            suggestions: frame.suggestions || [],
            examples: frame.examples || [],
            followups: frame.followups || []
          })
          this.updateCollectedFields(frame.ask)
        } else if (response.kind === 'wizard_complete') {
          // Wizard completion
          this.messages.push({
            type: 'agent',
            kind: 'wizard_complete',
            text: response.text,
            summary: response.summary
          })
          this.completeConversation('AI completed wizard')
        } else {
          // Plain text fallback
          this.messages.push({
            type: 'agent',
            kind: response.kind || 'text',
            text: response.text || JSON.stringify(response)
          })
          this.updateCollectedFields(response.text)
        }
      }
      this.checkWizardComplete()
    },

    prefillComposer(s) {
      // Append-friendly prefill
      const spacer = this.userInput && !this.userInput.endsWith(' ') ? ' ' : ''
      this.userInput = (this.userInput || '') + spacer + s
      this.$nextTick(this.scrollToBottom)
    },

    updateCollectedFields(text) {
      if (!text) return;
      const lc = text.toLowerCase();
      if (!this.collectedFields.goal && /(goal|main objective|primary aim|main purpose)/i.test(lc)) this.collectedFields.goal = text;
      if (!this.collectedFields.industry && /(industry|sector|field|business type)/i.test(lc)) this.collectedFields.industry = text;
      if (!this.collectedFields.audience && /(audience|target|customer|buyer|client)/i.test(lc)) this.collectedFields.audience = text;
      if (!this.collectedFields.region && /(region|market|location|country|area)/i.test(lc)) this.collectedFields.region = text;
      if (!this.collectedFields.valueProp && /(value prop|unique|differentiator|why choose|what makes)/i.test(lc)) this.collectedFields.valueProp = text;
      if (!this.collectedFields.channels && /(channel|email|whatsapp|sms|call|linkedin)/i.test(lc)) this.collectedFields.channels = text;
      if (!this.collectedFields.duration && /(duration|days|weeks|timeline|period)/i.test(lc)) this.collectedFields.duration = text;
      if (!this.collectedFields.cta && /(cta|call to action|link|url|meeting|book|schedule)/i.test(lc)) this.collectedFields.cta = text;
    },

    checkWizardComplete() {
      this.wizardComplete = Object.values(this.collectedFields).every(Boolean);
      if (this.wizardComplete && !this.conversationCompleted) {
        this.completeConversation('All fields collected');
        this.messages.push({
          type: 'agent',
          text: '✅ All campaign details collected!\n' + this.renderSummary()
        });
      }
    },

    renderSummary() {
      return Object.entries(this.collectedFields)
        .map(([k, v]) => `${k}: ${v || '[not provided]'}`)
        .join('\n');
    },

    async initializeConversation() {
      const agentInstanceId = this.$store.state.campaignV2.campaign.agentInstanceId
      
      console.log('[ConversationalWizard] Initializing conversation with AI-generated first question', {
        agentInstanceId
      })
      
      if (!agentInstanceId) {
        console.warn('[ConversationalWizard] No agentInstanceId found, AI mode disabled')
        this.useAI = false
        this.isTyping = false
        return
      }

      try {
        console.log('[ConversationalWizard] Requesting AI to generate first question based on Step 1 and Step 2 context')
        
        // Request backend to generate AI-powered first question
        const { data } = await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').AGENT_CONVERSE,
          variables: {
            agentInstanceId: agentInstanceId,
            message: 'INIT', // Special marker - backend will generate first question
            conversationId: null, // First message, no conversation yet
          },
        })

        console.log('[ConversationalWizard] AGENT_CONVERSE response:', data)

        // Extract conversationId and first question from response
        if (data && data.agentConverse && data.agentConverse.conversationId) {
          this.conversationId = data.agentConverse.conversationId
          this.useAI = true
          
          // Backend now returns the first question immediately (no polling needed!)
          const firstQuestion = data.agentConverse.text
          
          console.log('[ConversationalWizard] ✅ Conversation initialized with first question', {
            conversationId: this.conversationId,
            success: data.agentConverse.success,
            hasQuestion: !!firstQuestion
          })
          
          // Display the first question immediately (tolerant parser)
          if (firstQuestion || data.agentConverse.wizardFrame) {
            this.pushAgentMessage(data.agentConverse)
          }
          
          this.isTyping = false
        } else {
          console.warn('[ConversationalWizard] ⚠️ No conversationId returned from backend', data)
          this.useAI = false
          this.isTyping = false
        }
      } catch (error) {
        console.error('[ConversationalWizard] ❌ Failed to initialize conversation:', {
          error: error.message,
          graphQLErrors: error.graphQLErrors,
          networkError: error.networkError
        })
        this.useAI = false
        this.isTyping = false
      }
    },

    

    updateCollectedFields(text) {
      if (!text) return;
      const lc = text.toLowerCase();
      // Crude regex/keyword checks (improve as needed)
      if (!this.collectedFields.goal && /(goal|main objective|primary aim|main purpose)/i.test(lc)) this.collectedFields.goal = text;
      if (!this.collectedFields.industry && /(industry|sector|field|business type)/i.test(lc)) this.collectedFields.industry = text;
      if (!this.collectedFields.audience && /(audience|target|customer|buyer|client)/i.test(lc)) this.collectedFields.audience = text;
      if (!this.collectedFields.region && /(region|market|location|country|area)/i.test(lc)) this.collectedFields.region = text;
      if (!this.collectedFields.valueProp && /(value prop|unique|differentiator|why choose|what makes)/i.test(lc)) this.collectedFields.valueProp = text;
      if (!this.collectedFields.channels && /(channel|email|whatsapp|sms|call|linkedin)/i.test(lc)) this.collectedFields.channels = text;
      if (!this.collectedFields.duration && /(duration|days|weeks|timeline|period)/i.test(lc)) this.collectedFields.duration = text;
      if (!this.collectedFields.cta && /(cta|call to action|link|url|meeting|book|schedule)/i.test(lc)) this.collectedFields.cta = text;
    },

    checkWizardComplete() {
      // If all fields are filled, set wizardComplete
      this.wizardComplete = Object.values(this.collectedFields).every(Boolean);
      if (this.wizardComplete && !this.conversationCompleted) {
        this.completeConversation('All fields collected');
        // Show summary bubble
        this.messages.push({
          type: 'agent',
          text: '✅ All campaign details collected!\n' + this.renderSummary()
        });
      }
    },

    renderSummary() {
      return Object.entries(this.collectedFields)
        .map(([k, v]) => `${k}: ${v || '[not provided]'}`)
        .join('\n');
    },

    async sendMessage() {
      if (!this.userInput.trim() || this.isTyping) return

      const userResponse = this.userInput
      this.userInput = ''
      
      // Reset textarea height after sending
      this.$nextTick(() => {
        this.autoResizeTextarea()
      })

      console.log('[ConversationalWizard] User sent message', {
        questionIndex: this.currentQuestionIndex,
        messageLength: userResponse.length,
        useAI: this.useAI,
        conversationId: this.conversationId
      })

      // Add user message to chat
      this.messages.push({
        type: 'user',
        text: userResponse
      })

      // Save to store
      this.$store.dispatch('campaignV2/updateCampaign', {
        [`wizardAnswer${this.currentQuestionIndex + 1}`]: userResponse,
      })

      // Update local field tracker
      this.updateCollectedFields(userResponse)
      this.checkWizardComplete()

      // Scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      this.isTyping = true
      this.currentQuestionIndex++

      

      try {
        const agentInstanceId = this.$store.state.campaignV2.campaign.agentInstanceId

        if (this.useAI && agentInstanceId && this.conversationId) {
          console.log('[ConversationalWizard] Sending message to AI', {
            agentInstanceId,
            conversationId: this.conversationId,
            questionNumber: this.currentQuestionIndex
          })

          // Send via GraphQL mutation and get immediate response (no polling!)
          const { data } = await this.$apollo.mutate({
            mutation: require('~/graphql/campaignV2/mutations').AGENT_CONVERSE,
            variables: {
              agentInstanceId: agentInstanceId,
              message: userResponse,
              conversationId: this.conversationId,
            },
          })

          console.log('[ConversationalWizard] Received immediate AI response', data)
          
          // Display the AI reply immediately (tolerant parser)
          if (data && data.agentConverse) {
            this.pushAgentMessage(data.agentConverse)
          }
          
          this.isTyping = false
        } else {
          console.warn('[ConversationalWizard] AI not available, using fallback', {
            useAI: this.useAI,
            agentInstanceId,
            conversationId: this.conversationId
          })

          // No AI available - just complete after max questions
          this.isTyping = false

          // Show a generic prompt if AI is not available (no auto-completion cap)
          this.messages.push({
            type: 'agent',
            text: 'Thank you for your response. Please continue...',
          })
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      } catch (error) {
        console.error('[ConversationalWizard] ❌ Agent converse error:', {
          error: error.message,
          graphQLErrors: error.graphQLErrors,
          networkError: error.networkError
        })
        this.isTyping = false
        this.$notify({
          group: 'main',
          type: 'error',
          text: error.message || 'Failed to send message',
        })
      }
    },

    renderMarkdown(text) {
    if (!text) return ''
    return md.render(text)
  },


    handleEnterKey(e) {
      // Shift+Enter for newline, Enter alone sends message
      if (!e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    },

    autoResizeTextarea() {
      const textarea = this.$refs.chatTextarea
      if (!textarea) return
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      
      // Set height based on content, with max height
      const maxHeight = 150 // max 150px height
      const newHeight = Math.min(textarea.scrollHeight, maxHeight)
      textarea.style.height = newHeight + 'px'
    },



    scrollToBottom() {
      const container = this.$refs.chatMessages
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    completeConversation(reason) {
      if (this.conversationCompleted) {
        console.log('[ConversationalWizard] Conversation already completed, ignoring')
        return
      }

      console.log('[ConversationalWizard] ✅ Completing conversation', { reason })
      
      this.conversationCompleted = true
      this.isTyping = false
      
      // Don't add hardcoded message - the agent's wizard_complete message
      // is already rendered with rich summary and structured data
      
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      
      // Emit completion event to parent after a short delay
      setTimeout(() => {
        console.log('[ConversationalWizard] Emitting wizard-completed event')
        this.$emit('wizard-completed')
      }, 1500)
    },

    

    renderRichText(text) {
      if (!text) return ''
      const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      let t = escape(text)
      t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      t = t.replace(/__([^_]+?)__/g, '<u>$1</u>')
      const lines = t.split(/\r?\n/)
      let inList = false
      const out = []
      for (const line of lines) {
        const m = line.match(/^\s*[-*]\s+(.*)/)
        if (m) {
          if (!inList) { out.push('<ul>'); inList = true }
          out.push('<li>' + m[1] + '</li>')
        } else {
          if (inList) { out.push('</ul>'); inList = false }
          if (line.trim() !== '') out.push('<p>' + line + '</p>')
        }
      }
      if (inList) out.push('</ul>')
      return out.join('')
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.conversational-wizard {
  height: 100%;
  min-height: calc(100vh - 180px); // ensures chat area stretches to viewport minus header chrome
  display: flex;
  flex-direction: column;
  position: relative;

  .chat-container {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: $white;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    min-height: 600px;

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      padding-bottom: 180px; // leave space so last message clears fixed composer

      .message-wrapper {
        margin-bottom: 20px;
        &:last-child { margin-bottom: 0; }
      }

      .message {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .avatar {
          width: 40px; height: 40px; border-radius: 50%;
          overflow: hidden; flex-shrink: 0; border: 4px solid $gray-200;
          img { width: 100%; height: 100%; object-fit: cover; }
        }

        .message-bubble {
          max-width: 70%;
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.5;
          position: relative;

          ul, ol {
            margin-left: 1.2rem;
            margin-top: 0.5rem;
          }

          li {
            margin-bottom: 0.3rem;
          }

          strong {
            font-weight: 600;
          }

          p {
            margin-bottom: 0.5rem;
          }
        }

        &.agent-message {
          .message-bubble {
            background: #def5f7;
            color: $gray-800;
            clip-path: polygon(0% 50%, 3% 0%, 100% 0%, 100% 100%, 3% 100%);
            
            &.wizard-frame {
              .reflect-text {
                font-size: 0.85rem;
                color: $gray-600;
                margin-bottom: 8px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              }
              
              .question-text {
                font-weight: 500;
                margin-bottom: 12px;
              }
              
              .suggestions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 12px;
                
                .suggestion-chip {
                  display: inline-block;
                  padding: 6px 12px;
                  background: rgba(255, 255, 255, 0.6);
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  border-radius: 16px;
                  font-size: 0.85rem;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  
                  &:hover {
                    background: rgba(255, 255, 255, 0.9);
                    border-color: $primary;
                    transform: translateY(-1px);
                  }
                }
              }
              
              .examples {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid rgba(0, 0, 0, 0.05);
                
                small {
                  color: $gray-600;
                  font-size: 0.8rem;
                }
              }
            }
            
            &.wizard-complete {
              .completion-text {
                font-weight: 500;
                margin-bottom: 12px;
              }
              
              .summary {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                
                pre {
                  background: rgba(0, 0, 0, 0.05);
                  padding: 8px;
                  border-radius: 4px;
                  font-size: 0.8rem;
                  overflow-x: auto;
                }
              }
            }
          }

          .typing-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-style: italic;
            color: $gray-600;

            .thinking-dots {
              display: inline-flex;
              gap: 4px;

              span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: $gray-500;
                opacity: 0.3;
                animation: thinkingDots 1.4s infinite ease-in-out;

                &:nth-child(2) {
                  animation-delay: 0.2s;
                }

                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }
          }

          &.streaming { opacity: 0.95;
            .cursor { display: inline-block; margin-left: 2px; animation: blink 1s infinite; font-weight: bold; color: $primary; }
          }
        }

        &.user-message {
          justify-content: flex-end;
          margin: 30px 0;
          .message-bubble {
            background: #f5f5f5; color: $gray-800;
            clip-path: polygon(0% 0%, 97% 0%, 100% 50%, 97% 100%, 0% 100%);
          }
        }
      }
    }

    .chat-input-wrapper {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 20px; background: $white; border-top: 1px solid #e5e5e5;
      display: flex; gap: 12px; align-items: center; z-index: 10;

      .chat-input {
        flex: 1;
        padding: 12px 18px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-size: 0.95rem;
        outline: none;
        transition: all 0.2s ease;
        resize: none;
        overflow-y: auto;
        min-height: 44px;
        max-height: 150px;
        line-height: 1.5;
        font-family: inherit;

        &::placeholder {
          color: $gray-800;
        }

        &:focus {
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }

        &:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        /* Custom scrollbar for textarea */
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background: #d0d0d0;
          border-radius: 3px;

          &:hover {
            background: #b0b0b0;
          }
        }
      }

      .send-button {
        padding: 12px 24px; background: transparent; border: 1px solid $gray-400; border-radius: 8px;
        color: $gray-800; font-size: 0.95rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease;
        display: flex; align-items: center; gap: 8px; outline: none;

        .icon { font-size: 0.9rem;
          svg { fill: none !important; stroke: currentColor !important;
            * { fill: none !important; stroke: currentColor !important; }
          }
        }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
        &:hover:not(:disabled) { background: $gray-100; border-color: $gray-500; }
      }
    }
  }
}

@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }

@keyframes thinkingDots {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  40% {
    transform: translateY(-3px);
    opacity: 1;
  }
}
</style>
