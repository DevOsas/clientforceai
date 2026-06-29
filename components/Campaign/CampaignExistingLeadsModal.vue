<template>
  <b-modal
    id="CampaignExistingLeadsModal"
    size="xl"
    modal-class="campaign-existing-lead-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHidden"
  >
    <template #default="{ hide }">
      <div class="campaign-existing-lead-modal-header">
        <h4 class="modal-title">Add people to campaign</h4>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>

      <div class="existing-leads-row">
        <div v-if="!leadsEmpty" class="lists-col">
          <SidebarListBox
            :loading="$apollo.queries.lists.loading"
            :is-empty="lists && lists.length < 1"
          >
            <template #header> Lead Lists </template>
            <template #list>
              <li :class="{ active: listId === 0 }">
                <a
                  href="#"
                  @click.prevent="listSelect({ id: 0, title: 'All' })"
                >
                  All leads
                </a>
              </li>
              <li
                v-for="list in lists"
                :key="list.id"
                :class="{ active: listId === list.id }"
              >
                <a href="#" @click.prevent="listSelect(list)">
                  {{ list.title }}
                </a>
              </li>
            </template>
            <template #empty-list>
              <SvgIcon name="folder-add" class="empty-lists-icon" />
              <p>Lists allow you to easily organize your contacts.</p>
            </template>
          </SidebarListBox>
        </div>
        <div class="leads-col" :class="{ full: leadsEmpty }">
          <div
            v-if="$apollo.queries.result.loading"
            class="existing-leads-loading"
          >
            <b-spinner variant="primary" />
          </div>
          <div v-else-if="result.leads.length < 1" class="empty-existing-leads">
            <LeadsIl class="illustration" />
            <div class="description">
              <template v-if="listId">
                This list contains no contacts yet. You can add contacts from
                All contacts or import new contacts to this list
              </template>
              <template v-else>
                You have no existing leads yet. Add leads manually or bulk
                upload leads from a CSV file.
              </template>
            </div>

            <b-button
              v-if="!listId"
              variant="primary"
              class="px-4 mt-4"
              pill
              @click="goBack(hide)"
            >
              <SvgIcon name="arrow-left" class="mr-1" />
              Back
            </b-button>
          </div>
          <div v-else-if="result.leads.length" class="existing-leads-list">
            <div class="d-flex align-self-center">
              <CheckboxDropdown
                :checked="isAllChecked"
                :items="[
                  {
                    value: 'all',
                    label: 'All',
                  },
                  {
                    value: 'none',
                    label: 'None',
                  },
                ]"
                class="mb-4"
                @itemClick="handleDropdownItemClick"
                @change="handleCheckAll"
              />
            </div>

            <div class="leads-thead">
              <div class="existing-leads-list-row">
                <div class="existing-leads-list-col"></div>
                <div class="existing-leads-list-col">Name</div>
                <div class="existing-leads-list-col">Email</div>
                <div class="existing-leads-list-col">Company</div>
                <div class="existing-leads-list-col">Domain</div>
              </div>
            </div>

            <div class="leads-tbody">
              <div
                v-for="lead in result.leads"
                :key="lead.id"
                class="existing-leads-list-row"
                :class="{ selected: selected.includes(lead.id) }"
              >
                <div class="existing-leads-list-col">
                  <b-form-checkbox v-model="selected" :value="lead.id" />
                </div>
                <div class="existing-leads-list-col">
                  {{ `${lead.firstName} ${lead.lastName}` }}
                </div>
                <div class="existing-leads-list-col">
                  {{ lead.email }}
                </div>
                <div class="existing-leads-list-col">{{ lead.company }}</div>
                <div class="existing-leads-list-col">{{ lead.domain }}</div>
              </div>
            </div>

            <div class="text-right mt-5">
              <b-button
                variant="link"
                class="text-dark px-4 mr-2"
                pill
                @click="hide"
              >
                Cancel
              </b-button>

              <b-button
                variant="primary"
                class="px-4"
                pill
                :disabled="!selected.length || adding"
                @click="addSelected"
              >
                <b-spinner v-if="adding" small class="mr-1" />
                Add {{ selected.length }} leads
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import SidebarListBox from '~/components/General/SidebarListBox'
import CheckboxDropdown from '~/components/General/CheckboxDropdown'

