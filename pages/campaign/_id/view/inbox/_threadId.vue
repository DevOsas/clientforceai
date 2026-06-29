<template>
  <div class="view-thread">
    <div v-if="$apollo.queries.emailThread.loading" class="thread-loading">
      <b-spinner variant="primary" />
    </div>
    <div v-else-if="threadNotFound" class="thread-not-found">
      <h2>Thread not found</h2>
      <b-button
        :to="{ name: 'campaign-id-view-inbox', params: { id: campaignId } }"
        class="mt-10"
      >
        Go back
      </b-button>
    </div>
    <template v-else>
      <div class="mb-3 d-flex">
        <b-button
          :to="{ name: 'campaign-id-view-inbox', params: { id: campaignId } }"
          variant="outline-gray"
          class="px-4 mr-2"
        >
          <SvgIcon name="arrow-left" />
        </b-button>

        <b-dropdown variant="outline-gray" toggle-class="mr-2" no-caret>
          <template #button-content>
            Move to
            <SvgIcon name="chevron-down-2" class="ml-1" />
          </template>
          <b-dropdown-item
            v-for="cat in filteredCategories"
            :key="cat.id"
            @click="changeCategory(cat.id)"
          >
            {{ cat.title }}
          </b-dropdown-item>
        </b-dropdown>

        <b-button
          variant="outline-gray"
          class="px-4 mr-2"
          @click="$bvModal.show('RemoveThreadConfirmationModal')"
        >
          <SvgIcon name="delete" />
          Delete
        </b-button>
      </div>

      <div class="email-thread">
        <div class="email-subject">
          <h4 class="subject">{{ emailThread.subject }}</h4>
          <span class="category">{{ emailThread.categoryTitle }}</span>
        </div>

        <div class="email-thread-replies">
          <div
            v-for="message in emailThread.replies"
            :key="message.messageId"
            class="email-thread-message"
          >
            <div class="message-header">
              <div>
                <span class="from-name" :class="{ prospect: message.fromName }">
                  <SvgIcon name="user" class="user-icon" />

                  {{ message.fromName || 'You' }}
                </span>
                <span class="from-email">
                  {{ message.fromEmail }}
                </span>
              </div>
              <div>{{ message.date }}</div>
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="email-text"
              :class="{ open: !message.collapsed }"
              @click="expandMessage(message.id)"
              v-html="message.htmlBody || message.textBody"
            ></div>
            <!-- eslint-enable vue/no-v-html -->
            <div
              v-if="message.collapsed"
              class="readmore"
              @click="expandMessage(message.id)"
            >
              <div class="spacer">
                <div
                  v-b-tooltip.hover.bottom="`Show full message`"
                  class="dots"
                >
                  ...
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="thread-reply-editor-wrap">
          <EmailEditor v-model="emailMessage">
            <b-dropdown
              slot="footer-right"
              split
              variant="primary"
              toggle-class="px-2"
              split-class="px-4"
              @click="sendReply"
            >
              <template #button-content>
                <b-spinner v-if="sendingReply" class="mr-1" small />
                Reply
              </template>
              <b-dropdown-item href="#">Save as template</b-dropdown-item>
            </b-dropdown>
          </EmailEditor>
        </div>
      </div>
    </template>

    <b-modal
      id="RemoveThreadConfirmationModal"
      centered
      hide-header
      hide-footer
    >
      <template #default="{ hide }">
        <div v-if="isDeleting" class="is-thread-deleting">
          <b-spinner variant="primary" />
        </div>
        <template v-else>
          <div class="py-4 text-center">
            <h4 class="mb-3">Remove Emails</h4>
            <p class="mb-3">
              Are you sure you would like to remove this emails
            </p>

            <div class="mt-4">
              <b-button variant="link" class="mr-2 text-dark" @click="hide">
                Cancel
              </b-button>
              <b-button
                variant="primary"
                class="px-4"
                pill
                @click="deleteThread"
              >
                Okay
              </b-button>
            </div>
          </div>
        </template>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import EmailEditor from '~/components/Email/Editor/EmailEditor'

