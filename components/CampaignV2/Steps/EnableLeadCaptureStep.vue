<template>
  <div class="enable-lead-capture-step">
    <!-- Tabs Navigation -->
    <div class="tabs-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Widget Tab Content -->
    <div v-if="activeTab === 'widget'" class="tab-content">
      <div class="widget-header">
        <h3 class="widget-title">Widget List</h3>
        <b-button variant="outline-dark" class="add-widget-btn" @click="handleAddWidget">
          <SvgIcon name="plus" class="mr-2" />
          Add New Widget
        </b-button>
      </div>

      <div class="widget-list">
        <div v-for="widget in widgets" :key="widget.id" class="widget-card">
          <div class="widget-name-col">
            <span class="widget-name">{{ widget.name }}</span>
          </div>
          
          <div class="widget-code-col">
            <p class="widget-code">{{ widget.code }}</p>
            <b-button variant="outline-secondary" class="copy-btn" @click="copyCode(widget.code)">
              <SvgIcon name="copy" class="mr-1" />
              Copy
            </b-button>
          </div>
          
          <div class="widget-toggle-col">
            <b-form-checkbox 
              v-model="widget.enabled" 
              switch 
              class="custom-switch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Chrome Extension Tab Content -->
    <div v-if="activeTab === 'chrome-extension'" class="tab-content">
      <div class="chrome-extension-card">
        <div class="extension-header">
          <div class="extension-title-wrapper">
            <div class="chrome-icon">
             <SvgIcon name="chrome-alt" class="mr-2" />
            </div>
            <h3 class="extension-title">Chrome extension</h3>
          </div>
          <div class="extension-toggle">
            <b-form-checkbox 
              v-model="chromeExtensionEnabled" 
              switch 
              class="custom-switch"
            />
          </div>
        </div>

        <div class="extension-body">
          <p class="extension-description">Install our Chrome Extension on your computer</p>
          <b-button variant="outline-dark" class="install-btn" @click="handleInstallExtension">
            <SvgIcon name="install" />
            Install
          </b-button>
        </div>
      </div>
    </div>

    <!-- Lead Form Tab Content -->
    <div v-if="activeTab === 'lead-form'" class="tab-content">
      <div class="lead-forms-header">
        <h3 class="lead-forms-title">Lead Forms</h3>
        <b-button variant="outline-dark" class="add-form-btn" @click="handleAddForm">
          <SvgIcon name="plus" class="mr-2" />
          Add New Form
        </b-button>
      </div>

      <div class="lead-forms-grid">
        <div v-for="form in leadForms" :key="form.id" class="form-card">
          <div class="form-preview">
            <div class="browser-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="form-mockup">
              <div class="mockup-line long"></div>
              <div class="mockup-line medium"></div>
              <div class="mockup-line short"></div>
              <div class="mockup-line medium"></div>
              <b-button variant="primary" size="sm" class="mockup-btn">
                Learn more
              </b-button>
            </div>
          </div>
          <div class="form-footer">
            <span class="form-name">{{ form.name }}</span>
            <b-form-checkbox 
              v-model="form.enabled" 
              switch 
              class="custom-switch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Lead Finder Tab Content -->
    <div v-if="activeTab === 'lead-finder'" class="tab-content lead-finder-tab">
      <!-- Initial Lead Finder View -->
      <div v-if="!showSetupView" class="lead-finder-section">
        <h3 class="section-title">Rule And Filters</h3>

        <!-- Search Keywords -->
        <div class="form-group">
          <label class="form-label">Enter your search keywords</label>
          <b-form-input
            v-model="searchKeywords"
            placeholder="Add Keywords"
            class="keyword-input"
            @keyup.enter="addKeyword"
          />
          <div class="keywords-list">
            <span
              v-for="(keyword, index) in keywords"
              :key="index"
              class="keyword-tag"
            >
              {{ keyword }}
              <button class="remove-keyword" @click="removeKeyword(index)">
                <SvgIcon name="x" />
              </button>
            </span>
          </div>
        </div>

        <!-- Refine Query Dropdown -->
               <h3 class="refine-query">Refine your query</h3>


        <!-- Region and City -->
        <div class="form-row">
          <div class="form-group half-width">
            <label class="form-label">Region</label>
            <CustomSelect
              v-model="region"
              :options="regionOptions"
              placeholder="Select region"
            />
          </div>

          <div class="form-group half-width">
            <label class="form-label">City</label>
            <CustomSelect
              v-model="city"
              :options="cityOptions"
              placeholder="Select city"
            />
          </div>
        </div>

        <!-- Post Language and Post Age -->
        <div class="form-row">
          <div class="form-group half-width">
            <label class="form-label">Post Language</label>
            <CustomSelect
              v-model="postLanguage"
              :options="languageOptions"
              placeholder="Select language"
            />
          </div>

          <div class="form-group half-width">
            <label class="form-label">Post Age</label>
            <CustomSelect
              v-model="postAge"
              :options="postAgeOptions"
              placeholder="Select post age"
            />
          </div>
        </div>

        <!-- Setup Button -->
        <div class="setup-button-wrapper">
          <b-button
            
            class="setup-btn"
            @click="showSetupView = true"
          >
            Setup
          </b-button>
        </div>
      </div>

      <!-- Setup Lead Capture Automation View -->
      <div v-else class="lead-capture-automation">
        <div class="automation-grid">
          <!-- Left: Setup Rules -->
          <div class="rules-section">
            <div class="section-header">
              <h3 class="section-title">Setup lead Capture Automation</h3>
              <p class="section-subtitle">Define up to 3 search rules, the agent will automatically find & add new clients</p>
            </div>

            <div class="header-actions"> 
              <!-- Back Button -->
              <b-button
                variant="outline-dark"
                class="back-btn"
                @click="showSetupView = false"
              >
                <SvgIcon name="arrow-left" class="mr-2" />
                Back
              </b-button>
              
              <!-- Add New Rule Button -->
              <b-button
                v-if="captureRules.length < 3"
                variant="outline-dark"
                class="add-rule-btn"
                @click="addNewRule"
              >
                <SvgIcon name="plus" class="mr-2" />
                Add New Rule
              </b-button>
            </div>
            <!-- Rules List -->
            <div v-for="(rule, index) in captureRules" :key="index" class="rule-card">
              <div class="rule-header">
                <h4 class="rule-title">Rule {{ index + 1 }}</h4>
                <button v-if="captureRules.length > 1" class="remove-rule-btn" @click="removeRule(index)">
                  <SvgIcon name="close" />
                </button>
              </div>

              <div class="rule-form">
                <!-- Row 1: Keyword, Industry, Location -->
                <div class="form-row">
                  <div class="form-group">
                    <b-form-input
                      v-model="rule.keyword"
                      placeholder="Keyword"
                      class="rule-input"
                    />
                  </div>
                  <div class="form-group">
                    <CustomSelect
                      v-model="rule.industry"
                      :options="industryOptions"
                      placeholder="Industry"
                    />
                  </div>
                  <div class="form-group">
                    <CustomSelect
                      v-model="rule.location"
                      :options="locationOptions"
                      placeholder="Location"
                    />
                  </div>
                </div>

                <!-- Row 2: Radius, Distance, Leads/Run, Frequency -->
                <div class="form-row">
                  <div class="form-group small">
                    <CustomSelect
                      v-model="rule.radius"
                      :options="radiusOptions"
                      placeholder="Radius"
                    />
                  </div>
                  <div class="form-group small">
                    <CustomSelect
                      v-model="rule.distance"
                      :options="distanceOptions"
                      placeholder="10km"
                    />
                  </div>
                  <div class="form-group small">
                    <CustomSelect
                      v-model="rule.leadsPerRun"
                      :options="leadsPerRunOptions"
                      placeholder="10 Leads/Run"
                    />
                  </div>
                  <div class="form-group small">
                    <CustomSelect
                      v-model="rule.frequency"
                      :options="frequencyOptions"
                      placeholder="Weekly"
                    />
                  </div>
                </div>
              </div>
            </div>

          
          </div>

          <!-- Right: Sample Leads Preview -->
          <div class="preview-section">
            <h3 class="preview-title">Sample Leads Preview</h3>
            <div class="leads-table">
              <div class="table-row header-row">
                <div class="table-cell">Search Code</div>
                <div class="table-cell">CEO</div>
                <div class="table-cell">GrowthWave</div>
                <div class="table-cell">New York, USA</div>
              </div>
              <div v-for="i in 3" :key="i" class="table-row">
                <div class="table-cell">Sarah Cole</div>
                <div class="table-cell">CEO</div>
                <div class="table-cell">GrowthWave</div>
                <div class="table-cell">New York, USA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from '~/components/CampaignV2/CustomSelect'

