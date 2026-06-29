<template>
  <b-dropdown
    v-b-tooltip.hover.bottom
    title="Highlight color"
    variant="link"
    size="sm"
    toggle-class="menubar__button proposal-editor-back-color-dropdown"
    menu-class="proposal-editor-back-color-menu"
    :disabled="!editor.isEditable"
    @click="onSelectCurrent"
  >
    <template #button-content>
      <div class="back-colore-btn-label">
        <SvgIcon name="pencil" />
        <div class="indicator" :style="`background: ${hex}`"></div>
      </div>
    </template>

    <ProposalEditorColorBoard
      :active-color="activeColor"
      @select="onSelect"
      @reset="editor.chain().focus().unsetHighlight().run()"
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
      hex: '#ffec3d',
      closable: false,
    }
  },

  computed: {
    activeColor() {
      const active = this.editor.getAttributes('highlight').color
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
      this.editor.chain().focus().toggleHighlight({ color }).run()
    },
  },
}
</script>

<style lang="scss">
.proposal-editor-back-color-dropdown {
  .back-colore-btn-label {
    display: inline-block;

    .indicator {
      width: 14px;
      height: 3px;
      margin-top: -2px;
    }
  }
}
.proposal-editor-back-color-menu {
  min-width: 250px;
}
</style>
