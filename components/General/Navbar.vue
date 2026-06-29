<template>
  <b-navbar toggleable="lg" type="light" variant="light" class="app-navbar">
    <b-container>
      <b-navbar-brand class="logo" :to="dashboardRoute">Clientforce</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="main-nav">
          <b-nav-item :to="dashboardRoute" active-class="active">Dashboard</b-nav-item>
          <b-nav-item :to="agentsRoute" :active="isAgentsRoute" active-class="active">Agents</b-nav-item>
          <b-nav-item :to="contactsRoute" active-class="active">Contacts</b-nav-item>
          <b-nav-item :to="analyticsRoute" active-class="active">Analytics</b-nav-item>
          <b-nav-item :to="templatesRoute" active-class="active">Templates</b-nav-item>
          <b-nav-item-dropdown text="Tools" right>
            <b-dropdown-item :to="integrationsRoute">Integrations</b-dropdown-item>
            <b-dropdown-item :to="proposalsRoute">Dynamic Proposals</b-dropdown-item>
            <b-dropdown-item :to="widgetRoute">Lead Capture Widget</b-dropdown-item>
            <b-dropdown-item :to="chromeExtensionRoute">LinkedIn Extension</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item :to="settingsRoute" active-class="active">Settings</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto align-items-center">
          <NotificationDropdown v-if="!prototypeMode" />
          <b-nav-item-dropdown right no-caret class="profile-dropdown">
            <template #button-content>
              <img :src="computedPhotoUrl" class="user-profile-photo" alt="Profile" />
            </template>
            <b-dropdown-item :to="settingsRoute">Settings</b-dropdown-item>
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import NotificationDropdown from '~/components/General/NotificationDropdown'

export default {
  components: { NotificationDropdown },

  computed: {
    prototypeMode() {
      return this.$config.prototypeMode
    },

    dashboardRoute() {
      return this.prototypeMode ? { name: 'prototype-dashboard' } : { name: 'dashboardv2' }
    },

    agentsRoute() {
      return this.prototypeMode ? { name: 'prototype-agents' } : { name: 'campaigns-v2' }
    },

    contactsRoute() {
      return this.prototypeMode ? { name: 'prototype-contacts' } : { name: 'leads' }
    },

    analyticsRoute() {
      return this.prototypeMode ? { name: 'prototype-analytics' } : { name: 'analyticsv2' }
    },

    templatesRoute() {
      return this.prototypeMode ? { name: 'prototype-templates' } : { name: 'templates' }
    },

    settingsRoute() {
      return this.prototypeMode ? { name: 'prototype-settings' } : { name: 'settings-profile' }
    },

    integrationsRoute() {
      return this.prototypeMode ? { name: 'prototype-tools', query: { view: 'integrations' } } : { name: 'integrations' }
    },

    proposalsRoute() {
      return this.prototypeMode ? { name: 'prototype-tools', query: { view: 'proposals' } } : { name: 'proposals' }
    },

    widgetRoute() {
      return this.prototypeMode ? { name: 'prototype-tools', query: { view: 'widget' } } : { name: 'widget' }
    },

    chromeExtensionRoute() {
      return this.prototypeMode ? { name: 'prototype-tools', query: { view: 'extension' } } : { name: 'chrome-extension' }
    },

    computedPhotoUrl() {
      return (this.$auth.user && this.$auth.user.photoUrl) || require('@/assets/images/default.png')
    },

    isAgentsRoute() {
      return (this.$route.name || '').includes('campaign') || (this.$route.name || '').includes('prototype-agents')
    },
  },

  methods: {
    async logout() {
      if (this.prototypeMode) {
        this.$router.push({ name: 'login' })
        return
      }

      this.$nuxt.$loading.start()
      await this.$auth.logout()
    },
  },
}
</script>

<style lang="scss">
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #ece7dc;

  .logo {
    width: 135px;
    height: 40px;
    background: transparent url('~@/assets/images/Logo-alt.png') center/contain no-repeat;
    text-indent: -7000px;
    margin-right: 24px;
  }

  .main-nav .nav-link,
  .profile-dropdown .dropdown-toggle {
    border-radius: 999px;
  }

  .main-nav .nav-link {
    color: #5f6368;
    font-weight: 500;
    margin-right: 6px;
    padding: 10px 14px;

    &.active,
    &:hover {
      color: #1f2937;
      background: #eef6e6;
    }
  }

  .dropdown-menu {
    border-radius: 14px;
    border: 1px solid #ece7dc;
    box-shadow: 0 16px 40px rgba(18, 24, 18, 0.08);
  }

  .user-profile-photo {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid #d8e8c8;
    object-fit: cover;
  }
}
</style>