export default {
  name: 'EnableLeadCaptureStep',
  
  components: {
    CustomSelect
  },

  mounted() {
    // Emit event to parent to control sidebar visibility
    this.$emit('toggle-sidebar', !this.showSetupView)
  },

  watch: {
    showSetupView(newVal) {
      // Hide sidebar when in setup view, show when in initial view
      this.$emit('toggle-sidebar', !newVal)
    }
  },

  data() {
    return {
      activeTab: 'lead-finder',
      chromeExtensionEnabled: false,
      showSetupView: false,
      tabs: [
        { id: 'lead-finder', label: 'Lead Finder' },
        { id: 'widget', label: 'Widget (Optional)' },
        { id: 'chrome-extension', label: 'Chrome Extension (Optional)' },
        { id: 'lead-form', label: 'Lead Form (Optional)' },
      ],
      widgets: [
        {
          id: 1,
          name: 'Widget Name',
          code: "function createWidget() { const widget = document.createElement('div'); widget.className = 'widget'; widget.innerHTML = '<h2>Widget</h2>'; document.body.appendChild(widget); }",
          enabled: true,
        },
        {
          id: 2,
          name: 'Widget Name 2',
          code: "function createWidget() { const widget = document.createElement('div'); widget.className = 'widget'; widget.innerHTML = '<h2>Widget</h2>'; document.body.appendChild(widget); }",
          enabled: false,
        },
        {
          id: 3,
          name: 'Widget Name',
          code: "function createWidget() { const widget = document.createElement('div'); widget.className = 'widget'; widget.innerHTML = '<h2>Widget</h2>'; document.body.appendChild(widget); }",
          enabled: true,
        },
      ],
      leadForms: [
        {
          id: 1,
          name: 'Lead form template 1',
          enabled: false,
        },
        {
          id: 2,
          name: 'Lead form template 1',
          enabled: false,
        },
        {
          id: 3,
          name: 'Lead form template 1',
          enabled: false,
        },
        {
          id: 4,
          name: 'Lead form template 1',
          enabled: false,
        },
      ],
      // Lead Finder Initial Form
      searchKeywords: '',
      keywords: [],
      refineQuery: '',
      region: '',
      city: '',
      postLanguage: '',
      postAge: '',
      // Dropdown Options
      refineQueryOptions: ['Exact match', 'Broad match', 'Phrase match'],
      regionOptions: ['World', 'Africa', 'Asia', 'Europe', 'North America', 'South America'],
      cityOptions: ['Word', 'Any'],
      languageOptions: ['English', 'Spanish', 'French', 'German', 'Any'],
      postAgeOptions: ['Any', 'Last 24 hours', 'Last week', 'Last month', 'Last year'],
      // Lead Capture Automation Rules
      captureRules: [
        {
          keyword: '',
          industry: '',
          location: '',
          radius: '',
          distance: '',
          leadsPerRun: '',
          frequency: ''
        }
      ],
      industryOptions: ['Technology', 'Healthcare', 'Finance', 'Real Estate', 'Education', 'Retail', 'Manufacturing'],
      locationOptions: ['New York, USA', 'Los Angeles, USA', 'London, UK', 'Paris, France', 'Tokyo, Japan'],
      radiusOptions: ['Radius', '5km', '10km', '25km', '50km', '100km'],
      distanceOptions: ['5km', '10km', '25km', '50km', '100km'],
      leadsPerRunOptions: ['5 Leads/Run', '10 Leads/Run', '20 Leads/Run', '50 Leads/Run', '100 Leads/Run'],
      frequencyOptions: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'],
    }
  },

  computed: {
    isLeadFinderFormValid() {
      return this.keywords.length > 0 && 
             this.refineQuery && 
             this.region && 
             this.city && 
             this.postLanguage && 
             this.postAge
    }
  },

  methods: {
    handleAddWidget() {
      console.log('Add new widget')
    },
    copyCode(code) {
      navigator.clipboard.writeText(code).then(() => {
        console.log('Code copied to clipboard')
      })
    },
    handleInstallExtension() {
      console.log('Install Chrome Extension')
      window.open('https://chrome.google.com/webstore', '_blank')
    },
    handleAddForm() {
      console.log('Add new form')
    },
    addKeyword() {
      if (this.searchKeywords.trim()) {
        this.keywords.push(this.searchKeywords.trim())
        this.searchKeywords = ''
      }
    },
    removeKeyword(index) {
      this.keywords.splice(index, 1)
    },
    addNewRule() {
      if (this.captureRules.length < 3) {
        this.captureRules.push({
          keyword: '',
          industry: '',
          location: '',
          radius: '',
          distance: '',
          leadsPerRun: '',
          frequency: ''
        })
      }
    },
    removeRule(index) {
      this.captureRules.splice(index, 1)
    }
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/variables.scss';

.enable-lead-capture-step {
  background: $white;

  .tabs-navigation {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #e5e5e5;
    margin-bottom: 32px;

    .tab-button {
      padding: 14px 24px;
      font-size: 0.95rem;
      font-weight: 500;
      color: $gray-600;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      bottom: -2px;

      &:hover {
        color: $gray-900;
        background: #f9f9f9;
      }

      &.active {
        color: $primary;
        border-bottom-color: $primary;
        font-weight: 600;
      }
    }
  }

  .tab-content {
    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .widget-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: $gray-900;
        margin: 0;
      }

      .add-widget-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        color: $gray-900;
        background: $white;
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
          background: #f9f9f9;
        }
      }
    }

    .widget-toggle-col .custom-switch {
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

    // Custom switch styles for both chrome extension and lead forms
    .chrome-extension-card .extension-header .extension-toggle .custom-switch,
    .lead-forms-grid .form-card .form-footer .custom-switch {
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

    // SVG styles - ordered by specificity (shortest path first)
    .widget-header .add-widget-btn svg {
      width: 16px;
      height: 16px;
    }

    .lead-forms-header .add-form-btn svg {
      width: 16px;
      height: 16px;
    }

    .chrome-extension-card .extension-body .install-btn svg {
      width: 16px;
      height: 16px;
    }

    .chrome-extension-card .extension-header .extension-title-wrapper .chrome-icon svg {
      width: 28px;
      height: 28px;
    }

    .widget-list .widget-card .widget-code-col .copy-btn svg {
      width: 13px;
      height: 13px;
    }

    .lead-finder-section .form-group .keywords-list .keyword-tag .remove-keyword svg {
      width: 14px;
      height: 14px;
    }

    .widget-list {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .widget-card {
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 28px 32px;
        display: grid;
        grid-template-columns: 180px 1fr 80px;
        gap: 32px;
        align-items: start;
        transition: all 0.2s ease;

        &:hover {
          border-color: $gray-400;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .widget-name-col {
          display: flex;
          align-items: flex-start;
          padding-top: 4px;

          .widget-name {
            font-size: 0.95rem;
            font-weight: 500;
            color: $gray-900;
          }
        }

        .widget-code-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 0;

          .widget-code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.85rem;
            color: $gray-600;
            line-height: 1.6;
            margin: 0;
          }

          .copy-btn {
            padding: 8px 12px;
            font-size: 0.8rem;
            font-weight: 500;
            border-radius: 6px;
            border: 1px solid #d0d0d0;
            color: $gray-700;
            background: $white;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            align-self: flex-start;

            &:hover {
              background: #f5f5f5;
              border-color: $gray-500;
            }
          }
        }

        .widget-toggle-col {
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          padding-top: 4px;
        }
      }
    }

    .chrome-extension-card {
      background: $white;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 28px 32px;
      max-width: 400px;

      .extension-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 1px solid #f0f0f0;

        .extension-title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;

          .chrome-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .extension-title {
            font-size: 1.15rem;
            font-weight: 600;
            color: $gray-900;
            margin: 0;
          }
        }

        .extension-toggle {
          display: flex;
          align-items: center;
        }
      }

      .extension-body {
        .extension-description {
          font-size: 0.95rem;
          color: $gray-700;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .install-btn {
          padding: 10px 24px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          color: $gray-900;
          background: $white;
          display: inline-flex;
          align-items: center;
          gap: 8px;

          &:hover {
            background: #f9f9f9;
            border-color: $gray-400;
          }
        }
      }
    }

    .lead-forms-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      .lead-forms-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: $gray-900;
        margin: 0;
      }

      .add-form-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        color: $gray-900;
        background: $white;
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
          background: #f9f9f9;
        }
      }
    }

    .lead-forms-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;

      .form-card {
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.2s ease;

        &:hover {
          border-color: $gray-400;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .form-preview {
          background: #f8f9fa;
          padding: 20px;
          min-height: 200px;
          display: flex;
          flex-direction: column;

          .browser-dots {
            display: flex;
            gap: 6px;
            margin-bottom: 16px;

            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;

              &.red {
                background-color: #ff5f57;
              }

              &.yellow {
                background-color: #ffbd2e;
              }

              &.green {
                background-color: #28ca42;
              }
            }
          }

          .form-mockup {
            background: $white;
            border-radius: 8px;
            padding: 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;

            .mockup-line {
              height: 8px;
              background: #e5e5e5;
              border-radius: 4px;

              &.long {
                width: 100%;
              }

              &.medium {
                width: 75%;
              }

              &.short {
                width: 50%;
              }
            }

            .mockup-btn {
              margin-top: auto;
              padding: 6px 16px;
              font-size: 0.75rem;
              font-weight: 600;
              border-radius: 6px;
              align-self: center;
            }
          }
        }

        .form-footer {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: $white;

          .form-name {
            font-size: 0.9rem;
            font-weight: 600;
            color: $gray-900;
          }
        }
      }
    }

    .lead-finder-section {
      max-width: 900px;

      .section-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: $gray-900;
        margin-bottom: 32px;
      }
      .refine-query{
        font-size: 1rem;
        font-weight: 700;
        color: $gray-900;
        margin-bottom: 32px;
      }

      .form-group {
        margin-bottom: 24px;

        &.half-width {
          flex: 1;
        }

        .form-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: $gray-900;
          margin-bottom: 10px;
        }

        .keyword-input {
          width: 100%;
          padding: 26px 16px;
          font-size: 0.95rem;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          transition: all 0.2s ease;

          &:focus {
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
            outline: none;
          }

          &::placeholder {
            color: #a0a0a0;
          }
        }

        .keywords-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;

          .keyword-tag {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #f0f7e8;
            color: $gray-900;
            font-size: 0.9rem;
            font-weight: 500;
            border-radius: 6px;

            .remove-keyword {
              background: none;
              border: none;
              padding: 0;
              cursor: pointer;
              display: flex;
              align-items: center;
              color: $gray-600;
              transition: color 0.2s ease;

              &:hover {
                color: $gray-900;
              }
            }
          }
        }

        .refine-select,
        .filter-select {
          width: 100%;
          padding: 14px 40px 14px 16px;
          font-size: 0.95rem;
          line-height: 1.6;
          height: 48px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          background: $white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E") no-repeat right 16px center;
          background-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          vertical-align: middle;
          display: flex;
          align-items: center;

          &:focus {
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
            outline: none;
          }

          &::-ms-expand {
            display: none;
          }

          option {
            padding: 10px;
            line-height: 1.6;
          }
        }
      }

      .form-row {
        display: flex;
        gap: 20px;
        margin-bottom: 24px;
      }

      .setup-button-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 40px;

        .setup-btn {
          padding: 12px 40px;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: $primary;
          color: #000;
          border: none;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }

    // Lead Capture Automation View
    .lead-capture-automation {
      .automation-grid {
        display: grid;
        grid-template-columns: 1fr 420px;
        gap: 40px;

        .rules-section {
          .section-header {
            margin-bottom: 30px;

            .section-title {
              font-size: 1.25rem;
              font-weight: 700;
              color: $gray-900;
              margin-bottom: 8px;
            }

            .section-subtitle {
              font-size: 0.9rem;
              color: $gray-600;
              margin: 0;
            }
          }

          .rule-card {
            // background: #f9f9f9;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;

            .rule-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;

              .rule-title {
                font-size: 1rem;
                font-weight: 600;
                color: $gray-900;
                margin: 0;
              }

              .remove-rule-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: $gray-500;
                transition: color 0.2s ease;

                &:hover {
                  color: $gray-900;
                }

                .icon {
                  width: 18px;
                  height: 18px;
                }
              }
            }

            .rule-form {
              .form-row {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-bottom: 12px;

                &:last-child {
                  grid-template-columns: repeat(4, 1fr);
                }

                .form-group {
                  &.small {
                    min-width: 0;
                  }
                }
              }

              .rule-input {
                width: 100%;
                padding: 24px 16px;
                font-size: 0.9rem;
                border: 2px solid #e5e5e5;
                border-radius: 8px;
                transition: all 0.2s ease;
                background: #f4f4f4;

                &:focus {
                  border-color: $primary;
                  box-shadow: 0 0 0 3px rgba($primary, 0.1);
                  outline: none;
                }

                &::placeholder {
                  color: #9ca3af;
                }
              }
            }
          }

          .header-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-bottom: 20px;

            .back-btn,
            .add-rule-btn {
              padding: 10px 20px;
              font-size: 0.95rem;
              font-weight: 600;
              border-radius: 8px;
              display: flex;
              align-items: center;
              gap: 8px;

              &:hover {
                color: white;

                .icon {
                  color: white;
                }
              }
            }
          }
        }

        .preview-section {
          .preview-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: $gray-900;
            margin-bottom: 20px;
          }

          .leads-table {
            background: $white;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            overflow: hidden;

            .table-row {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              border-bottom: 1px solid #e5e5e5;

              &:last-child {
                border-bottom: none;
              }

              &.header-row {
                background: #f9f9f9;

                .table-cell {
                  font-weight: 600;
                  color: $gray-900;
                }
              }

              .table-cell {
                padding: 16px;
                font-size: 0.9rem;
                color: $gray-700;
                border-right: 1px solid #e5e5e5;

                &:last-child {
                  border-right: none;
                }
              }
            }
          }
        }
      }
    }

    .placeholder-content {
      padding: 60px 20px;
      text-align: center;
      color: $gray-600;
      font-size: 1rem;
    }
  }
}
</style>
