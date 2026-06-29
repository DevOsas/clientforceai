<template>
  <div class="proposal-editor-page">
    <b-container>
      <div class="editor-wrap">
        <div class="proposal-title-wrap">
          <b-form-input
            v-model="title"
            placeholder="Proposal title"
            :disabled="!isEditable"
          />
        </div>

        <div class="proposal-section">
          <ProposalEditor
            v-model="content"
            :is-busy="isBusy"
            :editable="isEditable"
            placeholder="Click to add content..."
            @preview="handlePreview"
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
import { SAVE_PROPOSAL_MUTATION } from '~/graphql/proposal/mutations'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  components: { ProposalEditor },

  middleware: 'auth',

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
      limitBalance: {},
    }
  },
  apollo: {
    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
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
    handlePreview() {
      const routeData = this.$router.resolve({
        name: 'proposal-id',
        params: { id: this.id },
      })
      window.open(routeData.href, '_blank')
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
