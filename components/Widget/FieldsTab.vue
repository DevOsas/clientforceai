<template>
  <div class="fields-tab">
    <!-- Left: Fields Section -->
    <div class="fields-section">
      <div class="fields-card">
        <h2 class="section-title">Fields</h2>

        <!-- Fields Table -->
        <div class="fields-table">
          <div class="table-header">
            <div class="col-field">Field</div>
            <div class="col-type">Type</div>
            <div class="col-required">Required</div>
            <div class="col-validation">Validation</div>
            <div class="col-map">Map to CRM</div>
          </div>

          <div class="table-row" v-for="field in fields" :key="field.name">
            <div class="col-field">{{ field.name }}</div>
            <div class="col-type">{{ field.type }}</div>
            <div class="col-required">
              <SvgIcon v-if="field.required" name="check" class="check-icon" />
            </div>
            <div class="col-validation">{{ field.validation }}</div>
            <div class="col-map">{{ field.mapToCRM }}</div>
          </div>
        </div>

        <!-- Consents & Opt-Ins -->
        <div class="consents-section">
          <h3 class="consents-title">Consents & Opt-Ins</h3>

          <div class="consent-row">
            <span class="consent-label">Email Marketing Consents</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="emailConsent" />
              <span class="toggle-slider"></span>
            </label>
            <span class="consent-label">Whatsapp Opt-In</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="whatsappOptIn" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="consent-row">
            <span class="consent-label">Phone & SMS Consents</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="smsConsent" />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="consent-text-group">
            <label class="consent-text-label">Consent Text</label>
            <input
              type="text"
              class="consent-text-input"
              v-model="consentText"
              placeholder="(GDPR/CASL, Compliant)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Live Preview Section -->
    <div class="preview-section">
      <div class="preview-card">
        <h2 class="preview-title">Live Preview</h2>

        <div class="preview-grid">
          <!-- Inline Form Preview -->
          <div class="preview-container inline-preview">
            <h3 class="preview-heading">Inline form Preview</h3>
            <div class="form-preview">
              <div class="form-field">
                <label>Name</label>
                <input type="text" readonly />
              </div>
              <div class="form-field">
                <label>Email</label>
                <input type="text" readonly />
              </div>
              <div class="form-field">
                <label>Phone</label>
                <input type="text" readonly />
              </div>
              <div class="form-field">
                <label>Company</label>
                <input type="text" readonly />
              </div>
              <div class="form-field">
                <label>Message</label>
                <textarea readonly rows="3"></textarea>
              </div>
              <button class="submit-btn">Submit</button>
            </div>
          </div>

          <!-- Chat Capture Preview -->
          <div class="preview-container chat-preview">
            <h3 class="preview-heading">Chat Capture preview</h3>
            <div class="chat-form-preview">
              <p class="chat-prompt">Can i get your email and phone?</p>
              <div class="chat-field">
                <label>Name</label>
                <input type="text" readonly />
              </div>
              <div class="chat-field">
                <label>Phone</label>
                <input type="text" readonly />
              </div>
              <button class="connect-btn">Connect</button>
            </div>
          </div>
        </div>

        <!-- Sparkles Icon -->
        <div class="preview-sparkles">
          <SvgIcon name="sparkles" size="lg" class="sparkles-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldsTab',

  data() {
    return {
      fields: [
        {
          name: 'Name',
          type: 'Text',
          required: true,
          validation: 'min chars',
          mapToCRM: 'Lead.name'
        },
        {
          name: 'Email',
          type: 'Email',
          required: true,
          validation: 'Must be valid',
          mapToCRM: 'Lead.name'
        },
        {
          name: 'Phone',
          type: 'Phone',
          required: true,
          validation: 'Must be valid',
          mapToCRM: 'Lead.name'
        }
      ],
      emailConsent: true,
      whatsappOptIn: false,
      smsConsent: true,
      consentText: '(GDPR/CASL, Compliant)'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.fields-tab {
  display: grid;
  grid-template-columns: 550px 1fr;
  gap: 32px;
}

// Fields Section
.fields-section {
  .fields-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 32px;

    .section-title {
      font-size: 1.1rem;
      font-weight: 400;
      color: #000;
      padding-bottom: 24px;
      margin: 0;
    }
  }

  .fields-table {
    margin-bottom: 32px;

    .table-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1.2fr 1.2fr;
      gap: 12px;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 8px 8px 0 0;
      border: 1px solid #e5e5e5;
      border-bottom: none;

      > div {
        font-size: 0.85rem;
        font-weight: 600;
        color: #6b7280;
      }
    }

    .table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1.2fr 1.2fr;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e5e5e5;
      border-top: none;
      background: #fff;

      &:last-child {
        border-radius: 0 0 8px 8px;
      }

      > div {
        font-size: 0.9rem;
        color: #2f2f41;
        display: flex;
        align-items: center;
      }

      .col-required {
        justify-content: flex-start;

        .check-icon {
          width: 18px;
          height: 18px;
          color: $primary;
        }
      }
    }
  }

  .consents-section {
    padding-top: 32px;
    border-top: 1px solid #e5e5e5;

    .consents-title {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 20px 0;
    }

    .consent-row {
      display: flex;
      // align-items: center;
      gap: 16px;
      margin-bottom: 20px;

      .consent-label {
        font-size: 0.9rem;
        color: #2f2f41;
        min-width: 180px;
      }

      .toggle-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
        flex-shrink: 0;

        input {
          opacity: 0;
          width: 0;
          height: 0;

          &:checked + .toggle-slider {
            background: $primary;
          }

          &:checked + .toggle-slider:before {
            transform: translateX(22px);
          }
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #d1d5db;
          border-radius: 34px;
          transition: 0.3s;

          &:before {
            content: '';
            position: absolute;
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background: #fff;
            border-radius: 50%;
            transition: 0.3s;
          }
        }
      }
    }

    .consent-text-group {
      margin-top: 24px;

      .consent-text-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 600;
        color: #000;
        margin-bottom: 10px;
      }

      .consent-text-input {
        width: 100%;
        padding: 12px 16px;
        font-size: 0.9rem;
        font-style: italic;
        color: #9ca3af;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        background: #fff;

        &:focus {
          outline: none;
          border-color: $primary;
        }
      }
    }
  }
}

