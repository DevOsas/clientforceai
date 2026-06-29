<template>
  <figcaption
    ref="content"
    class="vidcaption"
    :class="{ 'is-empty-caption': isEmpty }"
    data-content="video"
    data-default-text="Type caption for video (optional)"
    :contenteditable="node.attrs.contenteditable"
  ></figcaption>
</template>

<script>
export default {
  // there are some props available
  // `node` is a Prosemirror Node Object
  // `updateAttrs` is a function to update attributes defined in `schema`
  // `view` is the ProseMirror view instance
  // `options` is an array of your extension options
  // `selected` is a boolean which is true when selected
  // `editor` is a reference to the TipTap editor instance
  // `getPos` is a function to retrieve the start position of the node
  // `decorations` is an array of decorations around the node
  props: {
    editor: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
    node: {
      type: Object,
      required: true,
    },
    updateAttrs: {
      type: Function,
      required: true,
    },
    view: {
      type: Object,
      required: true,
    },
    decorations: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isEmpty: this.node.textContent === '',
    }
  },

  watch: {
    'node.textContent'(text) {
      this.isEmpty = text === ''
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

figcaption.vidcaption {
  font-size: 1rem;
  color: $gray-500;
  font-style: italic;

  &.is-empty-caption {
    &::before {
      content: attr(data-default-text);
      color: #aaa;
      pointer-events: none;
      height: 0;
      position: absolute;
      right: 50%;
      transform: translate(50%, 0);
    }
  }
}
</style>
