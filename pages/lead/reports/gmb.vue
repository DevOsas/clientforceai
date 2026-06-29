<template>
  <div class="lead-gmb-report-page">
    <b-container>
      <div class="lead-gmb-report-wrap">
        <h3 class="mb-4">Google My Business Report</h3>
        <embed
          src="/reports/google-my-business-report.pdf"
          type="application/pdf"
          width="100%"
          height="1000px"
        />
      </div>
    </b-container>
  </div>
</template>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-gmb-report-page {
  margin-top: 30px;

  .lead-gmb-report-wrap {
    min-height: 80vh;

    h3 {
      color: $gray-700;
    }
  }
}
</style>
