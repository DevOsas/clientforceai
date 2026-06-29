<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: null,
    },
  },

  render(createElement) {
    const component = require(`~/assets/icons/${this.name}.svg?inline`)

    const sizing = this.size !== null ? `icon-${this.size}` : ''
    const data = {
      class: ['icon', sizing],
      on: {
        click: (e) => this.$emit('click', e),
        mouseover: (e) => this.$emit('mouseover', e),
        mouseleave: (e) => this.$emit('mouseleave', e),
      },
    }
    const children = [createElement(component)]

    return createElement('span', data, children)
  },
}
</script>

<style lang="scss">
.icon {
  display: inline-block;

  > svg {
    width: 1em;
    height: 1em;
    margin-top: -4px;
    fill: currentColor;
  }

  &.icon-sm {
    > svg {
      width: 0.9em;
      height: 0.9em;
    }
  }

  &.icon-lg {
    > svg {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
  &.icon-xl {
    > svg {
      width: 3rem;
      height: 3rem;
    }
  }
}
</style>
