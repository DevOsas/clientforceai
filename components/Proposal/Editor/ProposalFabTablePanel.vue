<template>
  <ProposalFabPanel
    :title="isTableActive ? 'Table controls' : 'Create table'"
    class="table-fab-panel"
    @close="$emit('close')"
  >
    <transition name="slide">
      <div v-if="isTableActive" key="edit" class="table-controls">
        <div class="table-buttons">
          <b-button
            v-b-tooltip.hover.top
            title="Add column before"
            variant="primary"
            class=""
            size="sm"
            @click="editor.chain().focus().addColumnBefore().run()"
          >
            <SvgIcon name="add-col-before" />
          </b-button>
          <b-button
            v-b-tooltip.hover.top
            title="Add column after"
            variant="primary"
            class=""
            size="sm"
            @click="editor.chain().focus().addColumnAfter().run()"
          >
            <SvgIcon name="add-col-after" />
          </b-button>
          <b-button
            v-b-tooltip.hover.top
            title="Delete column"
            variant="primary"
            class=""
            size="sm"
            @click="editor.chain().focus().deleteColumn().run()"
          >
            <SvgIcon name="delete-col" />
          </b-button>
          <b-button
            v-b-tooltip.hover.top
            title="Add row before"
            variant="primary"
            class=""
            size="sm"
            @click="editor.chain().focus().addRowBefore().run()"
          >
            <SvgIcon name="add-row-before" />
          </b-button>
          <b-button
            v-b-tooltip.hover.top
            title="Add row after"
            variant="primary"
            class=""
            size="sm"
            @click="editor.chain().focus().addRowAfter().run()"
          >
            <SvgIcon name="add-row-after" />
          </b-button>
          <b-button
            v-b-tooltip.hover.top
            title="Delete row"
            variant="primary"
            class=""
            size="sm"
            @click="editor.chain().focus().deleteRow().run()"
          >
            <SvgIcon name="delete-row" />
          </b-button>
          <b-button
            v-b-tooltip.hover.top
            title="Merge cells"
            variant="primary"
            class=""
            size="sm"
            @click="editor.chain().focus().mergeCells().run()"
          >
            <SvgIcon name="combine-cells" />
          </b-button>
        </div>

        <b-button
          variant="danger"
          size="sm"
          class="mt-4"
          block
          @click="editor.chain().focus().deleteTable().run()"
        >
          <SvgIcon name="delete-table" />
          Delete table
        </b-button>
      </div>
      <div v-else key="create" class="create-table-wrap">
        <p class="create-table-tip">
          Click and drag on the boxes below to set table rows and columns as
          needed.
        </p>

        <DragSelect
          selector-class="item"
          class="items"
          @change="handleDragChange"
        >
          <div
            v-for="item in createGrid"
            :key="item.index"
            :class="getClasses(item.index)"
            :data-index="item.index"
            :data-row="item.row"
            :data-col="item.col"
          ></div>
        </DragSelect>

        <div class="create-stats">
          <div class="stats-col"><strong>Rows:</strong> {{ rows.length }}</div>
          <div class="stats-col">
            <strong>Columns:</strong> {{ cols.length }}
          </div>
        </div>

        <div class="mt-3">
          <b-button
            variant="primary"
            size="sm"
            class="px-4"
            block
            :disabled="!rows.length && !cols.length"
            @click="insertTable"
          >
            Create table
          </b-button>
        </div>
      </div>
    </transition>
  </ProposalFabPanel>
</template>

<script>
import DragSelect from 'vue-drag-select/src/DragSelect.vue'

import ProposalFabPanel from '~/components/Proposal/Editor/ProposalFabPanel'

export default {
  components: { ProposalFabPanel, DragSelect },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      rows: [],
      cols: [],
      selected: [],
    }
  },

  computed: {
    isTableActive() {
      return this.editor.isActive('table')
    },

    createGrid() {
      let row = 0
      let col = 0
      return Array.from(Array(80).keys()).map((index) => {
        if (index % 8 === 0) {
          row++
        }

        if (col === 8) {
          col = 0
        }
        col++

        return { index, row, col }
      })
    },
  },

  methods: {
    getClasses(index) {
      const isActive = !!this.selected.find((selectedItem) => {
        return parseInt(selectedItem.dataset.index, 10) === index
      })

      return {
        item: true,
        active: isActive,
      }
    },

    handleDragChange(selectedItems) {
      this.rows = []
      this.cols = []

      this.selected = selectedItems

      this.selected.forEach((selectedItem) => {
        if (!this.rows.includes(selectedItem.dataset.row)) {
          this.rows.push(selectedItem.dataset.row)
        }
        if (!this.cols.includes(selectedItem.dataset.col)) {
          this.cols.push(selectedItem.dataset.col)
        }
      })
    },

    insertTable() {
      this.editor
        .chain()
        .focus()
        .insertTable({
          rows: this.rows.length,
          cols: this.cols.length,
          withHeaderRow: false,
        })
        .run()

      this.reset()
    },

    reset() {
      this.selected = []
      this.rows = []
      this.cols = []
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';
.table-fab-panel {
  .table-controls {
    padding-top: 10px;
    margin-top: -10px;
  }

  .create-stats {
    border: 1px solid rgba($primary, 0.2);
    display: flex;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 3px;
    background-color: rgba($primary, 0.1);

    .stats-col {
      padding: 2px 10px;
      width: 50%;
      color: rgba($primary, 0.5);
      font-size: 0.9rem;

      &:first-child {
        border-right: 1px solid rgba($primary, 0.2);
      }
    }
  }

  .create-table-wrap {
    padding-top: 10px;
    margin-top: -10px;

    .create-table-tip {
      font-size: 0.9rem;
    }

    .items {
      display: flex;
      flex-wrap: wrap;
      width: 248px;
      margin: auto;

      .item {
        width: 31px;
        height: 20px;
        border: 1px solid $gray-300;
        background-color: $white;

        &.active {
          background-color: rgb(0, 162, 255);
          color: #fff;
        }
      }
    }
  }
}
.slide-enter-active {
  transition-duration: 0.4s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.4s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 200px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
