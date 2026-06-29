import { gql } from 'graphql-tag'

export const ACCOUNT_SETUP_PROGRESS_QUERY = gql`
  query AccountSetupProgressQuery {
    accountSetupProgress {
      hasEmailAccount
      hasCampaign
      hasLead
      hasTemplate
      hasProposal
    }
  }
`

export const DASHBOARD_STATS_QUERY = gql`
  query DashbaordStatsQuery($range: String, $stats: String) {
    dashboardStats(range: $range, stats: $stats) {
      leadsCount
      campaignsCount
      emailSentCount
      responsesCount
    }
  }
`
