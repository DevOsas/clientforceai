<template>
  <b-modal
    id="LeadCsvImportResultModal"
    size="lg"
    modal-class="lead-csv-import-result-modal"
    hide-header
    hide-footer
    centered
  >
    <template #default="{ hide }">
      <b-button variant="link" class="close-btn" @click="hide()">
        <SvgIcon name="close" />
      </b-button>

      <div class="result-wrap">
        <h3 class="text-center text-muted mb-5">Import results</h3>

        <div class="csv-import-result">
          <div class="import-results">
            <div class="import-result-col">
              <div class="import-result-number green">{{ rows || 0 }}</div>
              <div class="import-result-label text-center">Imported</div>
            </div>
            <div class="import-result-col">
              <div class="import-result-number blue">0</div>
              <div class="import-result-label text-center">Updated</div>
            </div>
            <div class="import-result-col">
              <div class="import-result-number gray">0</div>
              <div class="import-result-label text-center">Skipped</div>
            </div>
            <div class="import-result-col">
              <div class="import-result-number red">0</div>
              <div class="import-result-label text-center">Import errors</div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-right">
        <b-button variant="primary" class="px-5" pill @click="hide">
          OK
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('lead', {
      rows: (state) => state.importedRows,
    }),
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-csv-import-result-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 70px 50px 40px;
  }

  .close-btn {
    font-size: 32px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .result-wrap {
    .csv-import-result {
      .import-results {
        width: 100%;
        padding: 50px 0 35px;
        line-height: 36px;
        font-weight: 400;
        font-size: 18px;
        color: #0f1012;
        min-height: 350px;
        display: flex;
        justify-content: center;

        .import-result-col {
          padding: 0 45px;

          &:first-child {
            padding-left: 0;
          }
        }

        .import-result-number {
          margin-bottom: 25px !important;
          font-size: 60px;
          text-align: center;

          &.green {
            color: $primary;
          }
          &.blue {
            color: $blue;
          }

          &.gray {
            color: #bdc3cb;
          }

          &.red {
            color: $danger;
          }
        }

        .import-result-label {
          font-size: 17px;
        }
      }
    }
  }
}
</style>
