<template>
  <b-nav-item-dropdown
    ref="NotificationDropdown"
    class="notifications-dropdown"
    toggle-class="notification-icon"
    right
    no-caret
    @show="hideUnreadCount"
    @shown="handleShown"
  >
    <template #button-content>
      <SvgIcon
        name="notification-solid"
        class="notification-icon"
        :class="{ notify: ringBell }"
      />
      <span v-if="shouldShowUnreadCount" class="unread-count">{{
        formattedUnreadCount
      }}</span>
    </template>
    <div class="notifications-dropdown-content">
      <div class="notification-header">
        <h4 class="notification-heading">Notifications</h4>

        <b-button
          v-if="hasNotifications"
          class="link"
          variant="link"
          :disabled="unreadCount < 1"
          @click="markAllAsRead"
        >
          Mark all as read
        </b-button>
      </div>
      <custom-scroll>
        <div class="notification-wrap">
          <div v-if="isLoading" class="notification-list">
            <div v-for="num in 7" :key="num" class="notification-item">
              <div class="mr-2">
                <b-skeleton
                  type="avatar"
                  width="50px"
                  height="50px"
                ></b-skeleton>
              </div>
              <div class="w-100">
                <b-skeleton></b-skeleton>
                <b-skeleton></b-skeleton>
              </div>
            </div>
          </div>
          <ul v-else-if="hasNotifications" class="notification-list">
            <li
              v-for="notification in userNotifications.notifications"
              :key="notification.id"
              class="notification-item"
              :class="{ unread: !notification.isRead }"
              @click="openNotification(notification)"
            >
              <div class="icon-wrap">
                <SvgIcon name="bell-notification" />
              </div>
              <div class="notification-detail">
                <div class="title">{{ notification.title }}</div>
                <div class="description">{{ notification.summary }}</div>
                <div class="create-date">
                  {{ notification.createdAt | timeAgo }}
                </div>
              </div>
              <div class="notification-actions-wrap">
                <b-button
                  v-b-tooltip.hover
                  :title="`Mark as ${notification.isRead ? 'Unread' : 'Read'}`"
                  variant="clear"
                  size="sm"
                  class="status-icon"
                  :class="{ unread: !notification.isRead }"
                  @click.stop="changeStatus(notification)"
                >
                  <SvgIcon
                    :name="notification.isRead ? 'dot-read' : 'dot-unread'"
                  />
                </b-button>
                <b-button
                  v-b-tooltip.hover
                  title="Delete notification"
                  variant="clear"
                  size="sm"
                  class="remove-icon"
                >
                  <SvgIcon
                    name="close"
                    @click.stop="deleteNotification(notification, $event)"
                  />
                </b-button>
              </div>
            </li>
          </ul>
          <div v-else-if="!hasNotifications" class="no-notification">
            <PushNotificationsIl class="notification-il" />
            <p>You do not have any notifications yet</p>
          </div>
        </div>
      </custom-scroll>
    </div>
  </b-nav-item-dropdown>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import PushNotificationsIl from '~/assets/illustrations/push-notifications.svg?inline'
import { NOTIFICATIONS_QUERY } from '~/graphql/notification/queries'
import {
  MARK_NOTIFICATION_AS_READ,
  MARK_NOTIFICATION_AS_UNREAD,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  DELETE_NOTIFICATION_MUTATION,
} from '~/graphql/notification/mutations'

