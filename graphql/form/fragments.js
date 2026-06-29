import { gql } from 'graphql-tag'

export const LEAD_FORM_FRAGMENT = gql`
  fragment LeadFormFields on LeadForm {
    id
    title
    description
    config
    fields
    submissionsCount
    createdAt
  }
`
