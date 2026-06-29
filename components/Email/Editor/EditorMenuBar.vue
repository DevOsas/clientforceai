<template>
  <div class="menubar">
    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('bold') }"
      :disabled="!editor.can().chain().focus().toggleBold().run()"
      @click="editor.chain().focus().toggleBold().run()"
    >
      <SvgIcon name="bold" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('italic') }"
      :disabled="!editor.can().chain().focus().toggleItalic().run()"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      <SvgIcon name="italic" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('strike') }"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      @click="editor.chain().focus().toggleStrike().run()"
    >
      <SvgIcon name="strikethrough" />
    </b-button>

    <b-button 
      variant="link" 
      size="sm" 
      class="menubar__button"
      @click="insertLink"
    >
      <SvgIcon name="link" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('underline') }"
      @click="editor.chain().focus().toggleUnderline().run()"
    >
      <SvgIcon name="underline" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('bulletList') }"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <SvgIcon name="list" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('orderedList') }"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <SvgIcon name="ordered-list" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
      @click="editor.chain().focus().setTextAlign('left').run()"
    >
      <SvgIcon name="text-align-left" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
      @click="editor.chain().focus().setTextAlign('center').run()"
    >
      <SvgIcon name="text-align-center" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
      @click="editor.chain().focus().setTextAlign('right').run()"
    >
      <SvgIcon name="text-align-right" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
      @click="editor.chain().focus().setTextAlign('justify').run()"
    >
      <SvgIcon name="text-justified" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('indent') }"
      @click="editor.chain().focus().indent().run()"
    >
      <SvgIcon name="indent" />
    </b-button>

    <b-button
      variant="link"
      size="sm"
      class="menubar__button"
      :class="{ 'is-active': editor.isActive('indent') }"
      @click="editor.chain().focus().outdent().run()"
    >
      <SvgIcon name="outdent" />
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    editor: {
      type: [Object],
      required: true,
    },
  },

  methods: {
    insertLink() {
      const url = window.prompt('Enter URL:')
      if (url) {
        this.editor.chain().focus().setLink({ href: url }).run()
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.menubar {
  .menubar__button {
    color: $gray-600;
    box-shadow: none;

    &:active {
      box-shadow: none !important;
    }
  }
}
</style>
