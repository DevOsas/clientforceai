import { gql } from 'graphql-tag'

import {
  LEAD_FIELDS_FRAGMENT,
  LEAD_ACTIVITY_FIELDS_FRAGMENT,
} from './fragments'

import { EMAIL_THREAD_FIELDS_FRAGMENT } from '~/graphql/campaign/inbox/fragments'

export const ALL_LEADS_QUERY = gql`
  query AllLeadsQuery(
    $limit: Int
    $offset: Int
    $listId: Int
    $filters: [FilterInput]
  ) {
    result: allLeads(
      limit: $limit
      offset: $offset
      listId: $listId
      filters: $filters
    ) {
      leads {
        ...LeadFields
      }
      hasMore
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`

export const ALL_LEAD_LISTS_QUERY = gql`
  query AllLeadListsQuery {
    lists: allLeadLists {
      id
      title
    }
  }
`
export const SINGLE_LEAD_QUERY = gql`
  query SingleLeadQuery($id: Int!) {
    lead: leadById(id: $id) {
      ...LeadFields
      customFields {
        id
        title
        type
        value
        valueId
      }
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`

export const CAMPAIGN_MEMBERSHIP_STATUSES_QUERY = gql`
  query CampaignMembershipStatusesQuery {
    campaignMembershipStatuses {
      id
      name
    }
  }
`

export const LEAD_CAMPAIGN_MEMBERSHIPS_QUERY = gql`
  query LeadCampaignMembershipsQuery($id: Int!, $offset: Int!) {
    leadCampaignMemberships(id: $id, offset: $offset) {
      memberships {
        id
        campaign {
          title
          opensCount
          replyCount
          deliveredCount
        }
        statuses {
          id
          name
        }
        isActive
      }
      total
      hasMore
    }
  }
`
export const LEAD_ACTIVITIES_QUERY = gql`
  query LeadActivitiesQuery($leadId: Int!) {
    leadActivities(leadId: $leadId) {
      ...LeadActivityFields
    }
  }

  ${LEAD_ACTIVITY_FIELDS_FRAGMENT}
`

export const LEAD_EMAIL_THREADS_QUERY = gql`
  query LeadEmailThreadsQuery($leadId: Int!) {
    leadEmailThreads(leadId: $leadId) {
      ...EmailThreadFields
    }
  }
  ${EMAIL_THREAD_FIELDS_FRAGMENT}
`

export const TOP_LEADS_QUERY = gql`
  query TopLeadsQuery($limit: Int) {
    topLeads(limit: $limit) {
      ...LeadFields
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`

export const ALL_CUSTOM_FIELDS_QUERY = gql`
  query AllCustomFieldsQuery {
    customFields: allCustomFields {
      id
      title
      slug
      type
    }
  }
`
