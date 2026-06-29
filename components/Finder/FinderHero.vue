<template>
  <div class="finder-hero">
    <b-container>
      <div class="finder-hero-header">
        <div class="hero-overline">
          <SvgIcon name="flame" />
          New Lead Finder
        </div>
        <h1 class="finder-hero-title">Google My Business Leads</h1>
        <p class="hero-description">
          Find Hot Leads using simple Keywords & locations <br />
          searches to get business data directly from google
        </p>
      </div>

      <div class="hero-form-wrap">
        <b-form class="hero-form">
          <div class="finder-form-inputs">
            <b-form-group>
              <div class="icon-input">
                <SvgIcon name="keyword-search" />
                <b-form-input
                  id="keywords"
                  size="lg"
                  placeholder="Search keyword"
                  v-model="form.keyword"
                />
              </div>
              <label for="keywords">Keywords</label>
            </b-form-group>
            <b-form-group>
              <div class="icon-input">
                <v-select
                  placeholder="Search location"
                  appendToBody
                  :clearable="false"
                  class="my-select"
                  label="city"
                  @search="fetchOptions"
                  :options="cities"
                  v-model="form.location"
                >
                  <template v-slot:no-options="{ searching }">
                    <em v-if="!searching" style="opacity: 0.5"
                      >Start typing to search for a location.</em
                    >
                  </template>
                </v-select>
              </div>
              <label for="location">Location:</label>
              <span class="text-muted">
                Within
                <b>{{ form.radius }}</b> radius
              </span>
              <b-button
                id="change-radius-id"
                variant="primary"
                size="sm"
                class="rounded"
                >change</b-button
              >
            </b-form-group>
          </div>
          <b-button
            @click="$emit('search-fired', form)"
            variant="primary"
            size="lg"
            class="finder-btn"
            pill
            :disabled="finding || !form.keyword || !form.location"
          >
            <b-spinner v-if="finding" small class="mr-1 mb-1" />
            Search
            <SvgIcon name="arrow-right" class="ml-2" />
          </b-button>
        </b-form>
      </div>
    </b-container>
    <b-popover
      target="change-radius-id"
      triggers="click"
      :show.sync="showChangeRadius"
      placement="right"
      container="finder-hero"
      ref="popover"
      boundary-padding="100"
      offset="10"
    >
      <template #title>
        <b-button @click="onClose" class="close" aria-label="Close">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-button>
        Radius
      </template>

      <div>
        <b-form-input
          id="popover-input-id"
          v-model="form.radius"
          size="sm"
          min="1000"
          max="50000"
          type="range"
        ></b-form-input>
      </div>
    </b-popover>
  </div>
</template>
<script>
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'
import throttle from 'lodash/throttle'
import { SEARCH_LOCATION_MUTATION } from '~/graphql/finder/mutations'
export default {
  components: { vSelect },
  props: {
    finding: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        radius: 50000,
        keyword: '',
        location: '',
        provider: 'GOOGLE',
      },
      cities: [],
      showChangeRadius: false,
    }
  },
  methods: {
    fetchOptions: throttle(function (search) {
      this.$apollo
        .mutate({
          mutation: SEARCH_LOCATION_MUTATION,
          variables: {
            keyword: search,
          },
        })
        .then(({ data }) => {
          this.cities = data.cities
        })
        .catch(({ graphQLErrors: errors }) => {
          if (typeof errors !== 'undefined') {
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].message === 'validation') {
                //
              } else {
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'Error fetching location',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    }, 1300),
    saveRadius() {},
    onClose() {
      this.showChangeRadius = false
    },
  },
}
</script>
<style lang="scss">
@import '~@/assets/scss/variables';
.vs__dropdown-toggle {
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  margin: 0;
  font-family: inherit;
  overflow: visible;
  display: block;
  width: 100%;
  font-weight: 400;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  height: calc(1.5em + 1rem + 2px);
  padding: 0.5rem 1rem;
  font-size: 1.1875rem;
  line-height: 1.5;
  background: #f9f9f9;
  border: 1px solid #ededed;
  border-radius: 10px;
  padding-left: 50px;
  color: #6c757d;
  box-shadow: none;
}
.vs__open-indicator {
  display: none;
}
.my-select {
  min-width: 400px;
}
.finder-hero {
  padding: 50px 0;
  height: 315px;
  background: $primary url('~@/assets/images/finder-bg.png') center/contain
    no-repeat;
  position: relative;

  &::before {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    background: radial-gradient(
      100% 283.5% at 0% 43.33%,
      #a0ea96 0%,
      rgba(110, 209, 96, 0) 100%
    );
  }
  .container {
    position: relative;
    z-index: 1;
  }

  .finder-hero-header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .hero-overline {
      background: rgba(24, 85, 16, 0.31);
      box-shadow: 0 7px 19px rgba(58, 188, 41, 0.35);
      border-radius: 5px;
      margin-bottom: 27px;
      padding: 2px 10px;
      padding-left: 20px;
      font-size: 12px;
      color: $white;
      position: relative;
      font-weight: normal;

      .icon {
        position: absolute;
        left: -9px;
        top: -14px;
        font-size: 28px;
      }
    }

    .finder-hero-title {
      font-weight: bold;
      font-size: 20px;
      background-color: $primary;
      padding: 12px 50px;
      box-shadow: 0 7px 19px rgba(58, 188, 41, 0.35);
      border-radius: 20px;
      margin-bottom: 30px;
      color: $white;
    }

    .hero-description {
      font-weight: normal;
      font-size: 18px;
      line-height: 22px;
      margin-bottom: 30px;
    }
  }

  .hero-form-wrap {
    background-color: $white;
    padding: 20px 40px;
    border: 1px solid #ededed;
    box-shadow: 0 34px 52px -20px rgba(0, 0, 0, 0.03);
    border-radius: 10px;
    width: 95%;
    margin: auto;

    .hero-form {
      display: flex;
      justify-content: space-around;
      .finder-form-inputs {
        display: flex;
        flex-shrink: 1;
        .form-group {
          margin-right: 30px;
          margin-bottom: 0;

          .icon-input {
            position: relative;

            .icon {
              font-size: 28px;
              position: absolute;
              left: 15px;
              top: 4px;
              color: $gray-500;
            }

            .form-control {
              background: #f9f9f9;
              border: 1px solid #ededed;
              border-radius: 10px;
              padding-left: 50px;
              color: $gray-600;
              box-shadow: none;

              &:focus {
                border-color: $primary;
              }

              &::placeholder {
                font-size: 17px;
                line-height: 21px;
                color: $gray-500;
              }
            }
          }

          label {
            margin-top: 8px;
            margin-bottom: 0;
            color: $gray-600;
            margin-left: 10px;
          }
        }
      }

      .finder-btn {
        align-self: flex-start;
        text-transform: uppercase;
        padding: 10px 35px;
        font-weight: bold;
      }
    }
  }
}
</style>
