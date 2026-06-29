import gql from 'graphql-tag'

export const CREATE_CAMPAIGN_V2 = gql`
  mutation CreateCampaignV2(
    $agentName: String
    $campaignName: String!
    $primaryGoal: String
    $audienceDescription: String
    $owner: String
    $tags: String
    $startingPoint: String
    $wizardAnswer1: String
    $wizardAnswer2: String
    $wizardAnswer3: String
    $wizardAnswer4: String
    $channels: [String]
    $brandTone: String
    $brandContext: String
    $industry: String
    $keyphrases: String
  ) {
    createCampaignV2(
      agentName: $agentName
      campaignName: $campaignName
      primaryGoal: $primaryGoal
      audienceDescription: $audienceDescription
      owner: $owner
      tags: $tags
      startingPoint: $startingPoint
      wizardAnswer1: $wizardAnswer1
      wizardAnswer2: $wizardAnswer2
      wizardAnswer3: $wizardAnswer3
      wizardAnswer4: $wizardAnswer4
      channels: $channels
      brandTone: $brandTone
      brandContext: $brandContext
      industry: $industry
      keyphrases: $keyphrases
    ) {
      id
      agentInstanceId
      name
      status
    }
  }
`

export const UPDATE_CAMPAIGN_V2 = gql`
  mutation UpdateCampaignV2(
    $campaignId: ID!
    $agentName: String
    $campaignName: String
    $primaryGoal: String
    $audienceDescription: String
    $owner: String
    $tags: String
    $startingPoint: String
    $wizardAnswer1: String
    $wizardAnswer2: String
    $wizardAnswer3: String
    $wizardAnswer4: String
    $channels: [String]
    $brandTone: String
    $brandContext: String
    $industry: String
    $keyphrases: String
  ) {
    updateCampaignV2(
      campaignId: $campaignId
      agentName: $agentName
      campaignName: $campaignName
      primaryGoal: $primaryGoal
      audienceDescription: $audienceDescription
      owner: $owner
      tags: $tags
      startingPoint: $startingPoint
      wizardAnswer1: $wizardAnswer1
      wizardAnswer2: $wizardAnswer2
      wizardAnswer3: $wizardAnswer3
      wizardAnswer4: $wizardAnswer4
      channels: $channels
      brandTone: $brandTone
      brandContext: $brandContext
      industry: $industry
      keyphrases: $keyphrases
    ) {
      id
      name
      status
      updated
    }
  }
`

export const UPLOAD_KNOWLEDGE_FILE = gql`
  mutation UploadKnowledgeFile(
    $agentInstanceId: ID!
    $filename: String!
    $mime: String!
    $size: Int
  ) {
    uploadKnowledgeFile(
      agentInstanceId: $agentInstanceId
      filename: $filename
      mime: $mime
      size: $size
    )
  }
`

export const CONFIRM_KNOWLEDGE_UPLOAD = gql`
  mutation ConfirmKnowledgeUpload(
    $agentInstanceId: ID!
    $storageKey: String!
    $filename: String!
    $mime: String!
    $size: Int
  ) {
    confirmKnowledgeUpload(
      agentInstanceId: $agentInstanceId
      storageKey: $storageKey
      filename: $filename
      mime: $mime
      size: $size
    )
  }
`

export const ADD_KNOWLEDGE_URL = gql`
  mutation AddKnowledgeUrl($agentInstanceId: ID!, $url: String!) {
    addKnowledgeUrl(agentInstanceId: $agentInstanceId, url: $url) {
      id
      title
      url
      status
      mime
      isSelected
    }
  }
`

export const AGENT_CONVERSE = gql`
  mutation AgentConverse(
    $agentInstanceId: ID!
    $message: String!
    $conversationId: ID
  ) {
    agentConverse(
      agentInstanceId: $agentInstanceId
      message: $message
      conversationId: $conversationId
    ) {
      conversationId
      success
      text
      kind
      wizardFrame
    }
  }
`

export const UPLOAD_AGENT_AVATAR = gql`
  mutation UploadAgentAvatar($agentInstanceId: ID!, $file: Upload!) {
    uploadAgentAvatar(agentInstanceId: $agentInstanceId, file: $file)
  }
`

export const DELETE_KNOWLEDGE_DOCUMENT = gql`
  mutation DeleteKnowledgeDocument($documentId: ID!) {
    deleteKnowledgeDocument(documentId: $documentId)
  }
`

export const SAVE_BUSINESS_DESCRIPTION = gql`
  mutation SaveBusinessDescription(
    $agentInstanceId: ID!
    $businessName: String
    $description: String!
    $keyphrases: String
    $industry: String
    $brandTone: String
    $brandContext: String
  ) {
    saveBusinessDescription(
      agentInstanceId: $agentInstanceId
      businessName: $businessName
      description: $description
      keyphrases: $keyphrases
      industry: $industry
      brandTone: $brandTone
      brandContext: $brandContext
    )
  }
`

export const TOGGLE_DOCUMENT_SELECTION = gql`
  mutation ToggleDocumentSelection($documentId: ID!, $isSelected: Boolean!) {
    toggleDocumentSelection(documentId: $documentId, isSelected: $isSelected)
  }
`

export const RETRY_DOCUMENT_PROCESSING = gql`
  mutation RetryDocumentProcessing($documentId: ID!) {
    retryDocumentProcessing(documentId: $documentId)
  }
`

export const GENERATE_CAMPAIGN_DRAFTS = gql`
  mutation GenerateCampaignDrafts($campaignId: ID!) {
    generateCampaignDrafts(campaignId: $campaignId)
  }
`

export const UPDATE_CAMPAIGN_DRAFT = gql`
  mutation UpdateCampaignDraft($id: ID!, $subject: String, $body: String, $whatsapp: String, $linkedin: String, $timing: String) {
    updateCampaignDraft(id: $id, subject: $subject, body: $body, whatsapp: $whatsapp, linkedin: $linkedin, timing: $timing) {
      id
      stepNumber
      timing
      subject
      body
      whatsapp
      linkedin
    }
  }
`

export const ADD_CAMPAIGN_DRAFT_STEP = gql`
  mutation AddCampaignDraftStep($campaignId: ID!, $stepNumber: Int!, $timing: String) {
    addCampaignDraftStep(campaignId: $campaignId, stepNumber: $stepNumber, timing: $timing) {
      id
      stepNumber
      timing
      subject
      body
    }
  }
`

export const DELETE_CAMPAIGN_DRAFT = gql`
  mutation DeleteCampaignDraft($id: ID!) {
    deleteCampaignDraft(id: $id)
  }
`
