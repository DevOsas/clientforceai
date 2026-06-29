<template>
  <div class="form-preview-page">
    <div v-if="liveFields && liveFields.length > 0" class="form-container">
      <div v-if="!showSuccess" class="form-content">
        <h3 v-if="liveConfig && liveConfig.title" class="form-title">
          {{ liveConfig.title }}
        </h3>
        <p v-if="liveConfig && liveConfig.description" class="form-description">
          {{ liveConfig.description }}
        </p>

        <b-form @submit.prevent="handleSubmit">
          <div
            v-for="(field, index) in liveFields"
            :key="`field-${index}`"
            class="form-field mb-3"
          >
            <b-form-group
              :label="field.label"
              :label-for="`field-${index}`"
              :description="field.description"
            >
              <!-- Text Input -->
              <b-form-input
                v-if="field.type === 'text' || field.type === 'email'"
                :id="`field-${index}`"
                v-model="formData[field.name]"
                :type="field.type"
                :placeholder="field.placeholderText"
                :required="field.required"
              />

              <!-- Textarea -->
              <b-form-textarea
                v-else-if="field.type === 'textarea'"
                :id="`field-${index}`"
                v-model="formData[field.name]"
                :placeholder="field.placeholderText"
                :required="field.required"
                rows="4"
              />

              <!-- Select -->
              <b-form-select
                v-else-if="field.type === 'select'"
                :id="`field-${index}`"
                v-model="formData[field.name]"
                :options="field.options || []"
                :required="field.required"
              />

              <!-- Checkbox -->
              <b-form-checkbox
                v-else-if="field.type === 'checkbox'"
                :id="`field-${index}`"
                v-model="formData[field.name]"
                :required="field.required"
              >
                {{ field.label }}
              </b-form-checkbox>
            </b-form-group>
          </div>

          <b-button
            type="submit"
            variant="primary"
            :disabled="submitting"
            block
          >
            <b-spinner v-if="submitting" small class="mr-1" />
            {{ (liveConfig && liveConfig.submitButtonText) || 'Submit' }}
          </b-button>
        </b-form>
      </div>

      <div v-else class="success-message text-center py-5">
        <h3>{{ (liveConfig && liveConfig.successHeading) || 'Thank You!' }}</h3>
        <p>{{ (liveConfig && liveConfig.successText) || 'Your form has been submitted successfully.' }}</p>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="preview-placeholder">
        <SvgIcon name="forms" class="icon-large mb-3" />
        <h4>Form Preview</h4>
        <p class="text-muted">
          This page is used for previewing forms.<br />
          Create or edit a form to see the preview.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormPreviewIndexPage',
  layout: 'blank',
  auth: false, // Public route - no authentication required

  data() {
    return {
      liveFields: null,
      liveConfig: null,
      formData: {},
      submitting: false,
    }
  },

  computed: {
    showSuccess() {
      return this.liveConfig && this.liveConfig.isShowSuccess
    },
  },

  mounted() {
    this.setupMessageListener()
  },

  beforeDestroy() {
    window.removeEventListener('message', this.handleParentMessage)
  },

  methods: {
    setupMessageListener() {
      window.addEventListener('message', this.handleParentMessage)

      // Notify parent that preview is ready
      if (window.parent !== window) {
        window.parent.postMessage({
          source: 'cf-form',
          ready: true,
        }, '*')
      }
    },

    handleParentMessage(event) {
      if (event.data && event.data.fields) {
        this.liveFields = event.data.fields
      }

      if (event.data && event.data.config) {
        this.liveConfig = event.data.config
      }
    },

    async handleSubmit() {
      this.submitting = true
      try {
        console.log('Form submitted:', this.formData)

        // Show success message
        if (this.liveConfig) {
          this.liveConfig.isShowSuccess = true
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          this.formData = {}
          if (this.liveConfig) {
            this.liveConfig.isShowSuccess = false
          }
        }, 3000)
      } catch (error) {
        console.error('Error submitting form:', error)
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.form-preview-page {
  min-height: 100vh;
  padding: 20px;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.form-container {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.form-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.form-field {
  margin-bottom: 20px;
}

.success-message {
  h3 {
    color: #28a745;
    margin-bottom: 15px;
  }

  p {
    color: #666;
  }
}

.preview-placeholder {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  .icon-large {
    font-size: 64px;
    color: #6c757d;
  }

  h4 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    margin-bottom: 0;
    font-size: 14px;
  }
}
</style>
