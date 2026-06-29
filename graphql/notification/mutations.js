import { gql } from 'graphql-tag'
import { NOTIFICATION_FIELDS_FRAGMENT } from '~/graphql/notification/fragments'

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation ($id: String!) {
    markNotificationAsRead(id: $id) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FIELDS_FRAGMENT}
`
export const MARK_NOTIFICATION_AS_UNREAD = gql`
  mutation ($id: String!) {
    markNotificationAsUnread(id: $id) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FIELDS_FRAGMENT}
`

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation {
    markAllNotificationsAsRead
  }
`

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation ($id: String!) {
    deleteNotification(id: $id)
  }
`
