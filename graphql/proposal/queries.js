import gql from 'graphql-tag'
import { PROPOSAL_FIELDS_FRAGMENT } from './fragments'

export const ALL_PROPOSAL_FOLDERS_QUERY = gql`
  query ProposalFoldersQuery($category: String) {
    folders: allProposalFolders(category: $category) {
      id
      title
      editable
    }
  }
`

export const ALL_PROPOSAL_QUERY = gql`
  query AllProposalQuery($category: String!, $folderId: Int) {
    proposals: allProposals(category: $category, folderId: $folderId) {
      ...ProposalFields
    }
  }
  ${PROPOSAL_FIELDS_FRAGMENT}
`

export const PROPOSAL_BY_ID_QUERY = gql`
  query AllProposalQuery($id: Int!) {
    proposal: proposalById(id: $id) {
      ...ProposalFields
    }
  }

  ${PROPOSAL_FIELDS_FRAGMENT}
`
