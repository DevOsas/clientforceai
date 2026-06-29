<template>
  <div class="lead-reports-wrap">
    <h4>Reports</h4>
    <ul class="lead-reports-list">
      <li>
        <a href="#" class="report-name" @click.prevent>
          Google My Business Report
        </a>
        <b-button
          :to="{ name: 'lead-reports-gmb' }"
          variant="primary"
          size="sm"
        >
          <SvgIcon name="eye" />
          View
        </b-button>
      </li>
      <li>
        <a href="#" class="report-name" @click.prevent> SEO Report </a>
        <b-button
          :to="{ name: 'lead-reports-seo' }"
          variant="primary"
          size="sm"
        >
          <SvgIcon name="eye" />
          View
        </b-button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import '~@/assets/scss/variables';
.lead-reports-wrap {
  margin-top: 20px;
  .lead-reports-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid $gray-300;
      background-color: darken($gray-100, 2);
      border-radius: 5px;
      margin-bottom: 7px;

      .report-name {
        color: $secondary;
        text-transform: uppercase;
        font-size: 1rem;
        display: block;
        text-decoration: none;
      }
    }
  }
}
</style>
