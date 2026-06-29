import { gql } from 'graphql-tag'

export const NOTIFICATION_FIELDS_FRAGMENT = gql`
  fragment NotificationFields on Notification {
    id
    title
    summary
    object
    variant
    data
    createdAt
    isRead
  }
`
