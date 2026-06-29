import { gql } from 'graphql-tag'

export const TOP_UP_MUTATION = gql`
  mutation unitTopUp($amount: String) {
    unitTopUp(amount: $amount) {
      id
      type
      units
      created_at
    }
  }
`
