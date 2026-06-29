import { gql } from 'graphql-tag'

export const INVITE_MUTATION = gql`
  mutation invite(
    $first_name: String
    $last_name: String
    $email: String
    $role: String
  ) {
    inviteTeamMember(
      first_name: $first_name
      last_name: $last_name
      email: $email
      role: $role
    ) {
      id
      name
      user {
        id
        firstName
        lastName
      }
    }
  }
`
export const DELETE_INVITE_MUTATION = gql`
  mutation removeTeamMember($id: Int) {
    deleted: removeTeamMember(id: $id)
  }
`
export const SET_ACTIVE_TEAM_MUTATION = gql`
  mutation setActiveTeam($id: Int) {
    team: setActiveTeam(id: $id) {
      id
      role
      user {
        id
        firstName
        lastName
      }
      invitee {
        id
        firstName
        lastName
      }
    }
  }
`
