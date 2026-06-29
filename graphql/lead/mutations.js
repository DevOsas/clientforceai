import { gql } from 'graphql-tag'

import {
  LEAD_FIELDS_FRAGMENT,
  LEAD_ACTIVITY_FIELDS_FRAGMENT,
} from './fragments'

export const SAVE_LEAD_MUTATION = gql`
  mutation SaveLeadMutation(
    $id: Int
    $email: String!
    $firstName: String!
    $lastName: String
    $phone: String
    $address: String
    $title: String
    $company: String
    $domain: String
    $listId: Int
    $customFields: [CustomFieldInput]
    $campaignId: Int
  ) {
    lead: saveLead(
      id: $id
      email: $email
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      address: $address
      title: $title
      company: $company
      domain: $domain
      listId: $listId
      customFields: $customFields
      campaignId: $campaignId
    ) {
      ...LeadFields
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`
export const SAVE_LEAD_LIST_MUTATION = gql`
  mutation ($id: Int, $title: String!) {
    leadlist: saveLeadList(id: $id, title: $title) {
      id
      title
    }
  }
`

export const DELETE_LEAD_LIST_MUTATION = gql`
  mutation DeleteLeadListMutation($id: Int!) {
    deleted: deleteLeadList(id: $id)
  }
`
export const DELETE_LEADS_MUTATION = gql`
  mutation DeleteLeadsMutation($ids: [Int!]!) {
    deleteLeads(ids: $ids)
  }
`

export const VALIDATE_LEAD_EMAIL_MUTATION = gql`
  mutation ValidateLeadEmailMutation($ids: [Int!]!) {
    validateLeadEmail(ids: $ids) {
      email
      valid
      message
    }
  }
`
export const UPLOAD_LEAD_CSV_MUTATION = gql`
  mutation UploadLeadCsvMutation($csv: Upload!) {
    uploadLeadCsv(csv: $csv) {
      headers {
        id
        title
        sample
      }
      rows
      fileName
      serverFileId
    }
  }
`
export const BEGIN_CSV_LEAD_IMPORT_MUTATION = gql`
  mutation BeginCsvLeadImportMutation(
    $mapping: String!
    $customMappings: String!
    $groupIds: [Int]!
    $serverFileId: String!
    $campaignId: Int!
  ) {
    beginCsvLeadImport(
      mapping: $mapping
      customMappings: $customMappings
      groupIds: $groupIds
      serverFileId: $serverFileId
      campaignId: $campaignId
    )
  }
`
export const ADD_LEADS_TO_CAMPAIGN_MUTATION = gql`
  mutation AddLeadsToCampaignMutation($campaignId: Int!, $leadIds: [Int]!) {
    addLeadsToCampaign(campaignId: $campaignId, leadIds: $leadIds) {
      ...LeadFields
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`
export const REMOVE_MEMBERS_FROM_CAMPAIGN = gql`
  mutation RemoveMembersFromCampaignMutation($campaignId: Int!, $ids: [Int]!) {
    removeMembersFromCampaign(campaignId: $campaignId, ids: $ids)
  }
`
export const SET_CAMPAIGN_MEMBERSHIPS_STATUS_MUTATION = gql`
  mutation SetCampaignMembershipsStatusMutation(
    $ids: [Int]!
    $status: String!
    $action: String!
  ) {
    setCampaignMembershipsStatus(ids: $ids, status: $status, action: $action) {
      id
      campaign {
        title
      }
      statuses {
        id
        name
      }
    }
  }
`
export const SET_LEADS_MEMBERSHIPS_STATUS_MUTATION = gql`
  mutation SetLeadsMembershipsStatusMutation(
    $ids: [Int]!
    $status: String!
    $action: String!
  ) {
    setLeadsMembershipsStatus(ids: $ids, status: $status, action: $action) {
      ...LeadFields
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`

export const MOVE_LEADS_TO_LISTS_MUTATION = gql`
  mutation MoveLeadsToListsMutation($leadListIds: [Int]!, $leadIds: [Int]!) {
    moveLeadsToLists(leadListIds: $leadListIds, leadIds: $leadIds) {
      ...LeadFields
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`

export const ADD_NOTE_TO_LEAD_MUTATION = gql`
  mutation MoveLeadsToListsMutation($leadId: Int!, $note: String!) {
    addNoteToLead(leadId: $leadId, note: $note) {
      ...LeadActivityFields
    }
  }
  ${LEAD_ACTIVITY_FIELDS_FRAGMENT}
`

export const SAVE_CUSTOM_FIELD_MUTATION = gql`
  mutation ($id: Int, $label: String!, $type: String!) {
    field: saveCustomField(id: $id, label: $label, type: $type) {
      id
      title
      slug
      type
    }
  }
`
