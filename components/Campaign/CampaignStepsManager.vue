<template>
  <div class="campaign-steps-manager">
    <div v-if="steps.length" class="campaign-steps-wrap">
      <div class="campaign-steps-list">
        <CampaignStepItem
          v-for="(step, index) in computedSteps"
          :key="index + 1"
          :index="index"
          :step="step"
          :show-if-no-reply="index !== 0"
          @remove="removeStep"
          @add-email="triggerAddEmailOption"
          @remove-email="handleRemoveEmail"
          @clone-email="cloneEmail"
          @edit-email="editEmail"
          @set-delay="setStepDelay"
        />
      </div>

      <div class="campaign-steps-footer">
        <b-button
          variant="add-new-step"
          size="lg"
          @click="$bvModal.show('EmailEditorModal')"
        >
          <SvgIcon name="plus-colored" />
          Create New Step
        </b-button>
      </div>
    </div>

    <div v-else class="empty-campaign-step">
      <CampaignStepIl class="illustration" />
      <div class="description">
        Start by creating a sequence of emails templates. <br />
        Try to keep your emails short, sweet and personal.
      </div>
      <b-button
        variant="outline-primary"
        size="lg"
        @click="$bvModal.show('EmailEditorModal')"
      >
        <SvgIcon name="plus-colored" />
        Add Campaign Step
      </b-button>
    </div>

    <EmailEditorModal
      :is-first-step="isFirstStep"
      :form-data="emailForm"
      :busy="isSaving"
      @save="handleFormSave"
    />
  </div>
</template>

<script>
import CampaignStepItem from '~/components/Campaign/CampaignStepItem'
import EmailEditorModal from '~/components/Email/EmailEditorModal'

import CampaignStepIl from '~/assets/illustrations/campaign-steps.svg?inline'

import {
  SAVE_CAMPAIGN_STEP_MUTATION,
  SAVE_CAMPAIGN_STEPS_MUTATION,
  DELETE_CAMPAIGN_STEP_EMAIL_MUTATION,
} from '~/graphql/campaign/mutations'

