import { gql } from 'graphql-tag'

export const USER_INTEGRATIONS_QUERY = gql`
  query UserIntegrationsQuery {
    userIntegrations {
      name
    }
  }
`
export const JVZOO_CUSTOMERS_QUERY = gql`
  query JVZooCustomersQuery {
    jVZooCustomers {
      id
      productName
      productId
      status
      customerEmail
      firstName
      lastName
      affiliateName
    }
  }
`
