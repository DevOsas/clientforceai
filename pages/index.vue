<script>
export default {
  middleware({ $auth, redirect }) {
    // If the user is not authenticated
    if (!$auth.loggedIn) {
      return redirect({ name: 'login' })
    }

    return redirect({ name: 'dashboardv2' })
  },

  render() {
    return null
  },
}
</script>
