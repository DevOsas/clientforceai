import { gql } from 'graphql-tag'

export const GET_TEAMS_QUERY = gql`
  query {
    teams: getTeams {
      id
      name
      user {
        id
        firstName
        lastName
      }
      pivot
    }
  }
`

export const GET_TEAM_MEMBERS_QUERY = gql`
  query {
    members: getTeamMembers {
      id
      firstName
      lastName
      email
      pivot
    }
  }
`

export const GET_ACTIVE_TEAM_QUERY = gql`
  query {
    activeTeam: getActiveTeam {
      id
      name
      pivot
    }
  }
`
