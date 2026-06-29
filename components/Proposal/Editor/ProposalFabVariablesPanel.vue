<template>
  <ProposalFabPanel
    title="Insert variables"
    class="variable-fab-panel"
    @close="$emit('close')"
  >
    <div key="create" class="create-variable-wrap">
      <ul class="variables-list">
        <li
          v-for="variable in variables"
          :key="variable.name"
          class="variable-item"
          @click="insertVariable(variable)"
        >
          <div class="variable-title">{{ variable.title }}</div>
          <div class="variable-token">{{ variable.token }}</div>
        </li>
      </ul>
    </div>
  </ProposalFabPanel>
</template>

<script>
import ProposalFabPanel from '~/components/Proposal/Editor/ProposalFabPanel'

export default {
  components: { ProposalFabPanel },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      variables: [
        {
          title: 'First Name',
          name: 'FirstName',
          token: '{{FirstName}}',
        },
        {
          title: 'Last Name',
          name: 'LastName',
          token: '{{LastName}}',
        },
        {
          title: 'Title',
          name: 'Title',
          token: '{{Title}}',
        },
        {
          title: 'Company',
          name: 'Company',
          token: '{{Company}}',
        },
        {
          title: 'Email',
          name: 'Email',
          token: '{{Email}}',
        },
        {
          title: 'City',
          name: 'City',
          token: '{{City}}',
        },
        {
          title: 'State',
          name: 'State',
          token: '{{State}}',
        },
        {
          title: 'Country',
          name: 'Country',
          token: '{{Country}}',
        },
      ],
    }
  },

  methods: {
    insertVariable(variable) {
      this.editor
        .chain()
        .focus()
        .setVariable({ tokenName: variable.name })
        .run()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.variable-fab-panel {
  .create-variable-wrap {
    padding-top: 10px;
    margin-top: -10px;

    .variables-list {
      list-style: none;
      padding: 0;

      .variable-item {
        display: flex;
        margin-bottom: 5px;
        padding: 2px 10px;
        margin-left: -10px;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: $gray-200;
        }

        .variable-title {
          color: $gray-600;
          margin-right: 5px;
        }

        .variable-token {
          color: $gray-500;
          font-size: 0.7rem;
          align-self: flex-end;
        }
      }
    }
  }
}
</style>
