<template>
  <b-nav-item-dropdown
    ref="EmailValidationDropdown"
    class="email-validations-dropdown"
    toggle-class="email-validation-icon"
    right
    no-caret
    @show="hideUnreadCount"
    @shown="handleShown"
  >
    <template #button-content>
      <b-button
        v-b-tooltip.hover.bottom
        :title="lead.emailValidatedAt ? 'Validation details' : 'Validate Lead'"
        :variant="lead.emailValidatedAt ? 'success' : 'lead-action'"
      >
        <SvgIcon name="verified" class="action-icon" />
      </b-button>
    </template>
    <div class="email-validations-dropdown-content">
      <div class="email-validation-header">
        <h4 class="email-validation-heading">Email Validation</h4>
      </div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum corporis
      consequuntur ullam quam, repudiandae assumenda eaque tempore consequatur,
      totam, omnis tenetur natus. Nostrum, quae. Impedit aspernatur qui dolorem
      tempore sapiente.
    </div>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  props: {
    lead: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {}
  },

  apollo: {},

  methods: {
    handleShown() {},
    hideUnreadCount() {},
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-validations-dropdown {
  .email-validation-icon {
    fill: #fff;
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
    transition: opacity 0.6s ease;
    margin-top: 1px;

    &.notify {
      animation: ring 1.5s ease;
    }
  }

  .dropdown-toggle {
    outline: none;
    position: relative;
  }

  .unread-count {
    position: absolute;
    top: 9px;
    left: 18px;
    font-size: 0.7rem;
    background-color: red;
    padding: 0 2px;
    line-height: 1.2;
    border-radius: 1px;
    font-weight: bold;
    max-width: 18px;
    min-width: 9px;
    overflow: hidden;
    color: $white;
  }

  .dropdown-menu {
    top: 50px;
    border-radius: 7px;
    min-width: 355px;
    min-height: 442px;
    right: -70px;
    padding-bottom: 0;
    margin-top: -4px;

    &::after,
    &::before {
      position: absolute;
      display: inline-block;
      border-bottom-color: rgba(0, 0, 0, 0.2);
      content: '';
    }
    &::before {
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid #ebebeb;
      right: 75px;
      top: -10px;
    }
    &::after {
      border-right: 8px solid transparent;
      border-bottom: 8px solid #fff;
      border-left: 8px solid transparent;
      right: 77px;
      top: -8px;
    }
  }

  .email-validations-dropdown-content {
    padding: 10px 0;
    width: 100%;

    .email-validation-header {
      padding: 0 15px;
      border-bottom: 1px solid $gray-100;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .email-validation-heading {
        font-size: 1.3rem;
      }
    }

    .email-validation-wrap {
      min-height: 250px;
      max-height: 390px;
    }

    .email-validation-loading {
      padding: 0 15px;
    }

    .email-validation-list {
      list-style: none;
      padding: 0;

      .email-validation-item {
        display: flex;
        align-items: center;
        padding: 7px 15px;
        border-bottom: 1px solid $gray-100;
        cursor: pointer;

        &.unread {
          background-color: rgba($primary, 0.04);
        }

        &:last-child {
          border-bottom: 0;
        }

        .icon-wrap {
          width: 50px;
          height: 50px;
          color: #446a39;
          background-color: #ebf2eb;
          margin-right: 10px;
          border-radius: 50%;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .email-validation-detail {
          width: 80%;
          .title {
            font-size: 0.9rem;
            font-weight: bold;
            color: $gray-600;
          }
          .description {
            font-size: 0.8rem;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .create-date {
            font-size: 0.75rem;
            color: $gray-500;
          }
        }
        .email-validation-actions-wrap {
          width: 10%;
          display: flex;
          align-items: center;
          cursor: default;

          .status-icon,
          .remove-icon {
            margin-top: 0;
            cursor: pointer;
            padding: 2px;
            line-height: 1;
            box-shadow: none;
            font-size: 0.6rem;
            opacity: 0;

            .icon {
              width: 0.5rem;
              height: 0.5rem;
            }
          }
          .status-icon {
            margin-right: 3px;

            &.unread {
              color: darken($primary, 10);
              opacity: 1;
            }
          }
        }

        &:hover {
          background-color: $gray-100;

          &.unread {
            background-color: rgba($primary, 0.1);
          }

          .email-validation-actions-wrap {
            .status-icon,
            .remove-icon {
              opacity: 1;
            }
          }
        }
      }
    }

    .no-email-validation {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 350px;
      text-align: center;
      color: $gray-500;

      .email-validation-il {
        width: 50%;
        height: 200px;
        margin-bottom: 0;
      }
    }
  }

  @-webkit-keyframes ring {
    0% {
      -webkit-transform: rotate(35deg);
    }
    12.5% {
      -webkit-transform: rotate(-30deg);
    }
    25% {
      -webkit-transform: rotate(25deg);
    }
    37.5% {
      -webkit-transform: rotate(-20deg);
    }
    50% {
      -webkit-transform: rotate(15deg);
    }
    62.5% {
      -webkit-transform: rotate(-10deg);
    }
    75% {
      -webkit-transform: rotate(5deg);
    }
    100% {
      -webkit-transform: rotate(0deg);
    }
  }

  @keyframes ring {
    0% {
      -webkit-transform: rotate(35deg);
      transform: rotate(35deg);
    }
    12.5% {
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }
    25% {
      -webkit-transform: rotate(25deg);
      transform: rotate(25deg);
    }
    37.5% {
      -webkit-transform: rotate(-20deg);
      transform: rotate(-20deg);
    }
    50% {
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }
    62.5% {
      -webkit-transform: rotate(-10deg);
      transform: rotate(-10deg);
    }
    75% {
      -webkit-transform: rotate(5deg);
      transform: rotate(5deg);
    }
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
  }
}
</style>
