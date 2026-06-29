<template>
  <div>
    <Navbar v-if="$auth.loggedIn" />
    <div class="main-content" :class="{ 'with-navbar': $auth.loggedIn }">
      <Nuxt />
    </div>

    <Footer v-if="showFooter" />

    <notifications group="main" classes="main-notification" />
    <template v-if="!prototypeMode">
      <LeadFinderModal />
      <LeadCsvImportResultModal />
      <FloatingWriterButton v-if="$auth.loggedIn" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import useEcho from '~/composables/useEcho'

import Navbar from '~/components/General/Navbar'
import LeadFinderModal from '~/components/Lead/LeadFinderModal'
import LeadCsvImportResultModal from '~/components/Lead/LeadCsvImportResultModal'

export default {
  name: 'DefaultLayout',

  components: { Navbar, LeadFinderModal, LeadCsvImportResultModal },

  setup() {
    useEcho()
  },

  computed: {
    ...mapState('layout', {
      showFooter: (state) => state.showFooter,
    }),

    prototypeMode() {
      return this.$config.prototypeMode
    },
  },
}
</script>

<style lang="scss">
.main-content {
  &.with-navbar {
    padding-top: 70px !important;
  }
}
</style>
