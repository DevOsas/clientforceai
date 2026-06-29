<template>
  <div class="mb-5">
    <div class="secruity">
      <span class="personal-info-text">Secruity</span>
      <div class="row">
        <div class="col-12">
          <h6>
            <span class="password-title">Password</span>
          </h6>

          <div class="form-group">
            <b-form-input
              value="................"
              type="password"
              class="hashed-password"
              autofocusplaceholder="Old Password"
              autocomplete="off"
              readonly="true"
              style="background-color: #fcfcfc"
            />
            <span class="very-secured flex-column">
              <SvgIcon name="check-circle" /> Very secure
            </span>
          </div>
        </div>
        <div class="form-group">
          <button
            class="change-password-btn"
            @click="$bvModal.show('changePasswordModal')"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>

    <b-modal
      id="changePasswordModal"
      size="md"
      modal-class="top-up-form-modal"
      hide-header
      hide-footer
      centered
      @hidden="handleOnHide"
    >
      <template #default="{ hide }">
        <div class="change-password-form-modal-header">
          <h3 class="change-password-form-modal-title">Change password</h3>
          <b-button variant="link" class="close-btn" @click="hide()">
            <SvgIcon name="close" />
          </b-button>
        </div>
        <b-form
          class="change-password-form"
          method="POST"
          @submit.prevent="changePassword"
          @keydown="form.onKeydown($event)"
        >
          <b-form-text id="input-live-help">Enter old password</b-form-text>
          <b-form-input
            v-model="form.oldPassword"
            type="password"
            class="form-control"
            autofocusplaceholder="Old Password"
            autocomplete="off"
            required
          />

          <b-form-text id="input-live-help">Enter new password</b-form-text>
          <b-form-input
            v-model="form.newPassword"
            type="password"
            class="form-control"
            autofocusplaceholder="New Password"
            autocomplete="off"
            required
          />

          <b-form-text id="input-live-help">Comfirm new password</b-form-text>
          <b-form-input
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            autofocusplaceholder="Comfirm Password"
            autocomplete="off"
            required
          />

          <b-form-invalid-feedback v-if="!passwordsMatch">
            Passwords do not match
          </b-form-invalid-feedback>

          <div class="text-right mt-4">
            <b-button
              variant="link"
              class="text-muted mr-1 px-4"
              pill
              @click="hide"
            >
              Cancel
            </b-button>

            <b-button
              :disabled="form.busy"
              type="submit"
              variant="primary"
              class="px-4"
              pill
            >
              <b-spinner v-if="form.busy" class="mr-1" small />
              Change Password
            </b-button>
          </div>
        </b-form>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { CHANGE_PASSWORD_MUTATION } from '~/graphql/user/mutations'
export default {
  data() {
    return {
      userData: '',
      form: new this.$form({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }),
    }
  },
  computed: {
    passwordsMatch() {
      return this.form.newPassword === this.form.confirmPassword
    },
  },
  methods: {
    async changePassword() {
      this.form.busy = true
      if (!this.passwordsMatch) {
        this.form.busy = false
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Update Failed',
          text: 'Passwords do not match',
        })
        return false
      }
      await this.$apollo
        .mutate({
          mutation: CHANGE_PASSWORD_MUTATION,
          variables: this.form.data(),
        })
        .then(({ data }) => {
          this.form.busy = false
          this.userData = data

          if (data.changePassword.status === false) {
            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Update Failed',
              text: `${data.changePassword.message}`,
            })

            return false
          }

          this.$notify({
            group: 'main',
            type: 'success',
            title: 'successful',
            text: `${data.changePassword.message}`,
          })
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
                  title: 'Update Failed',
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
.secruity {
  width: 888px;
  height: 284px;
  top: 70px;
  border-radius: 24px;
  border: 1px solid #bcfdb5;
  position: relative;
  margin-bottom: 20px;
}
.hashed-password {
  width: 350px;
  height: 43px;
  top: 50px;
  left: 44px;
  position: relative;
  display: inline-flex;
  font-size: large;
  border-radius: 7px;
  background: #fcfcfc;
  border: 1px solid #e1e1e1;
}
.very-secured {
  font-size: 19px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  color: #33c442;
  position: relative;
  left: 151px;
  top: 43px;
}

.password-title {
  width: 69px;
  height: 10px;
  top: 28px;
  left: 49px;
  color: #979797;
  font-size: 14px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  text-align: center;
  display: block;
  position: relative;
}

.change-password-btn {
  width: 193px;
  height: 46px;
  color: #fff;
  background: #33c442;
  border-radius: 7px;
  border: 1px solid #bcfdb5;
  padding: 15px 25px 17px 24px;
  position: relative;
  left: 57px;
  top: 66px;
}
.modal-content {
  background-color: #f5f5f5;
  box-shadow: none;
  border: 0;
}
.modal-body {
  padding: 40px 70px 40px;
}

.change-password-form-modal-header {
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

  .change-password-form-modal-title {
    background-color: $primary;
    padding: 5px 40px;
    color: $white;
    border-radius: 5px;
    margin-bottom: 25px;
    font-size: 20px;
  }
}

.change-password-form {
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
