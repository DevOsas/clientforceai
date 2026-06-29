<template>
  <div class="lead-activity-wrap">
    <div class="lead-activity-form">
      <b-form method="POST" @submit.prevent="addNoteActivity">
        <b-form-group label-for="note" :state="getInputState('note')">
          <b-form-textarea
            id="note"
            v-model="form.note"
            name="note"
            size="lg"
            :state="getInputState('note')"
          />

          <b-form-invalid-feedback :state="getInputState('note')" class="mt-2">
            {{ form.errors.get('note') }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
          class="px-5"
          pill
          :disabled="form.busy"
        >
          <b-spinner v-if="form.busy" class="mr-1" small />
          SAVE
        </b-button>
      </b-form>
    </div>

    <div class="lead-form-extension-activity">
      <div
        v-for="activity in leadActivities"
        :key="activity.id"
        class="extension-activity-item"
      >
        <div class="activity-time">
          <div class="activity-time-content">
            {{ activity.createdAt | formatDate }}
          </div>
        </div>
        <div class="extension-activity-item-content">
          <!-- Created -->
          <template v-if="activity.itemType == 'created'">
            <strong>You</strong> created
            <strong>{{ fullName }}</strong> manually
          </template>

          <!-- Moved to campaign -->
          <template v-if="activity.itemType == 'moved_to_campaign'">
            <strong>You</strong> moved <strong>{{ fullName }}</strong> to
            <router-link
              :to="{
                name: 'campaign-id-view-people',
                params: { id: getActivityContent(activity).campaignId },
              }"
            >
              {{ getActivityContent(activity).campaignName }}
            </router-link>
            campaign manually
          </template>

          <!-- Replied -->
          <template v-if="activity.itemType == 'sent_email'">
            <strong>You</strong> sent
            <b-button variant="link" class="p-0">Email</b-button> to
            <strong>{{ fullName }}</strong> with
            <b-button variant="link" class="p-0"
              >Step {{ getActivityContent(activity).stepNum }}</b-button
            >
            of
            <router-link
              :to="{
                name: 'campaign-id-view-people',
                params: { id: getActivityContent(activity).campaignId },
              }"
            >
              {{ getActivityContent(activity).campaignName }}
            </router-link>
            campaign

            <div class="inner-box">
              {{ getActivityContent(activity).emailBody }}
            </div>
          </template>

          <!-- Replied -->
          <template v-if="activity.itemType == 'replied_email'">
            <strong>{{ fullName }}</strong>
            <b-button variant="link" class="p-0">replied</b-button> to
            <strong>You</strong> in response to
            <b-button variant="link" class="p-0"> Email </b-button> sent using
            <b-button variant="link" class="p-0">
              Step {{ getActivityContent(activity).stepNum }}
            </b-button>
            of
            <router-link
              :to="{
                name: 'campaign-id-view-people',
                params: { id: getActivityContent(activity).campaignId },
              }"
            >
              {{ getActivityContent(activity).campaignName }}
            </router-link>
            campaign

            <div class="inner-box">
              {{ getActivityContent(activity).replyBody }}
            </div>
          </template>

          <!-- Finished -->
          <template v-if="activity.itemType == 'finished_campaign'">
            <strong>{{ fullName }}</strong>
            finished
            <router-link
              :to="{
                name: 'campaign-id-view-people',
                params: { id: getActivityContent(activity).campaignId },
              }"
            >
              {{ getActivityContent(activity).campaignName }}
            </router-link>
            campaign
          </template>

          <!-- Opened -->
          <template v-if="activity.itemType == 'opened_email'">
            <strong>{{ fullName }}</strong>
            opened
            <b-button variant="link" class="p-0"> email </b-button> sent with
            <b-button variant="link" class="p-0">
              Step {{ getActivityContent(activity).stepNum }}
            </b-button>
            of
            <router-link
              :to="{
                name: 'campaign-id-view-people',
                params: { id: getActivityContent(activity).campaignId },
              }"
            >
              {{ getActivityContent(activity).campaignName }}
            </router-link>
          </template>

          <!-- Viewed Proposal -->
          <template v-if="activity.itemType == 'viewed_proposal'">
            <strong>{{ fullName }}</strong>
            viewed
            <b-button
              variant="link"
              class="p-0"
              :to="{
                name: 'proposal-id',
                params: { id: getActivityContent(activity).proposalId },
              }"
            >
              Proposal
            </b-button>
            sent with
            <b-button variant="link" class="p-0">
              Step {{ getActivityContent(activity).stepNum }}
            </b-button>
            of
            <router-link
              :to="{
                name: 'campaign-id-view-people',
                params: { id: getActivityContent(activity).campaignId },
              }"
            >
              {{ getActivityContent(activity).campaignName }}
            </router-link>
          </template>

          <!-- Moved to list -->
          <template v-if="activity.itemType == 'moved_to_list'">
            <strong>You</strong> moved <strong>{{ fullName }}</strong> to
            <a href="#" @click.prevent>
              {{ getActivityContent(activity).listName }}
            </a>
            list manually
          </template>
          <template v-if="activity.itemType == 'note'">
            <strong>You</strong> added a note:
            <div class="inner-box">
              {{ getActivityContent(activity).note }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { LEAD_ACTIVITIES_QUERY } from '~/graphql/lead/queries'
import { ADD_NOTE_TO_LEAD_MUTATION } from '~/graphql/lead/mutations'

export default {
  filters: {
    formatDate(val) {
      return moment.utc(val).format('D MMM YYYY')
    },
  },

  props: {
    lead: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      form: new this.$form({
        leadId: this.lead.id,
        note: '',
      }),
    }
  },

  computed: {
    fullName() {
      return `${this.lead.firstName} ${this.lead.lastName}`
    },
  },

  apollo: {
    leadActivities: {
      query: LEAD_ACTIVITIES_QUERY,
      variables() {
        return {
          leadId: this.lead.id,
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    getActivityContent(activity) {
      return activity.contentProps ? JSON.parse(activity.contentProps) : {}
    },

    addNoteActivity() {
      this.form.busy = true

      this.$apollo
        .mutate({
          mutation: ADD_NOTE_TO_LEAD_MUTATION,
          variables: { ...this.form.data(), leadId: this.lead.id },
        })
        .then(({ data: { addNoteToLead } }) => {
          this.form.busy = false
          this.form.reset()

          const client = this.$apollo.getClient()

          try {
            const data = client.readQuery({
              query: LEAD_ACTIVITIES_QUERY,
              variables: {
                leadId: this.lead.id,
              },
            })

            // Add the newly added activity on top of the list
            data.leadActivities.unshift(addNoteToLead)

            // Write the activity data back to cache.
            client.writeQuery({
              query: LEAD_ACTIVITIES_QUERY,
              variables: {
                leadId: this.lead.id,
              },
              data,
            })
          } catch (err) {
            // Handle error
          }
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
                title: 'Unable to add note',
                text: `${errors[i].message}`,
              })
            }
          }
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';
.lead-activity-wrap {
  margin-top: 20px;
  .lead-activity-form {
    text-align: right;

    textarea.form-control {
      background: $white;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      min-height: 200px;
      margin-bottom: 20px;
    }
  }

  .lead-form-extension-activity {
    padding-top: 30px;

    .extension-activity-item {
      position: relative;
      padding-left: 147px;

      &::after {
        content: '';
        position: absolute;
        left: 108px;
        top: 0;
        width: 3px;
        height: 100%;
        background-color: #e0e0e0;
        margin-top: 2px;
      }

      .activity-time {
        color: #646464;
        font-size: 14px;
        margin-bottom: 7px;
        position: absolute;
        left: 0;
        padding: 20px 0;
        width: 73px;

        .activity-time-content {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            right: -45px;
            top: 2px;
            height: 15px;
            width: 15px;
            background-color: #e0e0e0;
            border-radius: 50%;
          }
        }
      }

      .extension-activity-item-content {
        border-bottom: 1px solid #dfdfdf;
        padding: 20px 0;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          left: -39px;
          top: 0;
          width: 3px;
          height: 35%;
          background-color: #e0e0e0;
          margin-top: 2px;
        }

        .inner-box {
          padding: 20px;
          border-radius: 10px;
          background: #fffafa;
          border: 1px solid rgba(224, 224, 224, 0.31);
          margin-top: 5px;

          .activity-body {
            width: 80%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #646464;
          }
        }
      }

      &:first-child {
        .activity-time,
        .extension-activity-item-content {
          padding-top: 0;

          &::after {
            display: none;
          }
        }
      }

      &:last-child {
        &::after {
          display: none;
        }

        .extension-activity-item-content {
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
