<template>
  <div class="user-sidebar w-100">
    <div class="pr-4 pb-5">
      <div>
        <h2 class="user-settings-header pb-4 font-weight-bolder">
          <span class="mr-3">Settings</span>
          <SvgIcon name="arrow-right" class="icon-lg" />
        </h2>
      </div>

      <div class="user-sidebar-menu w-100">
        <div class="box-header">Accounts</div>
        <ul class="user-sidebar-menu-items">
          <li>
            <NuxtLink :to="{ name: 'settings-profile' }" active-class="active">
              Profile
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'settings-billing' }" active-class="active">
              Plans/Billings
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="{ name: 'settings-email' }"
              active-class="active"
              exact
            >
              Emails
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="{ name: 'settings-email-accounts' }"
              active-class="active"
            >
              Emails Accounts
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'settings-teams' }" active-class="active"
              >Team</NuxtLink
            >
          </li>
          <li>
            <NuxtLink :to="{ name: 'settings-schedule' }" active-class="active"
              >Schedules</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :to="{ name: 'settings-custom-fields' }"
              active-class="active"
            >
              Custom Fields
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'chrome-extension' }" active-class="active">
              Chrome Extension
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.user-sidebar {
  border-right: 1px solid $gray-400;

  .user-sidebar-menu {
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 10px;

    .box-header {
      background: #c8fdc0;
      border-radius: 10px 10px 0 0;
      padding: 10px 30px;
      font-weight: bold;
      font-size: 18px;
      color: $primary;
    }

    .user-sidebar-menu-items {
      list-style: none;
      margin: 0;
      padding: 10px 45px 45px 0;

      & > li {
        & > a {
          color: $gray-600;
          display: block;
          font-size: 1.1rem;
          padding: 10px 30px;
          text-decoration: none;
        }

        // & a.nuxt-link-active {
        //   font-weight: bold;
        // }

        & a.active {
          color: $primary;
        }

        & a:hover {
          color: $primary;
        }
      }
    }
  }
}
</style>
