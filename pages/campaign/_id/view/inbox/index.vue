<template>
  <div class="inbox-thread-list">
    <div v-if="$apollo.queries.threads.loading" class="inbox-loading">
      <b-spinner variant="primary" />
    </div>
    <div v-else-if="groups.length < 1" class="empty-mailbox">
      <MailBoxIl class="illustration" />

      <p class="text-center">
        <template v-if="!categoryId">
          All your replies will go here. <br />
          Send a reply or set a new action for your contacts.
        </template>
        <template v-else> There are no replies in this category </template>
      </p>
    </div>
    <div v-else>
      <div class="d-flex">
        <CheckboxDropdown
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
          class="mr-2"
          :checked="isAllChecked"
          @itemClick="handleDropdownItemClick"
          @change="toggleCheckAll"
        />

        <template v-if="selected.length > 0">
          <b-dropdown variant="outline-gray" toggle-class="mr-2" no-caret>
            <template #button-content>
              Move to
              <SvgIcon name="chevron-down-2" class="ml-1" />
            </template>
            <b-dropdown-item
              v-for="cat in categories"
              :key="cat.id"
              @click="changeThreadsCategory(cat.id)"
            >
              {{ cat.title }}
            </b-dropdown-item>
          </b-dropdown>

          <b-dropdown variant="outline-gray" toggle-class="mr-2" no-caret>
            <template #button-content>
              Mark as
              <SvgIcon name="chevron-down-2" class="ml-1" />
            </template>
            <b-dropdown-item @click="markSelectedAs('read')">
              Read
            </b-dropdown-item>
            <b-dropdown-item @click="markSelectedAs('unread')">
              Unread
            </b-dropdown-item>
          </b-dropdown>

          <b-button
            variant="outline-gray"
            @click="$bvModal.show('RemoveThreadConfirmationModal')"
          >
            <SvgIcon name="delete" />
            Remove
          </b-button>
        </template>
      </div>

      <div class="inbox-category-group-wrapper">
        <CampaignInboxCategoryGroup
          v-for="group in groups"
          :key="group.id"
          :group="group"
          :thread-count="threads.length"
        >
          <div class="email-thread-list">
            <router-link
              v-for="(thread, threadIndex) in group.threads"
              :key="thread.id"
              :to="{
                name: 'campaign-id-view-inbox-threadId',
                params: { id: campaign.id, threadId: thread.id },
              }"
              tag="div"
              class="email-thread-item"
              :class="{
                first: threadIndex === 0,
                last: group.threads.length - 1 === threadIndex,
                new: thread.replies[thread.replies.length - 1].isNew,
              }"
            >
              <div class="checkbox-col" @click.stop>
                <b-form-checkbox
                  size="lg"
                  :checked="selected.includes(thread.id)"
                  @change="check(thread.id)"
                />
              </div>
              <div class="sender-col">
                <div
                  class="text-truncate"
                  :class="{ new: thread.replies[0].isNew }"
                >
                  {{ thread.replies[0].prospectName }}, Me
                </div>
              </div>
              <div class="subject-col">
                <div
                  class="text-truncate"
                  :class="{ new: thread.replies[0].isNew }"
                >
                  {{ thread.replies[0].subject }}
                </div>
              </div>
              <div class="body-col">
                <div class="text-truncate">
                  {{ stripTags(thread.replies[0].htmlBody) }}
                </div>
              </div>
              <div class="date-col">
                <span>{{ thread.replies[0].date }}</span>
              </div>
            </router-link>
          </div>
        </CampaignInboxCategoryGroup>
      </div>
    </div>

    <b-modal
      id="RemoveThreadConfirmationModal"
      centered
      hide-header
      hide-footer
    >
      <template #default="{ hide }">
        <div class="py-4 text-center">
          <h4 class="mb-3">
            Remove Repl{{ selected.length > 1 ? 'ies' : 'y' }}
          </h4>
          <p class="mb-3">
            Are you sure you would like to remove
            {{ selected.length > 1 ? selected.length : 'the selected' }} repl{{
              selected.length > 1 ? 'ies' : 'y'
            }}?
          </p>
          <div class="mt-4">
            <b-button variant="link" class="mr-2 text-dark" pill @click="hide">
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4"
              pill
              @click="removeThreads"
            >
              Okay
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CheckboxDropdown from '~/components/General/CheckboxDropdown'
import CampaignInboxCategoryGroup from '~/components/Campaign/CampaignInboxCategoryGroup'

import MailBoxIl from '~/assets/illustrations/mail-box.svg?inline'

import { EMAIL_THREADS_QUERY } from '~/graphql/campaign/inbox/queries'
import {
  REMOVE_EMAILS_MUTATION,
  MARK_EMAIL_MESSAGES_MUTATION,
  CHANGE_EMAIL_MESSAGES_CATEGORY_MUTATION,
} from '~/graphql/campaign/inbox/mutations'

import { stripTags } from '~/utils/helpers'

