import gql from 'graphql-tag'

export const ALL_USER_PHONE_NUMBERS_QUERY = gql`
  query AllUserPhoneNumbers($channel: String) {
    allUserPhoneNumbers(channel: $channel) {
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
