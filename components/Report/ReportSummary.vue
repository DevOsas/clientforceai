<template>
  <div class="reports-summary">
    <div class="summary-side">
      <div class="summary-total-item">
        <div class="total-icon-wrap">
          <SvgIcon name="eye" />
        </div>
        <div class="total-detail">
          <div class="total-value">{{ report.leadsCount }}</div>
          <div class="total-label">Total people</div>
        </div>
      </div>
      <div class="summary-total-item">
        <div class="total-icon-wrap">
          <SvgIcon name="connected" />
        </div>
        <div class="total-detail">
          <div class="total-value">{{ report.deliveredCount }}</div>
          <div class="total-label">Total Contacted</div>
        </div>
      </div>
    </div>
    <div class="summary-main">
      <div
        v-for="item in summary"
        :key="item.label"
        class="summary-item"
        :class="item.variant"
      >
        <radial-progress
          :diameter="100"
          :stroke-width="6"
          :inner-stroke-width="3"
          :completed-steps="item.completed"
          :total-steps="100"
          inner-stroke-color="#8F8F8F"
          :start-color="item.startColor"
          :stop-color="item.stopColor"
        >
          <div class="progress-percentage">{{ item.completed }}%</div>
          <div class="progress-count">{{ item.count }}</div>
        </radial-progress>
        <div class="summary-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      summary: [
        {
          variant: 'primary',
          completed: this.report.deliveredRate,
          startColor: '#3ABC29',
          stopColor: '#88EE7A',
          count: this.report.deliveredCount,
          label: 'Delivery Rate',
        },
        {
          variant: 'danger',
          completed: this.report.openRate,
          startColor: '#DD1B1B',
          stopColor: '#FFAEAE',
          count: this.report.opensCount,
          label: 'Open Rate',
        },
        {
          variant: 'yello',
          completed: this.report.replyRate,
          startColor: '#F29B17',
          stopColor: '#FFE6C0',
          count: this.report.replyCount,
          label: 'Reply Rate',
        },
        {
          variant: 'blue',
          completed: this.report.interestedRate,
          startColor: '#335BD3',
          stopColor: '#B4C5FA',
          count: this.report.interestedCount,
          label: 'Interested',
        },
        {
          variant: 'green',
          completed: this.report.optedOutRate,
          startColor: '#23C69E',
          stopColor: '#A0EFDC',
          count: this.report.optedOutCount,
          label: 'Opt Outs Rate',
        },
        {
          variant: 'purple',
          completed: this.report.notReachedRate,
          startColor: '#8B1DBE',
          stopColor: '#E2A4FF',
          count: this.report.notReachedCount,
          label: 'Not Reached',
        },
        {
          variant: 'purple',
          completed: this.report.notReachedRate,
          startColor: '#8B1DBE',
          stopColor: '#E2A4FF',
          count: this.report.campaign?.proposalsOpened,
          label: 'Proposal opens',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.reports-summary {
  margin-top: 40px;
  display: flex;

  .summary-side {
    width: 197px;
    flex-shrink: 0;
    margin-right: 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .summary-total-item {
      background: $gray-200;
      border-radius: 10px;
      width: 100%;
      display: flex;
      padding: 12px 15px;

      .total-icon-wrap {
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
          font-size: 37px;
        }
      }
      .total-detail {
        .total-value {
          font-weight: bold;
          font-size: 36px;
          line-height: 44px;
        }
        .total-label {
          font-size: 15px;
          line-height: 19px;
          color: #767676;
        }
      }

      &:nth-child(1) {
        background: #ffe6c0;

        .total-icon-wrap {
          .icon {
            color: #f29b17;
          }
        }

        .total-detail {
          .total-value {
            color: #f29b17;
          }
        }
      }
      &:nth-child(2) {
        background: #c9ffc1;

        .total-icon-wrap {
          .icon {
            color: $primary;
          }
        }

        .total-detail {
          .total-value {
            color: $primary;
          }
        }
      }
    }
  }

  .summary-main {
    flex-grow: 1;
    background: $white;
    box-shadow: 0 10px 100px rgba(0, 0, 0, 0.05);
    border-radius: 20px;
    padding: 30px 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .progress-percentage {
        font-weight: bold;
        font-size: 30px;
        line-height: 25px;
        margin-top: 10px;
      }
      .progress-count {
        font-size: 18px;
        margin-top: 2px;
        color: #8f8f8f;
      }
      .summary-label {
        padding: 3px 24px;
        background: #d8ffd2;
        border-radius: 10px;
        margin-top: 10px;
        font-size: 12px;
        line-height: 16px;
        color: #3abc29;
        letter-spacing: 0.222447px;
      }

      &.primary {
        .summary-label {
          background: #d8ffd2;
          color: #3abc29;
        }
      }
      &.danger {
        .summary-label {
          background: #ffc9c9;
          color: #dd1b1b;
        }
      }
      &.yello {
        .summary-label {
          background: #ffe6c0;
          color: #ec9512;
        }
      }
      &.blue {
        .summary-label {
          background: #c4d2ff;
          color: #1042db;
        }
      }
      &.green {
        .summary-label {
          background: #b2f0e1;
          color: #149e7f;
        }
      }
      &.purple {
        .summary-label {
          background: #e8c8f8;
          color: #9123c8;
        }
      }
    }
  }
}
</style>
