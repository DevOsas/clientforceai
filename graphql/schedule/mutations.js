import { gql } from 'graphql-tag'
import { STANDARD_SCHEDULE_FIELDS_FRAGMENT } from './fragments'

export const SAVE_SCHEDULE_MUTATION = gql`
  mutation (
    $id: Int!
    $title: String!
    $timezoneId: String!
    $plan: [ScheduleDayInput]!
    $followUpPlan: [ScheduleDayInput]!
    $useFollowUpPlan: Boolean
    $useLeadTimezone: Boolean
    $excludeHolidays: Boolean
  ) {
    schedule: saveSchedule(
      id: $id
      title: $title
      timezoneId: $timezoneId
      plan: $plan
      followUpPlan: $followUpPlan
      useFollowUpPlan: $useFollowUpPlan
      useLeadTimezone: $useLeadTimezone
      excludeHolidays: $excludeHolidays
    ) {
      ...StandardScheduleFields
    }
  }
  ${STANDARD_SCHEDULE_FIELDS_FRAGMENT}
`

export const UPDATE_SCHEDULE_MUTATION = gql`
  mutation ($id: Int!) {
    updateSchedule(id: $id)
  }
`

export const DELETE_SCHEDULE_MUTATION = gql`
  mutation ($id: Int!) {
    deleteSchedule(id: $id)
  }
`
