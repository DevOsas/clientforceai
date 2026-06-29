<template>
  <b-dropdown
    v-b-tooltip.hover.bottom
    title="Text color"
    variant="link"
    size="sm"
    toggle-class="menubar__button proposal-editor-fore-color-dropdown"
    menu-class="proposal-editor-fore-color-menu"
    :disabled="!editor.isEditable"
    @click="onSelectCurrent"
  >
    <template #button-content>
      <div class="fore-colore-btn-label">
        <SvgIcon name="coloring" />
        <div class="indicator" :style="`background: ${hex}`"></div>
      </div>
    </template>

    <ProposalEditorColorBoard
      :active-color="activeColor"
      @select="onSelect"
      @reset="editor.chain().focus().unsetColor().run()"
    />
  </b-dropdown>
</template>

<script>
import ProposalEditorColorBoard from '~/components/Proposal/Editor/ProposalEditorColorBoard'

export default {
  components: { ProposalEditorColorBoard },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      hex: '#ff4d4f',
      closable: false,
    }
  },

  computed: {
    activeColor() {
      const active = this.editor.getAttributes('textStyle').color
      return active
    },
  },

  methods: {
    onSelectCurrent() {
      this.onSelect(this.hex)
    },

    onSelect(color) {
      this.closable = true
      this.hex = color
      this.editor.chain().focus().setColor(color).run()
    },
  },
}
</script>

<style lang="scss">
.proposal-editor-fore-color-dropdown {
  .fore-colore-btn-label {
    display: inline-block;

    .indicator {
      width: 14px;
      height: 3px;
      margin-top: -2px;
    }
  }
}
.proposal-editor-fore-color-menu {
  min-width: 250px;
}
</style>
