<template>
  <div class="campaign-sidebar-box">
    <SidebarListBox :loading="loading" :is-empty="folders.length < 1">
      <template #header>
        Folders
        <b-button variant="add-folder" @click="addNewFolder">
          <SvgIcon name="plus-circle" />
        </b-button>
      </template>
      <template #list>
        <li :class="{ active: active === null }">
          <a
            href="#"
            @click.prevent="$emit('select', { id: null, title: 'all' })"
          >
            All Campaigns
          </a>
        </li>
        <li
          v-for="folder in folders"
          :key="folder.id"
          :class="{ active: active === folder.id }"
        >
          <a href="#" @click.prevent="$emit('select', folder)">
            <span>{{ folder.title }}</span>

            <b-dropdown variant="folder-dropdown" size="sm" no-caret>
              <template #button-content>
                <SvgIcon name="chevron-down-3" />
              </template>
              <b-dropdown-item @click.stop="editFolderItem(folder)">
                Edit
              </b-dropdown-item>
              <b-dropdown-item @click.stop="handleRemoveFolder(folder)">
                Remove
              </b-dropdown-item>
            </b-dropdown>
          </a>
        </li>
      </template>
      <template #empty-list>
        <SvgIcon name="folder-add" class="empty-lists-icon" />
        <p>Folders allow you to easily organize your campaigns.</p>

        <b-button
          variant="primary"
          class="text-uppercase px-3"
          @click="addNewFolder"
        >
          Create Folder
        </b-button>
      </template>
    </SidebarListBox>

    <CampaignFolderFormModal
      :folder-item="folderForEdit"
      @saved="handleFolderItemSaved"
      @closed="handleFolderFormClosed"
    />
  </div>
</template>

<script>
import SidebarListBox from '~/components/General/SidebarListBox'
import CampaignFolderFormModal from '~/components/Campaign/CampaignFolderFormModal'

import { ALL_CAMPAIGN_FOLDERS_QUERY } from '~/graphql/campaign/queries'
import { DELETE_CAMPAIGN_FOLDER_MUTATION } from '~/graphql/campaign/mutations'

export default {
  components: { SidebarListBox, CampaignFolderFormModal },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Number,
      default: null,
    },

    folders: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      folderForEdit: null,
    }
  },

  methods: {
    addNewFolder() {
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

      this.$bvModal.show('CampaignFolderFormModal')
    },

    editFolderItem(folder) {
      this.folderForEdit = folder

      this.$bvModal.show('CampaignFolderFormModal')
    },

    handleFolderFormClosed() {
      if (this.folderForEdit) {
        this.folderForEdit = null
      }
    },

    handleFolderItemSaved(folder) {
      const client = this.$apollo.getClient()

      try {
        const data = client.readQuery({
          query: ALL_CAMPAIGN_FOLDERS_QUERY,
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
          query: ALL_CAMPAIGN_FOLDERS_QUERY,
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    handleRemoveFolder(folder) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: DELETE_CAMPAIGN_FOLDER_MUTATION,
          variables: {
            id: folder.id,
          },
          update: (store, { data: { deleted } }) => {
            const data = store.readQuery({ query: ALL_CAMPAIGN_FOLDERS_QUERY })

            if (deleted) {
              data.folders = data.folders.filter((eachList) => {
                return eachList.id !== folder.id
              })
            }

            store.writeQuery({ query: ALL_CAMPAIGN_FOLDERS_QUERY, data })
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

.campaign-sidebar-box {
  // Styles
}
</style>
