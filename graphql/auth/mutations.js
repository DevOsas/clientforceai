import { gql } from 'graphql-tag'

import { USER_FIELDS_FRAGMENT } from '~/graphql/user/fragments'

export const SIGNUP_MUTATION = gql`
  mutation SignUpMutation(
    $firstName: String
    $lastName: String
    $email: String
    $password: String
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String, $password: String) {
    logIn(email: $email, password: $password) {
      token
      expiresIn
    }
  }
`
export const LOGOUT_MUTATION = gql`
  mutation LogOutMutation {
    logOut
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation(
    $token: String
    $password: String
    $password_confirmation: String
    $email: String
  ) {
    resetPassword(
      token: $token
      password: $password
      password_confirmation: $password_confirmation
      email: $email
    )
  }
`
