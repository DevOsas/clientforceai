import { gql } from 'graphql-tag'

export const SEND_EMAIL_TO_LEAD_MUTATION = gql`
  mutation SendEmailToLeadMutation(
    $id: Int!
    $leadId: Int!
    $subject: String!
    $htmlBody: String!
    $ccEmail: String
  ) {
    sendEmailToLead(
      id: $id
      leadId: $leadId
      subject: $subject
      htmlBody: $htmlBody
      ccEmail: $ccEmail
    ) {
      id
      leadId
      subject
      htmlBody
      ccEmail
    }
  }
`
