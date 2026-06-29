<template>
  <div class="campaign-step-item">
    <div class="step-knob">
      <SvgIcon
        v-b-tooltip.hover
        title="Remove"
        name="delete"
        @click="$emit('remove', step.id)"
      />
    </div>
    <div class="step-header">
      <div class="step-label">
        Step {{ step.number }} - Day
        {{ step.day }}
      </div>

      <b-dropdown variant="link" size="sm" class="delay-time-dropwown" no-caret>
        <template #button-content>
          <SvgIcon name="chevron-down-3" class="chevron-icon" />
        </template>

        <template #default="{ hide }">
          <div class="delay-time-form-wrap">
            <b-form
              method="POST"
              @submit.prevent="setStepDelay(hide)"
              @keydown="delayForm.onKeydown($event)"
            >
              <div class="delay-time-label">Deliver after a delay</div>
              <div class="delay-time-form-row">
                <div class="delay-time-form-group">
                  <input
                    v-model="delayForm.days"
                    type="number"
                    min="0"
                    class="delay-time-form-input"
                  />
                  <label for="" class="delay-time-form-label">Days</label>
                </div>
                <div class="delay-time-form-group">
                  <input
                    v-model="delayForm.hours"
                    type="number"
                    min="0"
                    class="delay-time-form-input"
                  />
                  <label for="" class="delay-time-form-label">Hours</label>
                </div>
                <div class="delay-time-form-group">
                  <input
                    v-model="delayForm.minutes"
                    type="number"
                    :min="minMinutes"
                    class="delay-time-form-input"
                  />
                  <label for="" class="delay-time-form-label">Minutes</label>
                </div>
              </div>
              <div class="delay-form-footer">
                <b-button
                  variant="outline-primary"
                  size="sm"
                  class="px-4 mr-2"
                  pill
                  @click="hide()"
                >
                  Cancel
                </b-button>
                <b-button
                  type="submit"
                  variant="primary"
                  size="sm"
                  class="px-4"
                  pill
                >
                  Save
                </b-button>
              </div>
            </b-form>
          </div>
        </template>
      </b-dropdown>

      <div v-if="showIfNoReply" class="if-no-reply">If no reply</div>
    </div>
    <div class="step-emails">
      <div
        v-for="(email, emailIndex) in step.emails"
        :key="`step-${email.id}`"
        class="step-email-item"
        @click="$emit('edit-email', { step, email })"
      >
        <div class="email-option-name">Option {{ alpha[emailIndex] }}</div>
        <div class="email-subject">
          {{ email.subject }}
        </div>
        <div class="email-body">{{ stripTags(email.body) }}</div>

        <div class="email-item-actions">
          <b-button
            v-b-tooltip.hover
            title="Edit"
            variant="link"
            size="sm"
            @click.stop="$emit('edit-email', { step, email })"
          >
            <SvgIcon name="pencil" />
          </b-button>
          <b-button
            v-b-tooltip.hover
            title="Clone"
            variant="link"
            size="sm"
            @click.stop="$emit('clone-email', { stepId: step.id, email })"
          >
            <SvgIcon name="duplicate" />
          </b-button>
          <b-button
            v-if="getActiveEmails(step.emails).length > 1"
            v-b-tooltip.hover
            title="Delete"
            variant="link"
            size="sm"
            @click.stop="removeEmailOption(step.id, email.id)"
          >
            <SvgIcon name="delete" />
          </b-button>
        </div>
      </div>
    </div>

    <b-button
      v-b-tooltip.hover.bottom
      title="Add new email option"
      variant="add-email-option"
      size="sm"
      @click="$emit('add-email', step)"
    >
      <SvgIcon name="add" />
    </b-button>
  </div>
</template>

<script>
import { stripTags } from '~/utils/helpers'

