<template>
  <b-modal
    id="CampaignTemplatesModal"
    size="lg"
    modal-class="campaign-templates-modal"
    hide-header
    hide-footer
    centered
    @hidden="onHidden"
  >
    <template #default="{ hide }">
      <div class="campaign-templates-modal-header">
        <div class="d-flex justify-content-between">
          <div class="templates-switch">
            <b-button
              variant="clear"
              class="switch-btn"
              :class="{ active: typeShowing === 'system' }"
              @click="switchTypeShowing('system')"
            >
              Clientforce templates
            </b-button>
            <b-button
              variant="clear"
              class="switch-btn"
              :class="{ active: typeShowing === 'user' }"
              @click="switchTypeShowing('user')"
            >
              Your saved templates
            </b-button>
          </div>

          <div class="template-input-wrap">
            <b-form-input
              v-model="keyworkInput"
              size="lg"
              placeholder="Search campaign templates"
              @keyup.enter="setSearchKeyword"
            />
            <b-button
              v-if="keyword && keyworkInput === keyword"
              v-b-tooltip.hover
              title="Clear keyword filter"
              variant="link"
              class="clear-btn"
              @click="clearSearch"
            >
              <SvgIcon name="close" />
            </b-button>
            <b-button
              v-else
              v-b-tooltip.hover
              title="Search keyword"
              variant="link"
              class="search-btn"
              @click="setSearchKeyword"
            >
              <SvgIcon name="search" />
            </b-button>
          </div>
        </div>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <div
        v-if="$apollo.queries.templates.loading"
        class="campaign-templates-loading"
      >
        <b-spinner variant="primary" />
      </div>
      <div
        v-else-if="!$apollo.queries.templates.loading && templates.length < 1"
        class="empty-templates"
      >
        <AddFilesIl class="illustration" />
        <p>
          <template v-if="typeShowing === 'user'">
            You have not saved any campaign templates yet.
          </template>
          <template v-if="typeShowing === 'system'">
            There are no Clientforce templates at this time, please check back
            later.
          </template>
        </p>
      </div>
      <custom-scroll v-else>
        <div class="campaign-templates">
          <div
            v-for="template in templates"
            :key="template.id"
            class="campaign-template"
            :class="{ selected: selected && selected.id == template.id }"
            @click="selectTemplate(template)"
          >
            <div class="campaign-template-icon-wrap">
              <SvgIcon
                :name="template.icon ? template.icon : 'layout'"
                class="main-icon"
              />
            </div>
            <div class="template-detail">
              <div class="campaign-template-title text-truncate">
                {{ template.title }}
              </div>
              <div
                v-b-tooltip.hover.bottom
                :title="template.description"
                class="campaign-template-description"
              >
                {{ template.description }}
              </div>

              <b-button
                v-if="typeShowing === 'user'"
                v-b-tooltip.hover
                title="Delete template"
                variant="clear"
                class="delete-btn"
                @click.stop="warnAgainstDelete(template)"
              >
                <SvgIcon name="delete" />
              </b-button>
            </div>
          </div>
        </div>
      </custom-scroll>

      <div class="text-right pt-4">
        <b-button
          variant="link"
          class="text-muted px-4 mr-2"
          :disabled="isLoading"
          pill
          @click="hide"
        >
          Cancel
        </b-button>

        <b-button
          variant="primary"
          class="px-4"
          :disabled="isLoading || !selected"
          pill
          @click="createWithSelected"
        >
          <b-spinner v-if="isLoading" class="mr-1" small />
          Continue
        </b-button>
      </div>

      <b-modal
        id="WarnAgainstDeleteModal"
        centered
        hide-header
        hide-footer
        @hidden="deleteWarningModalOnHide"
      >
        <template #default="{ hide: hideWarning }">
          <div v-if="isDeleting" class="templates-deleting">
            <b-spinner variant="primary" />
          </div>
          <div v-else class="text-center p-4">
            <h4>{{ templateToDelete.title }}</h4>
            <p>Are you sure you want to delete this campaign template</p>

            <div class="mt-4">
              <b-button
                variant="link"
                class="text-dark px-4 mr-1"
                pill
                @click="hideWarning"
              >
                Cancel
              </b-button>
              <b-button
                variant="primary"
                class="px-4 mr-1"
                pill
                @click="deleteCampaignTemplate"
              >
                Delete
              </b-button>
            </div>
          </div>
        </template>
      </b-modal>
    </template>
  </b-modal>
