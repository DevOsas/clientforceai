const demoUser = {
  id: 1,
  fullName: 'Alex Morgan',
  photoUrl: '',
  roleAtCompany: 'Growth Lead',
  companyName: 'Northstar Dental',
  companyIndustry: 'Healthcare',
  country: 'United States',
  defaultEmailAccount: { id: 1, email: 'alex@northstardental.co' },
  hasJVZooIntegration: false,
}

export default ({ app, $config }) => {
  if (!$config.prototypeMode || !app.$auth) {
    return
  }

  const applySession = () => {
    if (app.$auth.$state) {
      app.$auth.$state.user = demoUser
      app.$auth.$state.loggedIn = true
    }

    app.$auth.user = demoUser
    app.$auth.loggedIn = true
  }

  applySession()

  app.$auth.setUser = (user) => {
    const nextUser = user || demoUser
    if (app.$auth.$state) {
      app.$auth.$state.user = nextUser
      app.$auth.$state.loggedIn = true
    }
    app.$auth.user = nextUser
    app.$auth.loggedIn = true
  }

  app.$auth.fetchUser = async () => {
    applySession()
    return demoUser
  }

  app.$auth.loginWith = async () => {
    applySession()
    if (process.client) {
      app.router.push({ name: 'prototype-dashboard' })
    }
    return { user: demoUser }
  }

  app.$auth.logout = async () => {
    applySession()
    if (process.client) {
      app.router.push({ name: 'login' })
    }
  }
}
