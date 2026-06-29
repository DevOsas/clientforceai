<template>
  <div
    class="figure-wrap"
    :class="{ [node.attrs.class]: true, 'is-active': isActive }"
  >
    <div class="video-figure-menu">
      <b-button
        variant="custom"
        class="video-figure-menu__button"
        :class="{ 'is-active': node.attrs.class === 'is-left' }"
        @click="setAlignment('left')"
      >
        <SvgIcon name="text-align-left" />
      </b-button>

      <b-button
        variant="custom"
        class="video-figure-menu__button"
        :class="{ 'is-active': node.attrs.class === 'is-center' }"
        @click="setAlignment('center')"
      >
        <SvgIcon name="text-align-center" />
      </b-button>

      <b-button
        variant="custom"
        class="video-figure-menu__button"
        :class="{ 'is-active': node.attrs.class === 'is-right' }"
        @click="setAlignment('right')"
      >
        <SvgIcon name="text-align-right" />
      </b-button>
    </div>
    <figure
      ref="content"
      :class="node.attrs.class"
      data-content="video"
    ></figure>
  </div>
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
      isActive: true,
    }
  },

  mounted() {
    document.addEventListener('click', this.clickHandler)
  },

  beforeDestroy() {
    document.removeEventListener('click', this.clickHandler)
  },

  methods: {
    setAlignment(className) {
      this.updateAttrs({
        class: `is-${className}`,
      })
    },

    clickHandler(e) {
      const el = this.$refs.content.querySelector('.overlay')
      this.isActive = el === event.target || el.contains(event.target)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.figure-wrap {
  position: relative;

  &.is-center {
    text-align: center;
  }
  &.is-left {
    text-align: left;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  &.is-right {
    text-align: right;
    float: right;
    margin-left: 20px;
    margin-bottom: 20px;
  }
  &.is-cover {
    text-align: justify;
  }

  .video-figure-menu {
    position: absolute;
    display: flex;
    z-index: 20;
    background: darken($primary, 10);
    border-radius: 5px;
    padding: 10px 20px;
    margin-bottom: 10px;
    right: 50%;
    top: -20px;
    transform: translate(50%, 0);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;

    &__button {
      display: inline-flex;
      background: transparent;
      border: 0;
      color: $white;
      font-weight: bold;
      padding: 0 0.5rem;
      margin-right: 0.2rem;
      border-radius: 5px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        color: $white;
        background-color: rgba($white, 0.1);
      }

      &.is-active {
        color: $white;
        background-color: rgba($white, 0.1);
      }
    }
  }

  &.is-active {
    .video-figure-menu {
      opacity: 1;
      visibility: visible;
    }

    iframe {
      box-shadow: 0 0 0 3px $success;
    }
  }
}
</style>
