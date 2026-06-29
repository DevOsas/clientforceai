<template>
  <div class="campaigns-page">
    <b-container>
      <div v-if="campaignsPageLoading" class="campaigns-loading">
        <b-spinner variant="primary" />
      </div>
      <div
        v-else-if="
          statusFilter == 'all' &&
          !folderId &&
          campaignResult.campaigns.length < 1
        "
        class="empty-campaign"
      >
        <MailBroIl class="illustration" />
        <h2 class="title">Start by creating a Campaign</h2>
        <div class="description">
          Add contacts that you would like to get in touch with. You can import
          contacts via a CSV file or add them manually.
        </div>
        <b-button
          v-if="
            limitBalance.campaigns > 0 || limitBalance.campaigns == 'unlimited'
          "
          variant="primary"
          size="lg"
          class="text-uppercase px-5"
          @click="$bvModal.show('NewCampaignModal')"
        >
          Create Campaign
        </b-button>
        <template v-else>
          <h5
            v-if="limitBalance.currentPlan?.limits?.campaigns !== '0'"
            class="text-error text-centered"
          >
            You have exceeded your campaign limit
          </h5>
          <h5
            v-else-if="limitBalance.currentPlan"
            class="text-error text-centered"
          >
            Your current plan do not include campaigns
          </h5>
          <h5 v-else class="text-error text-centered">
            You currently do not have a plan
          </h5>
          <b-button
            variant="primary"
            size="lg"
            class="text-uppercase px-5"
            to="settings/Billing"
          >
            {{ limitBalance.currentPlan ? `upgrade` : `View plans` }}
          </b-button>
        </template>
      </div>
      <div v-else class="campaigns-page-row">
        <div class="campaigns-page-sidebar">
          <CampaignSidebarFolders
            :loading="$apollo.queries.folders.loading"
            :folders="folders"
            :active="folderId"
            @select="handleFolderSelect"
            @removed="handleFolderRemoved"
          />
        </div>
        <div class="campaigns-page-main">
          <div class="d-flex justify-content-between">
            <div class="d-flex align-self-center">
              <CampaignStatusDropdown v-model="statusFilter" />
            </div>

            <b-button
              variant="primary"
              class="create-btn shadow"
              @click="$bvModal.show('NewCampaignModal')"
            >
              <SvgIcon name="plus" class="mr-1" />
              Create
            </b-button>
          </div>
          <div v-if="campaignResult.campaigns.length" class="campaigns-list">
            <div class="campaigns-thead">
              <div class="campaigns-list-row">
                <div class="campaigns-list-col"></div>
                <div class="campaigns-list-col">Campaign Title</div>
                <div class="campaigns-list-col">Leads</div>
                <div class="campaigns-list-col">Open Rate</div>
                <div class="campaigns-list-col">Reply Rate</div>
                <div class="campaigns-list-col">Progress</div>
                <div class="campaigns-list-col">Delivered</div>
                <div class="campaigns-list-col"></div>
              </div>
            </div>

            <div class="campaigns-tbody">
              <div
                v-for="campaign in campaignResult.campaigns"
                :key="campaign.id"
                class="campaigns-list-row"
                :class="{ selected: selected.includes(campaign.id) }"
                @click="openCampaign(campaign)"
              >
                <div class="campaigns-list-col" @click.stop>
                  <SvgIcon
                    v-if="campaign.isArchived"
                    v-b-tooltip.hover
                    title="Archived"
                    name="archive"
                    class="archived-icon"
                  />
                  <b-form-checkbox
                    v-else
                    :checked="campaign.isActive"
                    size="lg"
                    switch
                    @change="updateCampaignStatus(campaign)"
                  />
                </div>
                <div class="campaigns-list-col">
                  {{ campaign.title }}
                </div>
                <div class="campaigns-list-col">
                  <SvgIcon name="user-filled" />
                  {{ campaign.leadsCount }}
                </div>
                <div class="campaigns-list-col">
                  {{ campaign.openRate || 0 }}% ({{ campaign.opensCount }})
                </div>
                <div
                  class="campaigns-list-col"
                  :class="{ 'text-success': campaign.replyRate > 30 }"
                >
                  {{ campaign.replyRate || 0 }}% ({{ campaign.replyCount }})
                </div>
                <div class="campaigns-list-col progress-col">
                  <b-progress :value="campaign.progressRate" />
                </div>
                <div class="campaigns-list-col">
                  <SvgIcon name="email-filled" />
                  {{ campaign.deliveredCount || 0 }}
                </div>
                <div class="campaigns-list-col action-col">
                  <b-dropdown
                    v-if="!campaign.isArchived"
                    variant="campaign-list-dropdown"
                    size="sm"
                    right
                    no-caret
                  >
                    <template #button-content>
                      <SvgIcon name="chevron-down-3" />
                    </template>
                    <template #default="{ hide }">
                      <b-dropdown-item @click.stop="showAddLeadModal(campaign)">
                        <SvgIcon name="add-user" class="mr-1" />
                        Add people
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click.stop="duplicateCampaign(campaign)"
                      >
                        <SvgIcon name="duplicate" class="mr-1" />
                        Duplicate
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click.stop="saveCampaignAsTemplate(campaign)"
                      >
                        <SvgIcon name="text-align-left" class="mr-1" />
                        Save as template
                      </b-dropdown-item>
                      <li
                        role="presentation"
                        class="dropdown-item folder-dropdown-item"
                        @click.stop
                      >
                        <SvgIcon name="folder-alt" class="mr-1" />
                        Move to folder

                        <div class="dropdown-folder-wrap">
                          <div
                            v-if="folders.length < 1"
                            class="dropdown-folder-empty"
                          >
                            You have no campaign folders yet
                          </div>
                          <custom-scroll v-else>
                            <ul class="dropdown-folder-list">
                              <li
                                v-for="folder in filteredFolders(campaign)"
                                :key="folder.id"
                                @click="addToFolder(campaign, folder, hide)"
                              >
                                <SvgIcon name="folder" class="mr-1" />
                                {{ folder.title }}
                              </li>
                            </ul>
                          </custom-scroll>
                        </div>
                      </li>
                      <b-dropdown-item
                        @click.stop="showArchiveCampaignModal(campaign)"
                      >
                        <SvgIcon name="archive" class="mr-1" />
                        Archive
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click.stop="showDeleteWarning(campaign)"
                      >
                        <SvgIcon name="delete" class="mr-1" />
                        Remove
                      </b-dropdown-item>
                    </template>
                  </b-dropdown>
                </div>
              </div>
            </div>

            <div v-if="campaignResult.hasMore">
              <ScrollTrigger
                :enough="showMore"
                @load-more="fetchMoreCampaigns()"
              />
            </div>
          </div>
          <div
            v-else-if="$apollo.queries.campaignResult.loading"
            class="campaigns-loading"
          >
            <b-spinner variant="primary" />
          </div>
          <div v-else class="empty-campaign-folder">
            <MailBroIl class="illustration" />

            <div class="description">No campaigns here.</div>
          </div>
        </div>
      </div>
    </b-container>

    <b-modal id="DeleteCampaignWarningModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isDeleting" class="modal-loading">
          <b-spinner variant="primary" />
        </div>
        <div v-else class="text-center p-4">
          <h4 v-if="campaignToDelete">{{ campaignToDelete.title }}</h4>
          <p>Are you sure you would like to remove this campaign?</p>

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
              @click="handleDeleteCampaign"
            >
              Delete
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>

    <b-modal
      id="ArchiveCampaignModal"
      content-class="text-center px-4 py-3"
      centered
      hide-header
      hide-footer
      @hidden="archiveCampaignModalOnHide"
    >
      <template #default="{ hide }">
        <div v-if="isArchiving" class="modal-loading">
          <b-spinner variant="primary" />
        </div>
        <template v-else>
          <h4 class="mb-3">{{ campaignToArchive.title }}</h4>
          <p class="mb-3">
            Are you sure you would like to archive this campaign? This action
            can not be reverted.
          </p>
          <div class="text-right pr-3 pl-3">
            <b-button variant="link" class="mr-1" pill @click="hide">
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4"
              pill
              @click="archiveCampaign"
            >
              Okay
            </b-button>
          </div>
        </template>
      </template>
    </b-modal>

    <TemplateFromCampaignModal
      :campaign="campaignToSaveAsTemplate"
      @reset="campaignToSaveAsTemplate = {}"
    />

    <NewCampaignModal />
    <NewCampaignNameModal />
    <CampaignTemplatesModal />

    <CampaignAddLeadModal
      @add-via="addLeadsVia"
      @hidden="campaignToAddLead = null"
    />
  </div>
