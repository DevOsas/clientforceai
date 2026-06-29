<template>
  <div class="lead-sidebar-box">
    <SidebarListBox :loading="loading" :is-empty="lists.length < 1">
      <template #header>
        Lists
        <b-button variant="add-list" @click="addNewList">
          <SvgIcon name="plus-circle" />
        </b-button>
      </template>
      <template #list>
        <li :class="{ active: active === 0 }">
          <a href="#" @click.prevent="$emit('select', { id: 0, title: 'all' })">
            All leads
          </a>
        </li>
        <li
          v-for="list in lists"
          :key="list.id"
          :class="{ active: active === list.id }"
        >
          <a href="#" @click.prevent="$emit('select', list)">
            <span>{{ list.title }}</span>

            <b-dropdown variant="list-dropdown" size="sm" no-caret>
              <template #button-content>
                <SvgIcon name="chevron-down-3" />
              </template>
              <b-dropdown-item @click.stop="editListItem(list)">
                Edit
              </b-dropdown-item>
              <b-dropdown-item @click.stop="handleRemoveList(list)">
                Remove
              </b-dropdown-item>
            </b-dropdown>
          </a>
        </li>
      </template>
      <template #empty-list>
        <SvgIcon name="folder-add" class="empty-lists-icon" />
        <p>Lists allow you to easily organize your contacts.</p>

        <b-button variant="outline-primary" class="px-4" @click="addNewList">
          <SvgIcon name="plus-colored" />
          Create a list
        </b-button>
      </template>
    </SidebarListBox>

    <LeadListFormModal
      :list-item="listForEdit"
      @saved="handleListItemSaved"
      @closed="handleListFormClosed"
    />
  </div>
</template>

<script>
import SidebarListBox from '~/components/General/SidebarListBox'
import LeadListFormModal from '~/components/Lead/LeadListFormModal'

import { ALL_LEAD_LISTS_QUERY } from '~/graphql/lead/queries'
import { DELETE_LEAD_LIST_MUTATION } from '~/graphql/lead/mutations'

export default {
  components: { SidebarListBox, LeadListFormModal },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Number,
      required: true,
    },

    lists: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      listForEdit: null,
    }
  },

  methods: {
    addNewList() {
      let title = 'Untitled'
      if (this.lists.find((l) => l.title === title)) {
        let num = 1
        do {
          title = `Untitled ${num}`
          num++
        } while (this.lists.find((l) => l.title === title))
      }

      this.listForEdit = {
        id: 0,
        title,
      }

      this.$bvModal.show('LeadListFormModal')
    },

    editListItem(list) {
      this.listForEdit = list

      this.$bvModal.show('LeadListFormModal')
    },

    handleListFormClosed() {
      if (this.listForEdit) {
        this.listForEdit = null
      }
    },

    handleListItemSaved(listItem) {
      this.updateQuery(listItem)
    },

    updateQuery(list) {
      const client = this.$apollo.getClient()

      try {
        const data = client.readQuery({
          query: ALL_LEAD_LISTS_QUERY,
        })

        const listIndex = data.lists.findIndex((listItem) => {
          return listItem.id === list.id
        })

        if (listIndex !== -1) {
          // Replace the updated list in place
          data.lists = [
            ...data.lists.slice(0, listIndex),
            list,
            ...data.lists.slice(listIndex + 1),
          ]
        } else {
          // Add the newly added list to the end of the list
          data.lists.push(list)
        }

        // Write the lists data back to cache.
        client.writeQuery({
          query: ALL_LEAD_LISTS_QUERY,
          data,
        })
      } catch (err) {
        // Handle error
      }
    },

    handleRemoveList(list) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: DELETE_LEAD_LIST_MUTATION,
          variables: {
            id: list.id,
          },
          update: (store, { data: { deleted } }) => {
            const data = store.readQuery({ query: ALL_LEAD_LISTS_QUERY })

            if (deleted) {
              data.lists = data.lists.filter((eachList) => {
                return eachList.id !== list.id
              })
            }

            store.writeQuery({ query: ALL_LEAD_LISTS_QUERY, data })
          },
        })
        .then(() => {
          this.$emit('removed', list.id)

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

.lead-sidebar-box {
  // Styles
}
</style>
