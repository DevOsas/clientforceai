import { gql } from 'graphql-tag'

import { EMAIL_ACCOUNT_FIELDS_FRAGMENT } from '~/graphql/email-account/fragments'
import { STANDARD_SCHEDULE_FIELDS_FRAGMENT } from '~/graphql/schedule/fragments'

export const USER_FIELDS_FRAGMENT = gql`
  fragment UserFields on User {
    id
    firstName
    lastName
    fullName
    email
    phone
    country {
      name
      isoCode
      callCode
    }
    companyName
    companyIndustry
    roleAtCompany
    defaultEmailAccount {
      ...EmailAccountFields
    }
    defaultSchedule {
      ...StandardScheduleFields
    }
    photoUrl
    hasJVZooIntegration
    leadLimitBalance
    campaignLimitBalance
    templateLimitBalance
    customFieldLimitBalance
  }
  ${EMAIL_ACCOUNT_FIELDS_FRAGMENT}
  ${STANDARD_SCHEDULE_FIELDS_FRAGMENT}
`
