<template>
  <div class="proposal-editor-side-fabs">
    <ProposalFabItem
      v-for="fab in fabs"
      :key="fab.id"
      :is-open="active === fab.id"
      :fab="fab"
      :editor="editor"
      @toggle="togglePanel(fab.id)"
      @close="closePanel"
    />
  </div>
</template>

<script>
import ProposalFabItem from '~/components/Proposal/Editor/ProposalFabItem'

export default {
  components: { ProposalFabItem },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      fabs: [
        {
          id: 'image-fab',
          icon: 'image',
          tip: 'Image',
          panel: this.importPanel('ProposalFabImagePanel'),
        },
        {
          id: 'video-fab',
          icon: 'video',
          tip: 'Video',
          panel: this.importPanel('ProposalFabVideoPanel'),
        },
        {
          id: 'table-fab',
          icon: 'table-grid',
          tip: 'Table',
          panel: this.importPanel('ProposalFabTablePanel'),
        },
        {
          id: 'variable-fab',
          icon: 'line-chart',
          tip: 'Variables',
          panel: this.importPanel('ProposalFabVariablesPanel'),
        },
      ],
      active: '',
    }
  },

  methods: {
    togglePanel(panel) {
      if (panel === this.active) {
        return (this.active = '')
      }

      this.active = panel
    },

    closePanel() {
      this.active = ''
    },

    importPanel(panel) {
      return () => import(`~/components/Proposal/Editor/${panel}`)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.proposal-editor-side-fabs {
  position: fixed;
  right: 120px;
  top: 200px;
  display: flex;
  flex-direction: column;
  background-color: $primary;
  border-radius: 30px;
  padding: 20px 0;
  box-shadow: 0 0 3px $gray-400;
}
</style>
