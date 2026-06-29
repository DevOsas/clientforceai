<template>
  <div class="templates-page">
    <b-container>
      <div class="templates-page-header">
        <CategoryTabs :categories="allCategories" />

        <b-button
          v-if="
            limitBalance.templates > 0 || limitBalance.templates == 'unlimited'
          "
          variant="primary"
          class="create-btn shadow"
          @click="$bvModal.show('EmailTemplateEditorModal')"
        >
          <SvgIcon name="plus" class="mr-1" />
          Create
        </b-button>
        <b-button
          v-else
          variant="primary"
          class="create-btn shadow"
          to="/settings/billing"
        >
          <SvgIcon name="plus" class="mr-1" />
          Upgrade
        </b-button>
      </div>

      <div class="templates-page-row">
        <div class="templates-page-sidebar">
          <EmailTemplateSidebarFolders
            :loading="isFoldersLoading"
            :folders="folders"
            :active="folderId"
            :category="activeCategory"
            @select="handleFolderSelect"
            @removed="handleListRemoved"
          />
        </div>

        <div class="templates-page-main">
          <b-skeleton-table
            v-if="isTemplatesLoading"
            class="mt-5"
            :rows="5"
            :columns="6"
          />
          <div
            v-else-if="!isTemplatesLoading && emailTemplates.length < 1"
            class="no-templates"
          >
            <MailBroIl />
            <h4>No templates created</h4>

            <p>Add a new template by clicking on the "Create" button above.</p>
          </div>
          <div v-else>
            <div class="d-flex justify-content-between">
              <div class="d-flex">
                <CheckboxDropdown
                  :checked="isAllChecked"
                  :items="[
                    {
                      value: 'all',
                      label: 'All',
                    },
                    {
                      value: 'none',
                      label: 'None',
                    },
                  ]"
                  @itemClick="handleDropdownItemClick"
                  @change="handleCheckAll"
                />

                <template v-if="selected.length">
                  <b-button
                    v-b-tooltip.hover.bottom
                    title="Delete"
                    variant="outline-dark"
                    class="ml-4"
                    @click="handleDeleteSelected()"
                  >
                    <SvgIcon name="delete" />
                  </b-button>
                </template>
              </div>
            </div>

            <EmailTemplateTable
              v-if="emailTemplates"
              :templates="emailTemplates"
              :selected="selected"
              @select="selected = $event"
              @edit="editTemplate"
            />
            <div v-else class="empty-templates">
              <AddFilesIl class="illustration" />
            </div>
          </div>
        </div>
      </div>
    </b-container>

    <EmailTemplateEditorModal
      :form-data="templateToEdit"
      :category="activeCategory"
      :busy="isbusy"
      @save="handleTemplateSave"
      @closed="handleTemplateFormClosed"
    />

    <!-- bulk delete modal -->
    <b-modal id="DeleteModal" centered hide-header hide-footer>
      <div class="p-5 text-center">
        <Spinner v-if="isDeleting" size="4" />
        <template v-else>
          <h5>
            Are you sure you want to delete
            <strong>{{ selected.length }}</strong> template(s)?
          </h5>

          <div>
            <b-button
              variant="light"
              class="px-4 mr-2 border"
              @click="handleCancelDelete"
            >
              Cancel
            </b-button>

            <b-button
              variant="danger"
              class="px-4"
              @click="DeleteInvokedEmailTemplate"
            >
              Delete
            </b-button>
          </div>
        </template>
      </div>
    </b-modal>
    <!-- end -->
  </div>
</template>

<script>
import CategoryTabs from '~/components/General/CategoryTabs'
import CheckboxDropdown from '~/components/General/CheckboxDropdown'
import EmailTemplateSidebarFolders from '~/components/EmailTemplate/EmailTemplateSidebarFolders'
import EmailTemplateTable from '~/components/EmailTemplate/EmailTemplateTable'
import EmailTemplateEditorModal from '~/components/EmailTemplate/EmailTemplateEditorModal'

import AddFilesIl from '~/assets/illustrations/add-files.svg?inline'
import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'

