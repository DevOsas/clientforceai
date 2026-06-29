import gql from 'graphql-tag'

export const EMAIL_TEMPLATE_FIELDS_FRAGMENT = gql`
  fragment EmailTemplateFields on EmailTemplate {
    id
    title
    body
    subject
    createdAt
    updatedAt
  }
`
