<template>
  <div class="form-preview-page">
    <div v-if="form || liveConfig" class="form-container">
      <div v-if="!showSuccess" class="form-content">
        <h3 v-if="computedTitle" class="form-title">{{ computedTitle }}</h3>
        <p v-if="computedDescription" class="form-description">
          {{ computedDescription }}
        </p>

        <b-form @submit.prevent="handleSubmit">
          <div
            v-for="(field, index) in formFields"
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
                :placeholder="field.placeholder"
                :required="field.required"
              />

              <!-- Textarea -->
              <b-form-textarea
                v-else-if="field.type === 'textarea'"
                :id="`field-${index}`"
                v-model="formData[field.name]"
                :placeholder="field.placeholder"
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
            {{ computedSubmitButtonText }}
          </b-button>
        </b-form>
      </div>

      <div v-else class="success-message text-center py-5">
        <h3>{{ computedSuccessTitle }}</h3>
        <p>{{ computedSuccessMessage }}</p>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-5">
      <b-spinner variant="primary" />
      <p class="mt-3">Loading form...</p>
    </div>

    <div v-else class="text-center py-5">
      <p>Form not found</p>
    </div>
  </div>
</template>

<script>
import { LEAD_FORM_BY_ID_QUERY } from '~/graphql/form/queries'

export default {
  name: 'FormPreviewPage',
  layout: 'blank',
  auth: false, // Public route - no authentication required

  data() {
    return {
      form: null,
      loading: true,
      submitting: false,
      formData: {},
      liveFields: null, // Live fields from parent editor
      liveConfig: null, // Live config from parent editor
    }
  },

  computed: {
    formFields() {
      // Use live fields if available (from parent editor), otherwise use saved fields
      if (this.liveFields) {
        return this.liveFields
      }

      if (!this.form || !this.form.fields) return []
      try {
        return typeof this.form.fields === 'string'
          ? JSON.parse(this.form.fields)
          : this.form.fields
      } catch (error) {
        console.error('Error parsing form fields:', error)
        return []
      }
    },

    formConfig() {
      // Use live config if available, otherwise use saved config
      if (this.liveConfig) {
        return this.liveConfig
      }

      if (!this.form || !this.form.config) return {}
      try {
        return typeof this.form.config === 'string'
          ? JSON.parse(this.form.config)
          : this.form.config
      } catch (error) {
        console.error('Error parsing form config:', error)
        return {}
      }
    },

    computedTitle() {
      return this.liveConfig?.title || this.form?.title || ''
    },

    computedDescription() {
      return this.liveConfig?.description || this.form?.description || ''
    },

    computedSubmitButtonText() {
      return this.liveConfig?.submitButtonText || this.form?.submitButtonText || 'Submit'
    },

    computedSuccessTitle() {
      return this.liveConfig?.successHeading || this.form?.successHeading || 'Thank You!'
    },

    computedSuccessMessage() {
      return this.liveConfig?.successText || this.form?.successText || 'Your form has been submitted successfully.'
    },

    showSuccess() {
      return this.liveConfig?.isShowSuccess || this.form?.isShowSuccess || false
    },
  },

  mounted() {
    this.loadForm()
    this.setupMessageListener()
  },

  beforeDestroy() {
    window.removeEventListener('message', this.handleParentMessage)
  },

  methods: {
    async loadForm() {
      try {
        const formId = this.$route.params.id

        const { data } = await this.$apollo.query({
          query: LEAD_FORM_BY_ID_QUERY,
          variables: { id: formId },
          fetchPolicy: 'network-only',
        })

        if (data && data.form) {
          this.form = data.form
        }
      } catch (error) {
        console.error('Error loading form:', error)
      } finally {
        this.loading = false
      }
    },

    setupMessageListener() {
      // Listen for updates from parent editor
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
      // Receive live updates from form editor
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
        } else if (this.form) {
          this.form.isShowSuccess = true
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          this.formData = {}
          if (this.liveConfig) {
            this.liveConfig.isShowSuccess = false
          } else if (this.form) {
            this.form.isShowSuccess = false
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
</style>
