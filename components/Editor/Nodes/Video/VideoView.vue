<template>
  <div class="iframe" :style="containerStyles">
    <div v-if="selected" class="video-bubble-menu">
      <b-button
        variant="video-bubble-button"
        size="sm"
        @click="toggleEditPanel"
      >
        <SvgIcon name="pencil" />
      </b-button>
    </div>
    <EditVideoPanel
      v-if="isShowEditPanel"
      :attrs="node.attrs"
      @update="updateVideo"
    />
    <div class="overlay"></div>
    <iframe
      ref="iframe"
      class="iframe__embed"
      :src="src"
      :width="width"
      :height="height"
    ></iframe>
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
    getPos: {
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
      isShowEditPanel: false,
    }
  },

  computed: {
    containerStyles() {
      const width = this.width ? `${this.width}px` : null
      const height = this.height ? `${this.height}px` : null

      return { width, height }
    },

    src: {
      get() {
        return this.node.attrs.src
      },
      set(src) {
        this.updateAttrs({
          src,
        })
      },
    },
    height: {
      get() {
        return this.node.attrs.height
      },
      set(height) {
        this.updateAttrs({
          height,
        })
      },
    },
    width: {
      get() {
        return this.node.attrs.width
      },
      set(width) {
        this.updateAttrs({
          width,
        })
      },
    },
  },

  methods: {
    updateVideo(attrs) {
      this.updateAttrs(attrs)

      this.isShowEditPanel = false
    },

    toggleEditPanel() {
      this.isShowEditPanel = !this.isShowEditPanel
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.iframe {
  background-color: $dark;
  position: relative;

  .video-bubble-menu {
    padding: 0 10px;
    border-radius: 30px;
    background: white;
    position: absolute;
    right: 0;
    top: -35px;
    z-index: 3;
    border: 1px solid $gray-200;

    .btn {
      box-shadow: none !important;
    }
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    border: 2px solid transparent;
    background-color: rgba($black, 0);
    z-index: 2;
  }

  &__embed {
    min-width: 200px;
    min-height: 15rem;
    margin-bottom: -8px;
    border: 0;
    position: absolute;
    top: 0;
    right: 0;
  }
}

figure.is-center {
  .iframe {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
