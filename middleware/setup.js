export default function ({ $auth, $config, redirect }) {
  if ($config.prototypeMode) {
    return
  }

  if ($auth.user && !$auth.user.defaultEmailAccount) {
    return redirect({ name: 'setup-profile' })
  }
}
