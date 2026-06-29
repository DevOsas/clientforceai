import { gql } from 'graphql-tag'

export const CREDIT_UNIT_TRANSACTIONS_QUERY = gql`
  query getCreditTransactions($limit: Int, $page: Int, $filter: String) {
    creditUnitTransactions(limit: $limit, page: $page, filter: $filter) {
      data {
        id
        units
        type
        created_at
      }
      total
      per_page
    }
  }
`
export const DEBIT_UNIT_TRANSACTIONS_QUERY = gql`
  query getDebitTransactions($limit: Int, $page: Int, $filter: String) {
    debitUnitTransactions(limit: $limit, page: $page, filter: $filter) {
      data {
        id
        debitAction {
          name
          units
          type
        }
        created_at
      }
      total
      per_page
    }
  }
`

export const UNIT_BALANCE_QUERY = gql`
  query {
    unitBalance {
      balance
    }
  }
`

export const CREDIT_TYPES_QUERY = gql`
  query {
    creditUnitTypes {
      name
      value
    }
  }
`

export const DEBIT_ACTIONS_QUERY = gql`
  query {
    debitAction {
      id
      name
      units
      type
    }
  }
`
