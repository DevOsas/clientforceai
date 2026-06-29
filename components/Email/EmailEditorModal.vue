<template>
  <b-modal
    id="EmailEditorModal"
    size="xl"
    modal-class="email-editor-modal"
    hide-header
    hide-footer
    centered
    @hide="handleOnHide"
  >
    <template #default="{ hide }">
      <b-button variant="link" class="close-btn" @click="hide()">
        <SvgIcon name="close" />
      </b-button>

      <b-row>
        <b-col md="9" class="editor-col">
          <b-form-input
            v-model="form.subject"
            size="lg"
            :placeholder="subjectPlaceholder"
            class="email-subject-input"
            autofocus
          />

          <EmailEditor
            :value="nl2br(form.body)"
            placeholder="Write some dazzling email ..."
            @input="form.body = $event"
          />

          <div class="d-flex justify-content-end mt-5">
            <div>
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
                <b-spinner v-if="busy" small />
                Continue
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
  },

  data() {
    return {
      form: new this.$form({
        subject: this.formData.subject,
        body: this.formData.body,
      }),
      emailQuality: null,
    }
  },

  computed: {
    subjectPlaceholder() {
      return this.isFirstStep
        ? 'Subject'
        : 'You can leave subject empty to answer in the same thread'
    },

    canContinue() {
      return this.isFirstStep
        ? !this.busy && this.form.subject && this.form.body
        : !this.busy && this.form.body
    },
  },

  watch: {
    formData(data) {
      this.form.keys().forEach((key) => {
        if (data[key]) {
          this.form[key] = data[key]
        }
      })
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
      this.$emit('save', this.form.data())
    },

    handleOnHide() {
      if (typeof this.form.reset === 'function') {
        this.form.reset()
      }
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
.email-editor-modal {
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
  }

  .response-chance-col {
    margin: 80px 40px 0;
    padding: 0;
  }
}
</style>
