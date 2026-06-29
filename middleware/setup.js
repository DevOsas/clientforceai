export default function ({ $auth, redirect }) {
  // If the user is not authenticated
  if ($auth.user && !$auth.user.defaultEmailAccount) {
    return redirect({ name: 'setup-profile' })
  }
}
