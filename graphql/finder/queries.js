import { gql } from 'graphql-tag'

export const GET_PLACE_DETAILS_QUERY = gql`
  query getPlace($place_id: String) {
    place: getPlace(place_id: $place_id)
  }
`
export const GET_RECENTLY_ADDED_LEAD = gql`
  query {
    recentlyAdded: getRecentLeads {
      id
      email
      phone
      company
    }
  }
`

export const GET_ADDED_LEADS_COUNT = gql`
  query {
    howManyLeads
  }
`

export const GET_FINDER_STAT_QUERY = gql`
  query {
    finderStat: getFinderStat
  }
`
export const FIND_EMAIL_QUERY = gql`
  query findEmail($domain: String, $name: String) {
    findEmail(domain: $domain, name: $name)
  }
`
