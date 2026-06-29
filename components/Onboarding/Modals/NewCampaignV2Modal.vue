<template>
  <div class="onboarding-modal">
    <div class="modal-card">
      <!-- Close Button -->
      <div class="modal-close-btn" @click="$emit('close')">
        <SvgIcon name="close-2" />
      </div>

      <!-- Modal Content -->
      <div class="modal-content-wrapper">
        <div class="modal-header-section">
          <h1 class="modal-title">
            Welcome to Clientforce
          </h1>
          <p class="modal-subtitle">Your AI Sales Team Starts here</p>
        </div>

        <b-form @submit.prevent="handleSubmit">
          <b-form-group label="Business Name" label-for="business-name" class="form-group-custom">
            <b-form-input
              id="business-name"
              v-model="form.businessName"
              placeholder="Enter Your Business Name"
              class="input-custom"
              required
            />
          </b-form-group>

          <b-form-group label="Goals" label-for="goals" class="form-group-custom">
            <b-form-input
              id="goals"
              v-model="form.goals"
              placeholder="Book demos - Get Clients - Get Sales"
              class="input-custom"
              required
            />
          </b-form-group>

          <div class="modal-action">
            <b-button type="submit" variant="primary" size="lg" class="create-agent-btn" :disabled="!isValid">
              Lets Create your First Agent
              <SvgIcon name="arrow-right" class="ml-3" />
            </b-button>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewCampaignV2Modal',

  data() {
    return {
      form: {
        businessName: '',
        goals: ''
      }
    }
  },

  computed: {
    isValid() {
      return this.form.businessName.trim() !== '' && this.form.goals.trim() !== ''
    }
  },

  methods: {
    handleSubmit() {
      if (!this.isValid) return

      // Save to campaign store
      this.$store.dispatch('campaignV2/resetCampaign')
      this.$store.dispatch('campaignV2/updateCampaign', {
        businessName: this.form.businessName,
        goals: this.form.goals
      })

      // Emit complete event for onboarding system
      this.$emit('complete', this.form)

      // Stay on dashboard - don't navigate
      // User can navigate to campaign wizard later from dashboard
    },

    resetForm() {
      this.form = {
        businessName: '',
        goals: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.onboarding-modal {
  position: relative;
  z-index: 10000;
  max-width: 650px;
  width: 90%;
  margin: 0 auto;

  .modal-card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    padding: 20px 20px;
    animation: modalSlideUp 0.3s ease;

    .modal-close-btn {
      position: absolute;
      top: 15px;
      right: 25px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: $gray-500;
      font-size: 20px;
      transition: all 0.2s ease;

      &:hover {
        color: $gray-700;
        transform: scale(1.1);
      }

      .icon {
        font-size: 1rem;
      }
    }

    .modal-content-wrapper {
      padding: 0 30px;
      .modal-header-section {
        margin-bottom: 50px;

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .modal-subtitle {
          font-size: 1rem;
          color: $gray-600;
          margin-bottom: 0;
          font-weight: 400;
        }
      }

      .form-group-custom {
        margin-bottom: 35px;

        label {
          font-size: 1.05rem;
          font-weight: 500;
          color: $gray-700;
          margin-bottom: 12px;
        }

        .input-custom {
          height: 60px;
          border-radius: 12px;
          border: 2px solid #e5e5e5;
          font-size: 1.05rem;
          padding: 0 20px;
          transition: all 0.3s ease;

          &::placeholder {
            color: $gray-400;
            font-weight: 400;
          }

          &:focus {
            border-color: $primary;
            box-shadow: 0 0 0 3px rgba($primary, 0.1);
          }
        }
      }

      .modal-action {
        margin-top: 50px;
        display: flex;
        justify-content: center;

        .create-agent-btn {
          background: linear-gradient(-120deg, #3bdcb8 0%, #35e834 20%);
          border: none;
          border-radius: 12px;
          padding: 18px 45px;
          font-size: 1.15rem;
          font-weight: 600;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba($primary, 0.3);
          min-width: 400px;
          outline: none !important;

          .icon {
            font-size: 1.3rem;
            margin-left: 10px;
          }

          &:focus {
            outline: none !important;
            box-shadow: 0 4px 15px rgba($primary, 0.3) !important;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
          }

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba($primary, 0.4);
            background: linear-gradient(-120deg, #3bdcb8 0%, #35e834 20%);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        }
      }
    }
  }
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .onboarding-modal {
    .modal-card {
      padding: 30px 25px;
    }

    .modal-content-wrapper {
      .modal-header-section {
        .modal-title {
          font-size: 2rem;
        }

        .modal-subtitle {
          font-size: 1rem;
        }
      }

      .modal-action {
        .create-agent-btn {
          min-width: 100%;
          font-size: 1rem;
          padding: 16px 35px;
        }
      }
    }
  }
}
</style>
