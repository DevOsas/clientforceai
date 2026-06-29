import { gql } from 'graphql-tag'

import { CAMPAIGN_FIELDS_FRAGMENT } from './fragments'

export const SAVE_CAMPAIGN_FOLDER_MUTATION = gql`
  mutation SaveCampaignFolderMutation(
    $id: Int
    $title: String!
    $type: String
  ) {
    folder: saveFolder(id: $id, title: $title, type: $type) {
      id
      title
    }
  }
`

export const SAVE_CAMPAIGN_TITLE_MUTATION = gql`
  mutation SaveCampaignTitleMutation($id: Int!, $title: String!) {
    campaign: saveCampaignTitle(id: $id, title: $title) {
      title
    }
  }
`

export const DELETE_CAMPAIGN_FOLDER_MUTATION = gql`
  mutation DeleteFolderMutation($id: Int!) {
    deleted: deleteFolder(id: $id)
  }
`

export const UPDATE_CAMPAIGN_STATUS_MUTATION = gql`
  mutation ChangeCampaignStatusMutation($id: Int!, $status: String!) {
    changeCampaignStatus(id: $id, status: $status) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS_FRAGMENT}
`

export const CREATE_CAMPAIGN_MUTATION = gql`
  mutation CreateCampaignMutation(
    $title: String!
    $steps: [CampaignStepInput]
  ) {
    campaign: newCampaign(title: $title, steps: $steps) {
      id
      title
      schedule {
        id
      }
    }
  }
`
export const CREATE_CAMPAIGN_FROM_TEMPLATE_MUTATION = gql`
  mutation CreateCampaignFromTemplateMutation($id: Int!) {
    campaign: createCampaignFromTemplate(id: $id) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS_FRAGMENT}
`

export const DUPLICATE_CAMPAIGN_MUTATION = gql`
  mutation DuplicateCampaignMutation($id: Int!) {
    campaign: duplicateCampaign(id: $id) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS_FRAGMENT}
`
export const SAVE_CAMPAIGN_STEP_MUTATION = gql`
  mutation SaveCampaignStepMutation(
    $id: Int!
    $campaignId: Int!
    $inMinutes: Int!
    $number: Int!
    $emails: [CampaignStepEmailInput]
  ) {
    saveCampaignStep(
      id: $id
      campaignId: $campaignId
      inMinutes: $inMinutes
      number: $number
      emails: $emails
    ) {
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
`

export const SAVE_CAMPAIGN_STEPS_MUTATION = gql`
  mutation SaveCampaignStepsMutation($id: Int!, $steps: [CampaignStepInput]) {
    steps: saveCampaignSteps(id: $id, steps: $steps) {
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
`

export const ARCHIVE_CAMPAIGN_MUTATION = gql`
  mutation ChangeCampaignStatusMutation($id: Int!, $status: String!) {
    campaign: changeCampaignStatus(id: $id, status: $status) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS_FRAGMENT}
`

export const DELETE_CAMPAIGN_STEP_EMAIL_MUTATION = gql`
  mutation DeleteCampaignStepEmailMutation(
    $id: Int!
    $campaignId: Int!
    $stepId: Int!
  ) {
    deleteCampaignStepEmail(id: $id, campaignId: $campaignId, stepId: $stepId) {
      id
      subject
      body
    }
  }
`
export const DELETE_CAMPAIGN_STEP_MUTATION = gql`
  mutation DeleteCampaignStepMutation($id: Int!, $campaignId: Int!) {
    deleteCampaignStep(id: $id, campaignId: $campaignId) {
      id
      number
    }
  }
`

export const SAVE_CAMPAIGN_CONFIGURATION_MUTATION = gql`
  mutation (
    $campaign_id: Int!
    $email_account_id: Int!
    $max_no_emails: Int!
    $disable_opens_tracking: Boolean!
    $enable_links_tracking: Boolean!
    $upon_reply: String!
    $max_unreplied_emails_to_track: Int!
    $call_automatically: Boolean!
    $num_email_opens_before_call: Int!
    $pause_on_successful_call: Boolean!
    $emails_priority: String!
    $email_delay: Int!
  ) {
    saveCampaignConfiguration(
      campaign_id: $campaign_id
      email_account_id: $email_account_id
      max_no_emails: $max_no_emails
      disable_opens_tracking: $disable_opens_tracking
      enable_links_tracking: $enable_links_tracking
      upon_reply: $upon_reply
      max_unreplied_emails_to_track: $max_unreplied_emails_to_track
      call_automatically: $call_automatically
      num_email_opens_before_call: $num_email_opens_before_call
      pause_on_successful_call: $pause_on_successful_call
      emails_priority: $emails_priority
      email_delay: $email_delay
    ) {
      id
    }
  }
`
export const MOVE_CAMPAIGN_TO_FOLDER_MUTATION = gql`
  mutation MoveCampaignToFolderMutation($id: Int!, $folderId: Int!) {
    campaign: moveCampaignToFolder(id: $id, folderId: $folderId) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FIELDS_FRAGMENT}
`

export const DELETE_CAMPAIGN_TEMPLATE_MUTATION = gql`
  mutation ($id: Int!) {
    isDeleted: deleteCampaignTemplate(id: $id)
  }
`
export const SET_CAMPAIGN_SCHEDULE_MUTATION = gql`
  mutation SetCampaignScheduleMutation($campaignId: Int!, $scheduleId: Int!) {
    setCampaignSchedule(campaignId: $campaignId, scheduleId: $scheduleId) {
      id
    }
  }
`

export const DELETE_CAMPAIGN_MUTATION = gql`
  mutation DeleteCampaignMutation($id: Int!) {
    deleted: deleteCampaign(id: $id)
  }
`
export const CREATE_TEMPLATE_FROM_CAMPAIGN_MUTATION = gql`
  mutation (
    $campaignId: Int!
    $title: String!
    $description: String!
    $icon: String
  ) {
    campaignTemplate: newCampaignTemplateFromCampaign(
      campaign_id: $campaignId
      title: $title
      description: $description
      icon: $icon
    ) {
      id
    }
  }
`
