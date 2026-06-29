<template>
  <div class="lead-seo-report-page">
    <b-container>
      <div class="lead-seo-report-wrap">
        <h3 class="mb-4">SEO Report</h3>
        <embed
          src="/reports/seo-report.pdf"
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

.lead-seo-report-page {
  margin-top: 30px;

  .lead-seo-report-wrap {
    min-height: 80vh;

    h3 {
      color: $gray-700;
    }
  }
}
</style>
