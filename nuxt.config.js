const apiRoot = process.env.APP_API_ROOT || 'https://src.clientforce.co'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,
  target: 'static',

  server: {
    // https://v2.nuxt.com/docs/features/configuration/#edit-host-and-port
    host: '0.0.0.0',
  },

  loading: {
    color: '#2ecb3a',
    height: '4px',
    continuous: true,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Clientforce',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['assets/scss/index.scss', 'bootstrap-vue/dist/bootstrap-vue.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/directives',
    '~/plugins/notifications',
    '~/plugins/form',
    { src: '~/plugins/echarts', mode: 'client' },
    '~/plugins/global-components',
    '~/plugins/radial-progress',
    '~/plugins/vue-scroll',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // ESLint disabled
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    '@nuxtjs/composition-api/module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/svg',
    '@nuxtjs/apollo',
    '@nuxtjs/auth',
  ],

  auth: {
    redirect: {
      login: '/login',
      logout: '/login?logout=1',
      callback: '/login',
      home: '/dashboardv2',
    },
    strategies: {
      graphql: {
        _scheme: '~/graphql/auth/scheme.js',
      },
    },
    cookie: {
      options: {
        path: '/',
        // domain: apiRoot.substring(apiRoot.indexOf('.')),
      },
    },
    token: {
      property: 'token',
      global: true,
      // Remove any domain specification here
      // domain: 'localhost'
    },
  },

  generate: {
    fallback: '200.html',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ['@nuxtjs/auth'],
    extend(config) {
      if (config && Array.isArray(config.module && config.module.rules)) {
        config.module.rules = config.module.rules.filter((rule) => {
          if (!rule) return true
          const uses = Array.isArray(rule.use) ? rule.use : rule.use ? [rule.use] : []
          const hasEslint = uses.some((u) => {
            const loader = (u && (u.loader || u)) || ''
            return typeof loader === 'string' && loader.includes('eslint-loader')
          })
          return !hasEslint
        })
      }
    },
  },

  publicRuntimeConfig: {
    APIRoot: apiRoot,
    formHost: process.env.APP_FORM_HOST,
  },

  // Give apollo module options
  apollo: {
    // Token name for the cookie which will be set in case of authentication
    tokenName: 'token',

    // Sets the authentication type for any authorized request.
    authenticationType: 'Bearer',

    cookieAttributes: {
      expires: 7,
      path: '/',
      // Only set domain in production
      domain:
        process.env.NODE_ENV === 'production'
          ? apiRoot.substring(apiRoot.indexOf('.'))
          : undefined,
      // Use secure cookies only in production
      secure: process.env.NODE_ENV === 'production',
    },

    includeNodeModules: true,
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler: '~/graphql/apollo/error-handler.js',
    clientConfigs: {
      default: '~/graphql/apollo/default-client.js',
    },
  },
}
