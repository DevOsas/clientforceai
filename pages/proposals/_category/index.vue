<template>
  <div class="proposals-page">
    <b-container>
      <div class="proposal-page-header">
        <CategoryTabs :categories="allCategories" />

        <b-button
          v-if="
            limitBalance.proposals > 0 || limitBalance.proposals == 'unlimited'
          "
          :to="{
            name: 'proposals-category-id',
            params: { category: 'personal', id: 0 },
          }"
          variant="primary"
          class="create-btn shadow"
        >
          <SvgIcon name="plus" class="mr-1" />
          Create
        </b-button>
        <b-button
          v-else
          to="/settings/billing"
          variant="primary"
          class="create-btn shadow"
        >
          <SvgIcon name="plus" class="mr-1" />
          Upgrade
        </b-button>
      </div>
      <div class="proposals-page-row">
        <div class="proposals-page-sidebar">
          <ProposalSidebarFolders
            :loading="isFoldersLoading"
            :folders="folders"
            :active="folderId"
            :category="activeCategory"
            :writable="isWritable"
            @select="handleFolderSelect"
            @removed="handleListRemoved"
          />
        </div>

        <div class="proposals-page-main">
          <div v-if="isProposalsLoading" class="proposals-list">
            <div v-for="num in 6" :key="num" class="proposal-item">
              <div class="proposal-image-wrap">
                <b-skeleton-img class="proposal-image" no-aspect width="100%" />
              </div>
              <div class="proposal-detail">
                <h4 class="proposal-title">
                  <b-skeleton />
                </h4>
                <p class="proposal-description">
                  <b-skeleton width="100%" />
                  <b-skeleton width="90%" />
                  <b-skeleton width="80%" />
                  <b-skeleton width="80%" />
                </p>
              </div>
            </div>
          </div>
          <div
            v-else-if="!isProposalsLoading && proposals.length < 1"
            class="no-proposals"
          >
            <MailBroIl />
            <h4>No proposals created</h4>

            <p>Add a new proposal by clicking on the "Create" button above.</p>
          </div>
          <div v-else class="proposals-list">
            <div
              v-for="proposal in proposals"
              :key="proposal.id"
              class="proposal-item"
              @click="openProposal(proposal)"
            >
              <div class="proposal-image-wrap">
                <img
                  src="@/assets/images/clientforce-symbol.svg"
                  alt=""
                  class="proposal-image"
                />
              </div>
              <div class="proposal-detail">
                <div class="proposal-title">
                  <h5>
                    {{ proposal.title }}
                  </h5>
                  <div v-if="activeCategory == 'personal'">
                    <b-badge v-b-tooltip.hover title="Total sent to leads">
                      {{ proposal.sentToLeads }}
                      <SvgIcon name="mail-send-fill" />
                    </b-badge>
                    <b-badge
                      variant="primary"
                      v-b-tooltip.hover
                      title="Total views"
                    >
                      {{ proposal.views }}
                      <SvgIcon name="eye" />
                    </b-badge>
                  </div>
                </div>
                <p class="proposal-description">
                  {{ proposal.description }}
                </p>

                <b-button
                  v-if="isWritable"
                  class="delete-btn"
                  variant="primary"
                  size="sm"
                  @click.stop="openProposal(proposal)"
                >
                  <SvgIcon name="pencil" />
                  Edit
                </b-button>
                <b-button
                  class="delete-btn"
                  variant="primary"
                  size="sm"
                  @click.stop="previewProposal(proposal)"
                >
                  <SvgIcon name="eye" />
                  Preview
                </b-button>
                <b-button
                  v-if="isWritable"
                  class="delete-btn"
                  variant="secondary"
                  size="sm"
                  @click.stop="showDeleteWarning(proposal)"
                >
                  <SvgIcon name="delete" />
                  Delete
                </b-button>
                <template v-else>
                  <b-button
                    class="delete-btn"
                    variant="primary"
                    size="sm"
                    @click.stop="copyProposal(proposal)"
                  >
                    <SvgIcon name="duplicate" />
                    Use
                  </b-button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-container>

    <b-modal id="DeleteProposalWarningModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isDeleting" class="modal-loading">
          <b-spinner variant="primary" />
        </div>
        <div v-else class="text-center p-4">
          <h4 v-if="proposalToDelete">Delete "{{ proposalToDelete.title }}"</h4>
          <p>Are you sure you would like to delete this proposal?</p>

          <div class="mt-4">
            <b-button
              variant="link"
              class="text-dark px-4 mr-1"
              pill
              @click="hide"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4 mr-1"
              pill
              @click="handleDeleteProposal"
            >
              Delete
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ProposalSidebarFolders from '~/components/Proposal/ProposalSidebarFolders'
import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'
import {
  COPY_PROPOSAL_MUTATION,
  DELETE_PROPOSAL_MUTATION,
} from '~/graphql/proposal/mutations'
import {
  ALL_PROPOSAL_FOLDERS_QUERY,
  ALL_PROPOSAL_QUERY,
} from '~/graphql/proposal/queries'
import CategoryTabs from '~/components/General/CategoryTabs'
import { ALL_CATEGORIES_QUERY } from '~/graphql/category/queries'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  components: { CategoryTabs, ProposalSidebarFolders, MailBroIl },

  middleware: ['auth', 'setup'],

  async asyncData({ app, store, params }) {
    const {
      apolloProvider: { defaultClient },
    } = app

    const { data } = await defaultClient.query({
      query: ALL_CATEGORIES_QUERY,
    })

    return {
      allCategories: data.allCategories,
    }
  },

  data() {
    return {
      allCategories: [],
      proposals: [],
      folders: [],
      folderId: null,
      isProposalsLoading: false,
      isFoldersLoading: false,

      isDeleting: false,
      proposalToDelete: null,
      limitBalance: {},
    }
  },

  computed: {
    activeCategory() {
      return this.$route.params.category
    },

    isWritable() {
      const category = this.allCategories.find(
        (c) => c.slug === this.activeCategory
      )
      return category && category.writable
    },
  },

  apollo: {
    proposals: {
      query: ALL_PROPOSAL_QUERY,
      variables() {
        return {
          category: this.activeCategory,
          folderId: this.folderId,
        }
      },
      watchLoading(isLoading) {
        this.$nextTick(() => {
          this.isProposalsLoading = isLoading
        })
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },

    folders: {
      query: ALL_PROPOSAL_FOLDERS_QUERY,
      variables() {
        return {
          category: this.activeCategory,
        }
      },
      watchLoading(isLoading) {
        this.$nextTick(() => {
          this.isFoldersLoading = isLoading
        })
      },
    },
  },

  methods: {
    openProposal(proposal) {
      if (this.isWritable) {
        this.$router.push({
          name: 'proposals-category-id',
          params: { category: this.$route.params.category, id: proposal.id },
        })
      } else {
        this.previewProposal(proposal)
      }
    },

    previewProposal(proposal) {
      const routeData = this.$router.resolve({
        name: 'proposal-id',
        params: { id: proposal.id },
      })
      window.open(routeData.href, '_blank')
    },

    copyProposal(proposal) {
      this.$nuxt.$loading.start()
      this.$apollo
        .mutate({
          mutation: COPY_PROPOSAL_MUTATION,
          variables: {
            id: proposal.id,
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
          this.$nuxt.$loading.finish()
        })
    },

    handleFolderSelect(folder) {
      if (folder.id) {
        this.folderId = folder.id
      } else {
        this.folderId = null
      }
    },

    handleListRemoved() {
      // handleListRemoved
    },

    showDeleteWarning(proposal) {
      this.proposalToDelete = proposal

      this.$bvModal.show('DeleteProposalWarningModal')
    },

    handleDeleteProposal() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_PROPOSAL_MUTATION,
          variables: {
            id: this.proposalToDelete.id,
          },
          update: this.removeProposalFromList,
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: `Proposal <strong>${this.proposalToDelete.title}</strong> deleted successfully`,
          })

          this.proposalToDelete = null
          this.isDeleting = false
          this.$bvModal.hide('DeleteProposalWarningModal')
        })
        .catch((e) => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to delete',
            text: 'An error occurred while processing your request.',
          })

          this.isDeleting = false
          this.$bvModal.hide('DeleteProposalWarningModal')
        })
    },

    removeProposalFromList(store, { data: { deleted } }) {
      try {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: ALL_PROPOSAL_QUERY,
          variables: { category: this.activeCategory, folderId: this.folderId },
        })

        const proposalIndex = data.proposals.findIndex((proposal) => {
          return proposal.id === this.proposalToDelete.id
        })

        if (proposalIndex !== -1) {
          const updatedProposals = [
            ...data.proposals.slice(0, proposalIndex),
            ...data.proposals.slice(proposalIndex + 1),
          ]
          // Update proposals
          data.proposals = updatedProposals
          // Write the proposals data back to the cache.
          store.writeQuery({
            query: ALL_PROPOSAL_QUERY,
            variables: {
              category: this.activeCategory,
              folderId: this.folderId,
            },
            data,
          })
        }
      } catch (err) {
        // Handle error
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.proposals-page {
  padding-top: 40px;
  margin-bottom: 50px;
  min-height: 80vh;

  .proposal-page-header {
    margin-bottom: 35px;
    display: flex;
    justify-content: space-between;
  }

  .create-btn {
    padding: 5px 15px;
    font-weight: bold;
    font-size: 1.2rem;
    align-self: center;
  }

  .proposals-page-row {
    display: flex;

    .no-proposals {
      text-align: center;
    }

    .proposals-page-sidebar {
      width: 220px;
      margin-right: 40px;
      flex-shrink: 0;

      .sidebar-box {
        width: 100%;
        min-height: 305px;
        background: #ebffe9;
        border: 1px solid $gray-300;
        border-radius: 5px;

        .box-header {
          padding: 20px 20px 10px 30px;
          color: #8f8f8f;
          border-bottom: 1px solid $gray-300;
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;

          .btn {
            padding: 0;
            font-size: 20px;
            line-height: 24px;
            color: #8f8f8f;
            box-shadow: none;
          }
        }

        .box-list {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            a {
              display: flex;
              padding: 10px 15px 0 30px;
              color: $dark;
              text-decoration: none;
              font-size: 1.1rem;
            }

            &.active {
              a {
                color: $primary;
              }
            }
          }
        }
      }
    }

    .proposals-page-main {
      flex-grow: 1;

      .proposals-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .proposal-item {
          width: 470px;
          background: #f4f4f4;
          border: 1px solid $gray-400;
          border-radius: 20px;
          margin-bottom: 30px;
          display: flex;
          padding: 25px;
          cursor: pointer;

          .proposal-image-wrap {
            background-color: #818181;
            box-shadow: -5px 5px 20px rgba(0, 0, 0, 0.25);
            border-radius: 10px;
            width: 170px;
            flex-shrink: 0;
            display: flex;

            .proposal-image {
              width: 100%;
              object-fit: contain;
            }
          }

          .proposal-detail {
            margin-left: 10px;
            flex-grow: 1;

            .proposal-title {
              font-size: 16px;
              color: $dark;
              position: relative;
              margin-bottom: 40px;
              margin-top: 10px;
              display: flex;
              justify-content: space-between;

              &::before {
                content: '';
                position: absolute;
                left: 0;
                bottom: -25px;
                width: 35px;
                height: 14px;
                background-color: #c4c4c4;
              }

              &::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: -20px;
                width: 100%;
                height: 1px;
                background-color: #c4c4c4;
              }
            }
            .proposal-description {
              font-size: 15px;
              color: $dark;
            }

            .delete-btn {
              opacity: 0;
            }
          }

          &:hover {
            box-shadow: -3px 10px 27px -5px rgba(0, 0, 0, 0.15);
            border-color: $primary;

            .proposal-detail {
              .proposal-title {
                &::before {
                  background-color: $primary;
                }
                &::after {
                  background-color: $primary;
                }
              }

              .delete-btn {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
