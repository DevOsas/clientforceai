<template>
  <b-modal
    id="planUpgradeModal"
    size="lg"
    modal-class="top-up-form-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHide"
  >
    <template #default="{ hide }">
      <div class="top-up-form-modal-header">
        <h3 class="top-up-form-modal-title">Plan Upgrade</h3>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <b-row class="modal-body">
        <b-col v-for="plan in getPlans" :key="plan.id">
          <b-card
            tag="article"
            class="mb-2"
            :class="[
              getUserPlan?.id == plan.id ? 'plan-card-inverse' : 'plan-card',
            ]"
          >
            <h2 class="text-center plan-name">{{ plan.name }}</h2>

            <h1 class="text-center">${{ plan.price }}</h1>

            <b-card-body>
              <template v-for="(limit, i) in plan.limits">
                <div
                  :key="i"
                  style="font-size: 13px"
                  v-if="i !== '__typename'"
                  class="text-left py-1"
                >
                  <SvgIcon
                    :name="limit > 0 ? `check` : `close`"
                    :class="[
                      limit > 0
                        ? plan.id == getUserPlan?.id
                          ? `icon-white`
                          : `icon-success`
                        : `icon-danger`,
                    ]"
                  />
                  &nbsp;{{ limit }} {{ planLimitName(i) }}
                </div>
              </template>
              <div class="mt-4">
                <b-btn
                  v-if="getUserPlan?.id !== plan.id"
                  @click="upgrade(plan)"
                  :disabled="form.busy || plan.price <= getUserPlan?.price"
                  variant="success"
                  ><b-spinner
                    v-if="form.plan_id == plan.id && form.busy"
                    class="mr-1"
                    small
                  />Choose plan</b-btn
                >
                <b-btn v-else variant="dark">
                  Current plan
                  <SvgIcon name="check-circle" class="icon-md" />
                </b-btn>
              </div>
            </b-card-body> </b-card
        ></b-col>
      </b-row>
    </template>
  </b-modal>
</template>

<script>
import { INIT_PLAN_UPGRADE } from '~/graphql/subscription/mutations'
import { GET_ALL_PLAN_QUERY, PLAN_QUERY } from '~/graphql/subscription/queries'

export default {
  data() {
    return {
      form: new this.$form({
        plan_id: null,
      }),
      selectedPlanFeedback: '',
      isFetchingPlans: false,
      isFetchingUserPlan: false,
    }
  },
  apollo: {
    getUserPlan: {
      query: PLAN_QUERY,
      result({ loading }) {
        this.isFetchingUserPlan = loading
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
    getPlans: {
      query: GET_ALL_PLAN_QUERY,
      result({ loading }) {
        this.isFetchingPlans = loading
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },
  computed: {
    dollarEquivalent() {
      const selectedPlan = this.getPlans
        ? this.getPlans.find((plan) => plan.id === this.form.plan_id)
        : null
      const amount =
        selectedPlan && this.getUserPlan
          ? selectedPlan.price - this.getUserPlan.price
          : 0
      return amount > 0 ? amount : null
    },
  },
  methods: {
    async upgrade(plan) {
      this.form.busy = true
      this.form.plan_id = Number(plan.id)
      await this.$apollo
        .mutate({
          mutation: INIT_PLAN_UPGRADE,
          variables: this.form.data(),
        })
        .then(({ data }) => {
          this.form.busy = false
          location.href = data.changePlan
        })
        .catch(({ graphQLErrors: errors }) => {
          this.form.busy = false
          if (typeof errors !== 'undefined') {
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].message === 'validation') {
                this.form.errors.set(errors[i].extensions.validation)
              } else {
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'Upgrade Failed',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    },
    handleOnHide() {
      this.form.reset()
      this.$emit('closed')
    },
    validateInput(value) {
      const selectedPlan = this.getPlans.find((plan) => plan.id === value)
      if (selectedPlan.price <= this.getUserPlan.price) {
        this.selectedPlanFeedback =
          'Invalid input: Selected plan must be an upgrade to current plan'
      } else {
        this.selectedPlanFeedback = null
      }
    },
    planLimitName(name) {
      switch (name) {
        case 'emailValidation':
          return 'Email validation'
        case 'leadEnrichment':
          return 'Lead Enrichment'
        default:
          return name
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.top-up-form-modal {
  .plan-card {
    max-width: 20rem;
    min-height: 365px;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
  }
  .plan-card-inverse {
    max-width: 20rem;
    min-height: 365px;
    border-radius: 8px;
    // width: 250px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
    color: white;
    background-color: $primary;
  }
  .plan-name {
    font-size: 18px !important;
    font-weight: 600;
  }

  .modal-body {
    padding: 40px 30px 40px;
  }

  .card-body {
    padding: 20px 10px;
  }

  .top-up-form-modal-header {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .close-btn {
      font-size: 32px;
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .top-up-form-modal-title {
      background-color: $primary;
      padding: 5px 40px;
      color: $white;
      border-radius: 5px;
      margin-bottom: 25px;
      font-size: 20px;
    }
  }

  .campaign-name-form {
    .form-control {
      border-color: $gray-200;
      box-shadow: 0 2px 5px 0 $gray-200;
      border-radius: 0.3rem;

      &:focus {
        border-color: $primary;
      }

      &.is-invalid {
        border-color: lighten($danger, 40);
      }
      &::placeholder {
        color: $gray-400;
      }
    }
  }
  .icon-success {
    color: green;
  }

  .icon-white {
    color: white;
  }

  .icon-danger {
    color: red;
  }
  .line-through {
    text-decoration: line-through;
  }
}
</style>
