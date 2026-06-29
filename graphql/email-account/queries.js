import { gql } from 'graphql-tag'

import { EMAIL_ACCOUNT_FIELDS_FRAGMENT } from './fragments'

export const EMAIL_ACCOUNT_BY_ID_QUERY = gql`
  query EmailAccountByIdQuery($id: Int!) {
    emailAccount: emailAccountById(id: $id) {
      ...EmailAccountFields
    }
  }
  ${EMAIL_ACCOUNT_FIELDS_FRAGMENT}
`

export const ALL_EMAIL_ACCOUNTS_QUERY = gql`
  query AllEmailAccountsQuery {
    emailAccounts: allEmailAccounts {
      ...EmailAccountFields
    }
  }
  ${EMAIL_ACCOUNT_FIELDS_FRAGMENT}
`

export const TEST_IMAP_CONFIGURATION_QUERY = gql`
  query TestImapConfigurationQuery(
    $username: String
    $host: String
    $port: Int
    $password: String
    $enableSsl: Boolean
  ) {
    status: testImapConfiguration(
      username: $username
      host: $host
      port: $port
      password: $password
      enableSsl: $enableSsl
    )
  }
`
export const TEST_SMTP_CONFIGURATION_QUERY = gql`
  query TestSmtpConfigurationQuery(
    $email: String
    $username: String
    $senderName: String
    $replyToEmail: String
    $host: String
    $port: Int
    $password: String
    $enableSsl: Boolean
  ) {
    status: testSmtpConfiguration(
      email: $email
      username: $username
      senderName: $senderName
      replyToEmail: $replyToEmail
      host: $host
      port: $port
      password: $password
      enableSsl: $enableSsl
    )
  }
`
export const GET_OPTOUT_MESSAGE_QUERY = gql`
  query GetOptedOutMessage($messageId: Int!) {
    getOptedOutMessage(messageId: $messageId)
  }
`
