import Swal from 'sweetalert2'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { omitDeep } from '~/utils/helpers'

const errorLink = ({ route, app }) => {
  return onError(({ networkError, operation, forward }) => {
    if (networkError) {
      const { statusCode, result } = networkError

      if (statusCode === 402 && result.message === 'NoSubscriptionOrExpired') {
        return false // Do not retry request
      } else if (statusCode === 401) {
        app.$apolloHelpers.onLogout()

        app.$auth.reset()
        app.router.push({
          name: 'login',
          query: { next: route.path },
        })

        Swal.fire({
          icon: 'info',
          title: 'Session Expired!',
          text: 'Please log in again to continue.',
          confirmButtonText: 'Okay',
        })

        return false // Do not retry request
      } else {
        console.log(`[Network error]: ${networkError}`)
      }
    }

    // If no errors were handled, you can choose to retry the request
    // or forward the operation to the next link in the chain
    return forward(operation)
  })
}

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = omitDeep(operation.variables, '__typename')
  }
  return forward(operation).map((data) => {
    return data
  })
})

export default function DefaultConfig(ctx) {
  const { $config } = ctx

  return {
    link: ApolloLink.from([errorLink(ctx), cleanTypenameLink]),

    // required
    httpEndpoint: `${$config.APIRoot}/graphql`,

    // optional
    // See https://www.apollographql.com/docs/link/links/http.html#options
    httpLinkOptions: {
      credentials: 'same-origin',
    },
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    // wsEndpoint: 'ws://localhost:4000', // optional
    // LocalStorage token
    // tokenName: 'apollo-token', // optional
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false, // Optional
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false, // Optional
  }
}
