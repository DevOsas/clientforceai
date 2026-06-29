<template>
  <div class="d-flex justify-content-center mt-5">
    <b-spinner />
  </div>
</template>

<script>
import {
  CONFIRM_PLAN_UPGRADE,
  VALIDATE_TOP_UP,
} from '~/graphql/subscription/mutations'

export default {
  beforeMount() {
    this.confirmPayment()
  },
  methods: {
    async confirmPayment() {
      const transactionId = this.$route.query.transaction_id
      await this.$apollo
        .mutate({
          mutation: this.getMutation(),
          variables: {
            transaction: transactionId,
          },
        })
        .then(({ data }) => {
          this.$router.push({ name: 'settings-billing' })
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Payment Completed!',
            text: `Payment Completed successfully`,
          })
        })
        .catch(({ graphQLErrors: errors }) => {
          if (typeof errors !== 'undefined') {
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].message === 'validation') {
                this.form.errors.set(errors[i].extensions.validation)
              } else {
                this.$router.push({ name: 'settings-billing' })
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'Payment validation failed',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    },
    getMutation() {
      let mutation
      switch (this.$route.query.transaction_type) {
        case 'topUp':
          mutation = VALIDATE_TOP_UP
          break
        case 'planUpgrade':
          mutation = CONFIRM_PLAN_UPGRADE
          break
      }

      return mutation
    },
  },
}
</script>
