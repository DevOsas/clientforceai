<template>
  <div>
    <ScheduleEditor
      :campaign="campaign"
      :timezones="timezones"
      :schedule="schedule"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ScheduleEditor from '~/components/Schedule/ScheduleEditor'

import { SCHEDULE_BY_ID_QUERY } from '~/graphql/schedule/queries'

export default {
  components: { ScheduleEditor },

  middleware: 'auth',

  async asyncData({ app, store, params }) {
    const {
      apolloProvider: { defaultClient },
    } = app

    const { data } = await defaultClient.query({
      query: SCHEDULE_BY_ID_QUERY,
      variables: {
        id: params.scheduleId,
      },
    })

    return {
      timezones: data.timezones,
      schedule: data.schedule,
    }
  },

  computed: {
    ...mapState('campaign', {
      campaign: (state) => state.setup,
    }),
  },
}
</script>
