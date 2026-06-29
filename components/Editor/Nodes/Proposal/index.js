import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'proposal',

  addOptions() {
    return {
      class: 'proposal',
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      'data-proposal-id': {
        default: null,
      },
      'data-title': {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-proposal-id]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        {
          class: this.options.class,
        },
        HTMLAttributes
      ),
      `${node.attrs['data-title']}`,
    ]
  },

  addCommands() {
    return {
      setProposal:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options })
        },
    }
  },
})
