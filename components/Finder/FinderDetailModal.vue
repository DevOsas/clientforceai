<template>
  <b-modal
    id="finderDetailModal"
    size="sm"
    modal-class="lead-form-modal"
    centered
    @hide="handleOnHide"
    @shown="handleOnShown"
  >
    <template #modal-header="{ close }">
      <div class="modal-header-inner">
        <!-- icon -->
        <div class="d-flex p-5 align-items-center">
          <b-avatar
            :src="place.icon"
            rounded="lg"
            variant="primary"
            size="lg"
          />
          <b-rating
            :value="place.rating"
            readonly
            variant="primary"
            class="w-25 border-0 bg-transparent"
            size="sm"
          />
        </div>
        <!-- rating -->
      </div>

      <b-button variant="link" class="close-btn" @click="close()">
        <SvgIcon name="close" />
      </b-button>
    </template>

    <template #default>
      <custom-scroll>
        <div class="lead-form-scroll">
          <!-- details -->
          <b-list-group>
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
            >
              {{ place.name }}
              <SvgIcon name="user" />
            </b-list-group-item>

            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
            >
              {{ place.address }}
              <SvgIcon name="location" />
            </b-list-group-item>

            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
            >
              {{ place.phone_number }}
              <SvgIcon name="phone-line" />
            </b-list-group-item>

            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
            >
              <div>
                {{ place.email || 'No email found' }}
                <b-button
                  variant="primary"
                  size="sm"
                  @click="$emit('find-email', place)"
                  v-if="!place.email"
                >
                  Get email</b-button
                >
              </div>
              <SvgIcon name="email" />
            </b-list-group-item>

            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
            >
              <a :href="place.website" target="_blank">Visit website</a>
              <SvgIcon name="global-line" />
            </b-list-group-item>
            <b-list-group-item>
              <div class="d-flex flex-wrap">
                <b-badge
                  class="mx-1 my-1 text-capitalize"
                  v-for="(category, i) in place.categories"
                  :key="i"
                  variant="secondary"
                >
                  <svg-icon name="tag" />
                  {{ category.replaceAll('_', ' ') }}
                </b-badge>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
      </custom-scroll>
    </template>

    <template #modal-footer="{ cancel }">
      <b-button
        variant="link"
        class="px-4 mr-1 text-muted"
        pill
        @click="cancel()"
      >
        Cancel
      </b-button>
      <b-button
        variant="primary"
        class="px-5 font-weight-bold"
        pill
        @click="saveLead"
      >
        <b-spinner v-if="loading" class="mr-1" small />
        Save lead
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { SAVE_LEAD_MUTATION } from '~/graphql/lead/mutations'

export default {
  components: {},

  props: {
    place: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    handleOnShown() {},

    handleOnHide() {
      this.$emit('closed')
    },
    async saveLead() {
      if (this.place.email) {
        this.loading = true
        await this.$apollo
          .mutate({
            variables: {
              email: this.place.email,
              firstName: this.place.name,
              phone: this.place.phone_number,
              company: this.place.name,
              domain: this.place.website,
            },
            mutation: SAVE_LEAD_MUTATION,
          })
          .then(({ data }) => {
            this.loading = false
            this.$bvModal.hide('finderDetailModal')
            this.$notify({
              group: 'main',
              type: 'success',
              title: 'Lead created!',
              text: `Lead created successfully`,
            })
          })
          .catch(({ graphQLErrors: errors }) => {
            this.loading = false
            if (typeof errors !== 'undefined') {
              for (let i = 0; i < errors.length; i++) {
                if (errors[i].message === 'validation') {
                  this.form.errors.set(errors[i].extensions.validation)
                } else {
                  this.$notify({
                    group: 'main',
                    type: 'error',
                    title: 'Failed to save lead',
                    text: `${errors[i].message}`,
                  })
                }
              }
            }
          })
      } else {
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Email not found',
          text: 'Find email to continue',
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';
.my-dropdown {
  position: relative;
  width: 400px;
  padding: 0;
}
.lead-form-modal {
  .modal-dialog {
    max-width: 450px;
    margin: 1.75rem 50px 1.75rem auto;
  }

  .modal-header {
    padding: 0;
    justify-content: flex-end;
    border-bottom: 0;
    padding-bottom: 7px;
    box-shadow: 0 1px 50px -20px rgba(0, 0, 0, 0.2);

    .modal-header-inner {
      width: 100%;

      .lead-name {
        padding: 20px 45px 7px;
        font-size: 1.5rem;
        white-space: nowrap;
        overflow: hidden;
        width: 90%;
        text-overflow: ellipsis;
      }
    }

    .lead-actions {
      margin-right: auto;
      margin-left: 35px;
      margin-bottom: 15px;
      border-radius: 50px;
      padding: 0 10px;

      .btn-lead-action {
        box-shadow: none;
        background-color: $white;
        border: 1px solid $gray-400;

        &:hover {
          background-color: $gray-100;
        }

        &:active {
          box-shadow: none;
        }

        .action-icon {
          color: $gray-800;
        }
      }
    }

    .install-extension-wrap {
      padding: 0 45px;
      margin-top: 10px;

      .install-extension-tip {
        font-size: 0.8rem;
        color: $gray-500;
        text-align: center;
        margin: 5px 0;
      }
    }
  }

  .close-btn {
    font-size: 32px;
    box-shadow: none;
    position: absolute;
    right: 0;
    top: 0;

    &:active {
      box-shadow: none !important;
    }
  }

  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .lead-form-scroll {
    padding: 0;
    max-height: 65vh;
  }
  .modal-body {
    padding: 0;
  }
  .modal-footer {
    justify-content: center;
    border-top: 0;
  }

  .lead-form {
    .form-group {
      margin-bottom: 20px;

      label {
        font-size: 14px;
        line-height: 115.8%;
        text-transform: uppercase;
        color: #263238;
      }

      .form-control {
        border: 1px solid #e0e0e0;
        box-sizing: border-box;
        box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.4);
        border-radius: 10px;
      }
    }
  }
}

.slide-out-enter-active {
  transition: all 0.3s ease;
}
.slide-out-enter,
.slide-out-leave-to {
  transform: scaleX(0);
  opacity: 0;
}
</style>
