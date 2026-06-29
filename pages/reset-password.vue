<template>
  <div class="login-page">
    <h2 class="mb-4">Reset Password</h2>

    <b-form
      method="POST"
      @submit.prevent="onSubmit"
      @keydown="form.onKeydown($event)"
    >
      <b-form-group
        label="New password"
        label-for="password"
        label-size="lg"
        :state="getInputState('password')"
      >
        <b-form-input
          id="password"
          v-model="form.password"
          type="password"
          size="lg"
          name="password"
          :state="getInputState('password')"
          trim
          required
        ></b-form-input>

        <b-form-invalid-feedback
          :state="getInputState('password')"
          class="mt-2"
        >
          {{ form.errors.get('password') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        label="Confirm password"
        label-for="password_confirmation"
        label-size="lg"
        :state="getInputState('password_confirmation')"
      >
        <b-form-input
          id="password_confirmation"
          v-model="form.password_confirmation"
          type="password"
          size="lg"
          name="password_confirmation"
          :state="getInputState('password_confirmation')"
          trim
          required
        ></b-form-input>

        <b-form-invalid-feedback
          :state="getInputState('password_confirmation')"
          class="mt-2"
        >
          {{ form.errors.get('password_confirmation') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <div class="text-right mt-4">
        <b-button
          type="submit"
          variant="primary"
          class="shadow-sm font-weight-bold"
          size="lg"
          block
          :disabled="form.busy"
        >
          <b-spinner v-if="form.busy" small class="mr-1 mb-1" />
          Reset Password
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { RESET_PASSWORD_MUTATION } from '~/graphql/auth/mutations'

export default {
  layout: 'auth',

  middleware: 'auth',

  auth: 'guest',

  data() {
    return {
      form: new this.$form({
        password: '',
        token: this.$route.query.token,
        email: this.$route.query.email,
        password_confirmation: '',
      }),
    }
  },

  /**
   * Mounted lifecycle hook.
   *
   * This function is called when the component is mounted to the DOM.
   * It checks if the `token` and `email` query parameters are present in the route.
   * If they are not present, it displays an error message using Swal.fire and redirects the user to the login page.
   *
   * @return {Promise<void>} - This function does not return anything.
   */
  mounted() {
    if (!this.$route.query.token && !this.$route.query.email) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid password reset link',
        text: 'Your Password reset link is invalid.',
        showConfirmButton: true,
        timer: 7000,
      }).then(() => {
        this.$router.push({ name: 'login' })
      })
    }
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    async onSubmit() {
      const credentials = this.form.data()
      this.form.busy = true

      await this.$apollo
        .mutate({
          mutation: RESET_PASSWORD_MUTATION,
          variables: credentials,
          context: {
            uri: `${this.$config.APIRoot}/graphql/auth`,
          },
        })
        .then(({ response }) => {
          this.form.busy = false

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Password reset completed!',
            text: `Password reset Completed successfully`,
          })
          this.$router.push({ name: 'login' })
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
                  title: 'Password reset failed!',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.login-page {
  // Styles
}
</style>
