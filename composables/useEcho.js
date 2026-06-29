import Echo from 'laravel-echo'
import { onMounted, useContext } from '@nuxtjs/composition-api'

export default function useEcho() {
  onMounted(() => {
    window.Pusher = require('pusher-js')

    const {
      $auth,
      $config: { APIRoot },
    } = useContext()

    const token = $auth.$storage.getState('_token.graphql')
    if (token) {
      window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'g4r4t6rfdg5y5srgf766764',
        cluster: 'mt1',
        auth: { headers: { Authorization: token || null } },
        wsHost: APIRoot.replace('https://', ''),
        // wsPort: 6001,
        wssPort: 6001,
        disableStats: true,
        authEndpoint: `${APIRoot}/broadcasting/auth`,
      })
    }
  })

  return {}
}
