import { gql } from 'graphql-tag'

import { EMAIL_ACCOUNT_FIELDS_FRAGMENT } from './fragments'

export const GET_MICROSOFT_OAUTH_URL_QUERY = gql`
  query GetMicrosoftOAuthUrl {
    url: getMicrosoftOAuthUrl
  }
`

export const COMPLETE_MICROSOFT_OAUTH_MUTATION = gql`
  mutation CompleteMicrosoftOAuth($code: String!, $state: String!) {
    emailAccount: completeMicrosoftOAuth(code: $code, state: $state) {
      ...EmailAccountFields
    }
  }
  ${EMAIL_ACCOUNT_FIELDS_FRAGMENT}
`
