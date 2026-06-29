<template>
  <div>
    <h3 class="mb-3">Set up your profile</h3>
    <p class="mb-4">
      Complete your profile to be able to take advantage of all Clientforce's
      features. Your profile details can be used to customize your emails and
      proposals.
    </p>

    <b-form
      method="POST"
      @submit.prevent="handleUpdateProfile"
      @keydown="form.onKeydown($event)"
    >
      <div
        class="d-flex flex-column align-items-center bg-white shadow-sm py-5 rounded mb-2"
      >
        <div class="profile-avatar">
          <div
            v-if="url || $auth.user"
            class="photo-preview"
            :style="{
              backgroundImage: `url(${url || $auth.user.photoUrl})`,
            }"
          ></div>

          <div class="file-upload">
            <b-button
              variant="white"
              class="shadow-sm"
              size="sm"
              pill
              @click="$refs.Avatar.click()"
            >
              <svg-icon name="camera" />
            </b-button>
            <input
              id="avatar"
              ref="Avatar"
              type="file"
              class="file-upload__input"
              @change="handleFileUpload()"
            />
          </div>
        </div>

        <div class="mt-2 text-center">
          <p class="small mb-2">Recommended size: Less than 2MB (150 x 150)</p>
          <b-button
            variant="outline-primary"
            size="sm"
            class="px-3"
            pill
            @click="$refs.Avatar.click()"
          >
            Choose photo
          </b-button>
        </div>
      </div>

      <b-form-group
        label="Phone number"
        label-for="phone"
        label-size="lg"
        :state="getInputState('phone')"
      >
        <div class="phone-input">
          <CountrySelect v-model="form.country" :countries="countries" />

          <b-form-input
            id="phone"
            v-model="form.phone"
            type="text"
            size="lg"
            name="phone"
            class="right-radius"
            :state="getInputState('phone')"
            required
            trim
          ></b-form-input>
        </div>

        <b-form-invalid-feedback :state="getInputState('phone')" class="mt-2">
          {{ form.errors.get('phone') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <div class="text-right mt-5">
        <b-button
          :to="{ name: 'setup-business' }"
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
          <b-spinner v-if="form.busy" small class="mr-1" />
          Continue
          <SvgIcon name="right-arrow" class="ml-1" />
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { COUNTRIES_QUERY } from '~/graphql/country/queries'
import { USER_PROFILE_SETUP_MUTATION } from '~/graphql/user/mutations'

import CountrySelect from '~/components/General/CountrySelect'

export default {
  components: { CountrySelect },

  layout: 'setup',

  middleware: 'auth',

  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient

    const { data } = await client.query({ query: COUNTRIES_QUERY })
    return { countries: data.countries }
  },

  data() {
    return {
      form: new this.$form({
        avatar: '',
        phone: '',
        country: 'ng',
      }),
      url: null,
    }
  },

  created() {
    this.form.keys().forEach((key) => {
      if (key === 'country') {
        const country = this.$auth.user.country

        this.form.country = country ? country.isoCode : 'ng'

        return
      }

      if (this.$auth.user[key]) {
        this.form[key] = this.$auth.user[key]
      }
    })
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    handleFileUpload() {
      const file = this.$refs.Avatar.files[0]

      if (!file) return

      const fileReader = new FileReader()
      fileReader.onloadend = () => (this.url = fileReader.result)
      fileReader.readAsDataURL(file)

      this.form.avatar = file

      if (!this.isValidFile(file)) return null
    },

    isValidFile(file) {
      const imageFormats = ['image/png', 'image/jpeg']

      const inValidType = !imageFormats.includes(file.type)

      if (inValidType) {
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Invalid file type',
          text: `Please upload a valid image`,
        })
        return false
      }

      const size = file.size / 1000
      if (imageFormats.includes(file.type) && size > 5240) {
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Image too large',
          text: 'Image size must not exceed 5MB',
        })
        return false
      }

      return true
    },

    handleUpdateProfile() {
      this.form.busy = true
      this.$apollo
        .mutate({
          mutation: USER_PROFILE_SETUP_MUTATION,
          variables: {
            avatar: this.form.avatar,
            phone: this.form.phone,
            country: this.form.country,
          },
        })
        .then(({ data }) => {
          this.form.busy = false

          this.$auth.setUser(data.userProfileSetup)

          this.$notify({
            group: 'main',
            type: 'success',
            title: 'Success',
            text: 'Your profile has been updated successfully',
          })

          this.$router.push({ name: 'setup-business' })
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

          this.url = null
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.profile-avatar {
  position: relative;
  text-align: center;
  width: 100px;
  height: 100px;

  .photo-preview {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 50%;
    background-color: $gray-200;
    border: 1px solid $white;
  }

  .file-upload {
    position: absolute;
    display: block;
    cursor: pointer;
    bottom: 0;
    right: -5px;
    padding: 4px;
    background: white;
    border-radius: 50%;

    .btn {
      background-color: white;
      border: 1px solid $gray-200;
    }
  }

  .file-upload__input {
    display: none;
  }

  .img-round {
    border-radius: 50%;
  }
}

.phone-input {
  display: flex;

  .country-select {
    .select-toggle {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      box-shadow: 0 2px 5px 0 $gray-200;
      border-right: 0;
    }
  }
}
</style>
