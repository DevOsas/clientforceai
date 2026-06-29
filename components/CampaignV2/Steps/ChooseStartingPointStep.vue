<template>
  <div class="choose-starting-point-step">
    <!-- Show options grid if no option selected or if AI Chat not selected -->
    <div v-if="!showWizard && !showTemplates" class="starting-point-container">
      <!-- Options Grid -->
      <div class="options-grid">
        <!-- AI Chat Card -->
        <div 
          class="option-card ai-chat"
          :class="{ selected: selectedOption === 'ai-chat' }"
          @click="selectOption('ai-chat')"
        >
          <div class="three-dots-menu">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="option-visual">
            <img src="~/assets/images/from-scratch.png" alt="AI Chat" class="scratch-image" />
          </div>
          <h3 class="option-title">Start Building with AI</h3>
          <p class="option-description">
            Answer a few quick questions <br> and let AI generate<br>
            your full agent campaign.
          </p>
        </div>

        <!-- From Playbook Card -->
        <div 
          class="option-card from-playbook"
          :class="{ selected: selectedOption === 'from-playbook' }"
          @click="selectOption('from-playbook')"
        >
          <div class="option-visual playbook-images">
            <img src="~/assets/images/playbook-1.png" alt="Playbook 1" class="playbook-image" />
            <img src="~/assets/images/playbook-2.png" alt="Playbook 2" class="playbook-image" />
          </div>
          <h3 class="option-title">From Playbook</h3>
          <p class="option-description">
            Pick a ready-made playbook by<br>
            industry or goal and launch<br>
            your agent fast.
          </p>
        </div>
      </div>
    </div>

    <!-- Show template selection if "From Templates" is selected -->
    <div v-else-if="showTemplates" class="templates-view">
      <div class="template-categories">
        <div 
          class="category-card"
          :class="{ selected: selectedCategory === 'industry' }"
          @click="selectedCategory = 'industry'"
        >
          <div v-if="selectedCategory === 'industry'" class="category-check">
            <SvgIcon name="check" />
          </div>
          <div class="category-icon">
            <SvgIcon name="industry" />
          </div>
          <div class="category-content">
            <h4 class="category-title">Industry Templates</h4>
            <p class="category-description">Dental Real, Real Estate, SaaS...etc</p>
          </div>
        </div>

        <div 
          class="category-card"
          :class="{ selected: selectedCategory === 'role' }"
          @click="selectedCategory = 'role'"
        >
          <div v-if="selectedCategory === 'role'" class="category-check">
            <SvgIcon name="check" />
          </div>
          <div class="category-icon">
            <SvgIcon name="user-role" />
          </div>
          <div class="category-content">
            <h4 class="category-title">Role Templates</h4>
            <p class="category-description">Dental Real, Real Estate, SaaS...etc</p>
          </div>
        </div>
      </div>

      <!-- Templates Grid -->
      <div class="templates-section">
        <h3 class="templates-heading">Templates</h3>
        <div class="templates-grid">
          <div 
            v-for="template in templates" 
            :key="template.id"
            class="template-card"
            :class="{ selected: selectedTemplate === template.id }"
            @click="selectTemplate(template.id)"
          >
            <div v-if="selectedTemplate === template.id" class="template-check">
              <SvgIcon name="check" />
            </div>
            <div class="template-icon">
              <SvgIcon name="document-text" />
            </div>
            <h5 class="template-name">{{ template.name }}</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Show conversational wizard if AI Chat is selected -->
    <div v-else class="wizard-container">
      <ConversationalWizard 
        @back="showWizard = false" 
        @wizard-completed="$emit('wizard-completed')"
      />
    </div>
  </div>
</template>

<script>
import ConversationalWizard from './ConversationalWizard.vue'

