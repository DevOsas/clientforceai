<template>
  <b-modal
    id="AddCreditsModal"
    hide-header
    hide-footer
    centered
    size="md"
    modal-class="add-credits-modal"
    backdrop-class="modal-backdrop-blur"
    @hidden="resetForm"
  >
    <div class="modal-close-btn" @click="$bvModal.hide('AddCreditsModal')">
      <SvgIcon name="close-2" />
    </div>

    <div class="modal-content-wrapper">
      <div class="modal-header-section">
        <h1 class="modal-title">Add Credits</h1>
      </div>

      <b-form @submit.prevent="handleSubmit">
        <!-- Select Credit Type -->
        <b-form-group label="Select Credit Type" label-for="credit-type" class="form-group-custom">
          <CustomSelect
            v-model="form.creditType"
            :options="creditTypeOptions"
            placeholder="Select credit type"
          />
        </b-form-group>

        <!-- Amount (Credits) -->
        <b-form-group label="Amount (Credits)" label-for="amount" class="form-group-custom">
          <div class="amount-wrapper">
            <b-form-input
              id="amount"
              v-model="form.amount"
              type="number"
              placeholder="1000"
              class="input-custom"
              required
              min="1"
            />
            <span class="amount-price">= ${{ calculatedPrice }}</span>
          </div>
        </b-form-group>

        <!-- Submit Button -->
        <div class="modal-action">
          <b-button 
            type="submit" 
            variant="primary" 
            size="lg" 
            class="add-credits-btn"
            :disabled="!isValid"
          >
            + Add Credits
          </b-button>
        </div>
      </b-form>
    </div>
  </b-modal>
</template>

<script>
import CustomSelect from '@/components/CampaignV2/CustomSelect.vue'

export default {
  name: 'AddCreditsModal',

  components: {
    CustomSelect
  },

  data() {
    return {
      form: {
        creditType: 'Email',
        amount: 1000,
      },
      creditTypeOptions: ['Email', 'Voice', 'SMS', 'AI Actions'],
    }
  },

  computed: {
    isValid() {
      return this.form.creditType && this.form.amount > 0
    },
    calculatedPrice() {
      // Calculate price based on amount (example: $0.02 per credit)
      const pricePerCredit = 0.02
      return (this.form.amount * pricePerCredit).toFixed(2)
    },
  },

  methods: {
    handleSubmit() {
      if (!this.isValid) return

      console.log('Adding credits:', this.form)
      this.$toast?.success(`${this.form.amount} ${this.form.creditType} credits added!`)
      
      // Close modal
      this.$bvModal.hide('AddCreditsModal')
    },

    resetForm() {
      this.form = {
        creditType: 'Email',
        amount: 1000,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

::v-deep .add-credits-modal {
  .modal-dialog {
    max-width: 500px;

    .modal-content {
      border-radius: 16px;
      border: none;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      padding: 0;
      overflow: hidden;
    }
  }
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
    color: #000;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.modal-content-wrapper {
  padding: 40px;

  .modal-header-section {
    margin-bottom: 32px;

    .modal-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: #000;
      margin: 0;
    }
  }

  .form-group-custom {
    margin-bottom: 24px;

    ::v-deep label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #2f2f41;
      margin-bottom: 8px;
    }

    .select-custom,
    .input-custom {
      width: 100%;
      padding: 12px 16px;
      font-size: 0.9rem;
      color: #2f2f41;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      background: #fff;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    .amount-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;

      .input-custom {
        flex: 1;
      }

      .amount-price {
        font-size: 0.9rem;
        font-weight: 500;
        color: #6b7280;
        white-space: nowrap;
      }
    }
  }

  .modal-action {
    margin-top: 32px;
    display: flex;
    justify-content: center;

    .add-credits-btn {
      padding: 14px 32px;
      font-size: 1rem;
      font-weight: 600;
      color: #000;
      background: $primary;
      border: none;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: darken($primary, 10%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba($primary, 0.3);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  // Override CustomSelect background
  ::v-deep .custom-select-wrapper {
    .custom-select-trigger {
      background-color: #fff !important;
    }
  }
}
</style>
