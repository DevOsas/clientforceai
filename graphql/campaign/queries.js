import { gql } from 'graphql-tag'

import { CAMPAIGN_FIELDS_FRAGMENT } from './fragments'
import { LEAD_FIELDS_FRAGMENT } from '~/graphql/lead/fragments'

export const ALL_CAMPAIGNS_QUERY = gql`
  query AllCampaignsQuery(
    $status: String
    $folderId: Int
    $offset: Int
    $keyword: String
  ) {
    campaignResult: allCampaigns(
      status: $status
      folderId: $folderId
      offset: $offset
      keyword: $keyword
    ) {
      campaigns {
        ...CampaignFields
      }
      total
      hasMore
    }
  }
  ${CAMPAIGN_FIELDS_FRAGMENT}
`
export const ALL_CAMPAIGN_FOLDERS_QUERY = gql`
  query AllCampaignFoldersQuery {
    folders: allCampaignFolders {
      id
      title
    }
  }
`

export const CAMPAIGN_BY_ID_QUERY = gql`
  query CampaignByIdQuery($id: Int!) {
    campaign: campaignById(id: $id) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS_FRAGMENT}
`

export function getCampaignDetailsQuery(additionalFields) {
  const addedFields = additionalFields || ''
  return gql`
    query CampaignDetailsQuery($id: Int!) {
      campaign: campaignById(id: $id) {
        id
        title
        status
        isActive
        ${addedFields}
      }
    }
  `
}

export const CAMPAIGN_DETAILS_QUERY = getCampaignDetailsQuery()

export const CAMPAIGN_TEMPLATES_QUERY = gql`
  query CampaignTemplatesQuery($type: String!, $keyword: String) {
    templates: campaignTemplates(type: $type, keyword: $keyword) {
      id
      title
      description
      icon
      user {
        id
      }
    }
  }
`
export const CAMPAIGN_TEMPLATE_QUERY = gql`
  query CampaignTemplateQuery($id: Int!) {
    template: campaignTemplate(id: $id) {
      id
      title
      description
      icon
      steps {
        id
        number
        inMinutes
        emails {
          id
          subject
          body
        }
      }
    }
  }
`
export const CAMPAIGN_MEMBERS_QUERY = gql`
  query CampaignMembersQuery($campaignId: Int!, $step: Int, $offset: Int) {
    campaignMembers(campaignId: $campaignId, step: $step, offset: $offset) {
      members {
        id
        lead {
          ...LeadFields
        }
        step {
          id
          number
        }
        statuses {
          id
          name
        }
        delivered
        opens
        views
        replied
      }
      total
      hasMore
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`

export const CAMPAIGN_LOGS_QUERY = gql`
  query CampaignLogsQuery($campaignId: Int!, $offset: Int) {
    campaignLogs(campaignId: $campaignId, offset: $offset) {
      logs {
        id
        content
        createdAt
      }
      total
      hasMore
    }
  }
`

export const CAMPAIGN_PREVIEW_QUERY = gql`
  query CampaignPreviewQuery($campaignId: Int!) {
    campaignPreview(campaignId: $campaignId) {
      previews {
        id
        campaignProspectId
        name
        email
        steps {
          id
          number
          inMinutes
          emails {
            id
            subject
            body
          }
        }
      }
      isLastItems
      optOutBlock
    }
  }
`

export const TOP_CAMPAIGNS_QUERY = gql`
  query TopCampaignsQuery($limit: Int) {
    topCampaigns(limit: $limit) {
      id
      title
      status
      createdAt
    }
  }
`

export const CAMPAIGN_CHART_QUERY = gql`
  query CampaignChartQuery($campaignIds: [Int], $from: String, $to: String!) {
    campaignChart(campaignIds: $campaignIds, from: $from, to: $to) {
      dates
      deliveries
      nonDeliveries
      opens
      replies
      interested
      optedOuts
      leadsCount
    }
  }
`
