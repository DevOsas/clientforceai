<template>
  <b-modal
    id="LeadFormModal"
    size="sm"
    modal-class="lead-form-modal"
    centered
    @hide="handleOnHide"
    @shown="handleOnShown"
  >
    <template #modal-header="{ close }">
      <div class="modal-header-inner">
        <div class="lead-name">{{ form.firstName }} {{ form.lastName }}</div>
        <template v-if="form.id">
          <div class="lead-actions">
            <MoveLeadToListDropdown
              v-b-tooltip.hover
              title="Move to list"
              variant="lead-action"
              class="mr-1"
              :selected="[lead]"
              @change="handleMoveLeadToList"
            >
              <SvgIcon name="text-align-left" class="action-icon" />
            </MoveLeadToListDropdown>

            <AddLeadToCampaignDropdown
              v-b-tooltip.hover.bottom
              title="Add to campaign"
              variant="lead-action"
              @change="handleAddLeadToCampaign"
            >
              <SvgIcon name="megaphone" class="action-icon" />
            </AddLeadToCampaignDropdown>

            <b-button
              id="lead-campaign"
              v-b-tooltip.hover.bottom
              title="Change status"
              variant="lead-action"
              :disabled="!lead.firstCampaignMembership"
              @click="showCampaigns = !showCampaigns"
            >
              <SvgIcon name="check-circle" class="action-icon" />
            </b-button>

            <LeadCampaignMembershipsPopover
              target="lead-campaign"
              :lead="lead"
              :show="showCampaigns"
              @close="showCampaigns = false"
            />

            <b-button
              v-b-tooltip.hover.bottom
              title="Send an email"
              variant="lead-action"
              @click="$bvModal.show('SendEmailModal')"
            >
              <SvgIcon name="email" class="action-icon" />
            </b-button>
            <b-button
              v-b-tooltip.hover.bottom
              title="Delete"
              variant="lead-action"
              @click="$bvModal.show('DeleteLeadWarningModal')"
            >
              <SvgIcon name="delete" class="action-icon" />
            </b-button>
            <b-dropdown
              v-if="emailValidationResponse"
              id="dropdown-1"
              :variant="lead.emailValidatedAt ? 'success' : 'lead-action'"
              menu-class="my-dropdown"
              no-caret
            >
              <template #button-content>
                <SvgIcon
                  :title="
                    lead?.emailValidatedAt
                      ? 'Validation details'
                      : 'Validate Lead'
                  "
                  name="verified"
                  class="action-icon"
                  v-b-tooltip.hover.top
                />
              </template>
              <template #default>
                <b-card style="min-width: 400">
                  <b-card-text v-if="emailValidationResponse">
                    <div class="d-flex justify-content-between">
                      <h6>Risk:</h6>
                      <div>{{ emailValidationResponse.risk }}</div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <h6>Result:</h6>
                      <div>{{ emailValidationResponse.result }}</div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <h6>Is disposable address:</h6>
                      <div>
                        <SvgIcon
                          :name="
                            emailValidationResponse.is_disposable_address
                              ? 'check'
                              : 'close'
                          "
                          class="action-icon"
                          :class="{
                            'text-success':
                              emailValidationResponse.is_disposable_address,
                            'text-danger':
                              !emailValidationResponse.is_disposable_address,
                          }"
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <h6>Is role address:</h6>
                      <div>
                        <SvgIcon
                          :name="
                            emailValidationResponse.is_role_address
                              ? 'check'
                              : 'close'
                          "
                          class="action-icon"
                          :class="{
                            'text-success':
                              emailValidationResponse.is_role_address,
                            'text-danger':
                              !emailValidationResponse.is_role_address,
                          }"
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <h6>Last validated:</h6>
                      <div>
                        {{ lead?.emailValidatedAt }}
                      </div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <h6>Reasons:</h6>
                      <div class="d-flex flex-column">
                        <div
                          v-for="(item, i) in emailValidationResponse.reason"
                          :key="i"
                        >
                          <span class="ucfirst">
                            {{
                              item
                                .replaceAll('_', ' ')
                                .charAt(0)
                                .toUpperCase() +
                              item.replaceAll('_', ' ').slice(1)
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </b-card-text>
                  <b-button
                    variant="primary"
                    @click="$bvModal.show('ValidateLeadEmailModal')"
                  >
                    <SvgIcon name="verified" class="action-icon" />
                    Re-Validate</b-button
                  >
                </b-card>
              </template>
            </b-dropdown>
            <b-button v-else @click="$bvModal.show('ValidateLeadEmailModal')">
              <SvgIcon
                v-b-tooltip.hover.top
                :title="
                  lead?.emailValidatedAt ? 'Validation details' : 'Validate now'
                "
                name="verified"
                class="action-icon"
              />
            </b-button>
          </div>
          <SendEmailModal :lead="lead" />
        </template>

        <div class="install-extension-wrap">
          <InstallChromeExtensionButton :to="{ name: 'chrome-extension' }">
            Install Chrome Extension
          </InstallChromeExtensionButton>
          <p class="install-extension-tip">To add leads from anywhere.</p>
        </div>
      </div>

      <b-button variant="link" class="close-btn" @click="close()">
        <SvgIcon name="close" />
      </b-button>

      <b-button
        v-if="form.id && !expand"
        variant="lead-form-expand"
        @click="toggleExpand"
      >
        <SvgIcon name="plus" />
      </b-button>

      <transition v-if="form.id" name="slide-out">
        <LeadFormExtension v-show="expand" :lead="form" @hide="toggleExpand" />
      </transition>
    </template>

    <template #default>
      <custom-scroll>
        <div class="lead-form-scroll">
          <b-form
            ref="leadForm"
            method="POST"
            class="lead-form"
            @submit.prevent="saveLead"
            @keydown="form.onKeydown($event)"
          >
            <b-form-group
              label="Email"
              label-for="email"
              :state="getInputState('email')"
            >
              <b-form-input
                id="email"
                v-model="form.email"
                name="email"
                size="lg"
                :state="getInputState('email')"
                required
              />
              <b-form-invalid-feedback
                :state="getInputState('email')"
                class="mt-2"
              >
                {{ form.errors.get('email') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="First name"
              label-for="firstName"
              :state="getInputState('firstName')"
            >
              <b-form-input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                size="lg"
                required
                :state="getInputState('firstName')"
              />
              <b-form-invalid-feedback
                :state="getInputState('firstName')"
                class="mt-2"
              >
                {{ form.errors.get('firstName') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Last name"
              label-for="lastName"
              :state="getInputState('lastName')"
            >
              <b-form-input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                size="lg"
                :state="getInputState('lastName')"
              />
              <b-form-invalid-feedback
                :state="getInputState('lastName')"
                class="mt-2"
              >
                {{ form.errors.get('lastName') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Phone"
              label-for="phone"
              :state="getInputState('phone')"
            >
              <b-form-input
                id="phone"
                v-model="form.phone"
                name="phone"
                size="lg"
                :state="getInputState('phone')"
              />
              <b-form-invalid-feedback
                :state="getInputState('phone')"
                class="mt-2"
              >
                {{ form.errors.get('phone') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Address"
              label-for="address"
              :state="getInputState('address')"
              class="mt-2"
            >
              <b-form-input
                id="address"
                v-model="form.address"
                name="address"
                size="lg"
                :state="getInputState('address')"
                class="mt-2"
              />
              <b-form-invalid-feedback
                :state="getInputState('address')"
                class="mt-2"
              >
                {{ form.errors.get('address') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Title"
              label-for="title"
              :state="getInputState('title')"
            >
              <b-form-input
                id="title"
                v-model="form.title"
                name="title"
                size="lg"
                :state="getInputState('title')"
              />

              <b-form-invalid-feedback
                :state="getInputState('title')"
                class="mt-2"
              >
                {{ form.errors.get('title') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Company"
              label-for="company"
              :state="getInputState('company')"
            >
              <b-form-input
                id="company"
                v-model="form.company"
                size="lg"
                :state="getInputState('company')"
              />

              <b-form-invalid-feedback
                :state="getInputState('company')"
                class="mt-2"
              >
                {{ form.errors.get('company') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Domain"
              label-for="domain"
              :state="getInputState('domain')"
            >
              <b-form-input
                id="domain"
                v-model="form.domain"
                name="domain"
                size="lg"
                :state="getInputState('domain')"
              />

              <b-form-invalid-feedback
                :state="getInputState('domain')"
                class="mt-2"
              >
                {{ form.errors.get('domain') }}
              </b-form-invalid-feedback>
            </b-form-group>

            <template v-if="form.customFields?.length">
              <b-form-group
                v-for="(field, fieldIndex) in form.customFields"
                :id="`custom.${field.slug}`"
                :key="field.id"
                :name="`custom.${field.slug}`"
                size="lg"
                :state="getInputState(`custom.${field.slug}`)"
              >
                <template slot="label">
                  {{ field.title }}
                  <!-- <span class="lead-cf-slug">(custom.{{ field.slug }})</span> -->
                </template>
                <b-form-input
                  v-model="form.customFields[fieldIndex].value"
                  :name="`custom.${field.slug}`"
                  :type="field.type"
                />
                <b-form-invalid-feedback
                  :state="getInputState(`custom.${field.slug}`)"
                  class="mt-2"
                >
                  {{ form.errors.get(`custom.${field.slug}`) }}
                </b-form-invalid-feedback>
              </b-form-group>
            </template>
          </b-form>
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
        :disabled="form.busy"
        @click="saveLead"
      >
        <b-spinner v-if="form.busy" class="mr-1" small />
        Save
      </b-button>

      <b-modal id="DeleteLeadWarningModal" centered hide-header hide-footer>
        <template #default="{ hide }">
          <div v-if="isDeleting" class="leads-deleting">
            <b-spinner variant="primary" />
          </div>
          <div v-else class="text-center p-4">
            <h4>Are you sure?</h4>
            <p>Selected lead will be deleted from your account</p>

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
                @click="handleDeleteLead"
              >
                Delete
              </b-button>
            </div>
          </div>
        </template>
      </b-modal>
    </template>
  </b-modal>
</template>

<script>
import MoveLeadToListDropdown from '~/components/Lead/MoveLeadToListDropdown'
import AddLeadToCampaignDropdown from '~/components/Lead/AddLeadToCampaignDropdown'
import LeadCampaignMembershipsPopover from '~/components/Lead/LeadCampaignMembershipsPopover'
import SendEmailModal from '~/components/Email/SendEmailModal'
import InstallChromeExtensionButton from '~/components/General/InstallChromeExtensionButton'
import LeadFormExtension from '~/components/Lead/LeadFormExtension'

import {
  SAVE_LEAD_MUTATION,
  DELETE_LEADS_MUTATION,
  MOVE_LEADS_TO_LISTS_MUTATION,
  ADD_LEADS_TO_CAMPAIGN_MUTATION,
} from '~/graphql/lead/mutations'
import { ALL_CUSTOM_FIELDS_QUERY } from '~/graphql/lead/queries'

export default {
  components: {
    MoveLeadToListDropdown,
    AddLeadToCampaignDropdown,
    LeadCampaignMembershipsPopover,
    SendEmailModal,
    InstallChromeExtensionButton,
    LeadFormExtension,
  },

  props: {
    campaignId: {
      type: Number,
      default: null,
    },

    lead: {
      type: Object,
      default: () => null,
    },
  },

  data() {
    return {
      expand: false,
      form: new this.$form({
        id: null,
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        title: '',
        company: '',
        domain: '',
        customFields: [],
      }),
      showCampaigns: false,
      isDeleting: false,
      emailValidationResponse: {},
      customFields: [],
    }
  },
  apollo: {
    customFields: {
      query: ALL_CUSTOM_FIELDS_QUERY,
      error() {
        return false
      },
      result({ data }) {
        this.form.customFields = data?.customFields
      },
    },
  },

  watch: {
    lead(lead) {
      if (lead) {
        this.form.keys().forEach((key) => {
          this.form[key] = lead[key] ? lead[key] : null
        })
      }
    },
  },

  methods: {
    handleOnShown() {
      if (this.$route.query.showCampaigns) {
        this.showCampaigns = true
      }
      this.emailValidationResponse =
        this.lead && typeof this.lead.emailValidationResponse !== 'undefined'
          ? JSON.parse(this.lead.emailValidationResponse)
          : {}
    },

    handleOnHide() {
      this.expand = false
      this.form.reset()

      this.showCampaigns = false

      const { showCampaigns, ...rest } = this.$route.query
      this.$router.push({ query: rest })

      this.$emit('closed')
    },

    toggleExpand() {
      this.expand = !this.expand
    },

    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    handleMoveLeadToList(listIds) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: MOVE_LEADS_TO_LISTS_MUTATION,
          variables: {
            leadListIds: listIds,
            leadIds: [this.lead.id],
          },
          update: (store, { data: { moveLeadsToLists } }) => {
            this.$emit('saved', moveLeadsToLists[0])

            // Because I can think of way to update lead
            // in th modal yet
            this.$bvModal.hide('LeadFormModal')
          },
        })
        .then(({ data }) => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: `Lead successfully moved to list${
              listIds.length > 1 ? 's' : ''
            }`,
          })

          this.$nuxt.$loading.finish()
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          this.$nuxt.$loading.finish()

          if (errors && errors.length) {
            const validationErrors = errors.filter(
              (error) => error.extensions.category === 'Validation'
            )

            validationErrors.forEach((e) => {
              this.$notify({
                group: 'main',
                type: 'native-error',
                title: `Unable to move lead tolist${
                  listIds.length > 1 ? 's' : ''
                }`,
                text: e.message,
              })
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'native-error',
              title: `Unable to move lead to list${
                listIds.length > 1 ? 's' : ''
              }`,
              text: 'An error occurred while processing your request',
            })
          }
        })
    },

    handleAddLeadToCampaign(campaign) {
      this.$nuxt.$loading.start()

      this.$apollo
        .mutate({
          mutation: ADD_LEADS_TO_CAMPAIGN_MUTATION,
          variables: { leadIds: [this.lead.id], campaignId: campaign.id },
          update: (store, { data: { addLeadsToCampaign } }) => {
            this.$emit('saved', addLeadsToCampaign[0])

            // Because I can think of way to update lead
            // in th modal yet
            this.$bvModal.hide('LeadFormModal')
          },
        })
        .then(({ data }) => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: `Lead successfully added to campaign`,
          })

          this.$nuxt.$loading.finish()
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          this.$nuxt.$loading.finish()

          if (errors && errors.length) {
            const validationErrors = errors.filter(
              (error) => error.extensions.category === 'Validation'
            )

            validationErrors.forEach((e) => {
              this.$notify({
                group: 'main',
                type: 'native-error',
                title: 'Unable to add lead to campaign',
                text: e.message,
              })
            })
          } else {
            this.$notify({
              group: 'main',
              type: 'native-error',
              title: 'Unable to add lead to campaign',
              text: 'An error occurred while processing your request',
            })
          }
        })
    },

    saveLead() {
      this.form.busy = true

      this.$apollo
        .mutate({
          mutation: SAVE_LEAD_MUTATION,
          variables: { ...this.form.data(), campaignId: this.campaignId },
        })
        .then(({ data }) => {
          this.form.busy = false

          this.$emit('saved', data.lead)

          this.$bvModal.hide('LeadFormModal')
          this.$apollo.queries.limitBalance.refresh()
        })
        .catch(({ graphQLErrors: errors }) => {
          this.form.busy = false

          for (let i = 0; i < errors.length; i++) {
            if (errors[i].message === 'validation') {
              this.form.errors.set(errors[i].extensions.validation)
            } else {
              this.$notify({
                group: 'main',
                type: 'error',
                title: 'Unable to save lead',
                text: `${errors[i].message}`,
              })
            }
          }
        })
    },

    handleDeleteLead() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_LEADS_MUTATION,
          variables: {
            ids: [this.lead.id],
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: `Lead deleted successfully`,
          })

          this.isDeleting = false
          this.$bvModal.hide('DeleteLeadWarningModal')
          this.$bvModal.hide('LeadFormModal')

          this.$emit('deleted', this.lead.id)
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to delete',
            text: 'An error occurred while processing your request.',
          })

          this.isDeleting = false
          this.$bvModal.hide('DeleteLeadWarningModal')
        })
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
  .btn-lead-form-expand {
    position: absolute;
    top: 50%;
    height: 40px;
    width: 40px;
    left: -20px;
    transform: translate(0, -50%);
    color: $white;
    background-color: $primary;
    border-radius: 50%;
    padding: 0;
    z-index: 7;

    .icon {
      font-size: 1.3rem;
      margin-top: 3px;
    }
  }

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
    padding: 20px 45px;
    max-height: 65vh;
  }
  .modal-body {
    padding: 10px;
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

      .lead-cf-slug {
        font-size: 0.83rem;
        opacity: 0.7;
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