</template>

<script>
import { CAMPAIGN_TEMPLATES_QUERY } from '~/graphql/campaign/queries'

import AddFilesIl from '~/assets/illustrations/add-files.svg?inline'

import {
  CREATE_CAMPAIGN_FROM_TEMPLATE_MUTATION,
  DELETE_CAMPAIGN_TEMPLATE_MUTATION,
} from '~/graphql/campaign/mutations'

export default {
  components: { AddFilesIl },

  data() {
    return {
      isLoading: false,
      templates: [],
      selected: null,
      typeShowing: 'system',
      isDeleting: false,
      templateToDelete: null,
      keyword: '',
      keyworkInput: '',
    }
  },

  apollo: {
    templates: {
      query: CAMPAIGN_TEMPLATES_QUERY,
      variables() {
        return {
          type: this.typeShowing,
          keyword: this.keyword,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  methods: {
    switchTypeShowing(type) {
      this.typeShowing = type
    },

    setSearchKeyword() {
      this.keyword = this.keyworkInput
    },

    clearSearch() {
      this.keyword = ''
      this.keyworkInput = ''
    },

    selectTemplate(template) {
      if (this.selected && this.selected.id === template.id) {
        this.selected = null

        return
      }

      this.selected = template
    },

    createWithSelected() {
      this.isLoading = true

      this.$apollo
        .mutate({
          mutation: CREATE_CAMPAIGN_FROM_TEMPLATE_MUTATION,
          variables: {
            id: this.selected.id,
          },
        })
        .then(({ data }) => {
          console.log('Campaign creation response:', data)
          const campaign = data.createCampaignFromTemplate || data.campaign
          
          if (campaign && campaign.id) {
            this.$router.push(
              {
                name: 'campaign-id-setup-steps',
                params: { id: campaign.id },
              },
              () => {
                this.isLoading = false
                this.$bvModal.hide('CampaignTemplatesModal')
              }
            )
          } else {
            this.isLoading = false
            this.$notify({
              group: 'main',
              type: 'error',
              title: 'Campaign Creation Failed',
              text: 'Invalid response from server. Please try again.',
            })
          }
        })
        .catch((error) => {
          this.isLoading = false
          console.error('Campaign creation error:', error)
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Campaign Creation Failed',
            text: 'Unable to create campaign from template. Please try again.',
          })
        })
    },

    warnAgainstDelete(template) {
      this.templateToDelete = template

      this.$bvModal.show('WarnAgainstDeleteModal')
    },

    deleteWarningModalOnHide() {
      this.templateToDelete = null
    },

    deleteCampaignTemplate() {
      this.isDeleting = true
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: DELETE_CAMPAIGN_TEMPLATE_MUTATION,
          variables: { id: this.templateToDelete.id },
          update: this.removeDeletedCampaign,
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: `Campaign template <strong>${this.templateToDelete.title}</strong> deleted successfully`,
          })

          this.isDeleting = false
          this.$bvModal.hide('WarnAgainstDeleteModal')
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to delete',
            text: 'An error occurred while processing your request.',
          })

          this.isDeleting = false
          this.$bvModal.hide('WarnAgainstDeleteModal')
          this.$nuxt.$loading.finish()
        })
    },

    removeDeletedCampaign(store, { data: { isDeleted } }) {
      try {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: CAMPAIGN_TEMPLATES_QUERY,
          variables: { type: this.typeShowing, keyword: this.keyword },
        })

        const templateIndex = data.templates.findIndex((templ) => {
          return templ.id === this.templateToDelete.id
        })

        if (templateIndex !== -1) {
          // Update templates
          data.templates = [
            ...data.templates.slice(0, templateIndex),
            ...data.templates.slice(templateIndex + 1),
          ]
          // Write the templates data back to the cache.
          store.writeQuery({
            query: CAMPAIGN_TEMPLATES_QUERY,
            variables: { type: this.typeShowing, keyword: this.keyword },
            data,
          })
        }
      } catch (err) {
        // Handle error
      }
    },

    onHidden() {
      this.typeShowing = 'system'
      this.selected = null
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.templates-deleting {
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
.campaign-templates-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }

  .modal-body {
    padding: 70px 70px 30px;
  }

  .campaign-templates-modal-header {
    .close-btn {
      font-size: 32px;
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .templates-switch {
      display: flex;
      border-radius: 30px;
      margin-bottom: 25px;
      background-color: $gray-200;

      .switch-btn {
        padding: 10px 40px;
        color: $dark;
        border-radius: 30px;
        font-size: 18px;
        box-shadow: none !important;

        &.active {
          background-color: $primary;
          color: $white;
        }
      }
    }

    .template-input-wrap {
      position: relative;

      .form-control {
        width: 315px;
        border: 1px solid #c4c4c4;
        box-shadow: 0 5px 9px rgba(0, 0, 0, 0.09);
        border-radius: 15px;
        background-color: transparent;
        padding-right: 37px;
        font-size: 17px;

        &::placeholder {
          color: $gray-400;
        }
      }

      .search-btn {
        color: $gray-600;
        font-size: 1.1rem;
        position: absolute;
        right: 15px;
        top: 7px;
        padding: 0;
        box-shadow: none !important;
      }
      .clear-btn {
        color: $gray-600;
        font-size: 1.7rem;
        position: absolute;
        right: 8px;
        top: 2px;
        padding: 0;
        box-shadow: none !important;
      }
    }
  }

  .campaign-templates-loading {
    min-height: 56vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.4rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .empty-templates {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 450px;
    padding: 40px;

    .illustration {
      width: 280px;
    }
  }

  .campaign-templates {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: auto;
    margin-top: 10px;
    padding-top: 20px;
    max-height: 450px;
    overflow-y: auto;
    box-shadow: inset 0 7px 8px -10px $gray-400,
      inset 0 -7px 8px -10px $gray-400;

    .campaign-template {
      width: 430px;
      background-color: $white;
      box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;
      margin-bottom: 35px;
      position: relative;

      .campaign-template-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 118px;
        height: 118px;
        border: 1px solid #6ed160;
        box-sizing: border-box;
        box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        flex-shrink: 0;

        .icon {
          color: $primary;
        }

        .main-icon {
          font-size: 60px;
          margin: 0 5px;
        }
      }

      .template-detail {
        margin-left: 15px;
        flex-grow: 1;
      }

      .campaign-template-title {
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        color: $gray-600;
        line-height: 115.8%;
        margin-bottom: 14px;
        max-width: 240px;
      }

      .campaign-template-description {
        font-size: 14px;
        line-height: 1.4;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-word;
      }

      .delete-btn {
        position: absolute;
        right: 10px;
        bottom: 10px;
        opacity: 0;
      }

      &:hover {
        .delete-btn {
          opacity: 1;
        }
      }

      &.selected,
      &:hover {
        background: #edfeeb;
        border: 1px solid #3abc29;

        .campaign-template-icon-wrap {
          background-color: $primary;

          .icon {
            color: $white;
          }
        }

        .campaign-template-arrow {
          opacity: 1;
        }
      }

      &.selected {
        border-width: 2px;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          border-top: 0 solid transparent;
          border-bottom: 35px solid transparent;
          border-right: 40px solid $primary;
        }

        &::after {
          content: url('~@/assets/icons/selected-check.svg');
          position: absolute;
          top: 0;
          right: 3px;
          height: 12px;
          width: 12px;
        }
      }
    }
  }
}
</style>
