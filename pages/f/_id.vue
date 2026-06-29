<template>
  <div class="form-embed-page">
    <div v-if="form" class="form-container">
      <div v-if="!submitted" class="form-content">
        <h3 v-if="form.title" class="form-title">{{ form.title }}</h3>
        <p v-if="form.description" class="form-description">
          {{ form.description }}
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
            {{ form.submitButtonText || 'Submit' }}
          </b-button>
        </b-form>
      </div>

      <div v-else class="success-message text-center py-5">
        <div class="success-icon mb-3">✓</div>
        <h3>{{ form.successTitle || 'Thank You!' }}</h3>
        <p>{{ form.successMessage || 'Your form has been submitted successfully.' }}</p>
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
  name: 'FormEmbedPage',
  layout: 'blank',
  auth: false, // Public route - no authentication required

  data() {
    return {
      form: null,
      loading: true,
      submitting: false,
      submitted: false,
      formData: {},
    }
  },

  computed: {
    formFields() {
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
  },

  mounted() {
    this.loadForm()
    this.setupIframeMessaging()
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

    setupIframeMessaging() {
      // Listen for height requests from parent
      window.addEventListener('message', (event) => {
        if (event.data.type === 'REQUEST_HEIGHT') {
          this.sendHeight()
        }
      })

      // Send initial height
      this.$nextTick(() => {
        this.sendHeight()
      })

      // Watch for content changes and update height
      if (window.ResizeObserver) {
        const observer = new ResizeObserver(() => {
          this.sendHeight()
        })
        observer.observe(document.body)
      }
    },

    sendHeight() {
      if (window.parent !== window) {
        const height = document.body.scrollHeight
        window.parent.postMessage({
          type: 'FORM_RESIZE',
          height: height,
        }, '*')
      }
    },

    async handleSubmit() {
      this.submitting = true
      try {
        // For now, just show success message
        // TODO: Add mutation to save form submission
        console.log('Form submitted:', this.formData)

        // Show success message
        this.submitted = true

        // Update height after showing success message
        this.$nextTick(() => {
          this.sendHeight()
        })

        // Notify parent window if embedded in iframe
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'FORM_SUBMITTED',
            formId: this.form.id,
            data: this.formData,
          }, '*')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Error',
          text: 'Failed to submit form. Please try again.',
        })
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.form-embed-page {
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
  .success-icon {
    width: 60px;
    height: 60px;
    line-height: 60px;
    margin: 0 auto;
    background: #28a745;
    color: white;
    border-radius: 50%;
    font-size: 36px;
    font-weight: bold;
  }

  h3 {
    color: #28a745;
    margin-bottom: 15px;
  }

  p {
    color: #666;
  }
}
</style>
