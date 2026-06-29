<template>
  <div class="setup-row">
    <notifications group="main" classes="main-notification" />

    <div class="setup-aside">
      <nuxt-link :to="{ name: 'index' }" class="setup-logo">
        Clientforce
      </nuxt-link>
      <div class="aside-content">
        <ul class="setup-steps-list">
          <li
            v-for="step in steps"
            :key="step.label"
            class="setup-step"
            :class="{
              current: isCurrent(step),
              done: isDone(step),
              'has-children': step.children,
            }"
          >
            <nuxt-link :to="step.route" class="step-link">
              <div class="step-number">
                <SvgIcon v-if="isDone(step)" name="check" />
                <template v-else>{{ step.number }}</template>
              </div>
              <div class="step-label">{{ step.label }}</div>

              <div
                v-if="isCurrent(step) && !isChildCurrent(step)"
                class="step-arrow ml-auto"
              >
                <SvgIcon name="straight-right-arrow" />
              </div>
            </nuxt-link>

            <ul v-if="isShowEmailSubMenus(step)" class="setup-sub-steps-list">
              <li
                v-for="child in step.children"
                :key="child.label"
                :class="{ current: isCurrent(child) }"
              >
                <nuxt-link :to="child.route">
                  {{ child.label }}

                  <div v-if="isCurrent(child)" class="step-arrow ml-auto">
                    <SvgIcon name="straight-right-arrow" />
                  </div>
                </nuxt-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="background-wave"></div>
    </div>
    <div class="setup-main">
      <div class="main-content">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SetupLayout',

  data() {
    return {
      steps: [
        {
          number: 1,
          label: 'Personal Details',
          route: { name: 'setup-profile' },
        },
        {
          number: 2,
          label: 'Business Details',
          route: { name: 'setup-business' },
        },
        {
          number: 3,
          label: 'Email Account',
          route: { name: 'setup-email-account' },
          children: [
            {
              label: 'Receiving emails',
              route: { name: 'setup-email-account-receiving' },
            },
            {
              label: 'Sending emails',
              route: { name: 'setup-email-account-sending' },
            },
          ],
        },
      ],
    }
  },

  computed: {
    ...mapState('emailAccount', {
      platform: (state) => state.platform,
    }),
  },

  methods: {
    isCurrent(step) {
      return step.route.name === this.$route.name || this.isChildCurrent(step)
    },

    isChildCurrent(step) {
      if (!step.children || (step.children && step.children.length < 1)) {
        return false
      }

      const matchInChildren = step.children.find(
        (s) => s.route.name === this.$route.name
      )

      return !!matchInChildren
    },

    isDone(step) {
      const current = this.steps.find(
        (s) => s.route.name === this.$route.name || this.isChildCurrent(s)
      )
      return current && step.number < current.number
    },

    isShowEmailSubMenus(step) {
      return (
        this.platform &&
        this.platform !== 'gmail' &&
        step.children &&
        this.isCurrent(step)
      )
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.caps-spaced {
  text-transform: uppercase;
  letter-spacing: 1.3px;
}

.setup-row {
  height: 100vh;
  display: flex;

  .setup-aside {
    width: 35%;
    padding: 70px;
    background-color: $white;
    position: relative;

    .background-wave {
      &::before {
        content: '';
        position: absolute;
        left: 10px;
        bottom: 10px;
        opacity: 0.2;
        border-top: 200px solid transparent;
        border-bottom: 0 solid transparent;
        border-left: 350px solid $primary;
      }
      &::after {
        content: '';
        position: absolute;
        left: 10px;
        bottom: 10px;
        opacity: 0.1;
        border-top: 200px solid transparent;
        border-bottom: 0 solid transparent;
        border-left: 500px solid $primary;
      }
    }

    .setup-logo {
      display: inline-block;
      width: 150px;
      height: 35px;
      margin: auto;
      background: transparent
        url('~@/assets/images/clientforce-logo-150x35.png') center/contain
        no-repeat;
      text-indent: -7000px;
    }

    .aside-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: calc(100% - 200px);
      width: 100%;

      // Extra large devices (large desktops, 1500px and up)
      @media (min-width: 1500px) {
        max-width: 550px;
        margin: auto;
      }

      .setup-steps-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li.setup-step {
          position: relative;

          .step-link {
            font-size: 1rem;
            text-transform: uppercase;
            margin: 40px 0;
            display: flex;
            align-items: center;
            text-decoration: none;

            .step-number {
              width: 35px;
              height: 35px;
              border: 2px solid $gray-300;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 10px;
              font-size: 0.9rem;
              color: $gray-600;

              .icon {
                margin-top: 3px;
              }
            }

            .step-label {
              color: $gray-500;
              margin-top: 3px;
              cursor: pointer;
            }
          }

          &::before {
            content: '';
            width: 3px;
            height: 35px;
            border-radius: 5px;
            position: absolute;
            left: 15px;
            top: 37px;
            background-color: $gray-300;
          }

          &:last-child {
            &::before {
              display: none;
            }
          }

          &.current {
            .step-number {
              border-color: $blue;
              font-weight: bold;
              color: $blue;
            }

            .step-label {
              color: $blue;
            }

            .step-arrow {
              margin-top: 4px;
              color: $gray-400;
            }
          }

          &.done {
            .step-number {
              background-color: $primary;
              border-color: $primary;
              color: $white;
            }
            .step-label {
              color: $gray-400;
            }

            &::before {
              background-color: $primary;
            }
          }

          &.has-children {
            .step-link {
              margin-bottom: 20px;
            }
          }

          ul.setup-sub-steps-list {
            list-style: none;
            padding: 0;
            padding-left: 47px;

            li {
              a {
                color: $gray-500;
                font-size: 1rem;
                margin: 20px 0;
                display: flex;
                align-items: center;
                text-decoration: none;
              }

              &.current {
                a {
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }
  }

  .setup-main {
    padding: 100px;
    width: 65%;
    background-color: #f6f7fa;
    border: 10px solid $white;
    border-left: 0;
    border-radius: 10px;

    .main-content {
      display: flex;
      height: 100%;
      width: 600px;
      margin: auto;
      flex-direction: column;
      justify-content: center;

      .form-control,
      .custom-select {
        border-color: $gray-200;
        box-shadow: 0 2px 5px 0 $gray-200;
        border-radius: 0.3rem;
        font-size: 1.1rem;

        &.right-radius {
          border-radius: 0;
          border-bottom-right-radius: 0.3rem;
          border-top-right-radius: 0.3rem;
        }

        &:focus {
          border-color: $primary;
        }

        &.is-invalid {
          border-color: lighten($danger, 40);
        }

        &::placeholder {
          color: $gray-300;
        }
      }

      legend,
      label {
        color: $gray-600;
        font-size: 1.1rem;
        margin-bottom: 0;
      }
    }

    .top-action {
      color: $gray-600;
      position: absolute;
      top: 55px;
      right: 150px;
    }
  }
}
</style>
