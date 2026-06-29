import { gql } from 'graphql-tag'

import { USER_FIELDS_FRAGMENT } from './fragments'

export const USER_PROFILE_SETUP_MUTATION = gql`
  mutation UserProfileSetupMutation(
    $avatar: Upload
    $country: String!
    $phone: String!
  ) {
    userProfileSetup(avatar: $avatar, country: $country, phone: $phone) {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`

export const USER_BUSINESS_DETAILS_SETUP_MUTATION = gql`
  mutation UserBusinessDetailsSetupMutation(
    $name: String
    $industry: String
    $role: String
  ) {
    userBusinessDetailsSetup(name: $name, industry: $industry, role: $role) {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`

export const UPLOAD_USER_PHOTO_MUTATION = gql`
  mutation UploadUserPhotoMutation($file: Upload!) {
    uploadUserPhoto(file: $file) {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePasswordMutation(
    $oldPassword: String!
    $newPassword: String!
  ) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      status
      message
    }
  }
`

export const UPDATE_USER_DETAILS_MUTATION = gql`
  mutation updateUserDetailsMutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
  ) {
    updateUserDetails(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
    ) {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`

export const UPDATE_COMPANY_DETAILS_MUTATION = gql`
  mutation updateCompanyDetailsMutation(
    $companyName: String!
    $companyIndustry: String!
  ) {
    updateCompanyDetails(
      companyName: $companyName
      companyIndustry: $companyIndustry
    ) {
      ...UserFields
    }
  }
  ${USER_FIELDS_FRAGMENT}
`
