import { gql } from 'graphql-tag'

import { EMAIL_MESSAGE_FIELDS_FRAGMENT } from './fragments'

export const REMOVE_EMAILS_MUTATION = gql`
  mutation RemoveEmailsMutation($campaignId: Int!, $messages: [String]!) {
    deleteEmailMessages(campaignId: $campaignId, messages: $messages)
  }
`
export const CHANGE_EMAIL_MESSAGES_CATEGORY_MUTATION = gql`
  mutation ChangeEmailMessagesCategoryMutation(
    $campaignId: Int!
    $categoryId: Int!
    $messages: [String]!
  ) {
    changeEmailMessagesCategory(
      campaignId: $campaignId
      categoryId: $categoryId
      messages: $messages
    )
  }
`

export const REPLY_EMAIL_THREAD_MUTATION = gql`
  mutation ChangeEmailMessagesCategoryMutation(
    $threadId: Int!
    $email: String!
    $message: String!
  ) {
    replyEmailThread(threadId: $threadId, email: $email, message: $message) {
      ...EmailMessageFields
    }
  }
  ${EMAIL_MESSAGE_FIELDS_FRAGMENT}
`

export const MARK_EMAIL_MESSAGES_MUTATION = gql`
  mutation MarkEmailMessagesMutation(
    $campaignId: Int!
    $messages: [String]!
    $as: String!
  ) {
    markEmailMessages(campaignId: $campaignId, messages: $messages, as: $as)
  }
`
