<template>
  <b-modal
    id="EmailEditorModalV2"
    size="xl"
    modal-class="email-editor-modal-v2"
    hide-header
    hide-footer
    centered
    @hide="handleOnHide"
  >
    <template #default>
      <b-button variant="link" class="close-btn" @click="closeModal">
        <SvgIcon name="close" />
      </b-button>

      <div class="modal-layout">
        <!-- Left Sidebar - Action Types -->
        <div class="action-sidebar">
          <div
            v-for="action in actionTypes"
            :key="action.id"
            class="action-btn"
            :class="{ active: selectedAction === action.id }"
            @click="selectedAction = action.id"
          >
            <SvgIcon :name="action.icon" />
            <span>{{ action.label }}</span>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="editor-content">
          <!-- EMAIL VIEW -->
          <transition name="fade-slide" mode="out-in">
            <div v-if="selectedAction === 'email'" key="email-view" class="action-view">
              <!-- Top Section: Topbar + Subject -->
              <div class="editor-top-section">
              <!-- Top Bar -->
              <div class="editor-topbar">
                <div class="topbar-left">
                  <h4 class="topbar-title">Send emails</h4>
                  <b-form-select
                    v-model="sendMethod"
                    :options="sendMethods"
                    class="send-method-select"
                  />
                </div>
                <div class="topbar-right">
                  <span class="response-hint">Get +5% more replies on average by adding this step</span>
                </div>
              </div>

              <!-- Subject Input -->
              <div class="subject-section">
                <label class="subject-label">Subject:</label>
                <b-form-input
                  v-model="form.subject"
                  placeholder="Enter Email Subject"
                  class="subject-input"
                />
              </div>
            </div>

            <!-- Middle Section: Email Body + Metrics (side by side) -->
            <div class="editor-middle-section">
              <!-- Email Body Editor -->
              <div class="email-body-section">
                <EmailEditor
                  :value="nl2br(form.body)"
                  placeholder="Write your email content..."
                  @input="form.body = $event"
                />
              </div>

              <!-- Metrics Sidebar -->
              <div class="metrics-sidebar">
                <EmailResponseChanceMetrics :quality="emailQuality" />
              </div>
            </div>

            <!-- Bottom Section: Actions -->
            <div class="bottom-actions">
              <b-button variant="outline-dark" class="px-4" @click="closeModal">
                Cancel
              </b-button>
              <b-button
                variant="success"
                class="px-4 save-btn"
                :disabled="!canContinue"
                @click="save"
              >
                <SvgIcon name="plus-white" class="mr-2" />
                <b-spinner v-if="busy" small />
                Save
              </b-button>
              </div>
            </div>
          </transition>

          <!-- WHATSAPP VIEW -->
          <transition name="fade-slide" mode="out-in">
            <div v-if="selectedAction === 'whatsapp'" key="whatsapp-view" class="action-view">
              <!-- Top Section: Topbar -->
              <div class="editor-top-section">
                <div class="editor-topbar">
                  <div class="topbar-left">
                    <h4 class="topbar-title">Whatsapp</h4>
                  </div>
                  <div class="topbar-right">
                    <span class="response-hint">Get +5% more replies on average by adding this step</span>
                  </div>
                </div>
              </div>

              <!-- Middle Section -->
              <div class="editor-middle-section">
                <div class="whatsapp-left-section">
                  <!-- Message Title -->
                  <div class="form-group">
                    <label class="form-label">Message Title</label>
                    <b-form-input
                      v-model="whatsappForm.messageTitle"
                      placeholder="Initial Qualification Call"
                      class="form-input"
                    />
                  </div>

                  <!-- Message Template -->
                  <div class="form-group">
                    <label class="form-label">Message Template</label>
                    <b-form-textarea
                      v-model="whatsappForm.messageTemplate"
                      placeholder="Enter message template..."
                      rows="10"
                      class="form-textarea"
                    />
                    <b-button variant="outline-none" size="sm" class="variables-btn">
                      + Variables
                    </b-button>
                  </div>

                  <!-- Attachments -->
                  <div class="form-group">
                    <label class="form-label">Attachments</label>
                    <div class="toggle-option">
                      <span>Add image/file</span>
                      <b-form-checkbox
                        v-model="whatsappForm.addImageFile"
                        switch
                        class="custom-switch"
                      />
                    </div>
                    <div class="toggle-option">
                      <span>Add Button (Book Now / View Offer)</span>
                      <b-form-checkbox
                        v-model="whatsappForm.addButton"
                        switch
                        class="custom-switch"
                      />
                    </div>
                  </div>
                </div>

                <!-- Right: Message Preview & Settings -->
                <div class="whatsapp-right-section">
                  <!-- Message Preview -->
                  <div class="message-preview-section">
                    <h5 class="settings-title">Message Preview</h5>
                    <div class="preview-box">
                      <p class="preview-text">{{ whatsappForm.messageTemplate || 'Your message will appear here...' }}</p>
                    </div>
                  </div>

                  <!-- Sender Number -->
                  <div class="form-group">
                    <label class="form-label">Sender Number</label>
                    <div class="sender-number-input">
                      <b-form-input
                        v-model="whatsappForm.senderNumber"
                        placeholder="(+1) 3567 68686"
                        class="form-input"
                        readonly
                      />
                      <span class="verified-badge">Verified</span>
                    </div>
                  </div>

                  <!-- Follow up Rules -->
                  <div class="form-group">
                    <label class="form-label">Follow up Rules</label>
                    <div class="toggle-option">
                      <span>If message read, move to next step</span>
                      <b-form-checkbox
                        v-model="whatsappForm.moveToNextStep"
                        switch
                        class="custom-switch"
                      />
                    </div>
                    <div class="toggle-option">
                      <span>If not delivered, retry after 1 day</span>
                      <b-form-checkbox
                        v-model="whatsappForm.retryIfNotDelivered"
                        switch
                        class="custom-switch"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom Section: Actions -->
              <div class="bottom-actions">
                <b-button variant="outline-dark" class="px-4" @click="closeModal">
                  Cancel
                </b-button>
                <b-button
                  variant="success"
                  class="px-4 save-btn"
                  @click="save"
                >
                  <SvgIcon name="plus" class="mr-2" />
                  <b-spinner v-if="busy" small />
                  Save
                </b-button>
              </div>
            </div>
          </transition>

          <!-- CALL VIEW -->
          <transition name="fade-slide" mode="out-in">
            <div v-if="selectedAction === 'call'" key="call-view" class="action-view">
              <!-- Top Section: Topbar -->
              <div class="editor-top-section">
              <div class="editor-topbar">
                <div class="topbar-left">
                  <h4 class="topbar-title">Calls</h4>
                  <b-form-select
                    v-model="callType"
                    :options="callTypes"
                    class="send-method-select"
                  />
                </div>
                <div class="topbar-right">
                  <span class="response-hint">Get +5% more replies on average by adding this step</span>
                </div>
              </div>
            </div>

            <!-- Middle Section -->
            <div class="editor-middle-section">
              <!-- AI CALL VIEW -->
              <template v-if="callType === 'ai-call'">
                <div class="call-script-section">
                  <div class="form-group">
                    <label class="form-label">Script Name</label>
                    <b-form-input
                      v-model="callForm.scriptName"
                      placeholder="Initial Qualification Call"
                      class="form-input"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Call Script</label>
                    <b-form-textarea
                      v-model="callForm.script"
                      placeholder="Enter call script..."
                      rows="10"
                      class="form-textarea"
                    />
                    <b-button variant="outline-none" size="sm" class="variables-btn">
                      + Variables
                    </b-button>
                  </div>
                </div>

                <!-- Right: Call Settings -->
                <div class="call-settings-section">
                  <h5 class="settings-title">Call Settings</h5>

                  <!-- Voice Profile -->
                  <div class="form-group">
                    <label class="form-label">Voice Profile</label>
                    <b-form-select
                      v-model="callForm.voiceProfile"
                      :options="voiceProfiles"
                      class="form-select"
                    />
                  </div>

                  <!-- Tone -->
                  <div class="form-group">
                    <label class="form-label">Tone</label>
                    <b-form-select
                      v-model="callForm.tone"
                      :options="tones"
                      class="form-select"
                    />
                  </div>

                  <!-- Retry Options -->
                  <div class="form-group">
                    <label class="form-label">Retry Options</label>
                    <div class="toggle-option">
                      <span>Retry if no answer (after 1 day)</span>
                      <b-form-checkbox
                        v-model="callForm.retryEnabled"
                        switch
                        class="custom-switch"
                      />
                    </div>
                  </div>

                  <!-- Outcome Actions -->
                  <div class="form-group">
                    <label class="form-label">Outcome Actions</label>
                    <div class="toggle-option">
                      <span>Mark as qualified</span>
                      <b-form-checkbox
                        v-model="callForm.markAsQualified"
                        switch
                        class="custom-switch"
                      />
                    </div>
                    <div class="toggle-option">
                      <span>Move to booking step</span>
                      <b-form-checkbox
                        v-model="callForm.moveToBooking"
                        switch
                        class="custom-switch"
                      />
                    </div>
                    <div class="toggle-option">
                      <span>Stop sequence if successful</span>
                      <b-form-checkbox
                        v-model="callForm.stopSequence"
                        switch
                        class="custom-switch"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- MANUAL CALL VIEW -->
              <template v-if="callType === 'manual-call' && manualCallForm">
                <div class="call-script-section">
                  <div class="form-group">
                    <label class="form-label">Call Script</label>
                    <b-form-textarea
                      v-model="manualCallForm.script"
                      placeholder="Enter call script..."
                      rows="10"
                      class="form-textarea"
                    />
                    <b-button variant="outline-none" size="sm" class="variables-btn">
                      + Variables
                    </b-button>
                  </div>
                </div>

                <!-- Right: Reminder Settings -->
                <div class="call-settings-section">
                  <h5 class="settings-title">Reminder Settings</h5>

                  <!-- Assign to -->
                  <div class="form-group">
                    <label class="form-label">Assign to</label>
                    <b-form-select
                      v-model="manualCallForm.assignTo"
                      :options="assignToOptions"
                      class="form-select"
                    />
                  </div>

                  <!-- Reminder Timing -->
                  <div class="form-group">
                    <label class="form-label">Reminder Timing</label>
                    <b-form-select
                      v-model="manualCallForm.reminderTiming"
                      :options="reminderTimingOptions"
                      class="form-select"
                    />
                  </div>

                  <!-- Follow up Automation -->
                  <div class="form-group">
                    <label class="form-label">Follow up Automation</label>
                    <div class="toggle-option">
                      <span>Proceed to next step when completed</span>
                      <b-form-checkbox
                        v-model="manualCallForm.proceedToNextStep"
                        switch
                        class="custom-switch"
                      />
                    </div>
                    <div class="toggle-option">
                      <span>Send reminder if not completed in 2 days</span>
                      <b-form-checkbox
                        v-model="manualCallForm.sendReminder"
                        switch
                        class="custom-switch"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Bottom Section: Actions -->
            <div class="bottom-actions">
              <b-button variant="outline-dark" class="px-4" @click="closeModal">
                Cancel
              </b-button>
              <b-button variant="dark" class="px-4 mr-2">
                <SvgIcon name="eye" class="mr-2" />
                Preview Script
              </b-button>
              <b-button
                variant="success"
                class="px-4 save-btn"
                @click="save"
              >
                <SvgIcon name="plus" class="mr-2" />
                <b-spinner v-if="busy" small />
                Save
              </b-button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { debounce } from 'lodash'
