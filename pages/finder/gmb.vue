<template>
  <div class="finder-gmb">
    <FinderHero @search-fired="fireSearch" :finding="finding" />

    <div class="finder-content">
      <b-container>
        <div class="finder-row">
          <FinderSidebar :meta="searchMeta" v-if="showSideBar" />

          <div class="finder-main">
            <FinderLeadsList
              :leads="leads"
              :meta="searchMeta"
              :noResults="showSideBar"
              @load-page="fireSearch"
              :loadingNextPage="loadingNextPage"
            />
          </div>
        </div>
      </b-container>
    </div>
  </div>
</template>

<script>
import FinderHero from '~/components/Finder/FinderHero'
import FinderSidebar from '~/components/Finder/FinderSidebar'
import FinderLeadsList from '~/components/Finder/FinderLeadsList'
import { FIND_LEAD_MUTATION } from '~/graphql/finder/mutations'
export default {
  components: {
    FinderHero,
    FinderSidebar,
    FinderLeadsList,
  },

  middleware: 'auth',

  data() {
    return {
      leads: [],
      finding: false,
      searchMeta: {
        next_page: null,
        total: 0,
      },
      showSideBar: false,
      loadingNextPage: false,
    }
  },

  methods: {
    fireSearch({ ...params }) {
      if (!params.nextPage) {
        this.finding = true
        params.location = params.location.coordinates
        params.radius = Number(params.radius)
      } else {
        this.loadingNextPage = true
      }

      this.$apollo
        .mutate({ mutation: FIND_LEAD_MUTATION, variables: params })
        .then(({ data }) => {
          if (params.nextPage) {
            this.scrollToTop()
          }

          this.leads = data.leads.results.map((lead) => {
            lead.email = null
            return lead
          })

          this.finding = false

          this.loadingNextPage = false

          this.searchMeta.next_page = data.leads?.next_page || null

          this.searchMeta.total = data.leads.results.length

          this.showSideBar = true
        })
        .catch(({ graphQLErrors: errors }) => {
          this.finding = false
          this.loadingNextPage = false
          if (typeof errors !== 'undefined') {
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].message === 'validation') {
                // this.form.errors.set(errors[i].extensions.validation)
              } else {
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'Error searching for leads',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.finder-gmb {
  .finder-content {
    padding-top: 100px;

    .finder-row {
      display: flex;
      justify-content: center;
      min-height: 70vh;

      .finder-main {
        width: 71%;
      }
    }
  }
}
</style>
