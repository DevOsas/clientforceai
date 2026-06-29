<template>
  <b-dropdown
    size="lg"
    :variant="variant"
    class="insert-proposal-dropdown"
    :toggle-class="toggleClass"
    no-caret
  >
    <template #button-content>
      Insert Report
      <SvgIcon name="chevron-down-3" />
    </template>
    <template #default="{ hide }">
      <div class="insert-proposal-dropdown-content">
        <div class="dropdown-input-wrap">
          <SvgIcon name="search" />
          <b-form-input
            size="sm"
            placeholder="Search reports"
            autocomplete="off"
          />
        </div>

        <ul class="proposal-folders-list">
          <li
            v-for="report in reports"
            :key="report.id"
            @click.stop="selectReport(report, hide)"
          >
            <SvgIcon name="folder" class="folder-icon" />
            {{ report.title }}
          </li>
        </ul>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'primary',
    },

    toggleClass: {
      type: [String, Array, Object],
      default: null,
    },
  },

  data() {
    return {
      reports: [
        {
          id: 1,
          url: '#',
          title: 'GMB Report',
        },
        {
          id: 2,
          url: '#',
          title: 'SEO Report',
        },
      ],
    }
  },

  methods: {
    selectReport(report, hide) {
      this.$emit('insert', report)

      hide()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.insert-proposal-dropdown {
  .dropdown-menu {
    min-width: 20rem;
    margin-top: -50px;
    margin-left: -10px;

    .insert-proposal-dropdown-content {
      padding: 10px 20px;

      .dropdown-input-wrap {
        margin-bottom: 10px;
        position: relative;

        .icon {
          position: absolute;
          left: 0;
          top: 2px;
        }

        .form-control {
          border: 0;
          border-bottom: 1px solid $gray-500;
          border-radius: 0;
          padding-left: 20px;
          box-shadow: none;

          &::placeholder {
            color: $gray-500;
          }

          &:focus {
            border-color: $primary;
          }
        }
      }

      .proposal-folders-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          padding: 7px 0;
          align-items: center;
          cursor: pointer;

          .folder-icon {
            font-size: 1rem;
            margin-right: 7px;
          }

          &:hover {
            color: $primary;
          }
        }
      }
    }
  }
}
</style>
