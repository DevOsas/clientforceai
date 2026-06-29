<template>
  <div class="lead-statuses">
    <b-badge
      v-for="status in filteredStatuses"
      :key="status.id"
      variant="lead-status"
      :class="getStatusClass(status)"
    >
      {{ status.name }}
    </b-badge>
  </div>
</template>

<script>
export default {
  props: {
    statuses: {
      type: Array,
      required: true,
    },
    max: {
      type: Number,
      default: null,
    },
  },

  computed: {
    filteredStatuses() {
      if (this.max && this.max > 0 && this.statuses.length > this.max) {
        const statuses = []
        const active = this.statuses.find((s) => s.name === 'Active')
        if (active) {
          statuses.push(active)
        }
        const finished = this.statuses.find((s) => s.name === 'Finished')
        if (finished) {
          statuses.push(finished)
        }
        const replied = this.statuses.find((s) => s.name === 'Replied')
        if (replied) {
          statuses.push(replied)
        }
        const bounced = this.statuses.find((s) => s.name === 'Bounced')
        if (bounced) {
          statuses.push(bounced)
        }
        const others = this.statuses.filter((s) => {
          return (
            s.name !== 'Active' &&
            s.name !== 'Finished' &&
            s.name !== 'Finished' &&
            s.name !== 'Bounced'
          )
        })
        statuses.push(...others)

        return statuses.slice(0, this.max)
      }

      return this.statuses
    },
  },

  methods: {
    getStatusClass(status) {
      switch (status.name) {
        case 'Replied':
          return 'primary'
        case 'Opted out':
          return 'warning'
        case 'Bounced':
          return 'danger'
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-statuses {
  display: flex;
  flex-wrap: wrap;

  .badge-lead-status {
    background-color: $white;
    color: $gray-700;
    font-weight: normal;
    border: 1px solid $gray-500;
    border-radius: 3px;
    text-transform: uppercase;
    margin-right: 5px;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    margin-bottom: 5px;

    &.primary {
      background-color: $primary;
      color: $white;
      border-color: $primary;
    }
    &.warning {
      background-color: $warning;
      color: $white;
      border-color: $warning;
    }
    &.danger {
      background-color: #ff0060;
      color: $white;
      border-color: #ff0060;
    }
  }
}
</style>