import {
  EMAIL_THREAD_QUERY,
  EMAIL_THREADS_QUERY,
} from '~/graphql/campaign/inbox/queries'

import {
  REMOVE_EMAILS_MUTATION,
  REPLY_EMAIL_THREAD_MUTATION,
  CHANGE_EMAIL_MESSAGES_CATEGORY_MUTATION,
} from '~/graphql/campaign/inbox/mutations'

export default {
  components: { EmailEditor },

  data() {
    return {
      threadNotFound: false,
      emailMessage: '',
      sendingReply: false,
      isDeleting: false,
    }
  },

  apollo: {
    emailThread: {
      query: EMAIL_THREAD_QUERY,

      variables() {
        return {
          campaignId: this.campaignId,
          threadId: this.threadId,
        }
      },

      error(e) {
        const errors = e.graphQLErrors

        if (errors.filter((e) => e.message === 'ThreadNotFound')) {
          this.threadNotFound = true

          return // Prevent apollo inbuilt error handling
        }

        // eslint-disable-next-line no-console
        console.log(e)

        return null // Prevent apollo inbuilt error handling
      },
    },
  },

  computed: {
    ...mapState('inbox', {
      categories: (state) => state.categories,
    }),

    campaignId() {
      return parseInt(this.$route.params.id)
    },

    threadId() {
      return parseInt(this.$route.params.threadId)
    },

    filteredCategories() {
      return this.categories.filter(
        (cat) => cat.id !== this.emailThread.categoryId
      )
    },
  },

  methods: {
    expandMessage(id) {
      const store = this.$apollo.getClient()

      const data = store.readQuery({
        query: EMAIL_THREAD_QUERY,
        variables: {
          campaignId: this.campaignId,
          threadId: this.threadId,
        },
      })

      const messageIndex = this.emailThread.replies.findIndex(
        (message) => message.id === id
      )
      data.emailThread.replies.splice(messageIndex, 1, {
        ...data.emailThread.replies[messageIndex],
        collapsed: false,
      })

      store.writeQuery({
        query: EMAIL_THREAD_QUERY,
        variables: {
          campaignId: this.campaignId,
          threadId: this.threadId,
        },
        data,
      })
    },

    async changeCategory(categoryId) {
      this.$nuxt.$loading.start()

      const messageIds = this.emailThread.replies.map(
        (reply) => reply.messageId
      )

      await this.$apollo.mutate({
        mutation: CHANGE_EMAIL_MESSAGES_CATEGORY_MUTATION,
        variables: {
          campaignId: this.campaignId,
          categoryId,
          messages: messageIds,
        },
      })

      this.$apollo.queries.emailThread.refetch()
      this.$nuxt.$loading.finish()
    },

    deleteThread() {
      const messageIds = this.emailThread.replies.map(
        (reply) => reply.messageId
      )

      this.isDeleting = true
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: REMOVE_EMAILS_MUTATION,
          variables: {
            campaignId: this.campaignId,
            messages: messageIds,
          },
          update: (store, { data }) => {
            const deleted = data.deleteEmailMessages
            if (deleted) {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: EMAIL_THREADS_QUERY,
                variables: {
                  campaignId: this.campaignId,
                },
              })

              const index = data.threads.findIndex(
                (a) => a.id === this.emailThread.id
              )
              if (index !== -1) {
                data.threads.splice(index, 1)
              }
              // Write our data back to the cache.
              store.writeQuery({
                query: EMAIL_THREADS_QUERY,
                variables: {
                  campaignId: this.campaignId,
                },
                data,
              })
            }
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful!',
            text: 'Replies removed successfully',
          })

          this.$bvModal.hide('RemoveThreadConfirmationModal')

          this.$router.push({
            name: 'campaign-id-view-inbox',
            params: { id: this.campaignId },
          })

          this.$nuxt.$loading.finish()
          this.isDeleting = true
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Unable to delete replies!',
            text: 'An error occurred while processing your request.',
          })

          this.$nuxt.$loading.finish()
          this.isDeleting = true
        })
    },

    sendReply() {
      this.$nuxt.$loading.start()
      this.sendingReply = true

      const replies = this.emailThread.replies
      const email = replies[replies.length - 1].prospectEmail

      this.$apollo
        .mutate({
          mutation: REPLY_EMAIL_THREAD_MUTATION,
          variables: {
            threadId: this.emailThread.id,
            email,
            message: this.emailMessage,
          },
          update: (store, { data: { replyEmailThread } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: EMAIL_THREAD_QUERY,
              variables: {
                campaignId: this.campaignId,
                threadId: this.emailThread.id,
              },
            })

            data.emailThread.replies.push({
              ...replyEmailThread,
              collapsed: false,
            })

            // Write our data back to the cache.
            store.writeQuery({
              query: EMAIL_THREAD_QUERY,
              variables: {
                campaignId: this.campaignId,
                threadId: this.emailThread.id,
              },
              data,
            })
          },
        })
        .then(() => {
          this.emailMessage = ''
          this.sendingReply = false
          this.$nuxt.$loading.finish()

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: 'Your email is now being processed for sending.',
          })
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'native-error',
            title: 'Unable to send reply!',
            text: 'An error occurred while processing your request.',
          })

          this.sendingReply = false
          this.$nuxt.$loading.finish()
        })
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/scss/variables';

