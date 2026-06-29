import { Node, mergeAttributes } from '@tiptap/core'

export default Node.create({
  name: 'token',

  addOptions() {
    return {
      tokenName: 'tokenName',
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      tokenName: {
        default: this.options.tokenName,
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
      mergeAttributes({ 'data-token': node.attrs.tokenName }, HTMLAttributes),
      `{{ ${node.attrs.tokenName} }}`,
    ]
  },

  addCommands() {
    return {
      setVariable:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options })
        },
    }
  },
})
