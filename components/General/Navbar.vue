<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-container>
      <b-navbar-brand class="logo" :to="{ name: 'dashboardv2' }">
        Clientforce
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="main-nav">
          <!-- Workspace Dropdown -->
          <b-nav-item-dropdown class="workspace-dropdown" no-caret>
            <template #button-content>
              <div class="workspace-logo">W</div>
              <span class="workspace-name">Workspace</span>
              <SvgIcon name="double-chevron" class="dropdown-icon" />
            </template>
            <b-dropdown-item href="#">
              <div class="workspace-logo">W</div>
              <span>Workspace 1</span>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <div class="workspace-logo">W</div>
              <span>Workspace 2</span>
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button class="add-workspace-btn" @click="openCreateWorkspaceModal">
              <SvgIcon name="plus" />
              Add Workspace
            </b-dropdown-item-button>
          </b-nav-item-dropdown>

          <b-nav-item :to="{ name: 'dashboardv2' }" active-class="active">
            <SvgIcon name="dashboard-2" />
            Dashboard
          </b-nav-item>

          <b-nav-item
            :to="{ name: 'campaigns-v2' }"
            :active="$route.name.includes('campaign')"
            active-class="active"
          >
            <SvgIcon name="agent" />
            Agents
          </b-nav-item>

          <b-nav-item :to="{ name: 'leads' }" active-class="active">
            <SvgIcon name="capture-lead" />
            Contacts
          </b-nav-item>
         
          <b-nav-item :to="{ name: 'analyticsv2' }" active-class="active">
            <SvgIcon name="analytics" />
            Analytics
          </b-nav-item>

          <b-nav-item :to="{ name: 'templates' }" active-class="active">
            <SvgIcon name="templates" />
            Templates
          </b-nav-item>

          <!-- Tools Dropdown -->
          <b-nav-item-dropdown class="tools-dropdown" no-caret>
            <template #button-content>
              <SvgIcon name="tools-alt" />
              <span>Tools</span>
              <SvgIcon name="chevron-down-2" class="dropdown-icon" />
            </template>
            <b-dropdown-item :to="{ name: 'integrations' }">
              <SvgIcon name="integration" />
              Integrations
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'proposals' }">
              <SvgIcon name="proposal-alt" />
             Dynamic Proposals
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'widget' }">
              <SvgIcon name="capture-lead" />
             Lead Capture Widget
            </b-dropdown-item>
           
            <b-dropdown-item @click="$bvModal.show('FinderModal')">
              <SvgIcon name="form-builder" />
             Form Builder
            </b-dropdown-item>
             <b-dropdown-item :to="{ name: 'chrome-extension' }" class="linkedin-extension">
              <SvgIcon name="chrome-ext" />
            LinkedIn Lead Extension
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item :to="{ name: 'settings-profile' }" active-class="active">
            <SvgIcon name="settings" />
            Settings
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item v-b-tooltip title="Help" class="help-button" href="#">
            <SvgIcon name="help-alt" />
          </b-nav-item>

          <NotificationDropdown />
          <b-nav-item-dropdown class="user-profile-dropdown" right>
            <template #button-content>
              <img :src="computedPhotoUrl" class="user-profile-photo" />
            </template>
            <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
            <b-dropdown-item :to="{ name: 'settings-profile' }"
              >Settings</b-dropdown-item
            >
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <CreateWorkspaceModal @submit="handleWorkspaceSubmit" />
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import NotificationDropdown from '~/components/General/NotificationDropdown'
export default {
  components: {NotificationDropdown},

  computed: {
    computedPhotoUrl() {
      return this.$auth.user.photoUrl || require('@/assets/images/default.png')
    },
  },

  methods: {
    openCreateWorkspaceModal() {
      this.$bvModal.show('CreateWorkspaceModal')
    },
    handleWorkspaceSubmit(payload) {
      this.$emit('create-workspace', payload)
    },
    async logout() {
      this.$nuxt.$loading.start()
      await this.$auth.logout()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff !important;
  border-bottom: 1px solid #e5e5e5;
  padding: .5rem 1rem;
  font-family: 'Plus Jakarta Sans', sans-serif;


  // Render all icons as stroke-only to avoid filled shapes in the navbar
  // .icon,
  // .icon svg,
  // .icon svg * {
  //   fill: none !important;
  //   stroke: currentColor;
  // }

  .navbar-brand.logo {
    width: 135px;
    height: 40px;
    background: transparent url('~@/assets/images/Logo-alt.png')
      center/contain no-repeat;
    text-indent: -7000px;
    margin-right: 30px;
  }

  .finder-btn {
    color: $dark;
    align-self: center;
    border-width: 2px;
    border-radius: 5px;
    display: flex;
    align-items: center;

    .icon {
      font-size: 22px;
      line-height: 0;
      margin-right: 7px;
      margin-top: 3px;
    }

    &:hover {
      color: $white;
    }
  }

  .help-button {
    .nav-link {
      padding: 11px 5px;
      margin-right: 5px;
      display: flex;
      align-items: center;
      font-size: 22px;
    }
  }

  // Remove fill from specific icons only
  // Target: workspace chevron, agents, tools, help, linkedin extension
  .workspace-dropdown .dropdown-icon,
  .main-nav .nav-item:nth-child(3) .icon,  // Agents icon
  .tools-dropdown > .dropdown-toggle > .icon:first-child,  // Tools icon
  .help-button .icon,  // Help icon
  .tools-dropdown .linkedin-extension .icon {  // LinkedIn extension icon only
    svg,
    svg * {
      fill: none !important;
      stroke: currentColor !important;
    }
  }

  .main-nav.navbar-nav {
    .nav-item {
      .nav-link {
        padding: 8px 14px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        position: relative;
        border-radius: 8px;
        transition: all 0.2s ease;
        color: #6b7280;
        font-size: 16px;
        font-weight: 500;

        .icon {
          font-size: 1.1rem;
          margin-right: 6px;
        }

        &:hover {
          color: $primary;
          background: rgba($primary, 0.05);
        }

        &.active {
          color: #3e880a;
          border: 2px solid $primary;
          font-weight: 600;
        }
        
      }
    }

    // Workspace Dropdown Styles
    .workspace-dropdown {
      .dropdown-toggle {
        padding: 10px 16px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 8px;
        color: #6b7280;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        border: 1px solid $gray-300;

        &::after {
          display: none;
        }

        .workspace-logo {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: $gray-100;
          color: $primary;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 600;
          margin-right: 8px;
          border: 1px solid $gray-200;

        }

        .workspace-name {
          font-weight: 500;
          margin-right: 8px;
        }

        .dropdown-icon {
          font-size: 0.75rem;
          margin-left: auto;
        }

        &:hover {
         background: rgba($primary, 0.05);
        }
      }

      .dropdown-menu {
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 8px;
        min-width: 200px;
        background: #fff;
        border: 1px solid $gray-200;

        .dropdown-item {
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          font-size: 1rem;
          transition: all 0.2s ease;

          .workspace-logo {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            
            color: $primary;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: 600;
            margin-right: 15px;
            background: $gray-100;

          }

          .icon {
            font-size: 1.1rem;
            margin-right: 8px;
          }

          &:hover {
           background: rgba($primary, 0.05);
          }

          &.add-workspace-btn {
            border: 1px solid $gray-300 !important;
            margin-top: 4px;
            font-weight: 500;
          }
        }

        .dropdown-divider {
          margin: 8px 0;
        }
      }
    }

    // Tools Dropdown - Same styling as regular nav items
    .tools-dropdown {
      .dropdown-toggle {
        padding: 8px 16px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        position: relative;
        border-radius: 8px;
        transition: all 0.2s ease;
        color: #6b7280;
        background: transparent;
        border: none;

        &::after {
          display: none;
        }

        .icon {
          font-size: 1.1rem;
          margin-right: 6px;
        }

        span {
          margin-right: 6px;
        }

        .dropdown-icon {
          font-size: 0.75rem;
          margin-left: 2px;
        }

        &:hover {
          color: $primary;
          background: rgba($primary, 0.05);
        }
      }

      .dropdown-menu {
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 8px;
        min-width: 200px;

        .dropdown-item {
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          font-size: 1rem;
          transition: all 0.2s ease;
          color: $gray-600;

          .icon {
            font-size: 1.1rem;
            margin-right: 15px;
          }

          &:hover {
background: rgba($primary, 0.05);          }
        }
      }
    }
  }

  .user-profile-dropdown {
    .dropdown-toggle {
      display: flex;
      align-items: center;

      .user-profile-name {
        max-width: 150px;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 1px;
      }
    }
  }

  .notification-icon {
    font-size: 22px;
    color: #44ccd9;
    box-shadow: none;
    position: relative;
  }

  .user-profile-photo {
    width: 40px;
    height: 40px;
    border: 2px solid $gray-500;
    background-color: $gray-400;
    border-radius: 20%;
  }
}
</style>
