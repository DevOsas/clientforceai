<template>
  <div class="account-setup-progress">
    <div class="account-usage-box">
      <div class="usage-column">
        <div class="usage-title">Account Setup</div>
        <div class="progress-label">
          <div>Progress</div>
          <div>{{ progress }}%</div>
        </div>
        <b-progress :value="progress" :max="100" class="mb-1"></b-progress>
        <div class="progress-explanation">
          Your account setup completeness...
        </div>
      </div>
      <!-- <div class="usage-column">
        <b-button size="sm" block class="shadow-sm px-3"> Upgrade </b-button>
      </div> -->
    </div>

    <div class="dashboard-tasks">
      <div class="task-header">
        <h5>My Tasks</h5>
      </div>
      <ul class="task-list">
        <template v-if="queryLoading">
          <li v-for="num in 8" :key="num">
            <b-skeleton animation="fade" width="100%" height="20px" />
          </li>
        </template>
        <template v-else>
          <li
            v-for="task in tasks"
            :key="task.title"
            :class="{ done: accountSetupProgress[task.prop] }"
          >
            <div class="task-marker"></div>
            <div class="task-content">
              <div class="d-flex justify-content-between">
                <div class="task-title">{{ task.title }}</div>
                <b-form-checkbox
                  size="lg"
                  disabled
                  :checked="accountSetupProgress[task.prop]"
                />
              </div>
              <div class="task-description">
                {{ task.description }}
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { ACCOUNT_SETUP_PROGRESS_QUERY } from '~/graphql/user/queries'

export default {
  data() {
    return {
      accountSetupProgress: {},
      tasks: [
        {
          title: 'Add an Email account',
          prop: 'hasEmailAccount',
          description: 'Add an Email account to your account',
          checked: true,
        },
        {
          title: 'Create a Campaign',
          prop: 'hasCampaign',
          description: 'Create a campaign to start sending emails',
          checked: false,
        },
        {
          title: 'Add a Lead',
          prop: 'hasLead',
          description: 'Add your existing contacts to Cleintforce',
          checked: false,
        },
        {
          title: 'Create an Email Template',
          prop: 'hasTemplate',
          description: 'Create a reusable Email Template',
          checked: false,
        },
        {
          title: 'Create a Proposal',
          prop: 'hasProposal',
          description: 'Create a Proposal to send to your clients',
          checked: false,
        },
      ],
    }
  },

  apollo: {
    accountSetupProgress: {
      query: ACCOUNT_SETUP_PROGRESS_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    queryLoading() {
      return this.$apollo.queries.accountSetupProgress.loading
    },

    progress() {
      const tasks = Object.keys(this.accountSetupProgress).map((key) => ({
        key,
        done: this.accountSetupProgress[key],
      }))

      const totalTasks = tasks.length

      if (totalTasks < 1) {
        return 0
      }

      const doneTasks = tasks.filter((task) => task.done).length

      return Math.round((doneTasks / totalTasks) * 100)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.account-setup-progress {
  .account-usage-box {
    display: flex;
    align-items: center;
    margin-top: 20px;
    background-color: #f2f2f0;
    padding: 20px 0;
    border-radius: 10px;

    .usage-column {
      padding: 0 20px;

      &:first-of-type {
        width: 100%;
      }
    }
    .usage-title {
      color: $gray-600;
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 4px;
      margin-top: 7px;
      color: $gray-500;
    }

    .progress {
      height: 0.7rem;
      border-radius: 0.77rem;
      border: 1px solid $gray-500;

      .progress-bar {
        border-radius: 0.77rem;
      }
    }

    .progress-explanation {
      font-size: 0.7rem;
      margin-top: 7px;
      color: $gray-500;
    }
  }

  .dashboard-tasks {
    margin-top: 15px;

    .task-header {
      background-color: #f2f2f0;
      padding: 5px 15px;
      margin-bottom: 15px;
      border-radius: 5px;

      h5 {
        margin-bottom: 0;
        color: $gray-500;
        font-weight: normal;
      }
    }

    .task-list {
      list-style: none;
      padding: 0;
      margin-top: 20px;

      li {
        position: relative;
        display: flex;
        padding-bottom: 20px;

        .task-marker {
          height: 17px;
          width: 17px;
          border: 3px solid $primary;
          border-radius: 50%;
          margin-right: 10px;
          position: relative;
          z-index: 1;

          &::after {
            content: '';
            position: absolute;
            width: 3px;
            height: 55px;
            left: 50%;
            transform: translate(-50%, 0);
            background-color: $primary;
            top: 13px;
          }
        }

        .task-content {
          width: 95%;
        }

        .task-title {
          font-weight: bold;
        }

        .task-description {
          color: $gray-500;
          font-size: 0.9rem;
        }

        .custom-checkbox {
          margin-right: -10px;

          .custom-control-label::before {
            border-width: 2px;
          }
        }

        &.done {
          .task-marker {
            height: 24px;
            width: 24px;
            margin-left: -3px;

            &::before {
              content: '';
              position: absolute;
              height: 15px;
              width: 15px;
              background-color: $primary;
              border-radius: 50%;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }

        &:last-child {
          .task-marker {
            &::after {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
