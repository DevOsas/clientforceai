<template>
  <div class="forms-page">
    <b-container>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="forms-page-title">Lead Forms</h1>

        <b-button
          :to="{ name: 'forms-id', params: { id: 0 } }"
          variant="primary"
          class="create-btn shadow"
        >
          <SvgIcon name="plus" class="mr-1" />
          Create New Form
        </b-button>
      </div>

      <div v-if="$apollo.queries.result.loading" class="forms-loading">
        <b-spinner variant="primary" />
      </div>
      <div v-else-if="result.forms.length < 1" class="empty-forms">
        <h2 class="title">No Forms yet.</h2>
        <div class="description">
          Create lead capture forms that can be embeded on other websites.
        </div>
      </div>
      <div v-else class="forms-container">
        <div class="form-head">
          <div class="form-meta">
            <div class="created-at">Created At</div>
            <div class="submissions">Submissions</div>
          </div>
        </div>

        <div class="form-items">
          <div
            v-for="form in result.forms"
            :key="form.id"
            class="form-item"
            @click="openForm(form)"
          >
            <div class="form-details">
              <div class="form-title">{{ form.title }}</div>
              <div class="form-decription">
                {{ form.description }}
              </div>
            </div>
            <div class="form-meta">
              <div class="created-at">{{ form.createdAt | timeAgo }}</div>
              <div class="submissions">{{ form.submissionsCount || 0 }}</div>
              <SvgIcon class="arrow-icon" name="arrow-right" />
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import moment from 'moment'
import { ALL_LEAD_FORMS_QUERY } from '~/graphql/form/queries'

export default {
  middleware: 'auth',

  filters: {
    timeAgo(value) {
      if (value) {
        return moment.utc(value).fromNow()
      }

      return '-'
    },
  },

  data() {
    return {
      result: {
        forms: [],
      },
      offset: 0,
    }
  },

  apollo: {
    result: {
      query: ALL_LEAD_FORMS_QUERY,
      variables() {
        return {
          offset: this.offset,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {},

  methods: {
    openForm(form) {
      this.$router.push({ name: 'forms-id', params: { id: form.id } })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.forms-page {
  padding-top: 40px;

  .forms-loading {
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

  .empty-forms {
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

    .description {
      width: 650px;
      text-align: center;
      margin-bottom: 25px;
      font-size: 20px;
      line-height: 129.3%;
      color: $gray-600;
    }
  }

  .forms-page-title {
    padding: 10px 70px;
    font-size: 19px;
    line-height: 24px;
    color: $white;
    background-color: $primary;
    text-transform: uppercase;
    border-radius: 5px 0;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      border-top: 23px solid transparent;
      border-bottom: 23px solid white;
      border-left: 23px solid white;
      border-right: 23px solid transparent;
    }
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      border-top: 23px solid white;
      border-bottom: 23px solid transparent;
      border-left: 23px solid transparent;
      border-right: 23px solid white;
    }
  }

  .forms-container {
    .form-details {
      width: 40%;

      .form-title {
        font-size: 1rem;
        line-height: 1.2;
      }
      .form-decription {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.85rem;
        color: $gray-600;
      }
    }

    .form-meta {
      display: flex;
      font-size: 0.85rem;
      text-align: center;

      .created-at {
        width: 150px;
        margin-right: 25px;
      }
      .submissions {
        width: 100px;
      }

      .arrow-icon {
        width: 35px;
        text-align: right;
        color: $primary;
        opacity: 0;
      }
    }

    .form-head {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 0.9rem;
      font-weight: bold;
      color: $gray-500;
      padding: 0 30px;
      margin-bottom: 7px;

      .form-meta {
        font-size: 0.9rem;
        margin-right: 35px;
      }
    }

    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 30px;
      background-color: #fff;
      box-shadow: 0 1px 5px #0000001a;
      cursor: pointer;

      &:nth-child(1) {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }

      &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }

      &:hover {
        background-color: $gray-100;

        .arrow-icon {
          opacity: 1;
        }
      }
    }
  }
}
</style>
