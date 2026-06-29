<template>
  <div class="email-edit-modal-overlay" @click.self="$emit('close')">
    <div class="email-edit-modal">
      <div class="modal-header">
        <h3>Edit Email</h3>
        <button class="close-btn" @click="$emit('close')">
          <SvgIcon name="close-2" />
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="email-subject">Subject Line</label>
          <input
            id="email-subject"
            v-model="localDraft.subject"
            type="text"
            class="form-control"
            placeholder="Email subject"
          />
        </div>

        <div class="form-group">
          <label for="email-body">Email Body</label>
          <textarea
            id="email-body"
            v-model="localDraft.body"
            rows="18"
            class="form-control"
            placeholder="Email content..."
          ></textarea>
        </div>

        <div class="personalization-help">
          <strong>💡 Personalization Variables:</strong>
          <div class="variables">
            <code>{{FirstName}}</code>
            <code>{{Company}}</code>
            <code>{{Industry}}</code>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="preview-section">
          <h4>Preview with Sample Data</h4>
          <div class="preview-email">
            <div class="preview-subject">
              <strong>Subject:</strong> {{ replaceVariables(localDraft.subject) }}
            </div>
            <div class="preview-body">
              {{ replaceVariables(localDraft.body) }}
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">
          Cancel
        </button>
        <button class="btn-primary" @click="save">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailEditModal',

  props: {
    draft: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      localDraft: { ...this.draft },
    }
  },

  methods: {
    save() {
      this.$emit('save', this.localDraft)
    },

    replaceVariables(text) {
      if (!text) return ''
      return text
        .replace(/\{\{FirstName\}\}/g, 'John')
        .replace(/\{\{Company\}\}/g, 'Acme Corp')
        .replace(/\{\{Industry\}\}/g, 'SaaS')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.email-edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.email-edit-modal {
  background: $white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 30px;
    border-bottom: 1px solid #e5e5e5;

    h3 {
      font-size: 1.4rem;
      font-weight: 600;
      color: $gray-800;
      margin: 0;
    }

    .close-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: transparent;
      border: none;
      color: $gray-600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f5f5f5;
        color: $gray-800;
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 30px;

    .form-group {
      margin-bottom: 24px;

      label {
        display: block;
        font-size: 0.95rem;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 8px;
      }

      .form-control {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-size: 0.95rem;
        color: $gray-800;
        transition: all 0.2s ease;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }

        &::placeholder {
          color: $gray-400;
        }
      }

      textarea.form-control {
        resize: vertical;
        line-height: 1.6;
        min-height: 300px;
      }
    }

    .personalization-help {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 24px;

      strong {
        display: block;
        font-size: 0.9rem;
        color: $gray-800;
        margin-bottom: 12px;
      }

      .variables {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        code {
          padding: 6px 12px;
          background: $white;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-size: 0.85rem;
          color: $primary;
          font-family: 'Courier New', monospace;
        }
      }
    }

    .preview-section {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid #e5e5e5;

      h4 {
        font-size: 1.1rem;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 16px;
      }

      .preview-email {
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e5e5e5;

        .preview-subject {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e5e5;

          strong {
            font-weight: 600;
            color: $gray-700;
            margin-right: 8px;
          }

          color: $gray-800;
          font-size: 0.95rem;
        }

        .preview-body {
          color: $gray-700;
          font-size: 0.9rem;
          line-height: 1.7;
          white-space: pre-wrap;
        }
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 30px;
    border-top: 1px solid #e5e5e5;

    button {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;

      &.btn-secondary {
        background: #f5f5f5;
        color: $gray-700;

        &:hover {
          background: #e5e5e5;
        }
      }

      &.btn-primary {
        background: $primary;
        color: $white;

        &:hover {
          background: darken($primary, 5%);
        }
      }
    }
  }
}
</style>
