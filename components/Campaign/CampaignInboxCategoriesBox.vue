<template>
  <div class="inbox-categories-box">
    <div class="box-header">Categories</div>
    <div v-if="$apollo.queries.inboxCategories.loading" class="my-4">
      <b-skeleton
        v-for="num in 5"
        :key="num"
        animation="fade"
        width="85%"
        height="25px"
        class="mb-2 mx-3"
      />
    </div>
    <template v-else>
      <ul class="inbox-categories-list">
        <li :class="{ active: categoryId === 'all' }">
          <a href="#" @click.prevent="loadCategoryThreads('all')">
            All replies
          </a>
        </li>
        <li
          v-for="category in inboxCategories"
          :key="category.id"
          :class="{ active: categoryId === category.id }"
        >
          <a href="#" @click.prevent="loadCategoryThreads(category.id)">
            {{ category.title }}
          </a>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { EMAIL_CATEGORIES_QUERY } from '~/graphql/campaign/inbox/queries'

export default {
  data() {
    return {
      inboxCategories: [],
    }
  },

  apollo: {
    inboxCategories: {
      query: EMAIL_CATEGORIES_QUERY,
      variables() {
        return {
          campaignId: parseInt(this.$route.params.id),
        }
      },
      result({ loading, data }) {
        if (!loading) {
          this.$store.dispatch('inbox/updateCategories', data.inboxCategories)
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    categoryId() {
      return this.$route.query.category
        ? parseInt(this.$route.query.category)
        : 'all'
    },
  },

  methods: {
    loadCategoryThreads(id) {
      const { category, ...restQuery } = this.$route.query
      const query = id === 'all' ? restQuery : { category: id }

      this.$router.push({
        name: 'campaign-id-view-inbox',
        params: { id: parseInt(this.$route.params.id) },
        query,
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.inbox-categories-box {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 10px;

  .box-header {
    background: #c8fdc0;
    border-radius: 10px 10px 0 0;
    padding: 10px 30px;
    font-weight: bold;
    font-size: 18px;
    color: #646464;
    text-transform: uppercase;
  }

  .inbox-categories-list {
    list-style: none;
    padding: 0;
    margin: 0;
    padding-top: 10px;
    padding-bottom: 20px;

    & > li {
      & > a {
        color: $gray-600;
        display: block;
        font-size: 1.1rem;
        padding: 5px 30px;
        text-decoration: none;
      }

      &.active {
        & > a {
          color: $primary;
        }
      }
    }
  }
}
</style>
