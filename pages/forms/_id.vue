<template>
  <div class="form-page">
    <b-container>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="nav-switch-wrap">
          <nuxt-link
            class="nav-switch-item"
            active-class="active"
            exact
            :to="{ name: 'forms-id', params: { id: $route.params.id } }"
          >
            <SvgIcon name="edit-alt" />
            Overview
          </nuxt-link>
          <nuxt-link
            class="nav-switch-item"
            active-class="active"
            exact
            :to="{
              name: 'forms-id-submissions',
              params: { id: $route.params.id },
            }"
          >
            <SvgIcon name="users" />
            Responses
            <span class="responses-badge">{{ submissionsCount }}</span>
          </nuxt-link>
        </div>
      </div>

      <nuxt />
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  middleware: 'auth',

  computed: {
    ...mapState({
      submissionsCount: (state) => state.leadForm.submissionsCount,
    }),
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.form-page {
  padding-top: 30px;

  .nav-switch-wrap {
    background: #ededed;
    border-radius: 50px;
    display: inline-flex;

    .nav-switch-item {
      padding: 10px 30px;
      cursor: pointer;
      font-size: 17px;
      color: #8f8f8f;
      text-decoration: none;
      display: flex;
      align-items: center;

      .icon {
        font-size: 20px;
        line-height: 0;
        margin-right: 5px;
      }

      .responses-badge {
        display: inline-block;
        background-color: white;
        border-radius: 30px;
        padding: 0 7px;
        font-size: 0.7rem;
        margin-left: 5px;
      }

      &.active {
        background-color: $primary;
        border-radius: 50px;
        color: $white;

        .responses-badge {
          color: $gray-600;
        }
      }
    }
  }
}
</style>
