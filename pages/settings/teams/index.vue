<template>
  <div class="account-email-page">
    <b-container>
      <div class="row py-3">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>
        <div class="col col-md-9 col-sm-12">
          <div class="shadow rounded mb-4 p-5">
            <div class="d-flex justify-content-between mb-4">
              <h3>Set current workspace</h3>
            </div>
            <b-row>
              <b-skeleton-table
                v-if="isFetchingTeams"
                :rows="1"
                :columns="1"
              ></b-skeleton-table>

              <div v-else class="w-100 d-flex justify-content-between">
                <b-form-select class="mr-3" v-model="team_id">
                  <b-form-select-option
                    v-for="team in teams"
                    :key="team.id"
                    :value="team.id"
                    >{{ team.name }} ({{
                      team.pivot.role
                    }})</b-form-select-option
                  >
                </b-form-select>
                <b-button
                  variant="primary"
                  @click="setActiveTeam"
                  :disabled="team?.id == team_id"
                  >Choose</b-button
                >
              </div>
            </b-row>
          </div>
          <div class="shadow rounded p-5">
            <div class="d-flex justify-content-between mb-4">
              <h3>Team Members</h3>
              <b-button
                v-if="
                  limitBalance.workspaces > 0 ||
                  limitBalance.workspaces == 'unlimited'
                "
                variant="primary"
                class="ml-auto"
                @click="$bvModal.show('AddMemberModal')"
              >
                <SvgIcon name="plus" class="icon-sm" />
                Add member
              </b-button>
              <b-button
                v-else
                variant="primary"
                class="ml-auto"
                to="/settings/billing"
              >
                <SvgIcon name="arrow-up" class="icon-sm" />
                Upgrade
              </b-button>
            </div>
            <b-row class="justify-content-center">
              <b-skeleton-table
                v-if="isFetchingMembers"
                :rows="5"
                :columns="4"
              ></b-skeleton-table>

              <template v-else-if="members.length">
                <div
                  v-for="member in members"
                  :key="member.id"
                  class="d-flex shadow-sm p-2 rounded justify-content-around w-100 my-1"
                  style="background-color: #e2ffdf !important"
                >
                  <SvgIcon name="user" class="icon-sm ml-5" />
                  <div class="w-25">{{ member.firstName }}</div>
                  <div class="w-25">{{ member.lastName }}</div>
                  <div class="w-25">{{ member.pivot.role }}</div>
                  <b-dropdown
                    variant="account-action-dropdown"
                    size="sm"
                    right
                    no-caret
                  >
                    <template #button-content>
                      <SvgIcon name="menu-dots" />
                    </template>
                    <template>
                      <b-dropdown-item @click.stop="invokeDeleteMember(member)">
                        Remove
                      </b-dropdown-item>
                    </template>
                  </b-dropdown>
                </div>
              </template>
              <div
                style="
                  text-align: center !important;
                  padding-top: 16px !important;
                "
                v-else
              >
                <h4 class="mb-5">You have no team members</h4>
                <MailBroIl />
              </div>
            </b-row>
          </div>
        </div>
      </div>
    </b-container>

    <b-modal
      id="AddMemberModal"
      centered
      hide-header
      hide-footer
      modal-class="add-email-account-modal"
    >
      <template #default="{ hide }">
        <b-button variant="link" class="close-btn" @click="hide">
          <SvgIcon name="close" />
        </b-button>

        <h5>Add team member to your workspace</h5>
        <p v-if="limitBalance.workspaces == 'unlimited'">
          You have Unlimited workspaces.
        </p>
        <p v-else>
          You can add only {{ limitBalance.workspaces }} more team member(s).
        </p>
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
              size="md"
              required
              :state="getInputState('email')"
            />
            <b-form-invalid-feedback
              class="mt-2"
              :state="getInputState('email')"
            >
              {{ form.errors.get('email') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="First name"
            label-for="first_name"
            :state="getInputState('first_name')"
          >
            <b-form-input
              id="first_name"
              v-model="form.first_name"
              name="first_name"
              size="md"
              required
              :state="getInputState('first_name')"
            />
            <b-form-invalid-feedback
              class="mt-2"
              :state="getInputState('first_name')"
            >
              {{ form.errors.get('first_name') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="Last name"
            label-for="last_name"
            :state="getInputState('last_name')"
          >
            <b-form-input
              id="last_name"
              v-model="form.last_name"
              name="last_name"
              size="md"
              :state="getInputState('last_name')"
            />
            <b-form-invalid-feedback
              class="mt-2"
              :state="getInputState('last_name')"
            >
              {{ form.errors.get('last_name') }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            label="Role"
            label-for="role"
            :state="getInputState('role')"
          >
            <b-form-select
              id="role"
              v-model="form.role"
              name="role"
              size="md"
              :options="roles"
              :state="getInputState('role')"
            />
            <b-form-invalid-feedback
              class="mt-2"
              :state="getInputState('role')"
            >
              {{ form.errors.get('role') }}
            </b-form-invalid-feedback>
          </b-form-group>
        </b-form>
        <div class="text-right mt-4">
          <b-button
            variant="primary"
            class="px-4"
            @click="addMember"
            :disabled="isAddingMember"
          >
            Continue
          </b-button>
        </div>
      </template>
    </b-modal>

    <b-modal id="DeleteMemberModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isDeleting" class="leads-deleting">
          <b-spinner variant="primary" />
        </div>
        <div v-else-if="invokedForDelete" class="text-center p-4">
          <h4>{{ invokedForDelete.email }}</h4>
          <p class="px-3">
            User will be removed from your workspace. Are you sure you want to
            continue?
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
              @click="deleteMember"
            >
              Delete
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import SideBar from '~/components/Setting/SideBar.vue'
import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'

import {
  DELETE_INVITE_MUTATION,
  INVITE_MUTATION,
  SET_ACTIVE_TEAM_MUTATION,
} from '~/graphql/teams/mutations'
import {
  GET_ACTIVE_TEAM_QUERY,
  GET_TEAM_MEMBERS_QUERY,
  GET_TEAMS_QUERY,
} from '~/graphql/teams/queries'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  middleware: 'auth',

  name: 'SettingsTeams',

  components: { SideBar, MailBroIl },

  data() {
    return {
      isFetchingTeams: false,
      isFetchingMembers: false,
      isAddingMember: false,
      teams: [],
      members: [],
      provider: '',
      form: new this.$form({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
      }),
      roles: [
        { text: 'Admin', value: 'admin' },
        { text: 'Collaborator', value: 'collaborator' },
        { text: 'Owner', value: 'owner' },
      ],
      invokedForDelete: null,
      isDeleting: false,
      team_id: null,
      limitBalance: {},
    }
  },

  apollo: {
    teams: {
      query: GET_TEAMS_QUERY,

      result({ loading }) {
        this.isFetchingTeams = loading
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
    members: {
      query: GET_TEAM_MEMBERS_QUERY,

      result({ loading }) {
        this.isFetchingMembers = loading
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
    activeTeam: {
      query: GET_ACTIVE_TEAM_QUERY,
      result({ data }) {
        this.team_id = data?.activeTeam.id
      },
    },
    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
  },

  methods: {
    async addMember() {
      this.isAddingMember = true
      this.form.busy = true
      await this.$apollo
        .mutate({
          mutation: INVITE_MUTATION,
          variables: this.form.data(),
        })
        .then(() => {
          this.isAddingMember = false
          this.form.busy = false
          this.form.reset()
          this.$bvModal.hide('AddMemberModal')
          this.$apollo.queries.members.refetch()

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: 'Team member added successfully',
          })
        })
        .catch(({ graphQLErrors: errors }) => {
          this.isAddingMember = false

          this.form.busy = false
          for (let i = 0; i < errors.length; i++) {
            if (errors[i].message === 'validation') {
              this.form.errors.set(errors[i].extensions.validation)
            } else {
              this.$notify({
                group: 'main',
                type: 'error',
                title: 'Unable to update',
                text: `${errors[i].message}`,
              })
            }
          }
        })
    },

    invokeDeleteMember(member) {
      this.invokedForDelete = member

      this.$bvModal.show('DeleteMemberModal')
    },

    deleteMember() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_INVITE_MUTATION,
          variables: {
            id: this.invokedForDelete.id,
          },
        })
        .then(() => {
          this.$bvModal.hide('DeleteMemberModal')
          this.$apollo.queries.members.refetch()
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: 'The User has been removed successfully',
          })

          setTimeout(() => {
            this.isDeleting = false
            this.invokedForDelete = null
          }, 500)
        })
        .catch(({ graphQLErrors }) => {
          this.isDeleting = false
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Operation failed',
            text: 'An error occurred while processing your request.',
          })
        })
    },
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },
    async setActiveTeam() {
      await this.$apollo
        .mutate({
          mutation: SET_ACTIVE_TEAM_MUTATION,
          variables: {
            id: this.team_id,
          },
        })
        .then(({ data }) => {
          this.team_id = data.team.id
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Operation successful',
            text: 'Workspace changed successfully',
          })
        })
        .catch(({ graphQLErrors: errors }) => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Operations failed',
            text: `${errors[0]?.message}`,
          })
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.add-email-account-modal {
  .close-btn {
    font-size: 2rem;
    color: $gray-200;
    position: absolute;
    right: -25px;
    top: -30px;
    padding: 0;
    line-height: 0;

    &:active,
    &:focus {
      box-shadow: none !important;
      outline: 0 !important;
    }
  }

  .modal-dialog {
    max-width: 745px;
  }

  .modal-body {
    padding: 30px 40px;
  }
}

.account-email-page {
  margin-top: 30px;

  .btn-email-account-plus {
    border-radius: 25px;
    background: $danger;
    color: $white;
    padding: 8px 12px;
    padding: 12px 16px;
  }

  .email-account-table {
    text-align: left;

    .email-account-header {
      color: $gray-500;
    }

    tr {
      cursor: pointer;

      .btn-account-action-dropdown {
        opacity: 0.4;
        box-shadow: none;
        outline: 0;
      }

      &:hover {
        .btn-account-action-dropdown {
          opacity: 1;
        }
      }
    }
  }
}
</style>