import { ALL_LEAD_LISTS_QUERY, ALL_LEADS_QUERY } from '~/graphql/lead/queries'
import { ADD_LEADS_TO_CAMPAIGN_MUTATION } from '~/graphql/lead/mutations'

import LeadsIl from '~/assets/illustrations/leads.svg?inline'

export default {
  components: { SidebarListBox, CheckboxDropdown, LeadsIl },

  props: {
    campaignId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      selected: [],
      result: {},
      offset: 0,
      limit: 50,
      listId: 0,
      adding: false,
    }
  },

  apollo: {
    lists: {
      query: ALL_LEAD_LISTS_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },

    result: {
      query: ALL_LEADS_QUERY,
      variables() {
        return {
          listId: this.listId,
          limit: this.limit,
          filters: [{ property: 'campaign', value: '-1', condition: '' }],
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    leadsEmpty() {
      return !this.listId && this.result.leads && this.result.leads.length < 1
    },

    isAllChecked() {
      return !!(
        this.selected.length &&
        this.selected.length === this.result.leads.length
      )
    },
  },

  methods: {
    selectAll() {
      this.selected = this.result.leads.map((t) => t.id)
    },

    selectNone() {
      this.selected = []
    },

    handleDropdownItemClick(item) {
      if (item.value === 'all') {
        this.selectAll()
      } else if (item.value === 'none') {
        this.selectNone()
      }
    },

    handleCheckAll() {
      if (!this.isAllChecked) {
        this.selectAll()
      } else {
        this.selectNone()
      }
    },

    goBack(hide) {
      hide()

      this.$bvModal.show('CampaignSetupAddLeadModal')
    },

    listSelect(list) {
      this.listId = list.id
    },

    addSelected() {
      this.adding = true

      this.$apollo
        .mutate({
          mutation: ADD_LEADS_TO_CAMPAIGN_MUTATION,
          variables: {
            campaignId: this.campaignId,
            leadIds: this.selected,
          },
        })
        .then(({ data }) => {
          this.adding = false
          this.$bvModal.hide('CampaignExistingLeadsModal')

          this.$emit('added', data.addLeadsToCampaign)
        })
        .catch((e) => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to process',
            text: 'An error occurred while processing your request.',
          })

          this.adding = false
        })
    },

    handleOnHidden() {
      this.selectNone()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.campaign-existing-lead-modal {
  .modal-content {
    background-color: $white;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 50px 50px 70px;
  }

  .existing-leads-loading {
    min-height: 55vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.5rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .empty-existing-leads {
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: $gray-100;
    border-radius: 10px;
    padding: 40px 0 70px;

    .illustration {
      height: 350px;
    }

    .description {
      width: 45%;
      margin: auto;
      text-align: center;
      margin-top: -30px;
    }
  }

  .campaign-existing-lead-modal-header {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .modal-title {
      background-color: $primary;
      padding: 10px 40px;
      color: $white;
      border-radius: 30px;
      margin-bottom: 25px;
      font-size: 20px;
    }

    .close-btn {
      font-size: 32px;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }

  .existing-leads-row {
    display: flex;

    .lists-col {
      width: 19%;
      margin-right: 20px;
    }
    .leads-col {
      width: 80%;

      &.full {
        width: 100%;
      }

      .existing-leads-list {
        .existing-leads-list-row {
          display: flex;
          align-items: center;

          .existing-leads-list-col {
            font-size: 14px;
            line-height: 21px;
            // flex-grow: 1;

            &:nth-child(1) {
              width: 50px;
            }

            &:nth-child(2) {
              width: 220px;
            }

            &:nth-child(3) {
              width: 220px;
            }

            &:nth-child(4) {
              width: 220px;
            }

            &:nth-child(5) {
              width: 220px;
              padding: 0 20px;
            }
          }
        }

        .leads-thead {
          .existing-leads-list-row {
            margin-bottom: 20px;
            padding: 0 25px;

            .existing-leads-list-col {
              text-transform: uppercase;
            }
          }
        }

        .leads-tbody {
          .existing-leads-list-row {
            background-color: #f4f4f4;
            border-radius: 10px;
            margin-bottom: 10px;
            padding: 15px 25px;

            &.selected {
              background-color: #d8ffd2;
            }
          }
        }
      }
    }
  }
}
</style>