export default {
  components: { PushNotificationsIl },

  filters: {
    timeAgo(value) {
      return moment.utc(value).fromNow()
    },
  },

  data() {
    return {
      userNotifications: {
        notifications: [],
      },
      page: 1,
      isLoading: false,
      APIRoot: null,
    }
  },

  computed: {
    ...mapState({
      ringBell: (state) => state.notification.ringBell,
      showUnreadCount: (state) => state.notification.showUnreadCount,
      isRegistered: (state) => state.echo.notificationRegistered,
    }),

    hasNotifications() {
      return (
        this.userNotifications &&
        this.userNotifications.notifications &&
        this.userNotifications.notifications.length > 0
      )
    },

    unreadCount() {
      return this.userNotifications &&
        typeof this.userNotifications.unreadCount === 'number'
        ? this.userNotifications.unreadCount
        : 0
    },

    formattedUnreadCount() {
      return this.unreadCount > 9 ? '9+' : this.unreadCount
    },

    shouldShowUnreadCount() {
      return this.showUnreadCount && this.unreadCount > 0
    },
  },

  apollo: {
    userNotifications: {
      query: NOTIFICATIONS_QUERY,

      result({ loading }) {
        this.isLoading = loading
      },

      error() {
        this.$notify({
          group: 'main',
          type: 'native-error',
          title: 'Unable to fetch notifications',
          text: 'An error occurred while trying to process your request',
        })

        // Prevent the page from crashing on error
        return false
      },
    },
  },

  mounted() {
    if (!this.isRegistered) {
      const { Echo } = window

      Echo &&
        Echo.private(`App.Models.User.${this.$auth.user.id}`).notification(
          (notification) => {
            this.$refs.NotificationDropdown &&
              this.$refs.NotificationDropdown.hide(true)

            const type =
              notification.variant === 'error' ? 'native-error' : 'native'
            this.$notify({
              group: 'main',
              type,
              duration: 5000,
              title: notification.title,
              text: notification.summary,
            })

            this.$store.dispatch('notification/updateRingBell', true)
            setTimeout(
              () => this.$store.dispatch('notification/updateRingBell', false),
              5000
            )

            this.$store.dispatch('notification/updateShowUnreadCount', true)

            this.updateNotification({
              unreadCount: this.userNotifications.unreadCount + 1,
            })
          }
        )
      this.$store.dispatch('echo/notificationRegistered')
    }
  },

  beforeDestroy() {
    if (this.isRegistered && this.$auth.user) {
      const { Echo } = window
      Echo && Echo.leave(`App.Models.User.${this.$auth.user.id}`)
    }
  },

  methods: {
    handleShown() {
      this.$apollo.queries.userNotifications.refetch()
    },

    updateNotification(updates) {
      const data = this.readQueryData()

      data.userNotifications = {
        ...data.userNotifications,
        ...updates,
      }

      this.writeQueryData(data)
    },

    readQueryData() {
      const store = this.$apollo.getClient()
      // Read the data from our cache for this query.
      return store.readQuery({
        query: NOTIFICATIONS_QUERY,
      })
    },

    writeQueryData(data) {
      const store = this.$apollo.getClient()
      store.writeQuery({
        query: NOTIFICATIONS_QUERY,
        data,
      })
    },

    hideUnreadCount() {
      this.$store.dispatch('notification/updateShowUnreadCount', false)
    },

    getIndex(id) {
      return this.userNotifications.notifications.findIndex(
        (notif) => notif.id === id
      )
    },

    openNotification(notification) {
      if (notification.object === 'proposal') {
        const data = JSON.parse(notification.data)
        this.$router.push({
          name: 'proposal-id',
          params: {
            id: data.proposalId,
          },
        })
      }

      this.$refs.NotificationDropdown.hide(true)

      // Mark as read
      !notification.isRead && this.changeStatus(notification)
    },

    updateUnreadCount(notification = null, isDeleted = false) {
      if (!notification) {
        return this.updateNotification({
          unreadCount: 0,
        })
      }

      if (notification.isRead && !isDeleted) {
        this.updateNotification({
          unreadCount: this.userNotifications.unreadCount + 1,
        })
      } else {
        this.updateNotification({
          unreadCount: this.userNotifications.unreadCount - 1,
        })
      }
    },

    changeStatus(notification) {
      const index = this.getIndex(notification.id)
      if (index !== -1) {
        this.updateNotification({
          notifications: [
            ...this.userNotifications.notifications.slice(0, index),
            {
              ...this.userNotifications.notifications[index],
              isRead: !notification.isRead,
            },
            ...this.userNotifications.notifications.slice(index + 1),
          ],
        })

        this.updateUnreadCount(notification)

        this.$apollo.mutate({
          mutation: notification.isRead
            ? MARK_NOTIFICATION_AS_UNREAD
            : MARK_NOTIFICATION_AS_READ,
          variables: {
            id: notification.id,
          },
        })
      }
    },

    markAllAsRead() {
      this.updateNotification({
        notifications: this.userNotifications.notifications.map(
          (notification) => ({
            ...notification,
            isRead: true,
          })
        ),
      })

      this.updateUnreadCount()

      this.$apollo.mutate({
        mutation: MARK_ALL_NOTIFICATIONS_AS_READ,
      })
    },

    deleteNotification(notification) {
      const index = this.getIndex(notification.id)
      if (index !== -1) {
        this.updateNotification({
          notifications: [
            ...this.userNotifications.notifications.slice(0, index),
            ...this.userNotifications.notifications.slice(index + 1),
          ],
        })

        this.updateUnreadCount(notification, true)

        this.$apollo.mutate({
          mutation: DELETE_NOTIFICATION_MUTATION,
          variables: {
            id: notification.id,
          },
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.notifications-dropdown {
  .notification-icon {
    fill: #fff;
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
    transition: opacity 0.6s ease;
    margin-top: 1px;

    &.notify {
      animation: ring 1.5s ease;
    }
  }

  .dropdown-toggle {
    outline: none;
    position: relative;
  }

  .unread-count {
    position: absolute;
    top: 9px;
    left: 21px;
    font-size: 0.7rem;
    background-color: red;
    padding: 0 2px;
    line-height: 1.2;
    border-radius: 2px;
    font-weight: bold;
    max-width: 18px;
    min-width: 9px;
    overflow: hidden;
    color: $white;
  }

  .dropdown-menu {
    top: 50px;
    border-radius: 7px;
    min-width: 355px;
    min-height: 442px;
    right: -70px;
    padding-bottom: 0;
    margin-top: -4px;

    &::after,
    &::before {
      position: absolute;
      display: inline-block;
      border-bottom-color: rgba(0, 0, 0, 0.2);
      content: '';
    }
    &::before {
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid #ebebeb;
      right: 75px;
      top: -10px;
    }
    &::after {
      border-right: 8px solid transparent;
      border-bottom: 8px solid #fff;
      border-left: 8px solid transparent;
      right: 77px;
      top: -8px;
    }
  }

  .notifications-dropdown-content {
    padding: 10px 0;
    width: 100%;

    .notification-header {
      padding: 0 15px;
      border-bottom: 1px solid $gray-100;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .notification-heading {
        font-size: 1.3rem;
      }
    }

    .notification-wrap {
      min-height: 250px;
      max-height: 390px;
    }

    .notification-loading {
      padding: 0 15px;
    }

    .notification-list {
      list-style: none;
      padding: 0;

      .notification-item {
        display: flex;
        align-items: center;
        padding: 7px 15px;
        border-bottom: 1px solid $gray-100;
        cursor: pointer;

        &.unread {
          background-color: rgba($primary, 0.04);
        }

        &:last-child {
          border-bottom: 0;
        }

        .icon-wrap {
          width: 50px;
          height: 50px;
          color: #446a39;
          background-color: #ebf2eb;
          margin-right: 10px;
          border-radius: 50%;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-detail {
          width: 80%;
          .title {
            font-size: 0.9rem;
            font-weight: bold;
            color: $gray-600;
          }
          .description {
            font-size: 0.8rem;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .create-date {
            font-size: 0.75rem;
            color: $gray-500;
          }
        }
        .notification-actions-wrap {
          width: 10%;
          display: flex;
          align-items: center;
          cursor: default;

          .status-icon,
          .remove-icon {
            margin-top: 0;
            cursor: pointer;
            padding: 2px;
            line-height: 1;
            box-shadow: none;
            font-size: 0.6rem;
            opacity: 0;

            .icon {
              width: 0.5rem;
              height: 0.5rem;
            }
          }
          .status-icon {
            margin-right: 3px;

            &.unread {
              color: darken($primary, 10);
              opacity: 1;
            }
          }
        }

        &:hover {
          background-color: $gray-100;

          &.unread {
            background-color: rgba($primary, 0.1);
          }

          .notification-actions-wrap {
            .status-icon,
            .remove-icon {
              opacity: 1;
            }
          }
        }
      }
    }

    .no-notification {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 350px;
      text-align: center;
      color: $gray-500;

      .notification-il {
        width: 50%;
        height: 200px;
        margin-bottom: 0;
      }
    }
  }

  @-webkit-keyframes ring {
    0% {
      -webkit-transform: rotate(35deg);
    }
    12.5% {
      -webkit-transform: rotate(-30deg);
    }
    25% {
      -webkit-transform: rotate(25deg);
    }
    37.5% {
      -webkit-transform: rotate(-20deg);
    }
    50% {
      -webkit-transform: rotate(15deg);
    }
    62.5% {
      -webkit-transform: rotate(-10deg);
    }
    75% {
      -webkit-transform: rotate(5deg);
    }
    100% {
      -webkit-transform: rotate(0deg);
    }
  }

  @keyframes ring {
    0% {
      -webkit-transform: rotate(35deg);
      transform: rotate(35deg);
    }
    12.5% {
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }
    25% {
      -webkit-transform: rotate(25deg);
      transform: rotate(25deg);
    }
    37.5% {
      -webkit-transform: rotate(-20deg);
      transform: rotate(-20deg);
    }
    50% {
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }
    62.5% {
      -webkit-transform: rotate(-10deg);
      transform: rotate(-10deg);
    }
    75% {
      -webkit-transform: rotate(5deg);
      transform: rotate(5deg);
    }
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
  }
}
</style>
