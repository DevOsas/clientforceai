<template>
  <div class="reports-table">
    <div class="table-head">
      <div class="table-row">
        <div
          v-for="head in Object.keys(members[0])"
          :key="head"
          class="table-col"
        >
          {{ formatLabel(head) }}
        </div>
      </div>
    </div>
    <div class="table-body">
      <div
        v-for="(member, rowIndex) in members"
        :key="rowIndex"
        class="table-row"
      >
        <div
          v-for="(key, colIndex) in Object.keys(member)"
          :key="key + colIndex + rowIndex"
          class="table-col"
        >
          {{ member[key] }}
        </div>
      </div>
    </div>

    <div class="text-right mt-4">
      <b-button variant="primary" class="px-3">
        Next
        <SvgIcon name="arrow-right" class="ml-1" />
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      members: [
        {
          teamMember: 'Salem Jimfender',
          deliveries: '100%',
          opens: '100%',
          replies: '10%',
          optOut: '10%',
          notInterested: '10%',
          interested: '10%',
        },
        {
          name: 'Gold Mabel',
          deliveries: '100%',
          opens: '100%',
          replies: '10%',
          optOut: '10%',
          notInterested: '10%',
          interested: '10%',
        },
      ],
    }
  },

  methods: {
    formatLabel(label) {
      return label.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ').toLowerCase()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.reports-table {
  margin-top: 30px;

  .table-row {
    display: flex;

    .table-col {
      text-align: center;
      flex-grow: 1;
      padding: 10px 0;
      width: 200px;

      &:nth-child(1) {
        width: 220px;
        text-align: left;
        flex-shrink: 0;
        padding-left: 70px;
      }

      &:nth-child(2) {
        flex-shrink: 0;
      }

      &:nth-child(3) {
        flex-shrink: 0;
      }
    }
  }

  .table-head {
    .table-row {
      .table-col {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        text-transform: uppercase;
      }
    }
  }

  .table-body {
    .table-row {
      background: #e0ffdc;
      border-radius: 10px;
      margin-top: 10px;

      .table-col {
        padding-top: 20px;
        padding-bottom: 20px;
        font-size: 17px;
        line-height: 21px;
      }
    }
  }
}
</style>
