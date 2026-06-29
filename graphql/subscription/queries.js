import { gql } from 'graphql-tag'

export const TRANSACTIONS_QUERY = gql`
  query getTransactions($limit: Int, $page: Int, $action: String) {
    transactions(limit: $limit, page: $page, action: $action) {
      data {
        id
        units
        amount
        action_type
        transaction_type
        created_at
      }
      total
      per_page
    }
  }
`

export const EMAIL_VALIDATION_BALANCE_QUERY = gql`
  query {
    getEmailValidationBalance {
      balance
    }
  }
`

export const LEAD_ENRICHMENT_BALANCE_QUERY = gql`
  query {
    getLeadEnrichmentBalance {
      balance
    }
  }
`

export const PLAN_QUERY = gql`
  query {
    getUserPlan {
      id
      name
      limits {
        emailValidation
        leadEnrichment
        leads
        campaigns
        customFields
        templates
      }
      features
      price
    }
  }
`

export const SETTINGS_QUERY = gql`
  query getSettings($tag: String) {
    getSetting(tag: $tag) {
      id
      name
      tag
      options
    }
  }
`
export const GET_ALL_PLAN_QUERY = gql`
  query {
    getPlans {
      id
      name
      features
      limits {
        emailValidation
        leadEnrichment
        leads
        campaigns
        templates
        proposals
        workspaces
      }
      price
    }
  }
`
export const GET_LIMIT_BALANCE_QUERY = gql`
  query {
    limitBalance: getUserPlanBalance {
      emailValidation
      leadEnrichment
      leads
      campaigns
      customFields
      templates
      proposals
      workspaces
      currentPlan {
        id
        name
        features
        limits {
          emailValidation
          leadEnrichment
          leads
          campaigns
          templates
          proposals
          workspaces
        }
        price
      }
    }
  }
`
