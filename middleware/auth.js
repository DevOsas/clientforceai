const guestRoutes = new Set(['login', 'signup', 'forget-password', 'reset-password'])

export default function ({ $auth, $config, route, redirect }) {
  if ($config.prototypeMode) {
    return
  }

  const routeName = route.name || ''
  const isGuestRoute = guestRoutes.has(routeName)
  const isExplicitlyPublic = route.matched.some((record) => {
    return Object.values(record.components || {}).some((component) => {
      const options = component && (component.options || component)
      return options && options.auth === false
    })
  })

  if (isExplicitlyPublic) {
    return
  }

  if (!$auth.loggedIn && !isGuestRoute) {
    return redirect({ name: 'login', query: { next: route.fullPath } })
  }

  if ($auth.loggedIn && isGuestRoute) {
    return redirect({ name: 'dashboardv2' })
  }
}
