import { gql } from 'graphql-tag'

import { NOTIFICATION_FIELDS_FRAGMENT } from '~/graphql/notification/fragments'

export const NOTIFICATIONS_QUERY = gql`
  query UserNotificationsQuery {
    userNotifications {
      unreadCount
      notifications {
        ...NotificationFields
      }
    }
  }
  ${NOTIFICATION_FIELDS_FRAGMENT}
`
