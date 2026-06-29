import { gql } from 'graphql-tag'

import { EMAIL_ACCOUNT_FIELDS_FRAGMENT } from './fragments'

export const SAVE_EMAIL_ACCOUNT_MUTATION = gql`
  mutation SaveEmailAccountMutation(
    $id: Int
    $type: String!
    $name: String
    $email: String
    $username: String
    $sendingClientType: Int
    $emailsPerDayLimit: Int
    $isLimitEmailPerMinute: Boolean
    $emailsPerMinuteLimit: Int
    $emailsThrottleMinuteAmount: Int
    $signature: String
    $isOptOutLinkEnabled: Boolean
    $useDifferentEmailServers: Boolean
    $useDifferentAccountName: Boolean
    $optOutTextBlock: String
    $optOutPageText: String
    $smtpSettings: SmtpSettingsInput
    $imapSettings: ImapSettingsInput
  ) {
    emailAccount: saveEmailAccount(
      id: $id
      type: $type
      name: $name
      email: $email
      username: $username
      sendingClientType: $sendingClientType
      emailsPerDayLimit: $emailsPerDayLimit
      isLimitEmailPerMinute: $isLimitEmailPerMinute
      emailsPerMinuteLimit: $emailsPerMinuteLimit
      emailsThrottleMinuteAmount: $emailsThrottleMinuteAmount
      signature: $signature
      isOptOutLinkEnabled: $isOptOutLinkEnabled
      useDifferentEmailServers: $useDifferentEmailServers
      useDifferentAccountName: $useDifferentAccountName
      optOutTextBlock: $optOutTextBlock
      optOutPageText: $optOutPageText
      smtpSettings: $smtpSettings
      imapSettings: $imapSettings
    ) {
      ...EmailAccountFields
    }
  }
  ${EMAIL_ACCOUNT_FIELDS_FRAGMENT}
`

export const DELETE_EMAIL_ACCOUNT_MUTATION = gql`
  mutation DeleteEmailAccountMutation($id: Int!) {
    deleted: deleteEmailAccount(id: $id)
  }
`

export const SET_DEFAULT_EMAIL_ACCOUNT_MUTATION = gql`
  mutation SetDefaultEmailAccountMutation($id: Int!) {
    emailAccount: setDefaultEmailAccount(id: $id) {
      ...EmailAccountFields
    }
  }
  ${EMAIL_ACCOUNT_FIELDS_FRAGMENT}
`
