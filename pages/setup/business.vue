<template>
  <div>
    <h3 class="mb-3">Business details</h3>
    <p class="text-muted mb-4">
      Give us details about your business or company
    </p>

    <b-form
      method="POST"
      @submit.prevent="handleUpdateBusiness"
      @keydown="form.onKeydown($event)"
    >
      <b-form-group
        label="Business name"
        label-for="name"
        label-size="lg"
        :state="getInputState('name')"
      >
        <b-form-input
          id="name"
          v-model="form.name"
          type="text"
          size="lg"
          name="name"
          autocomplete="off"
          placeholder="Your business or company name"
          required
          :state="getInputState('name')"
          trim
        ></b-form-input>

        <b-form-invalid-feedback :state="getInputState('name')" class="mt-2">
          {{ form.errors.get('name') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        label="Industry"
        label-for="industry"
        label-size="lg"
        :state="getInputState('industry')"
      >
        <b-form-select
          id="industry"
          v-model="form.industry"
          :options="industries"
          text-field="name"
          type="text"
          size="lg"
          name="industry"
          placeholder="Your business industry"
          :state="getInputState('industry')"
          required
          trim
        ></b-form-select>

        <b-form-invalid-feedback
          :state="getInputState('industry')"
          class="mt-2"
        >
          {{ form.errors.get('industry') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        label="Your role"
        label-for="role"
        label-size="lg"
        :state="getInputState('role')"
      >
        <b-form-input
          id="role"
          v-model="form.role"
          type="text"
          size="lg"
          name="role"
          placeholder="Your role in your business or company"
          :state="getInputState('role')"
          required
          trim
        ></b-form-input>

        <b-form-invalid-feedback :state="getInputState('role')" class="mt-2">
          {{ form.errors.get('role') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <div class="d-flex justify-content-between align-items-center mt-5">
        <b-button
          :to="{ name: 'setup-profile' }"
          variant="link"
          size="sm"
          class="caps-spaced text-dark"
        >
          <SvgIcon name="left-arrow" class="mr-1" />
          Previous step
        </b-button>
        <div>
          <b-button
            :to="{ name: 'setup-email-account' }"
            variant="link"
            size="sm"
            class="caps-spaced text-dark px-4 mr-2"
          >
            Skip
          </b-button>
          <b-button
            type="submit"
            variant="primary"
            size="sm"
            class="caps-spaced px-4"
            :disabled="form.busy"
          >
            <b-spinner v-if="form.busy" small class="mr-1 mb-1" />
            Continue
            <SvgIcon name="right-arrow" class="ml-1" />
          </b-button>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
import { USER_BUSINESS_DETAILS_SETUP_MUTATION } from '~/graphql/user/mutations'

export default {
  layout: 'setup',

  middleware: 'auth',

  data() {
    return {
      industries: [
        {
          name: 'Select Industry',
          value: null,
        },
        {
          name: 'Aerospace Industry',
          value: 'Aerospace',
        },
        {
          name: 'Transport Industry',
          value: 'Transport',
        },
        {
          name: 'Computer Industry',
          value: 'Computer',
        },
        {
          name: 'Telecommunication Industry',
          value: 'Telecommunication',
        },
        {
          name: 'Agriculture Industry',
          value: 'Agriculture',
        },
        {
          name: 'Construction Industry',
          value: 'Construction',
        },
        {
          name: 'Education Industry',
          value: 'Education',
        },
        {
          name: 'Pharmaceutical Industry',
          value: 'Pharmaceutical',
        },
        {
          name: 'Food Industry',
          value: 'Food',
        },
        {
          name: 'Health care Industry',
          value: 'Health care',
        },
        {
          name: 'Hospitality Industry',
          value: 'Hospitality',
        },
        {
          name: 'Entertainment Industry',
          value: 'Entertainment',
        },
        {
          name: 'News Media Industry',
          value: 'News Media',
        },
        {
          name: 'Energy Industry',
          value: 'Energy',
        },
        {
          name: 'Manufacturing Industry',
          value: 'Manufacturing',
        },
        {
          name: 'Music Industry',
          value: 'Music',
        },
        {
          name: 'Mining Industry',
          value: 'Mining',
        },
        {
          name: 'Worldwide Industry',
          value: 'Worldwide',
        },
        {
          name: 'Electronics Industry',
          value: 'Electronics',
        },
      ],

      form: new this.$form({
        name: '',
        industry: null,
        role: '',
      }),
    }
  },

  created() {
    this.form.name = this.$auth.user.companyName || ''
    this.form.industry = this.$auth.user.companyIndustry || null
    this.form.role = this.$auth.user.roleAtCompany || ''
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    handleUpdateBusiness() {
      this.form.busy = true
      this.$apollo
        .mutate({
          mutation: USER_BUSINESS_DETAILS_SETUP_MUTATION,
          variables: this.form.data(),
        })
        .then(({ data }) => {
          this.form.busy = false

          this.$auth.setUser(data.userBusinessDetailsSetup)

          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Success',
            text: 'Your business details has been updated successfully',
          })

          this.$router.push({ name: 'setup-email-account' })
        })
        .catch((error) => {
          this.form.busy = false

          const validations = error.graphQLErrors.filter(
            (err) => err.message === 'validation'
          )

          if (validations.length) {
            validations.forEach((err) => {
              this.form.errors.set(err.extensions.validation)
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Unable to update',
              text: 'An error occurred while processing your request.',
            })
          }
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';
</style>
