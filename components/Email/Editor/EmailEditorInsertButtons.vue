<template>
  <div class="editor-insert-btns">
    <InsertTemplateDropdown
      v-if="showInsertTemplates"
      variant="editor-insert"
      @insert="insertTemplate"
    />

    <InsertEmailVariablesDropdown
      v-if="showInsertVariables"
      variant="editor-insert"
      @insert="variableInsert"
    />

    <InsertProposalDropdown
      v-if="showInsertProposals"
      variant="editor-insert"
      @insert="insertProposal"
    />

    <!-- <InsertReportDropdown
      v-if="showInsertReports"
      variant="editor-insert"
      @insert="insertReport"
    /> -->
  </div>
</template>

<script>
import InsertTemplateDropdown from '~/components/Email/InsertTemplateDropdown'
import InsertEmailVariablesDropdown from '~/components/Email/InsertEmailVariablesDropdown'
import InsertProposalDropdown from '~/components/Email/InsertProposalDropdown'
// import InsertReportDropdown from '~/components/Email/InsertReportDropdown'

import { nl2br } from '~/utils/helpers'

export default {
  components: {
    InsertTemplateDropdown,
    InsertEmailVariablesDropdown,
    InsertProposalDropdown,
    // InsertReportDropdown,
  },

  props: {
    editor: {
      type: Object,
      default: () => ({}),
    },
    showInsertTemplates: {
      type: Boolean,
      default: true,
    },
    showInsertVariables: {
      type: Boolean,
      default: true,
    },
    showInsertProposals: {
      type: Boolean,
      default: true,
    },
    // showInsertReports: {
    //   type: Boolean,
    //   default: true,
    // },
  },

  methods: {
    insertTemplate(template) {
      this.editor.commands.setContent(nl2br(template.body), true)
    },

    variableInsert(variable) {
      this.editor.commands.setVariable({ tokenName: variable.name })
    },

    insertProposal(proposal) {
      this.editor.commands.setProposal({
        'data-proposal-id': proposal.id,
        'data-title': proposal.title,
      })
    },

    // insertReport(report) {
    //   this.editor.commands.setReport({
    //     id: report.id,
    //     title: report.title,
    //     href: report.url,
    //   })
    // },
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/variables';

.editor-insert-btns {
  margin-bottom: 20px;
  margin-right: -7px;
  display: flex;
  // justify-content: center;

  .btn-editor-insert {
    border: 1px solid $gray-300;
    box-shadow: 0 0 50px -20px rgba(0, 0, 0, 0.7);
    border-radius: 7px;
    // text-transform: uppercase;
    font-size: 0.9rem;
    padding: 5px 17px;
    margin-right: 7px;

    &:focus {
      border-color: $primary;
    }

    .icon {
      margin-left: 10px;
    }
  }
}
</style>
