import { gql } from 'graphql-tag'

import { LEAD_FORM_FRAGMENT } from './fragments'

export const ALL_LEAD_FORMS_QUERY = gql`
  query AllLeadFormsQuery($limit: Int, $offset: Int) {
    result: allLeadForms(limit: $limit, offset: $offset) {
      forms {
        ...LeadFormFields
      }
      hasMore
    }
  }
  ${LEAD_FORM_FRAGMENT}
`
export const LEAD_FORM_BY_ID_QUERY = gql`
  query LeadFormByIdQuery($id: String!) {
    form: leadFormById(id: $id) {
      ...LeadFormFields
    }
  }

  ${LEAD_FORM_FRAGMENT}
`
export const LEAD_FORM_SUBMISSIONS_QUERY = gql`
  query LeadFormSubmissionsQuery($id: String!, $limit: Int, $offset: Int) {
    result: leadFormSubmissions(id: $id, limit: $limit, offset: $offset) {
      submissions {
        id
        email
        submission
        submittedAt
      }
      hasMore
      total
    }
  }
`
