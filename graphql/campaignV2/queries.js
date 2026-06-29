import gql from 'graphql-tag'

export const GET_CAMPAIGN_V2 = gql`
  query GetCampaignV2($campaignId: ID!) {
    getCampaignV2(campaignId: $campaignId)
  }
`

export const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($conversationId: ID!) {
    getConversationMessages(conversationId: $conversationId) {
      conversationId
      messages {
        type
        text
        kind
        payload
        timestamp
      }
      status
    }
  }
`

export const GET_AGENT_DOCUMENTS = gql`
  query GetAgentDocuments($agentInstanceId: ID!) {
    getAgentDocuments(agentInstanceId: $agentInstanceId) {
      id
      title
      status
      fileSize
      chunksCount
      indexedAt
      errorMessage
      createdAt
      isSelected
      progress
      processingStage
      openaiFileId
    }
  }
`

export const GET_CAMPAIGN_DRAFTS = gql`
  query GetCampaignDrafts($campaignId: ID!) {
    getCampaignDrafts(campaignId: $campaignId) {
      id
      stepNumber
      timing
      channel
      subject
      body
      whatsapp
      linkedin
      status
      createdAt
    }
  }
`
