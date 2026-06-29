<template>
  <div>
    <div class="personal-info-card">
      <span class="personal-info-text">Personal Information</span>
      <div class="row mt-3 p-5">
        <div class="col-12 p-4">
          <div class="uplaodIMG-DIV">
            <div class="uplaodIMG">
              <img
                :src="userPhotoURL || computedPhotoUrl"
                alt="uplaodIMG"
                class="img-upload"
                @click="triggerFileInput"
              />
            </div>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              accept="image/*"
              @change="handleFileChange"
            />
          </div>
          <b-form
            class="change-personalInfo-form"
            method="POST"
            @submit.prevent="changePersonInfo"
            @keydown="form.onKeydown($event)"
          >
            <h6>
              <span class="first-name-title">First Name</span>
              <span class="last-name-title">Last Name</span>
            </h6>
            <div class="mb-5 form-group">
              <b-form-input
                v-model="form.firstName"
                type="text"
                class="firstname"
                autofocusplaceholder="First Name"
                autocomplete="on"
                required
              />
              <b-form-input
                v-model="form.lastName"
                type="text"
                class="lastname"
                autofocusplaceholder="Last Name"
                autocomplete="on"
                required
              />
            </div>
            <h6>
              <span class="email-title">Email address </span>
              <span class="phone-number-title">Phone number </span>
            </h6>
            <h6>
              <div class="form-group">
                <b-form-input
                  v-model="form.email"
                  type="text"
                  class="email"
                  autofocusplaceholder="Email Address"
                  autocomplete="on"
                  required
                />

                <b-form-input
                  v-model="form.phone"
                  type="text"
                  class="phone-number"
                  autofocusplaceholder="Phone Number"
                  autocomplete="on"
                  required
                />
              </div>
            </h6>
            <div class="form-group">
              <button type="submit" class="update-btn">
                <b-spinner v-if="form.busy" class="mr-1" small />
                <span>Update</span>
              </button>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  UPDATE_USER_DETAILS_MUTATION,
  UPLOAD_USER_PHOTO_MUTATION,
} from '~/graphql/user/mutations'
export default {
  middleware: 'auth',
  data() {
    return {
      userPhotoURL: null,
      file: null,
      form: new this.$form({
        firstName: this.$auth.user.firstName,
        lastName: this.$auth.user.lastName,
        email: this.$auth.user.email,
        phone: this.$auth.user.phone,
      }),
    }
  },

  computed: {
    computedPhotoUrl() {
      return (
        this.$auth.user.photoUrl || require('@/assets/images/profile-pic.png')
      )
    },
  },
  methods: {
    async changePersonInfo() {
      this.form.busy = true
      await this.$apollo
        .mutate({
          mutation: UPDATE_USER_DETAILS_MUTATION,
          variables: this.form.data(),
        })
        .then(({ data }) => {
          this.form.busy = false
          this.userData = data
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'successful',
            text: 'Updated successfully',
          })
        })
        .catch(({ graphQLErrors: errors }) => {
          this.form.busy = false
          if (typeof errors !== 'undefined') {
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].message === 'validation') {
                const validationErrors = errors[i].extensions.validation
                const validationMessages = Object.keys(validationErrors)
                  .map((field) => {
                    return `${field}: ${validationErrors[field].join(', ')}`
                  })
                  .join('. ')
                this.form.errors.set(validationErrors)
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'Update Failed',
                  text: validationMessages,
                })
              } else {
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'Update Failed',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    },

    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    async handleFileChange(event) {
      this.file = event.target.files[0]

      if (this.file) {
        try {
          const response = await this.$apollo.mutate({
            mutation: UPLOAD_USER_PHOTO_MUTATION,
            variables: {
              file: this.file,
            },
            context: {
              hasUpload: true,
            },
          })
          if (response.data.uploadUserPhoto) {
            this.$notify({
              group: 'main',
              type: 'success',
              title: 'successful',
              text: 'Uploaded successfully',
            })

            this.userPhotoURL = response.data.uploadUserPhoto.photoUrl
            // Update the auth user object to reflect the new photo
            this.$auth.user.photoUrl = response.data.uploadUserPhoto.photoUrl
          }
        } catch (errors) {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Upload Failed',
            text: `${errors}`,
          })
        }
      } else {
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Upload Failed',
          text: 'No file selected',
        })

        return false
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.personal-info-card {
  width: 888px;
  height: 585px;
  border: 1px #bcfdb5 solid;
  border-radius: 24px;
}

.personal-info-text {
  width: 206px;
  height: 24px;
  font-size: 20px;
  font-weight: 600;
  line-height: 24.2px;
  letter-spacing: 0.25px;
  display: block;
  margin-left: 50px;
  margin-top: 30px;
}

.uplaodIMG-DIV {
  border-radius: 100%;
  width: 110px;
  height: 110px;
  background: #33c442;
  border: 1px dash #33c442;
  position: relative;
  margin-bottom: 30px;
  top: -49px;
}

.img-upload {
  cursor: pointer;
  width: 111px;
  height: 111px;
  border-radius: 50%;
}

.update-btn {
  width: 96px;
  height: 46px;
  border-radius: 7px;
  color: #fff;
  background: #33c442;
  border: 1px #bcfdb5 solid;
  position: relative;
  top: 10px;
}

.first-name-title {
  width: 76px;
  height: 10px;
  top: -32px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  text-align: center;
  color: #979797;
  display: inline-flex;
  position: relative;
}

.last-name-title {
  position: absolute;
  width: 80px;
  height: 14px;
  left: 415px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  text-align: center;
  color: #979797;
  top: 132px;
}

.lastname {
  width: 300px;
  height: 43px;
  left: 90px;
  font-size: 18px;
  display: inline-flex;
  position: relative;
  top: -30px;
  background: #fafafa;
  border: 1px solid #e1e1e1;
  border-radius: 7px;
}

.firstname {
  width: 300px;
  height: 43px;
  border-radius: 7px;
  font-size: 18px;
  position: relative;
  display: inline-block;
  top: -27px;
  border: 1px solid #e1e1e1;
  background: #f9f9f9;
}

.email-title {
  width: 98px;
  height: 14px;
  top: -44px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  text-align: center;
  color: #979797;
  position: relative;
  display: inline-block;
}

.email {
  font-size: 18px;
  position: relative;
  display: inline-flex;
  width: 300px;
  height: 43px;
  top: -30px;
  border-radius: 7px;
  border: 1px solid #e1e1e1;
  background: #fafafa;
}

.phone-number-title {
  left: 294px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  text-align: center;
  color: #979797;
  display: inline-flex;
  position: relative;
  top: -44px;
}

.phone-number {
  width: 300px;
  height: 43px;
  left: 83px;
  position: relative;
  display: inline-flex;
  top: -32px;
  background: #fafafa;
  border-radius: 7px;
  border: 1px solid #e1e1e1;
}

.modal-content {
  background-color: #f5f5f5;
  box-shadow: none;
  border: 0;
}

.modal-body {
  padding: 40px 70px 40px;
}

.change-personalInfo-form-modal-header {
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

  .change-personalInfo-form-modal-title {
    background-color: $primary;
    padding: 5px 40px;
    color: $white;
    border-radius: 5px;
    margin-bottom: 25px;
    font-size: 20px;
  }
}

.change-personalInfo-form {
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
</style>