import {
  ALL_EMAIL_TEMPLATE_FOLDERS_QUERY,
  EMAIL_TEMPLATES_QUERY,
} from '~/graphql/email-template/queries'
import { DELETE_EMAIL_TEMPLATE_MUTATION } from '~/graphql/email-template/mutations'
import { ALL_CATEGORIES_QUERY } from '~/graphql/category/queries'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  middleware: 'auth',

  components: {
    CategoryTabs,
    CheckboxDropdown,
    EmailTemplateSidebarFolders,
    EmailTemplateTable,
    EmailTemplateEditorModal,
    AddFilesIl,
    MailBroIl,
  },

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
      isFetching: false,
      allCategories: [],
      emailTemplates: [],
      changeCategoryId: null,
      selected: [],
      folders: [],
      folderId: 0,
      templateToEdit: {},
      isDeleting: false,
      isbusy: false,

      isTemplatesLoading: false,
      isFoldersLoading: false,
      limitBalance: {},
    }
  },

  apollo: {
    emailTemplates: {
      query: EMAIL_TEMPLATES_QUERY,
      variables() {
        return { category: this.activeCategory }
      },
      watchLoading(isLoading) {
        this.$nextTick(() => {
          this.isTemplatesLoading = isLoading
        })
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    folders: {
      query: ALL_EMAIL_TEMPLATE_FOLDERS_QUERY,
      variables() {
        return { category: this.activeCategory }
      },
      watchLoading(isLoading) {
        this.$nextTick(() => {
          this.isFoldersLoading = isLoading
        })
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
    isAllChecked() {
      return !!(
        this.selected.length &&
        this.selected.length === this.emailTemplates.length
      )
    },

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

  methods: {
    selectAll() {
      this.selected = this.emailTemplates.map((t) => t.id)
    },

    selectNone() {
      this.selected = []
    },

    handleDropdownItemClick(item) {
      if (item.value === 'all') {
        this.selectAll()
      } else if (item.value === 'none') {
        this.selectNone()
      }
    },

    handleCheckAll() {
      if (!this.isAllChecked) {
        this.selectAll()
      } else {
        this.selectNone()
      }
    },

    editTemplate(template) {
      this.templateToEdit = template

      this.$bvModal.show('EmailTemplateEditorModal')
    },

    handleTemplateFormClosed() {
      this.templateToEdit = null
    },

    // delete email template

    handleCancelDelete() {
      this.selected = []

      this.$bvModal.hide('DeleteModal')
    },

    handleDeleteSelected() {
      this.$bvModal.show('DeleteModal')
    },
    DeleteInvokedEmailTemplate() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_EMAIL_TEMPLATE_MUTATION,
          variables: {
            ids: this.selected,
          },
          update: (store, { data: { deleteEmailTemplate } }) => {
            const data = store.readQuery({
              query: EMAIL_TEMPLATES_QUERY,
              variables: {
                category: this.activeCategory,
              },
            })

            data.emailTemplates = data.emailTemplates.filter(
              (emailTemplate) => !this.selected.includes(emailTemplate.id)
            )

            store.writeQuery({
              query: EMAIL_TEMPLATES_QUERY,
              variables: {
                category: this.activeCategory,
              },
              data,
            })
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            text: 'Template(s) has been deleted successfully.',
          })
          this.selected = []
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            text: `An error occurred while processing your request.`,
          })
        })
        .finally(() => {
          this.$bvModal.hide('DeleteModal')

          this.isDeleting = false
        })
    },

    handleFolderSelect() {},

    handleListRemoved() {
      // handleListRemoved
    },
    handleTemplateSave({ id, title, subject, body }) {
      const index = this.emailTemplates.findIndex((t) => t.id === id)
      if (index !== -1) {
        // Update existing template
        this.$set(this.emailTemplates, index, {
          ...this.emailTemplates[index],
          title,
          subject,
          body,
        })
      } else {
        // Add new template to the list
        this.emailTemplates.push({
          id,
          title,
          subject,
          body,
          category: this.activeCategory,
          createdAt: new Date().toISOString(),
        })
      }
      this.templateToEdit = null
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.templates-page {
  padding-top: 40px;
  margin-bottom: 50px;
  min-height: 80vh;

  .no-templates {
    text-align: center;
  }

  .templates-page-header {
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

  .templates-page-row {
    display: flex;

    .templates-page-sidebar {
      width: 220px;
      margin-right: 30px;
    }

    .templates-page-main {
      flex-grow: 1;
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
      width: 383px;
    }
  }
}
</style>
