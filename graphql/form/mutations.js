import { gql } from 'graphql-tag'

import { LEAD_FORM_FRAGMENT } from './fragments'

export const SAVE_FORM_MUTATION = gql`
  mutation SaveFormMutation(
    $id: String
    $title: String!
    $description: String!
    $config: String
    $fields: String
  ) {
    saveForm(
      id: $id
      title: $title
      description: $description
      config: $config
      fields: $fields
    ) {
      ...LeadFormFields
    }
  }
  ${LEAD_FORM_FRAGMENT}
`

export const DELETE_LEAD_FORM_MUTATION = gql`
  mutation DeleteLeadFormMutation($id: String!) {
    deleteLeadForm(id: $id)
  }
`
