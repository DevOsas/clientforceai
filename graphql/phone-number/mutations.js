import gql from 'graphql-tag'

export const SAVE_USER_PHONE_NUMBER_MUTATION = gql`
  mutation SaveUserPhoneNumber(
    $id: Int
    $e164: String
    $label: String
    $provider: String
    $externalSid: String
    $channels: [String]
    $whatsappSender: String
  ) {
    saveUserPhoneNumber(
      id: $id
      e164: $e164
      label: $label
      provider: $provider
      externalSid: $externalSid
      channels: $channels
      whatsappSender: $whatsappSender
    ) {
      id
      e164
      label
      provider
      externalSid
      canVoice
      canWhatsapp
      whatsappSender
      status
    }
  }
`

export const DELETE_USER_PHONE_NUMBER_MUTATION = gql`
  mutation DeleteUserPhoneNumber($id: Int!) {
    deleteUserPhoneNumber(id: $id)
  }
`
