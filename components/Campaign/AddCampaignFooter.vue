<template>
  <div class="add-campaign-footer">
    <b-container class="d-flex align-items-center justify-content-between">
      <WizardSteps :steps="steps" :current="current" />

      <div>
        <slot />
      </div>
    </b-container>
  </div>
</template>

<script>
import WizardSteps from '~/components/General/WizardSteps'

export default {
  components: { WizardSteps },

  data() {
    return {
      steps: [
        {
          number: 1,
          label: 'Add Steps',
          route: { name: 'campaign-id-setup-steps' },
        },
        {
          number: 2,
          label: 'Schedule',
          route: { name: 'campaign-id-setup-schedule' },
        },
        {
          number: 3,
          label: 'Add People',
          route: { name: 'campaign-id-setup-people' },
        },
        {
          number: 4,
          label: 'Settings',
          route: { name: 'campaign-id-setup-settings' },
        },
        {
          number: 5,
          label: 'Preview & Launch',
          route: { name: 'campaign-id-setup-review' },
        },
      ],
    }
  },

  computed: {
    current() {
      const found = this.steps.find(
        (s) => s.route && s.route.name === this.$route.name
      )

      return found ? found.number : 1
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-campaign-footer {
  background-color: $light;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20px 0;
  z-index: 1001;
}
</style>
