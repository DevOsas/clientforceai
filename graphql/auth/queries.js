import { gql } from 'graphql-tag'

import { USER_FIELDS_FRAGMENT } from '~/graphql/user/fragments'

export const USER_DETAILS_QUERY = gql`
  query UserDetailsQuery {
    userDetails {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`

export const FORGET_PASSWORD_QUERY = gql`
  query ForgetPasswordQuery($email: String!) {
    forgetpassword(email: $email)
  }
`

// export const VALIDATE_TOKEN_QUERY = gql`
//   query ValidateTokenQuery($token: String!) {
//     validateToken(token: $token)
//   }
// `