// Preview Section
.preview-section {
  .preview-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 32px;
    position: relative;

    .preview-title {
      font-size: 1.1rem;
      font-weight: 400;
      color: #000;
      padding-bottom: 24px;
      margin: 0;
    }

    .preview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      align-items: start;
    }

    .preview-container {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      height: fit-content;

      .preview-heading {
        font-size: 0.85rem;
        font-weight: 400;
        color: #9ca3af;
        margin: 0;
        padding: 16px 20px;
      }
    }

    .form-preview {
      padding: 24px;

      .form-field {
        margin-bottom: 16px;

        &:last-of-type {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: #2f2f41;
          margin-bottom: 6px;
        }

        input,
        textarea {
          width: 100%;
          padding: 10px 12px;
          font-size: 0.9rem;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          background: #f9fafb;
          color: #9ca3af;

          &:focus {
            outline: none;
          }
        }

        textarea {
          resize: none;
        }
      }

      .submit-btn {
        width: 100%;
        padding: 12px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #fff;
        background: #000;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #333;
        }
      }
    }

    .chat-form-preview {
      padding: 24px;

      .chat-prompt {
        font-size: 0.95rem;
        color: #2f2f41;
        margin: 0 0 20px 0;
      }

      .chat-field {
        margin-bottom: 16px;

        &:last-of-type {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: #2f2f41;
          margin-bottom: 6px;
        }

        input {
          width: 100%;
          padding: 10px 12px;
          font-size: 0.9rem;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          background: #f9fafb;
          color: #9ca3af;

          &:focus {
            outline: none;
          }
        }
      }

      .connect-btn {
        width: 100%;
        padding: 12px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #fff;
        background: #000;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: #333;
        }
      }
    }

    .preview-sparkles {
      position: absolute;
      bottom: 28%;
      right: 32px;
      width: 52px;
      height: 52px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      .sparkles-icon {
        width: 24px;
        height: 24px;
        color: #000;
      }
    }
  }
}
</style>
