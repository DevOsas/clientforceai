<template>
  <div class="lead-campaign-memberships" @click.stop>
    <ul class="campaigns-list">
      <li>
        <div>
          {{ first.campaign.title }}
        </div>
        <LeadStatuses :statuses="first.statuses" :max="3" />
      </li>
      <li v-if="lead.campaignMembershipCount > 1" class="load-all">
        <b-button
          variant="outline-primary"
          size="sm"
          block
          @click.stop="$emit('open')"
        >
          See all {{ lead.campaignMembershipCount }} campaigns
        </b-button>
      </li>
    </ul>
  </div>
</template>

<script>
import LeadStatuses from '~/components/Lead/LeadStatuses'

export default {
  components: { LeadStatuses },

  props: {
    lead: {
      type: Object,
      required: true,
    },
  },

  computed: {
    first() {
      return this.lead.firstCampaignMembership
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-campaign-memberships {
  position: absolute;
  background-color: $white;
  width: 300px;
  padding: 10px 20px;
  z-index: 1;
  left: -10px;
  top: -4px;
  display: none;
  box-shadow: 0 10px 25px 0 rgba($gray-500, 0.5);

  .campaigns-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 10px;

      &.load-all {
        .btn {
          box-shadow: none !important;
        }
      }
    }
  }
}
</style>
