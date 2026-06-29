<template>
  <div class="wizard-progress-sidebar">
    <div class="sidebar-header">
      <h3>Campaign Setup Progress</h3>
      <button 
        v-if="showDiagnosticsToggle"
        @click="toggleDiagnostics" 
        class="diagnostics-toggle"
        :class="{ active: diagnosticsMode }"
      >
        <SvgIcon name="bug" />
      </button>
    </div>

    <!-- Progress Overview -->
    <div class="progress-overview">
      <div class="progress-stats">
        <span class="progress-count">{{ completedFields }}/{{ totalFields }}</span>
        <span class="progress-label">fields complete</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- Required Fields Checklist -->
    <div class="fields-checklist">
      <h4>Required Information</h4>
      <div 
        v-for="field in requiredFields" 
        :key="field.key"
        class="field-item"
        :class="{ complete: isFieldComplete(field.key), incomplete: !isFieldComplete(field.key) }"
      >
        <div class="field-icon">
          <SvgIcon :name="isFieldComplete(field.key) ? 'check-circle' : 'circle'" />
        </div>
        <div class="field-content">
          <div class="field-name">{{ field.label }}</div>
          <div v-if="!isFieldComplete(field.key) && field.hint" class="field-hint">
            {{ field.hint }}
          </div>
          
          <!-- Diagnostics: Show confidence -->
          <div v-if="diagnosticsMode && confidence[field.key] !== undefined" class="field-diagnostics">
            <span class="confidence-value">{{ Math.round(confidence[field.key] * 100) }}%</span>
            <div class="confidence-bar">
              <div class="confidence-fill" :style="{ width: (confidence[field.key] * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conversation Summary -->
    <div v-if="summary && Object.keys(summary).length > 0" class="conversation-summary">
      <h4>What We Know</h4>
      <div class="summary-items">
        <div v-if="summary.goal" class="summary-item">
          <strong>Goal:</strong> {{ summary.goal }}
        </div>
        <div v-if="summary.target_audience" class="summary-item">
          <strong>Audience:</strong> {{ summary.target_audience }}
        </div>
        <div v-if="summary.industries && summary.industries.length" class="summary-item">
          <strong>Industries:</strong> {{ summary.industries.join(', ') }}
        </div>
        <div v-if="summary.region" class="summary-item">
          <strong>Region:</strong> {{ summary.region }}
        </div>
        <div v-if="summary.value_proposition" class="summary-item">
          <strong>Value Prop:</strong> {{ summary.value_proposition }}
        </div>
      </div>
    </div>

    <!-- Diagnostics Panel (Admin Only) -->
    <div v-if="diagnosticsMode" class="diagnostics-panel">
      <h4>Diagnostics</h4>
      
      <div v-if="missingFields && missingFields.length" class="diagnostics-section">
        <strong>Missing/Unclear:</strong>
        <ul>
          <li v-for="(field, index) in missingFields" :key="index">{{ field }}</li>
        </ul>
      </div>
      
      <div v-if="lastFrameData" class="diagnostics-section">
        <strong>Last Frame Data:</strong>
        <pre>{{ JSON.stringify(lastFrameData, null, 2) }}</pre>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button @click="$emit('review-summary')" class="action-btn" :disabled="completedFields === 0">
        <SvgIcon name="eye" />
        Review Summary
      </button>
      <button @click="$emit('suggest-questions')" class="action-btn">
        <SvgIcon name="help-circle" />
        Suggest Questions
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WizardProgressSidebar',

  props: {
    confidence: {
      type: Object,
      default: () => ({})
    },
    summary: {
      type: Object,
      default: () => ({})
    },
    missingFields: {
      type: Array,
      default: () => []
    },
    lastFrameData: {
      type: Object,
      default: null
    },
    showDiagnosticsToggle: {
      type: Boolean,
      default: false // Only show for admins
    }
  },

  data() {
    return {
      diagnosticsMode: false,
      confidenceThreshold: 0.7, // Match backend threshold
      requiredFields: [
        { key: 'industry', label: 'Industry', hint: 'What industry are you targeting?' },
        { key: 'niche', label: 'Niche', hint: 'Specific market segment' },
        { key: 'goal', label: 'Campaign Goal', hint: 'What do you want to achieve?' },
        { key: 'offer', label: 'Offer', hint: 'What are you offering?' },
        { key: 'value_proposition', label: 'Value Proposition', hint: 'Why should they care?' },
        { key: 'channels', label: 'Channels', hint: 'Email, LinkedIn, etc.' },
        { key: 'duration_days', label: 'Duration', hint: 'How many days?' },
        { key: 'steps', label: 'Steps', hint: 'Number of touchpoints' },
        { key: 'cta_link', label: 'CTA Link', hint: 'Where should they go?' },
        { key: 'success_event', label: 'Success Event', hint: 'How do you measure success?' }
      ]
    }
  },

  computed: {
    completedFields() {
      return this.requiredFields.filter(field => this.isFieldComplete(field.key)).length
    },

    totalFields() {
      return this.requiredFields.length
    },

    progressPercentage() {
      return Math.round((this.completedFields / this.totalFields) * 100)
    }
  },

  methods: {
    isFieldComplete(fieldKey) {
      const conf = this.confidence[fieldKey]
      return conf !== undefined && conf >= this.confidenceThreshold
    },

    toggleDiagnostics() {
      this.diagnosticsMode = !this.diagnosticsMode
      this.$emit('diagnostics-toggled', this.diagnosticsMode)
    }
  }
}
</script>

