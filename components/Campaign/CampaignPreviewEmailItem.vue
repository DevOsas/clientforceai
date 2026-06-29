<template>
  <div class="email-item" :class="{ collapsed }">
    <div class="email-header">
      <div class="d-flex align-items-center">
        <div class="email-option">{{ option }}</div>
        <div class="email-subject">
          <template v-if="collapsed">{{ email.subject }}</template>
          <b-form-input v-else :value="email.subject" />
        </div>
      </div>

      <b-button
        variant="email-toggle"
        size="sm"
        @click="$emit('toggle', email)"
      >
        <SvgIcon :name="collapsed ? 'chevron-down-3' : 'chevron-up'" />
      </b-button>
    </div>
    <div class="email-body">
      <template v-if="collapsed">{{ email.body }}</template>
      <EmailEditor
        v-else
        :value="nl2br(email.body)"
        placeholder="Write some dazzling email ..."
        :show-insert-templates="false"
        :show-insert-variables="false"
        :show-insert-proposals="false"
        :show-insert-reports="false"
        :decorated="false"
      />
    </div>
  </div>
</template>

<script>
import EmailEditor from '~/components/Email/Editor/EmailEditor'

import { nl2br } from '~/utils/helpers'

export default {
  components: { EmailEditor },

  props: {
    email: {
      type: Object,
      required: true,
    },

    option: {
      type: String,
      required: true,
    },

    collapsed: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    nl2br,
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-item {
  background-color: #f5f5f5;
  border: 1px solid $gray-100;
  padding: 5px 20px 20px;
  box-shadow: 0 0.125rem 0.25rem rgba($dark, 0.2);
  transition: all 0.3s ease-in;
  border-bottom: 1px solid $gray-300;
  position: relative;

  .email-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;

    .email-option {
      margin-right: 15px;
      font-weight: bold;
      color: $gray-600;
    }

    .email-subject {
      font-weight: bold;
      width: 550px;

      .form-control {
        background-color: transparent;
        border-color: transparent;
        box-shadow: none;
        padding: 0;
        height: inherit;
        line-height: inherit;
        font-weight: bold;
      }
    }
    .btn-email-toggle {
      padding: 0;
      box-shadow: none;

      &:active {
        box-shadow: none !important;
      }
    }
  }

  .email-body {
    font-size: 1rem;
    padding: 10px 0 0;

    .email-editor-wrap {
      .menubar {
        bottom: -1px;
      }
      .email-editor {
        padding: 10px 0 30px;
        font-size: 1.1rem;

        .JMEditor {
          min-height: 72px;
        }
      }

      .email-editor-footer {
        bottom: 0;
      }
    }
  }

  &.collapsed {
    .email-body {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
