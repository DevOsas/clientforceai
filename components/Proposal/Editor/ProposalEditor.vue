<template>
  <div class="proposal-editor-wrap">
    <template v-if="editor">
      <ProposalEditorMenuBar
        v-if="editable"
        :editor="editor"
        :is-busy="isBusy"
        @preview="$emit('preview')"
        @copy="$emit('copy')"
        @save="$emit('save')"
      />
      <editor-content :editor="editor" class="proposal-editor" />
      <ProposalEditorSideFabs v-if="editable" :editor="editor" />
    </template>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import { StarterKit } from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { Placeholder } from '@tiptap/extension-placeholder'

// import Image from './Nodes/Image'
import Video from '~/components/Editor/Nodes/Video'
// import Figure from './Nodes/Figure'
// import Figcaption from './Nodes/Figcaption'
import Variable from '~/components/Editor/Nodes/Variable'

// import VideoFigure from './Nodes/VideoFigure'
// import Vidcaption from './Nodes/Vidcaption'

// import Indent from '~/components/Editor/Extensions/Indent'

import ProposalEditorMenuBar from '~/components/Proposal/Editor/ProposalEditorMenuBar'
import ProposalEditorSideFabs from '~/components/Proposal/Editor/ProposalEditorSideFabs'

export default {
  components: {
    EditorContent,

    ProposalEditorMenuBar,
    ProposalEditorSideFabs,
  },

  props: {
    value: {
      type: String,
      default: '',
    },

    editable: {
      type: Boolean,
      default: true,
    },

    placeholder: {
      type: String,
      default: '',
    },

    isBusy: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      editor: null,
    }
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

      this.editor.commands.setContent(value, false)
    },

    editable(editable) {
      this.editor.setEditable(editable)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Link,
        // Indent,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Image,
        Video,
        Table.configure({
          resizable: true,
        }),
        TableCell,
        TableHeader,
        TableRow,
        Variable,
        Placeholder.configure({
          emptyEditorClass: 'is-editor-empty',
          placeholder: this.placeholder,
        }),
      ],
      content: this.value,
      editable: this.editable,
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
@import '~@/assets/scss/variables';

.proposal-editor-wrap {
  .proposal-editor {
    height: 100%;
    padding: 50px 30px 50px;
    font-size: 1.2rem;

    p.is-editor-empty:first-child::before {
      color: #adb5bd;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }

    img {
      max-width: 100%;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid $gray-400;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        text-align: left;
      }

      .selectedCell::after {
        z-index: 2;
        position: absolute;
        content: '';
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        z-index: 20;
        background-color: #adf;
        pointer-events: none;
      }
    }

    .tableWrapper {
      margin: 1em 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }

    .JMEditor {
      outline: 0;
      min-height: 900px;
    }
  }
}
</style>
