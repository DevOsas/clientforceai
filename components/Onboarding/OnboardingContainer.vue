<template>
  <div v-if="isOnboardingActive" class="onboarding-container">
    <!-- Backdrop with blur -->
    <div class="onboarding-backdrop" @click="handleBackdropClick"></div>

    <!-- Modal Content -->
    <transition name="modal-fade">
      <component
        :is="currentModalComponent"
        v-if="currentStepData"
        @complete="handleComplete"
        @skip="handleSkip"
        @close="handleClose"
      />
    </transition>

    <!-- Progress Indicator (optional) -->
    <div v-if="showProgress" class="onboarding-progress">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <div class="progress-text">
        {{ completedSteps.length }} of {{ totalRequiredSteps }} completed
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'OnboardingContainer',

  data() {
    return {
      showProgress: true
    }
  },

  computed: {
    ...mapState('onboarding', [
      'isOnboardingActive',
      'currentStep',
      'completedSteps',
      'onboardingSteps'
    ]),

    ...mapGetters('onboarding', [
      'currentStepData',
      'progressPercentage'
    ]),

    currentModalComponent() {
      if (!this.currentStepData) return null
      
      // Dynamically load the component
      const componentName = this.currentStepData.component
      
      try {
        return () => import(`@/components/Onboarding/Modals/${componentName}.vue`)
      } catch (error) {
        console.error(`Failed to load component: ${componentName}`, error)
        return null
      }
    },

    totalRequiredSteps() {
      return this.onboardingSteps.filter(s => s.required).length
    }
  },

  mounted() {
    // Start onboarding when component mounts
    this.startOnboarding()
  },

  methods: {
    ...mapActions('onboarding', [
      'startOnboarding',
      'completeStep',
      'skipStep',
      'closeOnboarding'
    ]),

    handleComplete(data) {
      // Mark step as completed and move to next
      this.completeStep({
        stepId: this.currentStep,
        data: data
      })
    },

    handleSkip() {
      // Just close, will reappear next time
      this.skipStep()
    },

    handleClose() {
      // Same as skip
      this.closeOnboarding()
    },

    handleBackdropClick() {
      // Optionally prevent closing by clicking backdrop
      // this.closeOnboarding()
    }
  }
}
</script>

<style lang="scss" scoped>
.onboarding-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .onboarding-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  .onboarding-progress {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10001;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .progress-bar {
      width: 200px;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 8px;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      font-size: 0.85rem;
      color: #6b7280;
      text-align: center;
    }
  }
}

// Modal fade transition
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