export default {
  components: { CheckboxDropdown, CampaignInboxCategoryGroup, MailBoxIl },

  data() {
    return {
      threads: [],
      selected: [],
      activeThread: null,
    }
  },

  apollo: {
    threads: {
      query: EMAIL_THREADS_QUERY,
      variables() {
        return {
          campaignId: parseInt(this.$route.params.id),
          categoryId: this.categoryId,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    ...mapState({
      categories: (state) => state.inbox.categories,
      campaign: (state) => state.campaign.viewing,
    }),

    categoryId() {
      return this.$route.query.category
        ? parseInt(this.$route.query.category)
        : null
    },

    groups() {
      return this.categories.reduce((groups, cat, index) => {
        const catThreads = this.threads.filter(
          (thread) => thread.categoryId === cat.id
        )

        if (catThreads.length) {
          groups.push({
            id: `${cat.id}${index}${catThreads.length}`,
            title: cat.title,
            threads: catThreads,
          })
        }
        return groups
      }, [])
    },

    allGroupsLength() {
      return this.groups.reduce((sum, group) => {
        return (sum += group.threads.length)
      }, 0)
    },

    isAllChecked() {
      return this.selected.length === this.allGroupsLength
    },
  },

  methods: {
    stripTags,

    handleDropdownItemClick(item) {
      if (item.value === 'all') {
        this.checkAll()
      } else if (item.value === 'none') {
        this.checkNone()
      }
    },

    toggleCheckAll() {
      if (!this.isAllChecked) {
        this.checkAll()
      } else {
        this.checkNone()
      }
    },

    checkAll() {
      this.selected = this.threads.map((thread) => thread.id)
    },

    checkNone() {
      this.selected = []
    },

    check(id) {
      this.selected = this.selected.includes(id)
        ? this.selected.filter((check) => check !== id)
        : [...this.selected, id]
    },

    async runRemoveEmailsQuery(messageIds) {
      const campaignId = this.$route.params.id

      this.$nuxt.$loading.start()

      await this.$apollo.mutate({
        mutation: REMOVE_EMAILS_MUTATION,
        variables: {
          campaignId: parseInt(campaignId, 10),
          messages: messageIds,
        },
      })

      this.$apollo.queries.threads.refetch()
      this.$nuxt.$loading.finish()
    },

    async runChangeThreadsCategoryQuery(messageIds, categoryId) {
      const campaignId = this.$route.params.id

      this.$nuxt.$loading.start()
      await this.$apollo.mutate({
        mutation: CHANGE_EMAIL_MESSAGES_CATEGORY_MUTATION,
        variables: {
          campaignId: parseInt(campaignId, 10),
          categoryId: parseInt(categoryId, 10),
          messages: messageIds,
        },
      })

      this.$apollo.queries.threads.refetch()
      this.$nuxt.$loading.finish()
    },

    removeThreads() {
      this.$bvModal.hide('RemoveThreadConfirmationModal')

      const selected = this.selected.map((id) =>
        this.threads.find((thread) => thread.id === id)
      )
      const messageIds = selected.reduce((ids, thread) => {
        ids.push(...thread.replies.map((reply) => reply.messageId))
        return ids
      }, [])

      this.checkNone()

      this.runRemoveEmailsQuery(messageIds)
    },

    markSelectedAs(as) {
      const selected = this.selected.map((id) =>
        this.threads.find((thread) => thread.id === id)
      )
      const messageIds = selected.reduce((ids, thread) => {
        ids.push(...thread.replies.map((reply) => reply.messageId))
        return ids
      }, [])

      this.checkNone()

      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: MARK_EMAIL_MESSAGES_MUTATION,
          variables: {
            campaignId: parseInt(this.$route.params.id, 10),
            messages: messageIds,
            as,
          },
        })
        .then(() => {
          this.$apollo.queries.threads.refetch()
          this.$nuxt.$loading.finish()
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: `Unable to mark messages as ${as}`,
            text: 'An error occurred while processing your request.',
          })
          this.$nuxt.$loading.finish()
        })
    },

    changeThreadsCategory(categoryId) {
      const selected = this.selected.map((id) =>
        this.threads.find((thread) => thread.id === id)
      )

      const messageIds = selected.reduce((ids, thread) => {
        ids.push(...thread.replies.map((m) => m.messageId))
        return ids
      }, [])

      this.checkNone()

      this.runChangeThreadsCategoryQuery(messageIds, categoryId)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';
.inbox-thread-list {
  .inbox-loading {
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.5rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .empty-mailbox {
    background-color: $gray-100;
    padding: 70px 0 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;

    .illustration {
      height: 100%;
    }

    p {
      font-size: 17px;
      line-height: 1.4;
      margin-top: 25px;
    }
  }

  .inbox-category-group-wrapper {
    .email-thread-list {
      padding-left: 20px;

      .email-thread-item {
        display: flex;
        align-items: center;
        margin-top: 25px;
        font-size: 1.1rem;
        cursor: pointer;

        .checkbox-col {
          flex: 1 1 100%;
          max-width: 4%;
          max-height: 100%;
        }

        .sender-col,
        .subject-col {
          flex: 1 1 100%;
          max-width: 20%;
          max-height: 100%;
        }

        .subject-col {
          margin-right: 20px;
        }

        .body-col {
          flex: 1 1 100%;
          max-width: 45%;
          max-height: 100%;
          margin-right: 10px;
        }
        .date-col {
          color: #8f94a0;
          text-align: right;
          flex: 1 1 100%;
          max-width: 10%;
          max-height: 100%;
        }

        &.new {
          .sender-col,
          .subject-col {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
