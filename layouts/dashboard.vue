<template>
  <div>
    <Navbar v-if="$auth.loggedIn" />
    <div class="dashboard-layout" :class="{ 'with-navbar': $auth.loggedIn }">
      <Nuxt />
    </div>
    <notifications group="main" classes="main-notification" />
  </div>
</template>

<script>
import Navbar from '~/components/General/Navbar'

export default {
  name: 'DashboardLayout',
  components: { Navbar },
}
</script>

<style lang="scss">
.dashboard-layout.with-navbar {
  padding-top: 70px;
}
</style>
