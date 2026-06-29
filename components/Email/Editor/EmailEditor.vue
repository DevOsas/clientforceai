<template>
  <div class="email-editor-wrap">
    <template v-if="editor">
      <EmailEditorInsertButtons
        v-if="hasInsertButtons"
        :editor="editor"
        :show-insert-templates="showInsertTemplates"
        :show-insert-variables="showInsertVariables"
        :show-insert-proposals="showInsertProposals"
      />
      <div class="email-editor-input-wrap" :class="{ decorated }">
        <editor-content :editor="editor" class="email-editor" />
      </div>
      <div v-if="showMenu" class="email-editor-footer">
        <EditorMenuBar :editor="editor" />
        <slot name="footer-right" />
      </div>
    </template>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'

import EmailEditorInsertButtons from '~/components/Email/Editor/EmailEditorInsertButtons'
import EditorMenuBar from '~/components/Email/Editor/EditorMenuBar'

import Indent from '~/components/Editor/Extensions/Indent'

import Proposal from '~/components/Editor/Nodes/Proposal'
import Report from '~/components/Editor/Nodes/Report'

import Variable from '~/components/Editor/Nodes/Variable'

import { nl2br } from '~/utils/helpers'

export default {
  components: {
    EditorContent,
    EmailEditorInsertButtons,
    EditorMenuBar,
  },

  props: {
    value: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: '',
    },

    decorated: {
      type: Boolean,
      default: true,
    },

    showMenu: {
      type: Boolean,
      default: true,
    },

    showInsertTemplates: {
      type: Boolean,
      default: true,
    },

    showInsertVariables: {
      type: Boolean,
      default: true,
    },

    showInsertProposals: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      html: '',
      editor: null,
    }
  },

  computed: {
    hasInsertButtons() {
      return (
        this.showInsertTemplates ||
        this.showInsertVariables ||
        this.showInsertProposals
      )
    },
  },

  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(nl2br(value), false)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Link,
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Indent,
        Image,
        Variable,
        Proposal,
        Report,
      ],
      content: this.value,
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },

      onFocus: (e) => {
        this.$emit('focus', e)
      },

      onBlur: (e) => {
        this.$emit('blur', e)
      },

      editorProps: {
        attributes: {
          class: 'JMEditor',
        },
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/variables';

.email-editor-wrap {
  position: relative;

  .email-editor-input-wrap {
    &.decorated {
      background-color: $white;
      border-radius: 20px;
      box-shadow: 0 8px 24px -3px rgba(0, 0, 0, 0.1);
    }
  }

  .email-editor {
    height: 100%;
    padding: 30px 20px 50px;
    font-size: 1rem;

    p.is-editor-empty:first-child::before {
      content: attr(data-empty-text);
      float: left;
      color: #aaa;
      pointer-events: none;
      height: 0;
      font-style: italic;
    }

    .JMEditor {
      outline: 0;
      min-height: 340px;
    }

    span[data-proposal-id] {
      background-color: $primary;
      color: $white;
      padding: 2px 10px;
      border-radius: 4px;
    }
    span[data-report-id] {
      background-color: $blue;
      color: $white;
      padding: 2px 10px;
      border-radius: 3px;
    }
  }

  .email-editor-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 20px;
    padding: 0 20px;
  }
}
</style>
