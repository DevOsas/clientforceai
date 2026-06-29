import { gql } from 'graphql-tag'

export const EMAIL_ACCOUNT_FIELDS_FRAGMENT = gql`
  fragment EmailAccountFields on EmailAccount {
    id
    email
    name
    type
    username
    isOauth
    isDefault
    isLimitEmailPerMinute
    emailsPerDayLimit
    sendingClientType
    emailsPerMinuteLimit
    emailsThrottleMinuteAmount
    signature
    isAgreementConfirmed
    useDifferentEmailServers
    useDifferentAccountName
    isOptOutLinkEnabled
    optOutTextBlock
    optOutPageText
    smtpSettings {
      port
      host
      enableSsl
      username
      password
      email
      senderName
      replyToEmail
    }
    imapSettings {
      username
      port
      host
      enableSsl
      password
    }
  }
`
