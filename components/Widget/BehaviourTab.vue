<template>
  <div class="behaviour-tab">
    <!-- Left: Conversion & Logic Section -->
    <div class="conversion-section">
      <div class="conversion-card">
        <h2 class="section-title">Conversion & Logic</h2>

        <!-- Mode -->
        <div class="form-group mode-group">
          <div class="form-label-row">
            <label class="form-label">Mode:</label>
            <CustomSelect
              v-model="mode"
              :options="modeOptions"
              placeholder="Select mode"
            />
          </div>
        </div>

        <!-- Handoffs & Rules -->
        <div class="handoffs-section">
          <h3 class="handoffs-title">Handoffs & Rules</h3>

          <!-- Greeting Message -->
          <div class="form-group">
            <div class="form-label-second">
              <label class="form-label">Greeting message</label>
              <input
                type="text"
                v-model="greetingMessage"
                class="text-input"
                placeholder="Hi! Want a proposal or quick call?"
              />
            </div>
          </div>

          <!-- Tone and Goal -->
          <div class="form-row">
            <div class="form-col">
              <div class="form-label-row">
                <label class="form-label">Tone:</label>
                <CustomSelect
                  v-model="tone"
                  :options="toneOptions"
                  placeholder="Select tone"
                />
              </div>
            </div>
            <div class="form-col">
              <div class="form-label-row">
                <label class="form-label">Goal</label>
                <CustomSelect
                  v-model="goal"
                  :options="goalOptions"
                  placeholder="Select goal"
                />
              </div>
            </div>
          </div>

          <!-- Call back (voice agent) -->
          <div class="form-group">
            <div class="callback-row">
              <div class="callback-left">
                <div class="form-label-row">
                  <label class="form-label">Call back (voice agent)</label>
                  <CustomSelect
                    v-model="callbackAgent"
                    :options="callbackOptions"
                    placeholder="Select agent"
                  />
                </div>
              </div>
              <div class="callback-right">
                <span class="enable-label">Enable "Call me now"</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="enableCallMeNow" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Language and Respect Quiet Hours -->
          <div class="form-row">
            <div class="form-col">
              <div class="form-label-row">
                <label class="form-label">Language</label>
                <CustomSelect
                  v-model="language"
                  :options="languageOptions"
                  placeholder="Select language"
                />
              </div>
            </div>
            <div class="form-col">
              <div class="toggle-item">
                <span class="toggle-label">Respect Quiet Hours</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="respectQuietHours" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Profanity Filter and PLL Reduction -->
          <div class="toggles-row">
            <div class="toggle-item">
              <span class="toggle-label">Profanity Filter</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="profanityFilter" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="toggle-item">
              <span class="toggle-label">PLL Reduction</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="pllReduction" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Flow Preview Section -->
    <div class="flow-section">
      <div class="flow-card">
        <h2 class="section-title">Flow Preview</h2>

        <div class="flow-diagram">
          <!-- First Row -->
          <div class="flow-row">
            <div class="flow-box">Greetings</div>
            <div class="flow-connector"></div>
            <div class="flow-box">Ask email/phone</div>
            <div class="flow-connector"></div>
            <div class="flow-box">Offer: call now/schedule</div>
          </div>

          <!-- Vertical Connectors -->
          <div class="flow-vertical-connectors">
            <div class="vertical-line left"></div>
            <div class="vertical-line right"></div>
          </div>

          <!-- Second Row -->
          <div class="flow-row">
            <div class="flow-box">Qualify: Budget timing</div>
            <div class="flow-connector"></div>
            <div class="flow-box">Notate: High-intent - Human</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomSelect from '@/components/CampaignV2/CustomSelect.vue'

export default {
  name: 'BehaviourTab',

  components: {
    CustomSelect
  },

  data() {
    return {
      mode: 'hybrid(Recommended)',
      modeOptions: ['hybrid(Recommended)', 'Chat Only', 'Voice Only'],
      
      greetingMessage: 'Hi! Want a proposal or quick call?',
      
      tone: 'Consultative',
      toneOptions: ['Consultative', 'Friendly', 'Professional', 'Casual'],
      
      goal: 'Book demo',
      goalOptions: ['Book demo', 'Schedule call', 'Get information'],
      
      callbackAgent: 'Consultative',
      callbackOptions: ['Consultative', 'Friendly', 'Professional'],
      
      enableCallMeNow: true,
      
      language: 'Auto',
      languageOptions: ['Auto', 'English', 'Spanish', 'French'],
      
      respectQuietHours: false,
      profanityFilter: true,
      pllReduction: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.behaviour-tab {
  display: grid;
  grid-template-columns: 600px 1fr;
  gap: 32px;
}

// Conversion Section
.conversion-section {
  .conversion-card {
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

  .form-group {
    margin-bottom: 28px;
  }

  .form-label-second{
    display: flex;
    flex-direction: column !important;

     .text-input {
      flex: 1;
      padding: 10px 14px;
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

  .form-label-row {
    display: flex;
    align-items: center;
    gap: 16px;

    .form-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #2f2f41;
      // min-width: 140px;
      flex-shrink: 0;
    }

    .text-input {
      flex: 1;
      padding: 10px 14px;
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

  .mode-group {
    .form-label-row {
      .form-label {
        min-width: 60px;
      }
    }

    ::v-deep .custom-select {
      max-width: 280px;
    }
  }

  // Override CustomSelect background
  ::v-deep .custom-select-wrapper {
    .custom-select-trigger {
      background-color: #fff !important;
    }
  }

  .handoffs-section {
    padding-top: 24px;
    border-top: 1px solid #e5e5e5;

    .handoffs-title {
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      margin: 0 0 20px 0;
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 28px;

    .form-col {
      .toggle-item {
        display: flex;
        // align-items: center;
        gap: 12px;
        margin-top: 8px;

        .toggle-label {
          font-size: 0.9rem;
          color: #2f2f41;
        }
      }
    }
  }

  .callback-row {
    display: flex;
    gap: 20px;
    // align-items: center;

    .callback-left {
      flex: 1;
    }

    .callback-right {
      display: flex;
      // align-items: center;
      gap: 12px;

      .enable-label {
        font-size: 0.9rem;
        color: #2f2f41;
        white-space: nowrap;
      }
    }
  }

  .toggles-row {
    display: flex;
    gap: 32px;
    margin-top: 24px;

    .toggle-item {
      display: flex;
      // align-items: center;
      gap: 12px;

      .toggle-label {
        font-size: 0.9rem;
        color: #2f2f41;
      }
    }
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

// Flow Section
.flow-section {
  .flow-card {
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

  .flow-diagram {
    padding: 40px 20px;

    .flow-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 0;

      &:first-child {
        margin-bottom: 40px;
      }

      .flow-box {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 16px 20px;
        font-size: 0.9rem;
        color: #2f2f41;
        text-align: center;
        min-width: 160px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      }

      .flow-connector {
        width: 40px;
        height: 2px;
        background: #d1d5db;
        margin: 0 8px;
      }
    }

    .flow-vertical-connectors {
      display: flex;
      justify-content: space-between;
      padding: 0 80px;
      margin-bottom: 40px;

      .vertical-line {
        width: 2px;
        height: 40px;
        background: #d1d5db;

        &.left {
          margin-left: 80px;
        }

        &.right {
          margin-right: 80px;
        }
      }
    }
  }
}
</style>
