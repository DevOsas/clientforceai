import { Extension, mergeAttributes } from '@tiptap/core'

const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      levels: 7,
      unit: 'em',
    }
  },

  addAttributes() {
    return {
      level: {
        default: 0,
        renderHTML: (attributes) => {
          if (attributes.level === 0) {
            return {}
          }

          return {
            style: `margin-left: ${attributes.level * this.options.unit}`,
          }
        },
        parseHTML: (element) => {
          const marginLeft = parseFloat(element.style.marginLeft)

          if (marginLeft === 0) {
            return { level: 0 }
          }

          return { level: Math.round(marginLeft / this.options.unit) }
        },
      },
    }
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ commands }) => {
          return commands.updateAttributes('paragraph', {
            level: (value) => Math.min(value + 1, this.options.levels - 1),
          })
        },
      outdent:
        () =>
        ({ commands }) => {
          return commands.updateAttributes('paragraph', {
            level: (value) => Math.max(value - 1, 0),
          })
        },
    }
  },

  addNodeView() {
    return {
      props: ['node', 'updateAttributes', 'extension'],

      render(createElement) {
        const component = {
          template: `
            <p :style="{ marginLeft: node.attrs.level * extension.options.unit }" @input="onInput">
              <slot />
            </p>
          `,

          data: () => ({ node: this.node }),

          methods: {
            onInput(event) {
              const level = Math.round(
                parseFloat(event.target.style.marginLeft) /
                  this.extension.options.unit
              )
              this.updateAttributes({ level })
            },
          },
        }

        return createElement(component, {
          props: this.props,
        })
      },

      renderHTML({ HTMLAttributes }) {
        return ['p', mergeAttributes(this.node.attrs.level, HTMLAttributes), 0]
      },
    }
  },
})

export default Indent