export default {
  name: 'ChooseStartingPointStep',

  components: {
    ConversationalWizard,
  },

  data() {
    return {
      selectedOption: null,
      showWizard: false,
      showTemplates: false,
      selectedCategory: 'industry',
      selectedTemplate: null,
      startingOptions: [
        {
          id: 'ai-chat',
          title: 'Start Building with AI',
        },
        {
          id: 'from-playbook',
          title: 'From Playbook',
        },
      ],
      templates: [
        { id: 1, name: 'Template 1' },
        { id: 2, name: 'Template 1' },
        { id: 3, name: 'Template 1' },
        { id: 4, name: 'Template 1' },
        { id: 5, name: 'Template 1' },
      ],
    }
  },

  methods: {
    selectOption(optionId) {
      this.selectedOption = optionId
      // Save to store
      this.$store.dispatch('campaignV2/updateCampaign', {
        startingPoint: optionId,
      })

      if (optionId === 'ai-chat') {
        this.showWizard = true
      } else if (optionId === 'from-playbook') {
        this.showTemplates = true
      }
    },

    selectTemplate(templateId) {
      this.selectedTemplate = templateId
      // Save to store
      this.$store.dispatch('campaignV2/updateCampaign', {
        templateId,
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.choose-starting-point-step {
  padding: 10px 0 0 0;

  .wizard-container {
    width: 100%;
    height: 100%;
  }

  .starting-point-container {
    max-width: 1000px;
    margin: 0 auto;

    // AI Chat Card
    .ai-chat-card {
      background: linear-gradient(135deg, #9b9d9d 0%, #b8e9e9 100%);
      border-radius: 12px;
      padding: 48px 60px;
      margin-bottom: 32px;
      text-align: center;

      .main-title {
        font-size: 2rem;
        font-weight: 700;
        color: #000;
        margin-bottom: 32px;
      }

      .ai-input-wrapper {
        position: relative;
        max-width: 700px;
        margin: 0 auto 24px;

        .ai-input {
          background: $white;
          border-radius: 50px;
          padding: 18px 80px 18px 28px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

          .placeholder-text {
            color: #9ca3af;
            font-size: 1rem;
          }
        }

        .ai-icon {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          background: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $primary;

          svg {
            width: 24px;
            height: 24px;
          }
        }
      }

      .ai-subtitle {
        font-size: 1rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.6;
      }
    }

    // Options Grid
    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 350px);
      gap: 24px;
      justify-content: center;

      .option-card {
        background: $white;
        border-radius: 10px 10px;
        overflow: hidden;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        // border: 3px solid transparent;
        // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        &.selected {
          border-color: $primary;
        }

        .three-dots-menu {
          position: absolute;
          top: 30px;
          left: 30px;
          display: flex;
          gap: 4px;
          z-index: 10;
          padding: 8px;
          cursor: pointer;
          border-radius: 6px;
          transition: background 0.2s ease;

          &:hover {
            background: rgba(0, 0, 0, 0.05);
          }

          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: block;

            &:nth-child(1) {
              background: #e5e5e5;
            }

            &:nth-child(2) {
              background: #85f884;
            }

            &:nth-child(3) {
              background: #d0f56b;
            }
          }
        }

        .option-visual {
          background: #f8f8f8;
          padding: 48px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 280px;
          position: relative;

          // Inner light gray container
          &::before {
            content: '';
            position: absolute;
            inset: 24px;
            background: #fff;
            border-radius: 16px;
            z-index: 0;
          }

          .scratch-image {
            width: 80%;
            max-width: 200px;
            height: auto;
            position: relative;
            z-index: 1;
          }

          &.playbook-images {
            // gap: 20px;
            // padding: 48px 32px;

            .playbook-image {
              width: 60%;
              max-width: 200px;
              height: auto;
              // border-radius: 12px;
              // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              position: relative;
              z-index: 1;
            }
          }
        }

        .option-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #000;
          margin: 28px 0 12px;
          padding: 0 32px;
        }

        .option-description {
          font-size: 1rem;
          color: #9ca3af;
          line-height: 1.6;
          margin: 0;
          padding: 0 32px 32px;
        }
      }
    }
  }

  // Templates View
  .templates-view {
    .template-categories {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;

      .category-card {
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
          border-color: $primary;
          box-shadow: 0 2px 8px rgba($primary, 0.1);
        }

        .category-check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 20px;
          height: 20px;
          background: $primary;
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          color: $white;

          svg {
            width: 12px;
            height: 12px;
          }
        }

        .category-icon {
          width: 48px;
          height: 48px;
          background: #fff;
          border-radius: 50%;
          border: 1px solid $gray-300;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: $gray-800;

          svg {
            width: 24px !important;
            height: 24px !important;
            fill: none !important;
            stroke: currentColor !important;

            * {
              fill: none !important;
              stroke: currentColor !important;
            }

            path,
            circle,
            rect,
            line,
            polyline,
            polygon {
              fill: none !important;
              stroke: currentColor !important;
            }
          }
        }

        &.selected {
          border-color: $primary;
          background: #fcfff6;

          .category-check {
            display: flex;
          }

          .category-title {
            color: $primary;
          }

          .category-icon {
            color: $primary;
          }
        }

        .category-content {
          flex: 1;

          .category-title {
            font-size: 1rem;
            font-weight: 600;
            color: $gray-800;
            margin: 0 0 4px 0;
          }

          .category-description {
            font-size: 0.85rem;
            color: $gray-600;
            margin: 0;
          }
        }
      }
    }

    .templates-section {
      margin-top: 40px;
      .templates-heading {
        font-size: 1.1rem;
        font-weight: 600;
        color: $gray-800;
        margin-bottom: 20px;
      }

      .templates-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;

        .template-card {
          background: $white;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 24px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          min-height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          &:hover {
            border-color: $primary;
            box-shadow: 0 2px 8px rgba($primary, 0.1);
            transform: translateY(-2px);
          }

          .template-check {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 20px;
            height: 20px;
            background: $primary;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            color: $white;
            animation: checkPop 0.3s ease;

            svg {
              width: 12px;
              height: 12px;
            }
          }

          &.selected {
            border-color: $primary;
            background: rgba($primary, 0.02);

            .template-check {
              display: flex;
            }
          }

          .template-icon {
            width: 48px;
            height: 48px;
            background: #f5f5f5;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;

            svg {
              width: 24px;
              height: 24px;
              color: $gray-600;
            }
          }

          .template-name {
            font-size: 0.9rem;
            font-weight: 500;
            color: $gray-700;
            margin: 0;
          }
        }
      }
    }
  }
}

@keyframes checkPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
