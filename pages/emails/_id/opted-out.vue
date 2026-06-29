<template>
  <div class="opted-out-page">
    <b-container>
      <div class="message-box-wrap">
        <nuxt-link :to="{ name: 'index' }" class="logo">
          Clientforce
        </nuxt-link>
        <div class="message-box">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="message"></div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { GET_OPTOUT_MESSAGE_QUERY } from '~/graphql/email-account/queries'

export default {
  layout: 'bare',

  async asyncData({ $config, params, app: { apolloProvider } }) {
    const { defaultClient: apolloClient } = apolloProvider

    const { data } = await apolloClient.query({
      query: GET_OPTOUT_MESSAGE_QUERY,
      variables: {
        messageId: parseInt(params.id),
      },
      context: {
        uri: `${$config.APIRoot}/graphql/auth`,
      },
    })

    return { message: data.getOptedOutMessage }
  },

  data() {
    return {
      message: '',
    }
  },

  methods: {},
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.opted-out-page {
  display: flex;
  align-items: center;
  height: 100vh;

  .message-box-wrap {
    width: 400px;
    margin: auto;

    .logo {
      display: block;
      width: 150px;
      height: 35px;
      margin: auto;
      margin-bottom: 15px;
      background: transparent
        url('~@/assets/images/clientforce-logo-150x35.png') center/contain
        no-repeat;
      text-indent: -7000px;
    }

    .message-box {
      padding: 50px 30px;
      border-radius: 5px;
      box-shadow: 0 8px 5px #e7e7e7;
    }
  }
}
</style>
