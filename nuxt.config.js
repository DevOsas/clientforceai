const apiRoot = process.env.APP_API_ROOT || 'https://src.clientforce.co'
const prototypeMode = process.env.APP_PROTOTYPE_MODE !== 'false'

export default {
  ssr: false,
  target: 'static',

  server: {
    host: '0.0.0.0',
  },

  loading: {
    color: '#2ecb3a',
    height: '4px',
    continuous: true,
  },

  head: {
    title: 'Clientforce',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  },

  css: ['assets/scss/index.scss', 'bootstrap-vue/dist/bootstrap-vue.css'],

  plugins: [
    '~/directives',
    '~/plugins/notifications',
    '~/plugins/form',
    { src: '~/plugins/echarts', mode: 'client' },
    '~/plugins/global-components',
    '~/plugins/radial-progress',
    '~/plugins/vue-scroll',
    '~/plugins/prototype-mode',
  ],

  components: false,

  buildModules: ['@nuxtjs/composition-api/module'],

  modules: ['bootstrap-vue/nuxt', '@nuxtjs/svg', '@nuxtjs/apollo', '@nuxtjs/auth'],

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
      },
    },
    token: {
      property: 'token',
      global: true,
    },
  },

  generate: {
    fallback: '200.html',
  },

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
    prototypeMode,
  },

  apollo: {
    tokenName: 'token',
    authenticationType: 'Bearer',
    cookieAttributes: {
      expires: 7,
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? apiRoot.substring(apiRoot.indexOf('.'))
          : undefined,
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