</template>

<script>
import CampaignSidebarFolders from '~/components/Campaign/CampaignSidebarFolders'
import CampaignStatusDropdown from '~/components/Campaign/CampaignStatusDropdown'
import TemplateFromCampaignModal from '~/components/Campaign/TemplateFromCampaignModal'
import NewCampaignModal from '~/components/Campaign/NewCampaignModal'
import NewCampaignNameModal from '~/components/Campaign/NewCampaignNameModal'
import CampaignTemplatesModal from '~/components/Campaign/CampaignTemplatesModal'
import CampaignAddLeadModal from '~/components/Campaign/CampaignAddLeadModal'

import {
  ALL_CAMPAIGN_FOLDERS_QUERY,
  ALL_CAMPAIGNS_QUERY,
} from '~/graphql/campaign/queries'
import {
  DELETE_CAMPAIGN_MUTATION,
  DUPLICATE_CAMPAIGN_MUTATION,
  ARCHIVE_CAMPAIGN_MUTATION,
  MOVE_CAMPAIGN_TO_FOLDER_MUTATION,
  UPDATE_CAMPAIGN_STATUS_MUTATION,
} from '~/graphql/campaign/mutations'

import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  middleware: ['auth', 'setup'],

  components: {
    CampaignSidebarFolders,
    CampaignStatusDropdown,
    TemplateFromCampaignModal,
    NewCampaignModal,
    NewCampaignNameModal,
    CampaignTemplatesModal,
    CampaignAddLeadModal,
    MailBroIl,
  },

  data() {
    return {
      selected: [],
      campaignResult: {
        campaigns: [],
      },
      folders: [],
      limit: 15,
      folderId: null,

      statusFilter: 'all',

      campaignToSaveAsTemplate: {},

      isDeleting: false,
      campaignToDelete: null,

      isArchiving: false,
      campaignToArchive: null,
      showMore: true,
      page: 0,
      limitBalance: {},
    }
  },

  apollo: {
    campaignResult: {
      query: ALL_CAMPAIGNS_QUERY,
      variables() {
        return {
          status: this.statusFilter,
          folderId: this.folderId,
          offset: this.offset,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
    folders: {
      query: ALL_CAMPAIGN_FOLDERS_QUERY,
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
  },

  computed: {
    campaignsPageLoading() {
      return (
        this.statusFilter === 'all' &&
        !this.folderId &&
        !this.offset &&
        !this.page &&
        this.$apollo.queries.campaignResult.loading
      )
    },
  },

  methods: {
    filteredFolders(campaign) {
      return this.folders.filter((folder) => folder.id !== campaign.folderId)
    },

    handleFolderSelect(folder) {
      this.folderId = folder.id
    },

    handleFolderRemoved(folderId) {
      if (this.folderId === folderId) {
        this.folderId = 0
      }
    },

    // Fetch More Campaign
    fetchMoreCampaigns() {
      this.page++
      this.$apollo.queries.campaignResult.loading = false

      // Fetch more data and transform the original result
      this.$apollo.queries.campaignResult.fetchMore({
        variables: {
          offset: this.limit * this.page,
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newCampaigns = fetchMoreResult.campaignResult.campaigns
          const hasMore = fetchMoreResult.campaignResult.hasMore

          this.showMore = hasMore

          return {
            campaignResult: {
              ...previousResult.campaignResult,
              __typename: previousResult.campaignResult.__typename,
              // Merging the tag list
              campaigns: [
                ...previousResult.campaignResult.campaigns,
                ...newCampaigns,
              ],
              hasMore,
            },
          }
        },
      })
    },

    updateCampaignStatus(campaign) {
      const newStatusValue = !campaign.isActive
      const newStatusName = newStatusValue ? 'active' : 'paused'

      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: UPDATE_CAMPAIGN_STATUS_MUTATION,
          variables: {
            id: campaign.id,
            status: newStatusName,
          },
        })
        .then(({ data }) => {
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to precess',
            text: 'An error occurred while processing your request.',
          })

          this.$nuxt.$loading.finish()
        })
    },

    openCampaign(campaign) {
      if (campaign.isArchived) {
        return
      }

      this.$router.push({
        name: 'campaign-id-view-steps',
        params: { id: campaign.id },
      })
    },

    showAddLeadModal(campaign) {
      this.campaignToAddLead = campaign

      this.$bvModal.show('CampaignAddLeadModal')
    },

    addLeadsVia(via) {
      if (this.campaignToAddLead.isArchived) {
        return
      }

      this.$router.push({
        name: 'campaign-id-view-people',
        params: { id: this.campaignToAddLead.id },
        query: {
          addLeadsVia: via,
        },
      })
    },

    duplicateCampaign(campaign) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: DUPLICATE_CAMPAIGN_MUTATION,
          variables: { id: campaign.id },
          update: this.addDuplicateCampaignToList,
        })
        .then(() => {
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    },

    addDuplicateCampaignToList(store, { data: { campaign } }) {
      try {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: ALL_CAMPAIGNS_QUERY,
          variables: { status: this.statusFilter, folderId: this.folderId },
        })

        // Update campaigns
        data.campaignResult.campaigns = [
          campaign,
          ...data.campaignResult.campaigns,
        ]
        // Write the campaigns data back to the cache.
        store.writeQuery({
          query: ALL_CAMPAIGNS_QUERY,
          variables: { status: this.statusFilter, folderId: this.folderId },
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    saveCampaignAsTemplate(campaign) {
      this.campaignToSaveAsTemplate = campaign

      this.$bvModal.show('TemplateFromCampaignModal')
    },

    addToFolder(campaign, folder, hide) {
      if (!(campaign && folder)) return

      this.$nuxt.$loading.start()

      // Hide the dropdown menu
      hide()

      const oldFolderId = campaign.folderId

      this.$apollo
        .mutate({
          mutation: MOVE_CAMPAIGN_TO_FOLDER_MUTATION,
          variables: { id: campaign.id, folderId: folder.id },
          update: (store, { data: { campaign: updated } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: ALL_CAMPAIGNS_QUERY,
              variables: { status: this.statusFilter, folderId: this.folderId },
            })

            const campaignIndex = data.campaignResult.campaigns.findIndex(
              (campgn) => {
                return campgn.id === campaign.id
              }
            )

            if (campaignIndex !== -1) {
              // Update campaigns
              data.campaignResult.campaigns = [
                ...data.campaignResult.campaigns.slice(0, campaignIndex),
                updated,
                ...data.campaignResult.campaigns.slice(campaignIndex + 1),
              ]
              // Write the campaigns data back to the cache.
              store.writeQuery({
                query: ALL_CAMPAIGNS_QUERY,
                variables: {
                  status: this.statusFilter,
                  folderId: this.folderId,
                },
                data,
              })

              if (oldFolderId) {
                this.removeCampaignFromOldFolder(
                  store,
                  campaign.id,
                  oldFolderId
                )
              }
            }
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Campaign moved to folder successfully!',
            text: `The campaign <strong>${campaign.title}</strong> has been moved to <strong>${folder.title}</strong> folder`,
          })

          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Operation failed',
            text: 'An error occurred white processing your request.',
          })

          this.$nuxt.$loading.finish()
        })
    },

    removeCampaignFromOldFolder(store, campaignId, oldFolderId) {
      const data = store.readQuery({
        query: ALL_CAMPAIGNS_QUERY,
        variables: { status: this.statusFilter, folderId: oldFolderId },
      })

      const campaignIndex = data.campaignResult.campaigns.findIndex(
        (campgn) => {
          return campgn.id === campaignId
        }
      )

      if (campaignIndex !== -1) {
        data.campaignResult.campaigns = [
          ...data.campaignResult.campaigns.slice(0, campaignIndex),
          ...data.campaignResult.campaigns.slice(campaignIndex + 1),
        ]
        store.writeQuery({
          query: ALL_CAMPAIGNS_QUERY,
          variables: {
            status: this.statusFilter,
            folderId: oldFolderId,
          },
          data,
        })
      }
    },

    showArchiveCampaignModal(campaign) {
      this.campaignToArchive = campaign

      this.$bvModal.show('ArchiveCampaignModal')
    },

    archiveCampaignModalOnHide() {
      this.campaignToArchive = null
    },

    archiveCampaign() {
      this.isArchiving = true
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: ARCHIVE_CAMPAIGN_MUTATION,
          variables: {
            id: this.campaignToArchive.id,
            status: 'archived',
          },
          update: (store, { data: { campaign } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: ALL_CAMPAIGNS_QUERY,
              variables: { status: this.statusFilter, folderId: this.folderId },
            })

            const campaignIndex = data.campaignResult.campaigns.findIndex(
              (campgn) => {
                return campgn.id === this.campaignToArchive.id
              }
            )

            if (campaignIndex !== -1) {
              // Push the archived campaign to the bottom of the list
              const updatedCampaigns = [
                ...data.campaignResult.campaigns.slice(0, campaignIndex),
                ...data.campaignResult.campaigns.slice(campaignIndex + 1),
                campaign,
              ]
              // Update campaigns
              data.campaignResult.campaigns = updatedCampaigns
              // Write the campaigns data back to the cache.
              store.writeQuery({
                query: ALL_CAMPAIGNS_QUERY,
                variables: {
                  status: this.statusFilter,
                  folderId: this.folderId,
                },
                data,
              })
            }
          },
        })
        .then(() => {
          this.isArchiving = false
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to archive campaign',
            text: 'An error occurred while processing your request.',
          })

          this.isArchiving = false
          this.$nuxt.$loading.finish()
        })
        .finally(() => {
          this.$bvModal.hide('ArchiveCampaignModal')
        })
    },

    showDeleteWarning(campaign) {
      this.campaignToDelete = campaign

      this.$bvModal.show('DeleteCampaignWarningModal')
    },

    handleDeleteCampaign() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_CAMPAIGN_MUTATION,
          variables: {
            id: this.campaignToDelete.id,
          },
          update: this.removeCampaignFromList,
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: `Campaign <strong>${this.campaignToDelete.title}</strong> deleted successfully`,
          })

          this.campaignToDelete = null
          this.isDeleting = false
          this.$bvModal.hide('DeleteCampaignWarningModal')
        })
        .catch((e) => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to delete',
            text: 'An error occurred while processing your request.',
          })

          this.isDeleting = false
          this.$bvModal.hide('DeleteCampaignWarningModal')
        })
    },

    removeCampaignFromList(store, { data: { deleted } }) {
      try {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: ALL_CAMPAIGNS_QUERY,
          variables: { status: this.statusFilter, folderId: this.folderId },
        })

        const campaignIndex = data.campaignResult.campaigns.findIndex(
          (campgn) => {
            return campgn.id === this.campaignToDelete.id
          }
        )

        if (campaignIndex !== -1) {
          const updatedCampaigns = [
            ...data.campaignResult.campaigns.slice(0, campaignIndex),
            ...data.campaignResult.campaigns.slice(campaignIndex + 1),
          ]
          // Update campaigns
          data.campaignResult.campaigns = updatedCampaigns
          // Write the campaigns data back to the cache.
          store.writeQuery({
            query: ALL_CAMPAIGNS_QUERY,
            variables: { status: this.statusFilter, folderId: this.folderId },
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

.modal-loading {
  min-height: 200px;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .spinner-border {
    height: 3rem;
    width: 3rem;
    border-width: 0.4rem;
  }
}

.campaigns-page {
  padding-top: 50px;
  min-height: 80vh;
  margin-bottom: 50px;

  .campaigns-loading {
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.4rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .empty-campaign {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 655px;
    width: 90%;
    margin: auto;
    background: #ededed;
    border-radius: 20px;

    .illustration {
      width: 361px;
    }

    .title {
      font-weight: bold;
      font-size: 30px;
      margin-bottom: 20px;
    }

    .description {
      width: 650px;
      text-align: center;
      margin-bottom: 30px;
      font-size: 20px;
      line-height: 129.3%;
      color: $gray-600;
    }
  }

  .create-btn {
    padding: 5px 15px;
    font-weight: bold;
    font-size: 1.2rem;
    align-self: center;
  }

  .campaigns-page-row {
    display: flex;

    .campaigns-page-sidebar {
      width: 220px;
      margin-right: 30px;
    }

    .campaigns-page-main {
      flex-grow: 1;

      .campaigns-list {
        margin-top: 30px;

        .campaigns-list-row {
          display: flex;
          align-items: center;
          cursor: pointer;

          .campaigns-list-col {
            font-size: 17px;
            line-height: 21px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: center;

            &:nth-child(1) {
              width: 60px;
              min-height: 30px;
              padding-left: 5px;
              text-align: left;

              .custom-control-input {
                &:not(:checked) {
                  ~ .custom-control-label {
                    &::before {
                      background-color: transparent;
                    }
                  }
                }
              }

              .archived-icon {
                font-size: 25px;
                margin-left: 5px;
              }
            }

            &.progress-col {
              .progress {
                width: 95px;
                margin: auto;
                height: 10px;
                background: $white;
                border: 1px solid #323232;
                box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.25);
                border-radius: 20px;

                .progress-bar {
                  background: linear-gradient(
                    270deg,
                    #24ad11 -6.25%,
                    #93f986 109.38%
                  );
                  border-radius: 20px;
                }
              }
            }

            &.action-col {
              overflow: initial;
              text-align: right;

              .btn-campaign-list-dropdown {
                box-shadow: none;
                opacity: 0;
              }

              .dropdown-item {
                padding: 0.45rem 1.5rem;

                &.folder-dropdown-item {
                  position: relative;

                  .dropdown-folder-wrap {
                    position: absolute;
                    top: 0;
                    left: -180px;
                    width: 180px;
                    background-color: $white;
                    box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.25);
                    border-radius: 5px;
                    opacity: 0;

                    .dropdown-folder-empty {
                      padding: 20px;
                      text-align: center;
                      white-space: initial;
                      color: $dark;
                      font-size: 0.9rem;
                    }

                    .dropdown-folder-list {
                      list-style: none;
                      padding: 0;
                      margin: 10px 0;
                      max-height: 250px;

                      li {
                        padding: 0.45rem 15px;
                        color: $dark;

                        &:hover {
                          background-color: $gray-100;
                        }

                        &:active {
                          color: $white;
                          background-color: $primary;
                        }
                      }
                    }
                  }

                  &:hover {
                    .dropdown-folder-wrap {
                      opacity: 1;
                    }
                  }
                }
              }
            }

            &:nth-child(2) {
              width: 220px;
              text-align: left;
            }

            &:nth-child(3) {
              width: 120px;
            }
            &:nth-child(4) {
              width: 120px;
            }
            &:nth-child(5) {
              width: 120px;
            }
            &:nth-child(6) {
              width: 120px;
            }
            &:nth-child(7) {
              width: 120px;
            }
            &:nth-child(8) {
              width: 40px;
            }
          }

          &:hover {
            .campaigns-list-col {
              &.action-col {
                .btn-campaign-list-dropdown {
                  opacity: 1;
                }
              }
            }
          }
        }

        .campaigns-thead {
          .campaigns-list-row {
            margin-bottom: 20px;
            padding: 0 25px;

            .campaigns-list-col {
              font-size: 1rem;
              font-weight: bold;
              color: $gray-700;
              text-transform: uppercase;
            }
          }
        }

        .campaigns-tbody {
          .campaigns-list-row {
            background-color: #f4f4f4;
            border-radius: 10px;
            margin-bottom: 15px;
            padding: 15px 25px;
            transition: all 0.3s ease-in;

            &.selected {
              background-color: #84fd74;
            }
          }
        }
      }

      .empty-campaign-folder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background-color: $gray-100;
        margin-top: 30px;
        border-radius: 10px;
        padding: 40px 0 70px;

        .illustration {
          height: 350px;
        }

        .description {
          width: 50%;
          margin: auto;
          margin-top: -35px;
          font-size: 1.1rem;
          text-align: center;
        }
      }
    }
  }
}
</style>
