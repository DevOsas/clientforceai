import { gql } from 'graphql-tag'

export const COUNTRIES_QUERY = gql`
  query CountriesQuery {
    countries {
      id
      name
      isoCode
      callCode
    }
  }
`
