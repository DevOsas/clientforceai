<template>
  <div class="lead-form-extension">
    <div class="lead-form-extension-inner">
      <b-button variant="lead-form-collapse" @click="$emit('hide')">
        <SvgIcon name="minus" class="collapse-icon" />
      </b-button>

      <div class="lead-extension-nav-wrap">
        <div class="lead-extension-nav">
          <b-button
            v-for="tab in tabs"
            :key="tab.label"
            variant="nav-button"
            :class="{ active: tab.label === activeTab }"
            @click="switchTab(tab)"
          >
            <SvgIcon :name="tab.icon" class="nav-icon" />
            {{ tab.label }}
          </b-button>
        </div>
      </div>

      <div class="lead-form-extension-scroll">
        <template v-if="activeTab === 'Activity'">
          <LeadFormExtensionActivity v-if="lead.id" :lead="lead" />
        </template>
        <template v-else-if="activeTab === 'Campaigns'">
          <LeadFormExtensionCampaigns v-if="lead.id" :lead="lead" />
        </template>
        <template v-else-if="activeTab === 'Emails'">
          <LeadFormExtensionEmails v-if="lead.id" :lead="lead" />
        </template>
        <!-- <template v-else-if="activeTab === 'Reports'">
          <LeadFormExtensionReports />
        </template> -->
      </div>
    </div>
  </div>
</template>

<script>
import LeadFormExtensionActivity from '~/components/Lead/LeadFormExtensionActivity'
import LeadFormExtensionCampaigns from '~/components/Lead/LeadFormExtensionCampaigns'
import LeadFormExtensionEmails from '~/components/Lead/LeadFormExtensionEmails'
// import LeadFormExtensionReports from '~/components/Lead/LeadFormExtensionReports'

export default {
  components: {
    LeadFormExtensionActivity,
    LeadFormExtensionCampaigns,
    LeadFormExtensionEmails,
    // LeadFormExtensionReports,
  },

  props: {
    lead: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      tabs: [
        {
          label: 'Activity',
          icon: 'activity',
        },
        {
          label: 'Campaigns',
          icon: 'megaphone',
        },
        {
          label: 'Emails',
          icon: 'email',
        },
        // {
        //   label: 'Reports',
        //   icon: 'stats',
        // },
      ],

      activeTab: 'Activity',
    }
  },

  methods: {
    switchTab(tab) {
      this.activeTab = tab.label
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-form-extension {
  position: absolute;
  right: 470px;
  top: 50%;
  transform: translate(0, -50%);
  background: #f5f5f5;
  box-shadow: 3px 15px 37px 2px rgba(0, 0, 0, 0.2);
  border-radius: 30px;

  .lead-form-extension-inner {
    position: relative;
    width: 800px;
    min-height: 587px;

    .btn-lead-form-collapse {
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

      .collapse-icon {
        margin-top: 3px;
        font-size: 1.3rem;
      }
    }
  }

  .lead-extension-nav-wrap {
    padding: 30px 40px 0;
  }

  .lead-extension-nav {
    background-color: $gray-100;
    border-radius: 30px;
    display: inline-block;
    box-shadow: 0 1px 2px rgba($black, 0.2);

    .btn-nav-button {
      border-radius: 30px;
      padding: 8px 30px;
      box-shadow: none !important;

      .nav-icon {
        font-size: 1.2rem;
        margin-right: 5px;
        line-height: 1;
      }

      &:active {
        box-shadow: none !important;
      }

      &.active {
        color: $white;
        background-color: $primary;
      }
    }
  }

  .lead-form-extension-scroll {
    padding: 30px 40px;
    max-height: 84vh;
    overflow-y: auto;
  }
}
</style>
