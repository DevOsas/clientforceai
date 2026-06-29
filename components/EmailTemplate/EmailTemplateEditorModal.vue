<template>
  <b-modal
    id="EmailTemplateEditorModal"
    size="xl"
    modal-class="email-template-editor-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHidden"
  >
    <template #default="{ hide }">
      <b-button variant="link" class="close-btn" @click="hide()">
        <SvgIcon name="close" />
      </b-button>

      <b-row>
        <b-col md="9" class="editor-col">
          <b-form-input
            v-model="form.title"
            size="lg"
            placeholder="Template name"
            class="email-subject-input"
            autofocus
          />

          <b-form-input
            v-model="form.subject"
            size="lg"
            placeholder="Email template subject"
            class="email-subject-input"
          />

          <EmailEditor
            v-model="form.body"
            placeholder="Email template body ..."
          />

          <div class="d-flex justify-content-end mt-5">
              <div v-if="limitBalance.templates > 0">
              <b-button
                variant="link"
                class="px-4 mr-3 text-muted"
                @click="hide()"
              >
                Cancel
              </b-button>
              <b-button
                variant="primary"
                class="px-4"
                pill
                :disabled="!canContinue"
                @click="handleContinue"
              >
                <b-spinner v-if="isbusy" small />
                Save a copy
              </b-button>
            </div>
            <div v-else-if="limitBalance && limitBalance.templates === 0">
              <p class="text-danger">You have reached your template limit. Please upgrade your plan.</p>
              <b-button variant="primary" to="/settings/billing">
                Upgrade Plan
              </b-button>
            </div>
          </div>
        </b-col>
        <b-col class="response-chance-col">
          <EmailResponseChanceMetrics :quality="emailQuality" />
        </b-col>
      </b-row>
    </template>
  </b-modal>
</template>

<script>
import { debounce } from 'lodash'
import EmailEditor from '~/components/Email/Editor/EmailEditor'
import EmailResponseChanceMetrics from '~/components/Email/EmailResponseChanceMetrics'
import { COPY_EMAIL_TEMPLATE_MUTATION } from '~/graphql/email-template/mutations'
import { EMAIL_TEMPLATES_QUERY } from '~/graphql/email-template/queries'
import { GET_EMAIL_QUALITY_QUERY } from '~/graphql/email/queries'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

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
    category: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isbusy: false,
      form: new this.$form({
        id: this.formData ? this.formData.id : 0,
        title: this.formData ? this.formData.title : '',
        subject: this.formData ? this.formData.subject : '',
        body: this.formData ? this.formData.body : '',
      }),
      emailQuality: null,
      limitBalance: {},
    }
  },

  apollo: {
    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
  },

  computed: {
    canContinue() {
      return this.form.title && this.form.subject && this.form.body
    },
  },

  watch: {
    formData(data) {
      if (data) {
        this.form.keys().forEach((key) => {
          if (data[key]) {
            this.form[key] = data[key]
          }
        })
      }
    },

    'form.subject'() {
      this.getEmailQuality()
    },

    'form.body'() {
      this.getEmailQuality()
    },
  },

  methods: {
    handleContinue() {
      this.isbusy = true
      this.$apollo
        .mutate({
          mutation: COPY_EMAIL_TEMPLATE_MUTATION,
          variables: {
            category: 'personal',
            ...this.form.data(),
          },

          update: (store, { data: { saveEmailTemplate } }) => {
            const data = store.readQuery({
              query: EMAIL_TEMPLATES_QUERY,
              variables: {
                category: this.category,
              },
            })

            if (this.formData.id === 0) {
              data.emailTemplate.push(saveEmailTemplate)
            }

            store.writeQuery({
              query: EMAIL_TEMPLATES_QUERY,
              variables: {
                category: this.categoryId,
              },
              data,
            })
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            text: 'Template saved successfully.',
          })
        })
        .catch(({ graphQLErrors }) => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            text: 'An error occurred while processing your request',
          })
        })
        .finally(() => {
          this.form.reset()
          this.isbusy = false
          this.$bvModal.hide('EmailTemplateEditorModal')
        })
      this.$emit('save', this.form.data())
    },

    handleOnHidden() {
      if (typeof this.form.reset === 'function') {
        this.form.reset()
      }

      this.$emit('closed')
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
.email-template-editor-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 20px 50px 40px;
  }

  .close-btn {
    font-size: 32px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .editor-col {
    max-width: 788px;
    flex: 0 0 790px;

    .email-subject-input {
      background-color: transparent;
      border: 0;
      border-bottom: 1px solid $gray-500;
      margin-bottom: 20px;
      border-radius: 0;
      padding: 0;
      box-shadow: none;

      &::placeholder {
        color: #8f8f8f;
      }

      &:focus {
        border-color: $primary;
      }
    }

    .email-editor-input-wrap {
      background-color: $white;
      border-radius: 20px;
      box-shadow: 0 8px 24px -3px rgba(0, 0, 0, 0.1);
    }
  }

  .response-chance-col {
    margin: 80px 40px 0;
    padding: 0;

    .response-chance-header {
      margin-bottom: 45px;
      position: relative;

      h4 {
        font-size: 24px;
        color: $primary;
        margin-bottom: 0;
      }

      p {
        color: $gray-600;
      }

      &::after {
        content: url('~@/assets/images/long-arrow.svg');
        position: absolute;
        top: 45px;
        left: 0;
        height: 10px;
        width: 100px;
      }
    }
  }
}
</style>
