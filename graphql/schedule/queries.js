import { gql } from 'graphql-tag'

import { STANDARD_SCHEDULE_FIELDS_FRAGMENT } from './fragments'

export const SCHEDULE_LIST_QUERY = gql`
  query ScheduleListQuery($offset: Int) {
    schedules: scheduleList(offset: $offset) {
      ...StandardScheduleFields
    }
  }
  ${STANDARD_SCHEDULE_FIELDS_FRAGMENT}
`

export const SCHEDULE_BY_ID_QUERY = gql`
  query ScheduleByIdQuery($id: Int!) {
    schedule: scheduleById(id: $id) {
      ...StandardScheduleFields
    }
    timezones: allTimezones {
      id
      name
      offset
    }
  }
  ${STANDARD_SCHEDULE_FIELDS_FRAGMENT}
`