.is-thread-deleting {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  .spinner-border {
    border-width: 0.4rem;
    height: 4rem;
    width: 4rem;
  }
}

.view-thread {
  .thread-loading {
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.5rem;
      height: 4rem;
      width: 4rem;
    }
  }

  .email-thread {
    .email-subject {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid $gray-400;

      .subject {
        margin-right: 15px;
        margin-bottom: 0;
      }

      .category {
        display: inline-block;
        background-color: $gray-300;
        padding: 2px 10px;
      }
    }

    .email-thread-replies {
      .email-thread-message {
        padding-top: 25px;
        position: relative;
        padding-left: 25px;
        font-size: 16px;

        .message-header {
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;

          .from-name {
            font-size: 16px;

            &.prospect {
              color: $primary;
            }

            .user-icon {
              position: absolute;
              top: 23px;
              left: -5px;
            }
          }

          .from-email {
            margin-left: 10px;
            color: $gray-500;
            font-size: 15px;
          }
        }

        .email-text {
          margin-bottom: 15px;
          cursor: pointer;
          max-height: 120px;
          overflow: hidden;
          outline: none;
          white-space: pre-wrap;
          word-wrap: break-word;

          a {
            color: $dark;
            text-decoration: none;
          }

          &.open {
            cursor: default;
            max-height: 100%;
            overflow: auto;
          }
        }

        .readmore {
          position: absolute;
          left: 25px;
          bottom: -17px;
          width: 100%;
          height: 25px;
          cursor: pointer;

          .spacer {
            position: relative;
            width: 100%;
            height: 25px;
            background: hsla(0, 0%, 100%, 0.3);

            .dots {
              position: absolute;
              left: 0;
              bottom: 0;
              width: 22px;
              height: 9px;
              background-color: #e8ebf1;
              color: #a6a6a6;
              border-radius: 2px;
              line-height: 0;
              text-align: center;
              font-size: 18px;
            }
          }
        }

        br {
          display: block;
          margin-top: 15px;
          content: '';
        }
      }
    }
  }

  .thread-reply-editor-wrap {
    margin-top: 70px;

    .email-editor-input-wrap.decorated {
      border-radius: 5px;
    }

    .editor-insert-btns {
      justify-content: flex-start;
    }

    .email-editor-wrap .email-editor .JMEditor {
      min-height: 100px;
    }
  }
}
</style>