export default {
  props: {
    index: {
      type: Number,
      required: true,
    },

    step: {
      type: Object,
      required: true,
    },

    showIfNoReply: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const minutes = this.step.inMinutes
    const rem = minutes % 1440

    return {
      alpha: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],

      delayForm: new this.$form({
        days: minutes / 1440,
        hours: rem / 60,
        minutes: rem % 60,
      }),
    }
  },

  computed: {
    minMinutes() {
      const { minutes, hours, days } = this.delayForm
      const sum = minutes + hours + days
      return sum === 0 ? 10 : 0
    },
  },

  methods: {
    removeEmailOption(stepId, emailId) {
      this.$emit('remove-email', { stepId, emailId })
    },

    stripTags,

    getActiveEmails(emails) {
      return emails.filter((email) => !email.deleted)
    },

    setStepDelay(hide) {
      const { minutes, hours, days } = this.delayForm

      this.$emit('set-delay', {
        stepId: this.step.id,
        delay: days * 1440 + hours * 60 + minutes,
      })

      hide()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-step-item {
  padding-bottom: 30px;
  padding-left: 50px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 5px;
    height: 100%;
    background-color: #e0e0e0;
    left: 8px;
    top: 10px;
    transition: all 0.3s ease-in;
  }

  .step-knob {
    position: absolute;
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: $gray-100;
    border: 5px solid #e0e0e0;
    left: 0;
    top: 1px;
    transition: all 0.3s ease-in;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      opacity: 0;
      font-size: 1rem;
      margin-top: 1px;
      cursor: pointer;
      color: $white;
    }
  }

  .step-header {
    margin-bottom: 10px;
    display: flex;

    .step-label {
      font-weight: bold;
    }

    .delay-time-dropwown {
      margin: 0 7px;

      .dropdown-toggle {
        color: $gray-600;
        box-shadow: none;

        .chevron-icon {
          font-size: 1rem;
          line-height: 1;
        }
      }

      .dropdown-menu {
        min-width: 27rem;
      }
    }

    .delay-time-form-wrap {
      padding: 10px 20px;

      .delay-time-label {
        font-size: 1rem;
        margin-bottom: 10px;
        color: $gray-500;
      }

      .delay-time-form-row {
        display: flex;

        .delay-time-form-group {
          margin-right: 15px;

          .delay-time-form-input {
            width: 70px;
            border: 1px solid $gray-500;
            border-radius: 5px;
            outline: none;
            padding: 2px 7px;

            &:focus {
              border: 1px solid $primary;
            }
          }

          .delay-time-form-label {
            color: $gray-600;
            font-size: 0.9rem;
          }
        }
      }

      .delay-form-footer {
        text-align: right;
        margin-top: 15px;
      }
    }

    .if-no-reply {
      color: $gray-500;
    }
  }

  .step-emails {
    margin-bottom: 10px;

    .step-email-item {
      background-color: #f5f5f5;
      border: 1px solid $gray-100;
      padding: 20px;
      box-shadow: 0 0.125rem 0.25rem rgba($dark, 0.2);
      transition: all 0.3s ease-in;
      cursor: pointer;
      border-bottom: 1px solid $gray-300;
      position: relative;

      .email-option-name {
        text-transform: uppercase;
        font-size: 0.8rem;
        margin-bottom: 5px;
        color: $gray-500;
      }

      .email-subject {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .email-body {
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .email-item-actions {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(-50%, 0);
        opacity: 0;

        .btn {
          color: $gray-600;
          box-shadow: none;
        }
      }

      &:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      &:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom: 1px solid $gray-100;
      }

      &:hover {
        border-color: #3abc29;
        background-color: #d0ffca;
        box-shadow: 0 4px 20px -9px rgba(0, 0, 0, 0.2);

        .email-item-actions {
          opacity: 1;
        }
      }
    }
  }

  &:last-of-type {
    &::before {
      display: none;
    }
  }

  .btn-add-email-option {
    box-shadow: none;
    bottom: 27px;
    left: 100px;
    position: absolute;
    opacity: 0;
    background-color: $white;
    padding: 0;
    border-radius: 50%;
    transition: all 0.3s ease-in;

    .icon {
      font-size: 1.5rem;
      line-height: 1;
      color: $gray-600;
    }
  }

  &:hover {
    .step-knob {
      background-color: $primary;
      border: 0;
      width: 30px;
      height: 30px;
      left: -5px;
      top: 0;

      .icon {
        opacity: 1;
      }
    }

    &::before {
      background-color: $primary;
    }

    .btn-add-email-option {
      opacity: 1;
    }
  }
}
</style>
