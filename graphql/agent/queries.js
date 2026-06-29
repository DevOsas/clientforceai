import gql from 'graphql-tag'

export const ACTIVE_AGENTS_QUERY = gql`
  query ActiveAgents($limit: Int) {
    activeAgents(limit: $limit) {
      id
      name
      avatarUrl
      status
      channels
      replies
      qualified
      bookings
      payments
    }
  }
`
