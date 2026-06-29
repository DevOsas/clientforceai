import gql from 'graphql-tag'

export const CONVERT_DRAFTS_TO_STEPS = gql`
  mutation ConvertDraftsToSteps($campaignId: Int!, $autoApprove: Boolean) {
    convertDraftsToSteps(campaignId: $campaignId, autoApprove: $autoApprove)
  }
`

export const SETUP_CAMPAIGN_V2_SCHEDULE = gql`
  mutation SetupCampaignV2Schedule($campaignId: Int!, $timezone: String!, $plan: String!) {
    setupCampaignV2Schedule(campaignId: $campaignId, timezone: $timezone, plan: $plan) {
      id
      title
      status
      schedule {
        id
        title
        plan {
          weekDay
          isActive
          timeRanges {
            fromTime {
              hour
              minute
            }
            toTime {
              hour
              minute
            }
          }
        }
      }
    }
  }
`

export const SETUP_CAMPAIGN_V2_CONFIGURATION = gql`
  mutation SetupCampaignV2Configuration(
    $campaignId: Int!
    $emailAccountIds: [Int!]
    $emailsPerDayLimit: Int
    $callsPerDayLimit: Int
    $retriesCalls: Int
    $gdprCompliance: Boolean
    $whatsappConsents: Boolean
    $callPhoneNumberIds: [Int!]
    $whatsappPhoneNumberIds: [Int!]
  ) {
    setupCampaignV2Configuration(
      campaignId: $campaignId
      emailAccountIds: $emailAccountIds
      emailsPerDayLimit: $emailsPerDayLimit
      callsPerDayLimit: $callsPerDayLimit
      retriesCalls: $retriesCalls
      gdprCompliance: $gdprCompliance
      whatsappConsents: $whatsappConsents
      callPhoneNumberIds: $callPhoneNumberIds
      whatsappPhoneNumberIds: $whatsappPhoneNumberIds
    ) {
      id
      title
      status
      configuration {
        id
        emailsPerDayLimit
        callsPerDayLimit
        emailAccountIds
        callPhoneNumberIds
        whatsappPhoneNumberIds
      }
    }
  }
`

export const ADD_CONTACTS_TO_CAMPAIGN_V2 = gql`
  mutation AddContactsToCampaignV2($campaignId: Int!, $leadIds: [Int!]!) {
    addContactsToCampaignV2(campaignId: $campaignId, leadIds: $leadIds)
  }
`

export const ACTIVATE_CAMPAIGN_V2 = gql`
  mutation ActivateCampaignV2($campaignId: Int!) {
    activateCampaignV2(campaignId: $campaignId) {
      id
      title
      status
    }
  }
`
