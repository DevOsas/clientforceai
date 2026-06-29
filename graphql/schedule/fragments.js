import { gql } from 'graphql-tag'

export const STANDARD_SCHEDULE_FIELDS_FRAGMENT = gql`
  fragment StandardScheduleFields on Schedule {
    id
    title
    isUserDefault
    timezone {
      id
      name
    }
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
    useFollowUpPlan
    useLeadTimezone
    excludeHolidays
    followUpPlan {
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
`
