<template>
  <div>
    <div class="signup-page">
      <!-- Signup Form Container -->
      <div class="signup-form-container">
        <h1 class="signup-title">Get Started Now</h1>
        <p class="signup-subtitle">Please Enter Your Details</p>

        <b-form
          method="POST"
          @submit.prevent="onSubmit"
          @keydown="form.onKeydown($event)"
        >
          <!-- Name Input -->
          <div class="form-group-custom">
            <label for="name" class="form-label">Name</label>
            <b-form-input
              id="name"
              v-model="form.name"
              type="text"
              name="name"
              class="form-input"
              :class="{ 'is-invalid': form.errors.has('name') }"
              placeholder="Full Name"
              required
              trim
            ></b-form-input>
            <div v-if="form.errors.has('name')" class="error-message">
              {{ form.errors.get('name') }}
            </div>
          </div>

          <!-- Email Input -->
          <div class="form-group-custom">
            <label for="email" class="form-label">Email</label>
            <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              name="email"
              class="form-input"
              :class="{ 'is-invalid': form.errors.has('email') }"
              placeholder="myemailnow2025@gmail.com"
              required
              trim
            ></b-form-input>
            <div v-if="form.errors.has('email')" class="error-message">
              {{ form.errors.get('email') }}
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group-custom">
            <label for="password" class="form-label">Password</label>
            <div class="password-input-wrapper">
              <b-form-input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                class="form-input"
                :class="{ 'is-invalid': form.errors.has('password') }"
                placeholder="*******"
                required
                trim
              ></b-form-input>
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <SvgIcon v-if="showPassword" name="eye" />
                <SvgIcon v-else name="eye-off" />
              </button>
            </div>
            <div v-if="form.errors.has('password')" class="error-message">
              {{ form.errors.get('password') }}
            </div>
            <div class="login-link-wrapper">
              <nuxt-link :to="{ name: 'login' }" class="login-link">
                Already have an account? Login
              </nuxt-link>
            </div>
          </div>

          <!-- Action Buttons Row -->
          <div class="action-buttons-row">
            <!-- Google Sign In Button -->
            <button type="button" class="google-signin-btn">
              <SvgIcon name="google" class="google-icon" />
            </button>

            <!-- Get Started Button -->
            <b-button
              type="submit"
              class="get-started-btn"
              :disabled="form.busy"
            >
              <b-spinner v-if="form.busy" small class="mr-2" />
              <span v-else>Get Started</span>
              <SvgIcon v-if="!form.busy" name="arrow-right" class="ml-2" />
            </b-button>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { SIGNUP_MUTATION } from '~/graphql/auth/mutations'

export default {
  layout: 'auth',

  middleware: 'auth',

  auth: 'guest',

  data() {
    return {
      showPassword: false,
      form: new this.$form({
        name: '',
        email: '',
        password: '',
      }),
    }
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    onSubmit() {
      this.form.busy = true

      this.$apollo
        .mutate({
          mutation: SIGNUP_MUTATION,
          variables: this.form.data(),
          context: {
            uri: `${this.$config.APIRoot}/graphql/auth`,
          },
        })
        .then(async ({ data: { signUp } }) => {
          await this.login({
            email: signUp.email,
            password: this.form.password,
          })

          // I would normally set this.form.busy = false here
          // but doing that has this effect where the busy spinner
          // stops spinning a few seconds before navigating out...
        })
        .catch(({ graphQLErrors: errors }) => {
          this.form.busy = false
          for (let i = 0; i < errors.length; i++) {
            if (errors[i].message === 'validation') {
              this.form.errors.set(errors[i].extensions.validation)
            } else {
              this.$notify({
                group: 'main',
                type: 'error',
                title: 'Unable to update',
                text: `${errors[i].message}`,
              })
            }
          }
        })
    },

    login(credentials) {
      return this.$auth.loginWith('graphql', credentials).catch(() => {
        // Handle login errors
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.signup-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .signup-form-container {
    max-width: 520px;
    width: 100%;
    margin: auto;
    padding: 48px 56px;
    position: relative;
    z-index: 5;

    // Radial gradient blur effect behind the form
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 160%;
      height: 160%;
      background: radial-gradient(circle, rgba(246, 247, 231, 1) 0%, rgba(246, 247, 231, 0.3) 40%, rgba(255, 255, 255, 0) 50%);
      border-radius: 50%;
      z-index: -1;
      filter: blur(40px);
    }

    .signup-title {
      font-size: 2.25rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 8px;
      text-align: center;
    }

    .signup-subtitle {
      font-size: 1rem;
      color: #9ca3af;
      margin-bottom: 32px;
      text-align: center;
    }

    .form-group-custom {
      margin-bottom: 20px;

      .login-link-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;

        .login-link {
          font-size: 0.875rem;
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s ease;

          &:hover {
            color: $primary;
          }
        }
      }

      .form-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 400;
        color: #9ca3af;
        margin-bottom: 8px;
      }

      .form-input {
        width: 100%;
        height: 56px;
        padding: 16px 20px;
        font-size: 1rem;
        border: none;
        border-radius: 16px;
        background: #fff !important;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        &:focus {
          outline: none;
          background: #fff !important;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }

        &.is-invalid {
          background: #fee2e2;
          border: 1px solid #ef4444;
        }

        &::placeholder {
          color: #d1d5db;
        }
      }

      .password-input-wrapper {
        position: relative;

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          transition: color 0.2s ease;

          &:hover {
            color: #6b7280;
          }

          ::v-deep svg {
            width: 20px;
            height: 20px;
            fill: none !important;
            stroke: currentColor;
          }
        }
      }

      .error-message {
        margin-top: 8px;
        font-size: 0.875rem;
        color: #ef4444;
      }
    }

    .action-buttons-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 32px;
      margin-bottom: 24px;

      .google-signin-btn {
        width: 54px;
        height: 54px;
        border: none !important;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        &:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .google-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .get-started-btn {
        flex: 1;
        height: 64px;
        background: linear-gradient(-120deg, #3bdcb8 0%, #35e834 20%);
        border: none;
        border-radius: 100px;
        font-size: 1.05rem;
        font-weight: 500;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 12px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba($primary, 0.3);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba($primary, 0.4);

          &::before {
            transform: translateX(100%);
          }
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        ::v-deep .icon {
          width: 28px;
          height: 28px;
        }
      }
    }
  }
}
</style>
