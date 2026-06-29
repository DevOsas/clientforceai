<template>
  <div class="integrations-page">
    <b-container>
      <div class="d-flex justify-content-center mb-4">
        <h1 class="integrations-page-title">Native Integrations</h1>
      </div>

      <div class="integrations-grid">
        <template v-if="$apollo.queries.userIntegrations.loading">
          <div v-for="num in 4" :key="num" class="integration-item">
            <div class="integration-header">
              <b-skeleton
                animation="fade"
                width="35%"
                height="35px"
                class="mb-1 mt-3"
              />
            </div>
            <div class="integration-body">
              <div class="w-100">
                <div class="integration-title">
                  <b-skeleton
                    animation="fade"
                    width="100%"
                    height="15px"
                    class="mb-1 mt-3"
                  />
                </div>
                <div class="integration-description">
                  <b-skeleton
                    animation="fade"
                    width="85%"
                    height="15px"
                    class="mb-1 mt-3"
                  />
                  <b-skeleton animation="fade" width="100%" height="15px" />
                  <b-skeleton animation="fade" width="95%" height="15px" />
                  <b-skeleton animation="fade" width="100%" height="15px" />
                </div>
              </div>
              <b-skeleton animation="fade" width="50%" height="35px" />
            </div>
          </div>
        </template>

        <template v-else>
          <div
            class="integration-item"
            :class="{ connected: hasJVZooIntegration }"
          >
            <div class="integration-header">
              <img
                :src="loadImage('jvzoo-logo.png')"
                alt=""
                class="integration-logo"
              />
            </div>
            <div class="integration-body">
              <div>
                <div class="integration-title">JVZoo</div>
                <div class="integration-description">
                  JVZoo is an affiliate marketing platform that allows sellers
                  to easily list, promote, and sell their products, and
                  affiliate marketers to easily find interesting products at
                  great prices to promote.
                </div>
              </div>
              <b-button
                v-if="!hasJVZooIntegration"
                variant="integration-custom"
                @click="showConnectJVZooModal"
              >
                Connect
              </b-button>
              <b-button
                v-else
                variant="integration-custom"
                @click="showImportJVZooModal"
              >
                Import Leads
              </b-button>
            </div>
          </div>
          <div
            v-for="integration in integrations"
            :key="integration.id"
            class="integration-item"
            :class="{ connected: integration.connected }"
          >
            <div class="integration-header">
              <img
                :src="loadImage(integration.logo)"
                alt=""
                class="integration-logo"
              />
            </div>
            <div class="integration-body">
              <div>
                <div class="integration-title">{{ integration.name }}</div>
                <div class="integration-description">
                  {{ integration.description }}
                </div>
              </div>
              <b-button variant="integration-custom" @click="showComingSoonNotification">Connect</b-button>
            </div>
          </div>
        </template>
      </div>
    </b-container>

    <ConnectJVZooModal @connected="handleJVZooConnected" />
    <ImportJVZooLeadsModal
      v-if="$auth.user.hasJVZooIntegration"
      @imported="handleImported"
    />
  </div>
</template>

<script>
import ConnectJVZooModal from '~/components/UserIntegration/ConnectJVZooModal.vue'
import ImportJVZooLeadsModal from '~/components/UserIntegration/ImportJVZooLeadsModal.vue'

import { USER_INTEGRATIONS_QUERY } from '~/graphql/user-integration/queries'

export default {
  components: { ConnectJVZooModal, ImportJVZooLeadsModal },

  middleware: 'auth',

  data() {
    return {
      integrations: [
        {
          id: 3,
          name: 'Mailgun',
          description:
            'JVZoo is an affiliate marketing platform that allows sellers to easily list, promote, and sell their products, and affiliate marketers to easily find interesting products at great prices to promote.',
          logo: 'mailchimp-logo.png',
        },
        {
          id: 2,
          name: 'Zapier',
          description:
            'Zapier is an online automation tool that connects your favorite apps, such as Gmail, Slack, Mailchimp, and more',
          logo: 'zapier-logo.png',
        },
      ],
      userIntegrations: [],
    }
  },

  apollo: {
    userIntegrations: {
      query: USER_INTEGRATIONS_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    hasJVZooIntegration() {
      const jv = this.userIntegrations.find((i) => i.name === 'JVZoo')

      return jv !== undefined
    },
  },

  methods: {
    loadImage(image) {
      return require(`@/assets/images/${image}`)
    },

    showConnectJVZooModal() {
      this.$bvModal.show('ConnectJVZooModal')
    },

    showImportJVZooModal() {
      this.$bvModal.show('ImportJVZooLeadsModal')
    },

    handleJVZooConnected(integration) {
      const client = this.$apollo.getClient()

      try {
        const data = client.readQuery({
          query: USER_INTEGRATIONS_QUERY,
        })

        // Add the newly added integration to the end of the integration
        data.userIntegrations.push(integration)

        // Write the integrations data back to cache.
        client.writeQuery({
          query: USER_INTEGRATIONS_QUERY,
          data,
        })
      } catch (err) {
        // Handle error
      }

      this.showImportJVZooModal()
    },

    handleImported() {
      this.$router.push({ name: 'leads' })
    },

    showComingSoonNotification() {
      this.$notify({
        group: 'main',
        type: 'info',
        title: 'Coming Soon',
        text: 'This integration is currently under development and will be available soon.',
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.integrations-page {
  padding-top: 40px;

  .integrations-page-title {
    padding: 10px 100px;
    font-size: 19px;
    line-height: 24px;
    color: $white;
    background-color: $primary;
    text-transform: uppercase;
    border-radius: 50px;
  }

  .integrations-grid {
    display: flex;
    flex-wrap: wrap;
    margin-right: -50px;

    .integration-item {
      background: #ededed;
      border-radius: 10px;
      width: 290px;
      min-height: 340px;
      padding: 30px 20px;
      margin-bottom: 25px;
      border: 2px solid #ededed;
      margin-right: 30px;

      .integration-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        &::after {
          content: '';
          height: 27px;
          width: 27px;
          background-color: #dedede;
          border-radius: 50%;
        }
      }
      .integration-body {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 78%;

        .integration-logo {
          width: 82px;
          height: 40px;
        }

        .integration-title {
          font-weight: bold;
          font-size: 20px;
          line-height: 30px;
          color: #000;
          margin-bottom: 15px;
        }

        .integration-description {
          font-size: 14px;
          line-height: 129.3%;
          text-align: center;
          color: #000;
          margin-bottom: 25px;
        }

        .btn-integration-custom {
          background: #ededed;
          border: 1px solid #8f8f8f;
          border-radius: 10px;
          padding: 7px 50px;
          text-transform: uppercase;

          &:hover {
            background-color: $primary;
            border-color: $primary;
            color: $white;
          }
        }
      }

      &:hover {
        box-shadow: 0 1px 10px 2px rgba(0, 0, 0, 0.15);
      }

      &.connected {
        border-color: #6ed160;

        .integration-header {
          &::after {
            background-color: $primary;
          }
        }
      }
    }
  }
}
</style>
