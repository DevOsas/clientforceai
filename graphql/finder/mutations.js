import { gql } from 'graphql-tag'

export const SEARCH_LOCATION_MUTATION = gql`
  mutation searchLocation($keyword: String) {
    cities: searchLocation(keyword: $keyword) {
      city
      lat
      lng
      country
      iso3
      iso2
      coordinates
    }
  }
`
export const FIND_LEAD_MUTATION = gql`
  mutation findLead(
    $provider: LeadsFinderProviders
    $location: String
    $keyword: String
    $radius: Float
    $nextPage: String
  ) {
    leads: findLead(
      provider: $provider
      location: $location
      keyword: $keyword
      radius: $radius
      nextPage: $nextPage
    )
  }
`
