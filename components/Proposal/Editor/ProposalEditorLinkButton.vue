<template>
  <b-dropdown
    v-b-tooltip.hover.bottom
    title="Insert Link"
    variant="link"
    size="sm"
    class="proposal-editor-link"
    toggle-class="menubar__button"
    right
    no-caret
    :disabled="!editor.isEditable"
    @show="prepForm"
    @shown="$refs.linkInput.focus()"
    @hidden="resetForm"
  >
    <template #button-content>
      <SvgIcon name="link" />
    </template>
    <div class="proposal-editor-link-form">
      <b-form @submit.prevent="setLinkUrl(linkUrl)">
        <div class="link-input-wrap">
          <b-form-input
            ref="linkInput"
            v-model="linkUrl"
            placeholder="https://"
            type="text"
            size="sm"
            autofocus
          />

          <b-button
            type="submit"
            variant="primary"
            size="sm"
            class="submit-btn"
          >
            <SvgIcon name="check" />
          </b-button>

          <b-button
            variant="primary"
            size="sm"
            class="close-btn"
            @click="setLinkUrl(null)"
          >
            <SvgIcon name="close" />
          </b-button>
        </div>
      </b-form>
    </div>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isFormOpen: false,
      linkUrl: '',
    }
  },

  methods: {
    prepForm() {
      this.linkUrl = this.editor.getAttributes('link').href
    },

    resetForm() {
      this.linkUrl = ''
    },

    setLinkUrl(url) {
      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()

        return
      }

      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.proposal-editor-link {
  .dropdown-menu {
    min-width: 350px;

    .proposal-editor-link-form {
      padding: 5px 10px;

      .link-input-wrap {
        display: flex;

        .form-control {
          box-shadow: none;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        .submit-btn {
          border-radius: 0;
          border-right: 1px solid darken($primary, 2);
        }

        .close-btn {
          border-left: 1px solid lighten($primary, 2);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }
}
</style>
