import { gql } from 'graphql-tag'

export const LEAD_FIELDS_FRAGMENT = gql`
  fragment LeadFields on Lead {
    id
    email
    firstName
    lastName
    phone
    address
    title
    company
    domain
    emailValidatedAt
    emailValidationResponse
    lists {
      id
    }
    firstCampaignMembership {
      id
      campaign {
        title
      }
      statuses {
        id
        name
      }
    }
    campaignMembershipCount
    customFields {
      id
      valueId
      fieldId
      title
      slug
      type
      value
    }
  }
`

export const LEAD_ACTIVITY_FIELDS_FRAGMENT = gql`
  fragment LeadActivityFields on LeadActivity {
    id
    itemType
    sourceType
    contentProps
    createdAt
  }
`
