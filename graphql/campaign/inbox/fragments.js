import { gql } from 'graphql-tag'

export const EMAIL_MESSAGE_FIELDS_FRAGMENT = gql`
  fragment EmailMessageFields on EmailMessage {
    id
    messageId
    subject
    textBody
    prospectId
    prospectEmail
    prospectName
    fromName
    fromEmail
    isNew
    date
    htmlBody
    threadId
    collapsed
  }
`

export const EMAIL_THREAD_FIELDS_FRAGMENT = gql`
  fragment EmailThreadFields on EmailThread {
    id
    subject
    categoryId
    categoryTitle
    total
    replies {
      ...EmailMessageFields
    }
  }
  ${EMAIL_MESSAGE_FIELDS_FRAGMENT}
`
