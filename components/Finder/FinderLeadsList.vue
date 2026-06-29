<template>
  <div class="finder-leads-list">
    <b-card v-for="lead in leads" :key="lead.id" class="rounded-lg shadow my-3">
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center">
          <span
            class="b-avatar badge-primary rounded-circle"
            style="width: 3em; height: 3em"
            ><span class="b-avatar-img"
              ><img :src="lead.icon" alt="avatar" /></span
            ><!----></span
          >
          <div class="ml-3">
            <h3 class="lead-name">{{ lead.name }}</h3>
            <div class="d-flex">
              <div class="text-capitalize text-truncate">
                <svg-icon class="text-primary" name="tag" />
                {{ lead.categories[0].replaceAll('_', ' ') }}
              </div>
              <div class="ml-4 text-muted">
                <SvgIcon class="text-primary" name="location" />
                {{ lead.vicinity }}
              </div>
            </div>
          </div>
        </div>
        <div>
          <b-button
            :disabled="isLoadingPlace"
            variant="primary"
            @click="getPlaceDetails(lead)"
          >
            <b-spinner
              v-if="whoIsLoading.place_id == lead.place_id && isLoadingPlace"
              small
              class="mr-1 mb-1"
            />
            View Details</b-button
          >
          <b-rating
            variant="primary"
            :value="lead.rating"
            size="sm"
            class="border-0"
            readonly
          />
        </div>
      </div>
    </b-card>
    <div v-if="!leads.length" class="text-center">
      <MailBroIl class="illustration" />
      <h2 class="title">
        {{ noResults ? 'No search results' : 'Start searching...' }}
      </h2>
      <div class="description">
        Enter search term and location to search for leads within a specified
        radius
      </div>
    </div>
    <div class="my-5 d-flex justify-content-end" v-if="meta.next_page">
      {{ meta.total }}+ results &nbsp;
      <b-button
        variant="primary"
        size="sm"
        @click="$emit('load-page', { nextPage: meta.next_page })"
        :disabled="loadingNextPage"
      >
        <b-spinner v-if="loadingNextPage" small class="mr-1 mb-1" />
        Load more</b-button
      >
    </div>
    <FinderDetailModal :place="place" @find-email="setPlace" />
    <b-modal id="LeadEnrichmentModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isEnriching" class="leads-deleting">
          <b-spinner variant="primary" />
        </div>
        <div v-else class="text-center p-4">
          <h4>Lead Enrichment</h4>
          <p>
            Leads are enriched at
            <strong
              >{{ setting.values.leadEnrichment }} lead enrichment units</strong
            >
            per enrichment. Are you sure you want to proceed with lead
            enrichment?
          </p>

          <div class="mt-4">
            <b-button
              variant="link"
              class="text-dark px-4 mr-1"
              pill
              @click="hide"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4 mr-1"
              pill
              @click="findEmail"
            >
              Continue
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import FinderDetailModal from './FinderDetailModal.vue'
import {
  FIND_EMAIL_QUERY,
  GET_PLACE_DETAILS_QUERY,
} from '~/graphql/finder/queries'
import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'
import { SETTINGS_QUERY } from '~/graphql/subscription/queries'

export default {
  components: { FinderDetailModal, MailBroIl },
  props: {
    leads: {
      type: Array,
      required: true,
    },
    meta: {
      type: Object,
      default: () => ({
        next_page: null,
        total: 0,
      }),
    },
    noResults: Boolean,
    loadingNextPage: Boolean,
  },
  data() {
    return {
      place: {},
      isLoadingPlace: false,
      whoIsLoading: {},
      isEnriching: false,
      setting: {},
    }
  },
  apollo: {
    getSetting: {
      query: SETTINGS_QUERY,
      variables: {
        tag: 'unitSetting',
      },
      result({ data }) {
        this.setting = data ? JSON.parse(data.getSetting.options) : {}
      },
    },
  },
  methods: {
    async getPlaceDetails(lead) {
      this.whoIsLoading = lead
      this.isLoadingPlace = true
      const { ...response } = await this.$apollo.query({
        variables: {
          place_id: lead.place_id,
        },
        query: GET_PLACE_DETAILS_QUERY,
      })
      this.isLoadingPlace = response.loading
      this.place = response.data.place
      this.place.email = null
      this.$bvModal.show('finderDetailModal')
    },
    async findEmail() {
      if (!this.place.website) {
        this.$notify({
          group: 'main',
          type: 'native-error',
          title: 'Unable to find email',
          text: `Unfortunately, we were unable to find an email associated with this business.`,
        })
      } else {
        this.isEnriching = true
        const { ...response } =
          (await this.$apollo
            .query({
              query: FIND_EMAIL_QUERY,
              variables: {
                domain: this.place.website,
              },
            })
            .catch(({ graphQLErrors: errors }) => {
              this.isEnriching = false
              for (let i = 0; i < errors.length; i++) {
                if (errors[i].message === 'validation') {
                  // this.form.errors.set(errors[i].extensions.validation)
                } else {
                  this.$notify({
                    group: 'main',
                    type: 'native-error',
                    title: 'Unable to find email',
                    // text: `${errors[i].message}`,
                    text: 'Unfortunately, we were unable to find an email associated with this business.',
                  })
                }
              }
            })) || {}

        this.isEnriching = false
        this.place.email = response.data?.findEmail?.email || null

        this.$bvModal.hide('LeadEnrichmentModal')

        if (response.data) {
          this.$bvModal.hide('finderDetailModal')
          this.$bvModal.show('finderDetailModal')
        }
      }
    },
    setPlace(place) {
      this.place = place
      this.$bvModal.show('LeadEnrichmentModal')
    },
  },
}
</script>
<style scoped>
.badge-primary {
  background-color: #e7fae9 !important;
  box-shadow: 1px 2px 5px #dddcdc !important;
}
.b-avatar .b-avatar-img img {
  border-radius: initial !important;
}
.b-avatar-img {
  padding: 14px;
}
.lead-name {
  font-size: 1.2rem;
}
</style>
