<template>
  <div class="proposal-editor-page">
    <b-container>
      <div class="editor-wrap">
        <div class="proposal-section">
          <ProposalEditor
            v-model="content"
            :is-busy="isBusy"
            :editable="false"
            placeholder="Click to add content..."
            @copy="handleCopy"
            @save="handleSave"
          />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import ProposalEditor from '~/components/Proposal/Editor/ProposalEditor'
import { PROPOSAL_BY_ID_QUERY } from '~/graphql/proposal/queries'
import {
  COPY_PROPOSAL_MUTATION,
  SAVE_PROPOSAL_MUTATION,
} from '~/graphql/proposal/mutations'

export default {
  components: { ProposalEditor },

  layout: 'bare',

  async asyncData({ app, store, params }) {
    if (parseInt(params.id) === 0) {
      return {}
    }

    const {
      apolloProvider: { defaultClient },
    } = app

    const { data } = await defaultClient.query({
      query: PROPOSAL_BY_ID_QUERY,
      variables: {
        id: parseInt(params.id),
      },
    })

    return {
      proposal: data.proposal,
    }
  },

  data() {
    return {
      proposal: {},
      isBusy: false,
      title: '',
      content: '',
      description: '',
    }
  },

  computed: {
    id() {
      return parseInt(this.$route.params.id)
    },

    category() {
      return this.$route.params.category
    },

    isEditable() {
      return this.category !== 'library'
    },
  },

  watch: {
    proposal(proposal) {
      if (proposal) {
        this.title = proposal.title
        this.content = proposal.body
      }
    },
  },

  mounted() {
    this.title = this.proposal.title
    this.content = this.proposal.body
  },

  methods: {
    handleCopy() {
      this.isBusy = true
      this.$apollo
        .mutate({
          mutation: COPY_PROPOSAL_MUTATION,
          variables: {
            id: this.id,
          },
        })
        .then(({ data: { copyProposal } }) => {
          this.$notify({
            group: 'main',
            type: 'native',
            text: 'Proposal copied successfully.',
          })

          this.$router.push({
            name: 'proposals-category-id',
            params: { category: 'personal', id: copyProposal.id },
          })
        })
        .catch(({ graphQLErrors }) => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            text: 'An error occurred while processing your request',
          })
        })
        .finally(() => {
          this.isBusy = false
        })
    },

    handleSave() {
      this.isBusy = true
      this.$apollo
        .mutate({
          mutation: SAVE_PROPOSAL_MUTATION,
          variables: {
            id: this.id,
            title: this.title,
            description: this.description,
            body: this.content,
            category: this.category,
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success!',
            text: 'Proposal saved successfully.',
          })
        })
        .catch(({ graphQLErrors }) => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            text: 'An error occurred while processing your request',
          })
        })
        .finally(() => {
          this.isBusy = false
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.proposal-editor-page {
  background-color: #ededed;

  .editor-wrap {
    width: 800px;
    min-height: 1100px;
    margin: auto;
    padding-top: 100px;
    padding-bottom: 50px;

    .proposal-title-wrap {
      margin-bottom: 15px;
      box-shadow: 0 0 3px $gray-500;
      border-radius: 10px;

      .form-control {
        font-size: 1.2rem;
        border: 0;
        padding: 0.5rem 2rem;

        &:focus {
          box-shadow: none;
        }

        &::placeholder {
          color: #adb5bd;
          font-style: italic;
        }

        &:disabled {
          background: white;
        }
      }
    }

    .proposal-section {
      background-color: $white;
      box-shadow: 0 0 3px $gray-500;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
