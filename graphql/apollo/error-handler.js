/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

export default ({ graphQLErrors }, context) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      console.warn('error-handler: ', message)
      if (message === 'Unauthorized') {
        // Show Swal and redirect to login
      }
    })
  }
  context.error({ statusCode: 304, message: 'Server error' })
}
