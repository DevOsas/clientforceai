import gql from 'graphql-tag'

export const PROPOSAL_FIELDS_FRAGMENT = gql`
  fragment ProposalFields on Proposal {
    id
    title
    description
    body
    views
    sentToLeads
    createdAt
    updatedAt
  }
`
