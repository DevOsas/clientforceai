import LocalScheme from '@nuxtjs/auth/lib/schemes/local'

import { LOGIN_MUTATION, LOGOUT_MUTATION } from '~/graphql/auth/mutations'
import { USER_DETAILS_QUERY } from '~/graphql/auth/queries'

export default class GraphQLScheme extends LocalScheme {
  async login(credentials, { reset = true } = {}) {
    const {
      apolloProvider: { defaultClient: apolloClient },
      $apolloHelpers,
      $config,
    } = this.$auth.ctx.app

    // Ditch any leftover local tokens before attempting to log in
    if (reset) {
      this.$auth.reset({ resetInterceptor: false })
    }

    // Make login request
    const response = await apolloClient
      .mutate({
        mutation: LOGIN_MUTATION,
        variables: credentials,
        context: {
          uri: `${$config.APIRoot}/graphql/auth`,
        },
      })
      .then(({ data }) => data && data.logIn)

    this.$auth.setToken(this.name, response.token)

    // Set your graphql-token
    await $apolloHelpers.onLogin(response.token)

    // Fetch user
    await this.fetchUser()

    return response.token
  }

  // Override `fetchUser` method of `local` scheme
  async fetchUser() {
    const {
      apolloProvider: { defaultClient: apolloClient },
      $config,
    } = this.$auth.ctx.app

    // Token is required but not available
    if (!this.$auth.getToken(this.name)) {
      return
    }

    // Try to fetch user
    const user = await apolloClient
      .query({
        query: USER_DETAILS_QUERY,
        etchPolicy: 'no-cache', // Very Important!
        context: {
          uri: `${$config.APIRoot}/graphql/auth`,
        },
      })
      .then(({ data }) => data && data.userDetails)

    // Set the custom user
    // The `customUser` object will be accessible through `this.$auth.user`
    // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
    this.$auth.setUser(user)
  }

  logout() {
    const {
      apolloProvider: { defaultClient: apolloClient },
      $apolloHelpers,
      $config,
    } = this.$auth.ctx.app

    apolloClient
      .mutate({
        mutation: LOGOUT_MUTATION,
        context: {
          uri: `${$config.APIRoot}/graphql/auth`,
        },
      })
      .then(() => {
        $apolloHelpers.onLogout()

        // But reset regardless
        return this.$auth.reset()
      })
      .catch(() => {
        // console.log(err)
      })
  }

  _setToken(token) {
    // This method in LocalScheme calls app.$axios,
    // since we are not using $axios, we need to
    // override it to prevent the call...
  }

  _clearToken() {
    // This method in LocalScheme calls app.$axios,
    // since we are not using $axios, we need to
    // override it to prevent the call...
  }
}
