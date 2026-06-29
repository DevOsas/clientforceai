import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'report',

  addOptions() {
    return {
      class: 'report',
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      title: {
        default: null,
      },
      href: {
        default: null,
      },
      class: {
        default: this.options.class,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-token]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        {
          'data-report-id': node.attrs.id,
          class: this.options.class,
        },
        HTMLAttributes
      ),
      `${node.attrs.title}`,
    ]
  },

  addCommands() {
    return {
      setReport:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options })
        },
    }
  },
})
