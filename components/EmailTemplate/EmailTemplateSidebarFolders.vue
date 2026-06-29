<template>
  <div class="email-template-sidebar-box">
    <SidebarListBox :loading="loading" :is-empty="folders.length < 1">
      <template #header>
        Folders
        <b-button variant="add-folder" @click="addNewList">
          <SvgIcon name="plus-circle" />
        </b-button>
      </template>
      <template #list>
        <li :class="{ active: active === 0 }">
          <a href="#" @click.prevent="$emit('select', { id: 0, title: 'all' })">
            All Templates
          </a>
        </li>
        <li
          v-for="folder in folders"
          :key="folder.id"
          :class="{ active: active === folder.id }"
        >
          <a href="#" @click.prevent="$emit('select', folder)">
            <span>{{ folder.title }}</span>

            <b-dropdown
              v-if="folder.editable"
              variant="folder-dropdown"
              size="sm"
              no-caret
            >
              <template #button-content>
                <SvgIcon name="chevron-down-3" />
              </template>
              <b-dropdown-item @click.stop="editListItem(folder)">
                Edit
              </b-dropdown-item>
              <b-dropdown-item @click.stop="handleRemoveList(folder)">
                Remove
              </b-dropdown-item>
            </b-dropdown>
          </a>
        </li>
      </template>
      <template #empty-list>
        <SvgIcon name="folder-add" class="empty-lists-icon" />
        <p>Folders allow you to easily organize your templates.</p>

        <b-button variant="outline-primary" class="px-4" @click="addNewList">
          <SvgIcon name="plus-colored" />
          Create a folder
        </b-button>
      </template>
    </SidebarListBox>

    <EmailTemplateFolderFormModal
      :folder-item="folderForEdit"
      :category="category"
      @saved="handleListItemSaved"
      @closed="handleListFormClosed"
    />
  </div>
</template>

<script>
import SidebarListBox from '~/components/General/SidebarListBox'
import EmailTemplateFolderFormModal from '~/components/EmailTemplate/EmailTemplateFolderFormModal'

import { ALL_EMAIL_TEMPLATE_FOLDERS_QUERY } from '~/graphql/email-template/queries'
import { DELETE_EMAIL_TEMPLATE_FOLDER_MUTATION } from '~/graphql/email-template/mutations'

export default {
  components: { SidebarListBox, EmailTemplateFolderFormModal },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Number,
      required: true,
    },

    folders: {
      type: Array,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      folderForEdit: null,
    }
  },

  methods: {
    addNewList() {
      let title = 'Untitled'
      if (this.folders.find((l) => l.title === title)) {
        let num = 1
        do {
          title = `Untitled ${num}`
          num++
        } while (this.folders.find((l) => l.title === title))
      }

      this.folderForEdit = {
        id: 0,
        title,
      }

      this.$bvModal.show('EmailTemplateFolderFormModal')
    },

    editListItem(folder) {
      this.folderForEdit = folder

      this.$bvModal.show('EmailTemplateFolderFormModal')
    },

    handleListFormClosed() {
      if (this.folderForEdit) {
        this.folderForEdit = null
      }
    },

    handleListItemSaved(folderItem) {
      this.updateQuery(folderItem)
    },

    updateQuery(folder) {
      const client = this.$apollo.getClient()

      try {
        const data = client.readQuery({
          query: ALL_EMAIL_TEMPLATE_FOLDERS_QUERY,
          variables: { category: this.category },
        })

        const folderIndex = data.folders.findIndex((folderItem) => {
          return folderItem.id === folder.id
        })

        if (folderIndex !== -1) {
          // Replace the updated folder in place
          data.folders = [
            ...data.folders.slice(0, folderIndex),
            folder,
            ...data.folders.slice(folderIndex + 1),
          ]
        } else {
          // Add the newly added folder to the end of the folder
          data.folders.push(folder)
        }

        // Write the folders data back to cache.
        client.writeQuery({
          query: ALL_EMAIL_TEMPLATE_FOLDERS_QUERY,
          variables: { category: this.category },
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    handleRemoveList(folder) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: DELETE_EMAIL_TEMPLATE_FOLDER_MUTATION,
          variables: {
            id: folder.id,
          },
          update: (store, { data: { deleted } }) => {
            const data = store.readQuery({
              query: ALL_EMAIL_TEMPLATE_FOLDERS_QUERY,
              variables: { category: this.category },
            })

            if (deleted) {
              data.folders = data.folders.filter((eachFolder) => {
                return eachFolder.id !== folder.id
              })
            }

            store.writeQuery({
              query: ALL_EMAIL_TEMPLATE_FOLDERS_QUERY,
              variables: { category: this.category },
              data,
            })
          },
        })
        .then(() => {
          this.$emit('removed', folder.id)

          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$nuxt.$loading.finish()
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-template-sidebar-box {
  // Styles
}
</style>
