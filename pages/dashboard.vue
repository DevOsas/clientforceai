<template>
  <div class="dashboard-page">
    <b-container>
      <div class="d-flex align-items-center justify-content-between greeting">
        <p class="salute">Hello User</p>
        <div>
          <b-button variant="outline-dark" size="md" class="custom-btn" @click="openNewCampaignModal">
            <SvgIcon name="plus" class="mr-2" />
            CREATE CAMPAIGN
          </b-button>
        </div>
      </div>
      <b-row>
        <b-col>
          <div class="greeting">
            <span class="salute">Hello!</span>
            <span class="name">{{ $auth.user.fullName }}</span>
          </div>

          <DashboardStatsTiles />

          <div class="dashboard-lists">
            <DashboardTopLeads />
            <DashboardTopCampaigns />
          </div>
        </b-col>
        <b-col>
          <div class="dashboard-sidebar">
            <div class="dashboard-profile">
              <img
                src="@/assets/images/default.png"
                alt=""
                class="dashboard-user-photo"
              />
              <h4 class="dashboard-user-name">{{ $auth.user.fullName }}</h4>
              <div class="dashboard-user-position">
                {{ $auth.user.roleAtCompany }}
              </div>
            </div>

            <DashboardSidebarTasks />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import DashboardStatsTiles from '~/components/Dashboard/DashboardStatsTiles'
import DashboardTopLeads from '~/components/Dashboard/DashboardTopLeads'
import DashboardTopCampaigns from '~/components/Dashboard/DashboardTopCampaigns'
import DashboardSidebarTasks from '~/components/Dashboard/Sidebar/DashboardSidebarTasks'

export default {
  components: {
    DashboardStatsTiles,
    DashboardTopLeads,
    DashboardTopCampaigns,
    DashboardSidebarTasks,
  },

  middleware: ['auth', 'setup'],

  methods: {
    openNewCampaignModal() {
      // Navigate directly to campaign setup page
      this.$router.push('/campaign-v2/new/setup')
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.dashboard-page {
  margin-top: 20px;
  margin-bottom: 50px;

  .greeting {
    margin-bottom: 30px;

    .salute {
      font-weight: bold;
      font-size: 2rem;
      display: inline-block;
      margin-right: 4px;
    }

    .name {
      font-size: 1.3rem;
      color: $gray-700;
    }

    .custom-btn {
      padding: 0.6rem 1.2rem;
      transition: none !important;
      font-weight: 600;
      border-radius: 8px;
      font-size: .9rem;
      outline: none !important;

      &:hover,
      &:focus {
        background-color: transparent !important;
        color: inherit !important;
        outline: none !important;
        box-shadow: none !important;
      }
    }
  }

  .dashboard-lists {
    margin-top: 45px;
    display: flex;
  }

  .dashboard-sidebar {
    background-color: #fafafa;
    border-radius: 20px;
    padding: 20px 20px 2px;
    margin-left: 20px;

    .dashboard-profile {
      text-align: center;
      margin-top: 50px;

      .dashboard-user-photo {
        width: 130px;
      }

      .dashboard-user-name {
        margin-top: 15px;
        margin-bottom: 2px;
        font-weight: bold;
      }
      .dashboard-user-position {
        margin-top: 5px;
      }
    }
  }
}
</style>
