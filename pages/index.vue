<script>
export default {
  middleware({ $auth, $config, redirect }) {
    if ($config.prototypeMode) {
      return redirect({ name: 'prototype-dashboard' })
    }

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
