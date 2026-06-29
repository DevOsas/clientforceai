import { gql } from 'graphql-tag'

import { LEAD_FIELDS_FRAGMENT } from '~/graphql/lead/fragments'

export const CONNECT_JVZOO_MUTATION = gql`
  mutation ConnectJvzooMutation($key: String!) {
    connectJVZoo(key: $key) {
      name
    }
  }
`

export const IMPORT_JVZOO_CUSTOMERS_MUTATION = gql`
  mutation ImportJvZooCustomersMutation($customers: [String], $list: Int) {
    importJVZooCustomers(customers: $customers, list: $list) {
      ...LeadFields
    }
  }
  ${LEAD_FIELDS_FRAGMENT}
`