export default {
  components: { CampaignStepIl, CampaignStepItem, EmailEditorModal },

  props: {
    steps: {
      type: Array,
      required: true,
    },

    campaignId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      isSaving: false,

      stepToAddEmail: null,

      editingEmail: null,
      editingStep: null,

      emailForm: {
        subject: '',
        body: '',
      },

      prevDay: 1,
    }
  },

  computed: {
    computedSteps() {
      let prevDay = 1
      return this.steps.map((step, index) => {
        prevDay = prevDay + step.inMinutes / 1440

        return {
          ...step,
          day: prevDay,
        }
      })
    },

    isFirstStep() {
      if (this.stepToAddEmail !== null) {
        const index = this.steps.findIndex(
          (s) => s.id === this.stepToAddEmail.id
        )
        return index === 0
      }
      return this.steps.length === 0
    },
  },

  methods: {
    triggerAddEmailOption(step) {
      this.stepToAddEmail = step

      this.$bvModal.show('EmailEditorModal')
    },

    editEmail({ step, email }) {
      this.editingEmail = email
      this.editingStep = step

      this.emailForm = {
        subject: email.subject,
        body: email.body,
      }

      this.$bvModal.show('EmailEditorModal')
    },

    handleFormSave(form) {
      this.isSaving = true

      if (this.stepToAddEmail !== null) {
        return this.addEmailToStep(form)
          .then(({ data }) => {
            const stepIndex = this.steps.findIndex(
              (s) => s.id === this.stepToAddEmail.id
            )

            this.$emit('update', [
              ...this.steps.slice(0, stepIndex),
              data.saveCampaignStep,
              ...this.steps.slice(stepIndex + 1),
            ])

            this.isSaving = false
            this.reset()
          })
          .catch(() => {
            this.isSaving = false
          })
      } else if (this.editingEmail !== null) {
        return this.handleEditEmail(form)
          .then(({ data }) => {
            const stepIndex = this.steps.findIndex(
              (s) => s.id === this.editingStep.id
            )

            this.$emit('update', [
              ...this.steps.slice(0, stepIndex),
              data.saveCampaignStep,
              ...this.steps.slice(stepIndex + 1),
            ])

            this.isSaving = false
            this.reset()
          })
          .catch(() => {
            this.isSaving = false
          })
      } else {
        return this.saveNewCamapignStep(form)
          .then(({ data }) => {
            this.$emit('update', [...this.steps, data.saveCampaignStep])

            this.isSaving = false
            this.reset()
          })
          .catch(() => {
            this.isSaving = false
          })
      }
    },

    reset() {
      this.editingEmail = null
      this.editingStep = null
      this.stepToAddEmail = null
      this.emailForm = {
        subject: '',
        body: '',
      }

      this.$bvModal.hide('EmailEditorModal')
    },

    saveNewCamapignStep({ subject, body }) {
      return this.storeCamapignStep({
        id: 0,
        inMinutes: this.steps.length * 2880,
        number: this.steps.length + 1,
        emails: [
          {
            subject,
            body,
          },
        ],
      })
    },

    /**
     * Performs edit campaign step email
     * @param  {String} options.subject Email Subject
     * @param  {String} options.body    Email body
     * @return {Promise}                Apollo promise
     */
    handleEditEmail({ subject, body }) {
      const emailIndex = this.editingStep.emails.findIndex(
        (e) => e.id === this.editingEmail.id
      )

      return this.storeCamapignStep({
        ...this.editingStep,
        emails: [
          ...this.editingStep.emails.slice(0, emailIndex),
          {
            ...this.editingEmail,
            subject,
            body,
          },
          ...this.editingStep.emails.slice(emailIndex + 1),
        ],
      })
    },

    addEmailToStep({ subject, body }) {
      const stepItem = this.steps.find((s) => s.id === this.stepToAddEmail.id)

      return this.storeCamapignStep({
        ...stepItem,
        emails: [
          ...stepItem.emails,
          {
            id: 0,
            subject,
            body,
          },
        ],
      })
    },

    cloneEmail({ stepId, email }) {
      const stepItem = this.steps.find((s) => s.id === stepId)

      this.$nuxt.$loading.start()

      return this.storeCamapignStep({
        ...stepItem,
        emails: [
          ...stepItem.emails,
          {
            ...email,
            id: 0,
          },
        ],
      })
        .then(({ data }) => {
          const stepIndex = this.steps.findIndex((s) => s.id === stepId)

          this.$emit('update', [
            ...this.steps.slice(0, stepIndex),
            data.saveCampaignStep,
            ...this.steps.slice(stepIndex + 1),
          ])

          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    },

    handleRemoveEmail({ stepId, emailId }) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: DELETE_CAMPAIGN_STEP_EMAIL_MUTATION,
          variables: { id: emailId, campaignId: this.campaignId, stepId },
        })
        .then(({ data }) => {
          const stepIndex = this.steps.findIndex((s) => s.id === stepId)
          const step = this.steps[stepIndex]
          const emailIndex = step.emails.findIndex((e) => e.id === emailId)

          const steps = [
            ...this.steps.slice(0, stepIndex),
            {
              ...step,
              emails: [
                ...step.emails.slice(0, emailIndex),
                ...step.emails.slice(emailIndex + 1),
              ],
            },
            ...this.steps.slice(stepIndex + 1),
          ]

          this.$emit('update', steps)

          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    },

    setStepDelay({ stepId, delay }) {
      this.$nuxt.$loading.start()

      const stepIndex = this.computedSteps.findIndex(
        (step) => step.id === stepId
      )

      const steps = [
        ...this.computedSteps.slice(0, stepIndex),
        {
          ...this.computedSteps[stepIndex],
          inMinutes: delay,
        },
        ...this.computedSteps.slice(stepIndex + 1),
      ]

      this.storeCamapignSteps(steps)
        .then(({ data }) => {
          this.$emit('update', steps)
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    },

    removeStep(stepId) {
      this.$nuxt.$loading.start()

      const stepIndex = this.computedSteps.findIndex(
        (step) => step.id === stepId
      )

      const steps = [
        ...this.computedSteps.slice(0, stepIndex),
        ...this.computedSteps.slice(stepIndex + 1),
      ].map((step, index) => ({ ...step, number: index + 1 }))

      this.storeCamapignSteps(steps)
        .then(({ data }) => {
          this.$emit('update', steps)
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    },

    storeCamapignStep(step) {
      return this.$apollo.mutate({
        mutation: SAVE_CAMPAIGN_STEP_MUTATION,
        variables: { campaignId: this.campaignId, ...step },
      })
    },

    storeCamapignSteps(steps) {
      return this.$apollo.mutate({
        mutation: SAVE_CAMPAIGN_STEPS_MUTATION,
        variables: {
          id: this.campaignId,
          steps,
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-steps-manager {
  .campaign-steps-wrap {
    .campaign-steps-list {
      // Styles
    }

    .campaign-steps-footer {
      margin: 10px 0 50px;
    }

    .btn-add-new-step {
      padding: 10px 40px;
      color: $dark;
      border: 2px solid $primary;
      display: flex;
      align-items: center;
      margin: auto;

      .icon {
        font-size: 1.7rem;
        line-height: 0;
        margin-right: 10px;
      }
    }
  }

  .empty-campaign-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    height: 55vh;

    .illustration {
      height: 250px;
      margin-bottom: 10px;
    }

    .description {
      width: 650px;
      text-align: center;
      margin-bottom: 30px;
      font-size: 18px;
      line-height: 129.3%;
      color: $gray-600;
      margin-top: 10px;
    }

    .btn-outline-primary {
      padding: 5px 30px;
      color: $dark;
      border-width: 2px;

      .icon {
        margin-right: 7px;
        font-size: 25px;
        line-height: 0;
        margin-top: 5px;
      }

      &:hover {
        color: $white;
      }
    }
  }
}
</style>