import EmailEditor from '~/components/Email/Editor/EmailEditor'
import EmailResponseChanceMetrics from '~/components/Email/EmailResponseChanceMetrics'

import { GET_EMAIL_QUALITY_QUERY } from '~/graphql/email/queries'

import { nl2br } from '~/utils/helpers'

export default {
  components: { EmailEditor, EmailResponseChanceMetrics },

  props: {
    busy: {
      type: Boolean,
      default: false,
    },

    isFirstStep: {
      type: Boolean,
      default: true,
    },

    formData: {
      type: Object,
      default: () => ({}),
    },

    channel: {
      type: String,
      default: 'email',
    },
  },

  data() {
    return {
      selectedAction: 'email',
      sendMethod: 'manually',
      callType: 'ai-call',
      form: new this.$form({
        subject: '',
        body: '',
      }),
      callForm: {
        scriptName: '',
        script: '',
        voiceProfile: 'agent-rita-female',
        tone: 'friendly',
        retryEnabled: false,
        markAsQualified: false,
        moveToBooking: false,
        stopSequence: false,
      },
      manualCallForm: {
        script: '',
        assignTo: 'agent-rita-female',
        reminderTiming: 'after-1-day',
        proceedToNextStep: true,
        sendReminder: false,
      },
      whatsappForm: {
        messageTitle: '',
        messageTemplate: '',
        addImageFile: true,
        addButton: true,
        senderNumber: '(+1) 3567 68686',
        moveToNextStep: true,
        retryIfNotDelivered: false,
      },
      emailQuality: null,
      actionTypes: [
        { id: 'email', label: 'Email', icon: 'email-alt' },
        { id: 'whatsapp', label: 'Whatsapp', icon: 'whatsapp' },
        { id: 'sms', label: 'SMS', icon: 'message' },
        { id: 'call', label: 'Call', icon: 'phone' },
        { id: 'linkedin', label: 'Linkedin', icon: 'linkedin' },
        { id: 'task', label: 'Task', icon: 'todo' },
      ],
      sendMethods: [
        { value: 'manually', text: 'Manually' },
        { value: 'automatic', text: 'Automatic' },
      ],
      callTypes: [
        { value: 'ai-call', text: 'AI Call' },
        { value: 'manual-call', text: 'Manual Call' },
      ],
      voiceProfiles: [
        { value: 'agent-rita-female', text: 'Agent Rita (Voice: Female)' },
        { value: 'agent-john-male', text: 'Agent John (Voice: Male)' },
      ],
      tones: [
        { value: 'friendly', text: 'Friendly' },
        { value: 'professional', text: 'Professional' },
        { value: 'casual', text: 'Casual' },
      ],
      assignToOptions: [
        { value: 'agent-rita-female', text: 'Agent Rita (Voice: Female)' },
        { value: 'agent-john-male', text: 'Agent John (Voice: Male)' },
      ],
      reminderTimingOptions: [
        { value: 'after-1-day', text: 'After 1 day' },
        { value: 'after-2-days', text: 'After 2 days' },
        { value: 'after-3-days', text: 'After 3 days' },
        { value: 'after-1-week', text: 'After 1 week' },
      ],
    }
  },

  computed: {
    canContinue() {
      return this.isFirstStep
        ? !this.busy && this.form.subject && this.form.body
        : !this.busy && this.form.body
    },
  },

  watch: {
    formData: {
      handler(data) {
        console.log('Modal received formData:', data)
        
        // Update email form
        if (data.subject !== undefined || data.body !== undefined) {
          this.form.keys().forEach((key) => {
            if (data[key] !== undefined) {
              this.form[key] = data[key]
            }
          })
        }
        
        // Update call form
        if (data.scriptName !== undefined || data.script !== undefined) {
          console.log('Updating call form with:', { scriptName: data.scriptName, script: data.script })
          if (data.scriptName !== undefined) this.callForm.scriptName = data.scriptName
          if (data.script !== undefined) {
            this.callForm.script = data.script
            this.manualCallForm.script = data.script
          }
        }
        
        // Update whatsapp form
        if (data.messageTitle !== undefined || data.messageTemplate !== undefined) {
          console.log('Updating whatsapp form with:', { messageTitle: data.messageTitle, messageTemplate: data.messageTemplate })
          if (data.messageTitle !== undefined) this.whatsappForm.messageTitle = data.messageTitle
          if (data.messageTemplate !== undefined) this.whatsappForm.messageTemplate = data.messageTemplate
        }
      },
      immediate: true,
      deep: true,
    },

    channel: {
      handler(newChannel) {
        console.log('Modal received channel:', newChannel)
        this.selectedAction = newChannel || 'email'
      },
      immediate: true,
    },

    'form.subject'() {
      this.getEmailQuality()
    },

    'form.body'() {
      this.getEmailQuality()
    },
  },

  methods: {
    nl2br,

    handleContinue() {
      this.save()
    },

    save() {
      let dataToSave = {}
      
      // Prepare data based on selected channel
      if (this.selectedAction === 'email') {
        dataToSave = {
          channel: 'email',
          subject: this.form.subject,
          body: this.form.body,
        }
      } else if (this.selectedAction === 'call') {
        dataToSave = {
          channel: 'call',
          subject: this.callForm.scriptName || 'Call Script',
          body: this.callType === 'ai-call' ? this.callForm.script : this.manualCallForm.script,
          script: this.callType === 'ai-call' ? this.callForm.script : this.manualCallForm.script,
        }
      } else if (this.selectedAction === 'whatsapp') {
        dataToSave = {
          channel: 'whatsapp',
          subject: this.whatsappForm.messageTitle || 'WhatsApp Message',
          whatsapp: this.whatsappForm.messageTemplate,
          body: this.whatsappForm.messageTemplate,
        }
      } else if (this.selectedAction === 'linkedin') {
        dataToSave = {
          channel: 'linkedin',
          subject: 'LinkedIn Message',
          linkedin: this.form.body,
          body: this.form.body,
        }
      }
      
      console.log('Saving data:', dataToSave)
      this.$emit('save', dataToSave)
      this.closeModal()
    },

    closeModal() {
      this.$bvModal.hide('EmailEditorModalV2')
      this.resetForms()
    },

    resetForms() {
      // Reset email form
      if (typeof this.form.reset === 'function') {
        this.form.reset()
      }
      
      // Reset call forms
      this.callForm = {
        scriptName: '',
        script: '',
        voiceProfile: 'agent-rita-female',
        tone: 'friendly',
        retryEnabled: false,
        markAsQualified: false,
        moveToBooking: false,
        stopSequence: false,
      }
      
      this.manualCallForm = {
        script: '',
        assignTo: 'agent-rita-female',
        reminderTiming: 'after-1-day',
        proceedToNextStep: true,
        sendReminder: false,
      }
      
      // Reset whatsapp form
      this.whatsappForm = {
        messageTitle: '',
        messageTemplate: '',
        addImageFile: true,
        addButton: true,
        senderNumber: '(+1) 3567 68686',
        moveToNextStep: true,
        retryIfNotDelivered: false,
      }
    },

    handleOnHide() {
      this.resetForms()
    },

    getEmailQuality: debounce(function () {
      this.$apollo
        .mutate({
          mutation: GET_EMAIL_QUALITY_QUERY,
          variables: {
            subject: this.form.subject,
            body: this.form.body,
          },
        })
        .then(({ data }) => {
          this.emailQuality = data.getEmailQuality
        })
        .catch(() => {})
    }, 1000),
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-editor-modal-v2 {
  .modal-dialog {
    max-width: 1100px;
  }

  .modal-content {
    background-color: $white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border: 0;
    overflow: hidden;
   
  }

  .modal-body {
    padding: 0;
    border-radius: 20px;
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    font-size: 24px;
    color: $gray-600;
    padding: 8px;

    &:hover {
      color: $gray-800;
    }
  }

  .modal-layout {
    display: flex;
    height: 650px;
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.3s ease;
  }

  .fade-slide-enter {
    opacity: 0;
    transform: translateX(10px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }

  .action-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  // Left Sidebar 
  .action-sidebar {
    width: 180px;
    background: $white;
    border-right: 1px solid #efefef;
    padding: 24px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .action-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid $gray-300;
      background: $white;

      // svg {
      //   width: 20px;
      //   height: 20px;
      //   color: $gray-700;
      //   flex-shrink: 0;
      // }
       svg {
            width: 24px !important;
            height: 24px !important;
            fill: none !important;
            stroke: currentColor !important;

            * {
              fill: none !important;
              stroke: currentColor !important;
            }

            path,
            circle,
            rect,
            line,
            polyline,
            polygon {
              fill: none !important;
              stroke: currentColor !important;
            }
          }

      span {
        font-size: 0.85rem;
        color: #2f2f41;
        font-weight: 700;
      }

      &:hover {
        background: #f9f9f9;
      }
    }
  }

  // Main Editor Content
  .editor-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: $white;
  }

  // Top Section 
  .editor-top-section {
    padding: 24px 24px 0;
  }

  .editor-topbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;


    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .topbar-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: $gray-800;
        margin: 0;
      }

      .send-method-select {
        width: 160px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-size: 0.9rem;
        padding: 10px 36px 10px 16px;
        color: $gray-800;
        background-color: $white;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 12px;
        appearance: none;
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1.5;
        height: auto;

        &:hover {
          border-color: $gray-400;
          background-color: #fafafa;
        }

        &:focus {
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
          outline: none;
        }
      }
    }

    .topbar-right {
      .response-hint {
        font-size: 0.85rem;
        color: $gray-600;
      }
    }
  }

  .subject-section {
    .subject-label {
      font-size: 0.9rem;
      color: $gray-700;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .subject-input {
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 0.95rem;
      transition: all 0.2s ease;

      &:hover {
        border-color: $gray-400;
      }

      &:focus {
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }
    }
  }

  // Middle Section (Email Body + Metrics)
  .editor-middle-section {
    flex: 1;
    display: flex;
    gap: 0;
    padding: 24px;
    overflow: hidden;
    border-top: 1px solid #efefef;


    .email-body-section {
      flex: 1;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 14px;
      overflow-y: auto;
    }

    .metrics-sidebar {
      width: 300px;
      background: #fafafa;
      border-left: 1px solid #efefef;
      padding: 24px 20px;
      flex-shrink: 0;
      overflow-y: auto;
      margin-left: 24px;
    }
  }

  .bottom-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #efefef;

    .btn {
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .save-btn {
      background: $primary;
      border-color: $primary;
      color: #2f2f41;


      &:hover {
        background: darken($primary, 5%);
      }
    }
  }

  // Shared styles for Call and WhatsApp views
  .call-script-section,
  .whatsapp-left-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-x:scroll;

    .form-group {
      display: flex;
      flex-direction: column;

      .form-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 8px;
      }

      .form-input {
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 24px 16px;
        font-size: 0.95rem;
        transition: all 0.2s ease;

        &:hover {
          border-color: $gray-400;
        }

        &:focus {
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }
      }

      .form-textarea {
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 0.95rem;
        resize: vertical;
        transition: all 0.2s ease;

        &:hover {
          border-color: $gray-400;
        }

        &:focus {
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }
      }

      .variables-btn {
        align-self: flex-end;
        border-radius: 6px;
        font-size: 0.85rem;
        padding: 6px 14px;
        border-color: #e5e5e5;
        color: $gray-700;
        margin-top: -1rem;
        background: $white;

        &:hover {
          background: #f9f9f9;
          border-color: $gray-400;
        }
      }

      .toggle-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        margin-bottom: 8px;

        span {
          font-size: 0.9rem;
          color: $gray-700;
        }

        .custom-switch {
          margin: 0;
        }
      }
    }
  }

  .call-settings-section {
    width: 400px;
    border-left: 1px solid #efefef;
    padding: 24px 20px;
    flex-shrink: 0;
    overflow-y: auto;
    margin-left: 24px;

    .settings-title {
      font-size: 1rem;
      font-weight: 700;
      color: $gray-800;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 24px;

      .form-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 8px;
        display: block;
      }

      .form-select {
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 12px 36px 12px 16px;
        font-size: 0.9rem;
        background-color: $white;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 12px;
        appearance: none;
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1.5;
        height: auto;

        &:hover {
          border-color: $gray-400;
          background-color: #fafafa;
        }

        &:focus {
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
          outline: none;
        }
      }

      .toggle-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        margin-bottom: 8px;

        span {
          font-size: 0.9rem;
          color: $gray-700;
        }

        .custom-switch {
          margin: 0;
        }
      }
    }
  }

  .whatsapp-right-section {
    width: 400px;
    border-left: 1px solid #efefef;
    padding: 24px 20px;
    flex-shrink: 0;
    overflow-y: auto;
    margin-left: 24px;

    .message-preview-section {
      margin-bottom: 24px;

      .settings-title {
        font-size: 1rem;
        font-weight: 700;
        color: $gray-800;
        margin-bottom: 12px;
      }

      .preview-box {
        background: #f5f5f5;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 16px;
        min-height: 200px;

        .preview-text {
          font-size: 0.9rem;
          color: $gray-700;
          line-height: 1.6;
          white-space: pre-wrap;
          margin: 0;
        }
      }
    }

    .form-group {
      margin-bottom: 24px;

      .form-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 8px;
        display: block;
      }

      .sender-number-input {
        position: relative;

        .form-input {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 12px 16px;
          padding-right: 80px;
          font-size: 0.9rem;
          background: #fafafa;
          transition: all 0.2s ease;
        }

        .verified-badge {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.85rem;
          color: #10b981;
          font-weight: 600;
        }
      }

      .toggle-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        margin-bottom: 8px;

        span {
          font-size: 0.9rem;
          color: $gray-700;
        }

        .custom-switch {
          margin: 0;
        }
      }
    }
  }

  // Shared custom switch styles for all toggle switches
  .call-script-section,
  .whatsapp-left-section,
  .call-settings-section,
  .whatsapp-right-section {
    .form-group .toggle-option .custom-switch {
      .custom-control-label {
        &::before {
          width: 48px;
          height: 26px;
          border-radius: 13px;
          background-color: #e5e5e5;
          border: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        &::after {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: $white;
          top: 7px;
          left: -30px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
      }

      .custom-control-input:checked ~ .custom-control-label {
        &::before {
          background-color: $primary;
        }

        &::after {
          transform: translateX(22px);
        }
      }

      .custom-control-input:focus ~ .custom-control-label::before {
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }
    }
  }

  // Active state for action buttons
  .action-sidebar .action-btn.active {
    background: $primary;
    border-color: $primary;

    svg {
      color: #2f2f41;
    }

    span {
      color: #2f2f41;
    }
  }
}
</style>
