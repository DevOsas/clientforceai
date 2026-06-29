<template>
  <div class="view-campagin-inbox-page">
    <b-container>
      <div class="campaign-inbox-row">
        <div class="inbox-sidebar-col">
          <CampaignInboxCategoriesBox />
        </div>
        <div class="inbox-main-col">
          <nuxt />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import CampaignInboxCategoriesBox from '~/components/Campaign/CampaignInboxCategoriesBox'

export default {
  components: { CampaignInboxCategoriesBox },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.view-campagin-inbox-page {
  margin-top: 30px;

  .campaign-inbox-row {
    display: flex;

    .inbox-sidebar-col {
      width: 15%;
      flex-shrink: 0;
      margin-right: 30px;
    }

    .inbox-main-col {
      width: 84%;
    }
  }
}
</style>
