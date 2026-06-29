<template>
  <div class="login-page">
    <div class="top-action">
      Back to Login Page
      <nuxt-link
        variant="link"
        :to="{ name: 'login' }"
        class="font-weight-bold"
      >
        Login
      </nuxt-link>
    </div>

    <h2 class="mb-4">Forget Password</h2>

    <b-form
      method="POST"
      @submit.prevent="onSubmit"
      @keydown="form.onKeydown($event)"
    >
      <b-form-group
        label="Email address"
        label-for="email"
        label-size="lg"
        :state="getInputState('email')"
      >
        <b-form-input
          id="email"
          v-model="form.email"
          type="email"
          size="lg"
          name="email"
          :state="getInputState('email')"
          required
          trim
        ></b-form-input>

        <b-form-valid-feedback :state="!!success_message" class="mt-2">
          {{ success_message }}
        </b-form-valid-feedback>

        <b-form-invalid-feedback :state="getInputState('email')" class="mt-2">
          {{ form.errors.get('email') }}
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
          Send Email
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
// import Swal from 'sweetalert2'
import { FORGET_PASSWORD_QUERY } from '~/graphql/auth/queries'

export default {
  layout: 'auth',

  middleware: 'auth',

  auth: 'guest',

  data() {
    return {
      form: new this.$form({
        email: '',
      }),
      success_message: '',
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
        .query({
          query: FORGET_PASSWORD_QUERY,
          variables: {
            email: credentials.email,
          },
          context: {
            uri: `${this.$config.APIRoot}/graphql/auth`,
          },
        })
        .then((response) => {
          this.form.busy = false

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Email sent!',
            text: response.data.forgetpassword,
          })
          this.$router.push({ name: 'login' })
          // this.form.reset()
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
                  title: 'Couldn`t send email',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
      // } catch ({ graphQLErrors: errors }) {
      //   this.form.busy = false
      //   for (let i = 0; i < errors.length; i++) {
      //     if (errors[i].message === 'validation') {
      //       this.form.errors.set(errors[i].extensions.validation)
      //     } else if (errors[i].message === 'InvalidCredentials') {
      //       this.form.errors.set('email', 'Email or password is incorrect.')
      //     }
      //   }
      // }
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
