import gql from 'graphql-tag'
import { PROPOSAL_FIELDS_FRAGMENT } from './fragments'

export const SAVE_PROPOSAL_FOLDER_MUTATION = gql`
  mutation SaveProposalFolderMutation(
    $id: Int
    $title: String!
    $category: String
    $type: String!
  ) {
    folder: saveFolder(
      id: $id
      title: $title
      category: $category
      type: $type
    ) {
      id
      title
      editable
    }
  }
`

export const COPY_PROPOSAL_MUTATION = gql`
  mutation CopyProposalMutation($id: Int) {
    copyProposal(id: $id) {
      ...ProposalFields
    }
  }
  ${PROPOSAL_FIELDS_FRAGMENT}
`

export const SAVE_PROPOSAL_MUTATION = gql`
  mutation SaveProposalMutation(
    $id: Int
    $title: String!
    $description: String
    $body: String!
    $category: String!
  ) {
    saveProposal(
      id: $id
      title: $title
      description: $description
      body: $body
      category: $category
    ) {
      ...ProposalFields
    }
  }
  ${PROPOSAL_FIELDS_FRAGMENT}
`

export const DELETE_PROPOSAL_FOLDER_MUTATION = gql`
  mutation DeleteFolderMutation($id: Int!) {
    deleted: deleteFolder(id: $id)
  }
`

export const DELETE_PROPOSAL_MUTATION = gql`
  mutation DeleteProposalMutation($id: Int!) {
    deleted: deleteProposal(id: $id)
  }
`
