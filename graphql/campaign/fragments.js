import { gql } from 'graphql-tag'

import { STANDARD_SCHEDULE_FIELDS_FRAGMENT } from '~/graphql/schedule/fragments'

export const CAMPAIGN_FIELDS_FRAGMENT = gql`
  fragment CampaignFields on Campaign {
    id
    title
    isActive
    isArchived
    leadsCount
    opensCount
    openRate
    replyCount
    replyRate
    progressRate
    deliveredCount
    deliveredRate
    interestedCount
    interestedRate
    optedOutCount
    optedOutRate
    notReachedRate
    notReachedCount
    status
    folderId
    proposalsOpened
    proposalsSent
    schedule {
      ...StandardScheduleFields
    }
    configuration {
      id
      email_account_id
      max_no_emails
      disable_opens_tracking
      enable_links_tracking
      upon_reply
      max_unreplied_emails_to_track
      call_automatically
      num_email_opens_before_call
      pause_on_successful_call
      emails_priority
      email_delay
    }
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
  ${STANDARD_SCHEDULE_FIELDS_FRAGMENT}
`