<style scoped lang="scss">
.wizard-progress-sidebar {
  background: #f8f9fa;
  border-left: 1px solid #dee2e6;
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
  min-width: 320px;
  max-width: 380px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: #212529;
  }

  .diagnostics-toggle {
    background: transparent;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #e9ecef;
    }

    &.active {
      background: #0d6efd;
      border-color: #0d6efd;
      color: white;
    }
  }
}

.progress-overview {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .progress-stats {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.75rem;

    .progress-count {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0d6efd;
    }

    .progress-label {
      font-size: 0.875rem;
      color: #6c757d;
    }
  }

  .progress-bar-container {
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #0d6efd, #0dcaf0);
      transition: width 0.3s ease;
    }
  }
}

.fields-checklist {
  margin-bottom: 1.5rem;

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6c757d;
    margin-bottom: 0.75rem;
  }

  .field-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: white;
    border-radius: 6px;
    border: 1px solid #dee2e6;
    transition: all 0.2s;

    &.complete {
      border-color: #198754;
      background: #f0fdf4;

      .field-icon {
        color: #198754;
      }
    }

    &.incomplete {
      .field-icon {
        color: #adb5bd;
      }
    }

    .field-icon {
      flex-shrink: 0;
      font-size: 1.25rem;
    }

    .field-content {
      flex: 1;
      min-width: 0;

      .field-name {
        font-weight: 500;
        color: #212529;
        margin-bottom: 0.25rem;
      }

      .field-hint {
        font-size: 0.75rem;
        color: #6c757d;
        font-style: italic;
      }

      .field-diagnostics {
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #dee2e6;

        .confidence-value {
          font-size: 0.75rem;
          font-weight: 600;
          color: #0d6efd;
        }

        .confidence-bar {
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          margin-top: 0.25rem;
          overflow: hidden;

          .confidence-fill {
            height: 100%;
            background: #0d6efd;
            transition: width 0.3s ease;
          }
        }
      }
    }
  }
}

.conversation-summary {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6c757d;
    margin-bottom: 0.75rem;
  }

  .summary-items {
    .summary-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f3f5;
      font-size: 0.875rem;

      &:last-child {
        border-bottom: none;
      }

      strong {
        color: #495057;
        display: block;
        margin-bottom: 0.25rem;
      }
    }
  }
}

.diagnostics-panel {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;

  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #856404;
    margin-bottom: 0.75rem;
  }

  .diagnostics-section {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #856404;
    }

    ul {
      margin: 0;
      padding-left: 1.25rem;
      color: #856404;
    }

    pre {
      background: #fff;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      overflow-x: auto;
      max-height: 200px;
      overflow-y: auto;
    }
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #495057;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #f8f9fa;
      border-color: #0d6efd;
      color: #0d6efd;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
