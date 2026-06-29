<template>
  <div class="form-submission-page">
    <h1>Submissions</h1>
    <div v-if="$apollo.queries.result.loading" class="form-submission-loading">
      <b-spinner variant="primary" />
    </div>
    <div
      v-else-if="result.submissions.length < 1"
      class="empty-form-submission"
    >
      <h2 class="title">No Form submissions yet!</h2>
    </div>
    <b-table
      v-else
      striped
      responsive
      :fields="computedFields"
      :items="computedItems"
    ></b-table>
  </div>
</template>

<script>
import moment from 'moment'
import { LEAD_FORM_SUBMISSIONS_QUERY } from '~/graphql/form/queries'

export default {
  data() {
    return {
      result: {
        submissions: [],
      },
      fields: [
        {
          label: 'ID',
          key: 'id',
        },
        {
          key: 'email',
        },
        {
          label: 'Submitted At',
          key: 'submittedAt',
        },
      ],
    }
  },

  computed: {
    formId() {
      return this.$route.params.id
    },

    computedFields() {
      let values
      if (this.result.submissions.length) {
        const items = JSON.parse(this.result.submissions[0].submission)
        values = items.map((s) => ({ key: s.name }))
      } else {
        values = []
      }

      return [
        {
          label: 'ID',
          key: 'id',
        },
        ...values,
        {
          label: 'Submitted At',
          key: 'submittedAt',
        },
      ]
    },

    computedItems() {
      return this.result.submissions.map((a) => {
        const subs = JSON.parse(a.submission)
        const items = subs.reduce((accumulator, item) => {
          accumulator[item.name] = item.value
          return accumulator
        }, {})

        return {
          ...a,
          ...items,
          submittedAt: moment.utc(a.submittedAt).fromNow(),
        }
      })
    },
  },

  apollo: {
    result: {
      query: LEAD_FORM_SUBMISSIONS_QUERY,
      variables() {
        return {
          id: this.formId,
          offset: this.offset,
        }
      },
      result({ loading, data }) {
        if (!loading) {
          this.$store.dispatch(
            'leadForm/updateSubmissionsCount',
            data.result.total
          )
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.form-submission-page {
  .form-submission-loading {
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.4rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .empty-form-submission {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 655px;
    width: 100%;
    padding: 40px;
    margin: auto;
    background: $gray-100;
    border-radius: 20px;

    .title {
      font-size: 30px;
      margin-bottom: 20px;
      margin-top: -40px;
    }
  }
}
</style>
