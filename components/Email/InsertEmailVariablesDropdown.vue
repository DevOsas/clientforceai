<template>
  <b-dropdown
    size="lg"
    :variant="variant"
    class="insert-variable-dropdown"
    :toggle-class="toggleClass"
    no-caret
  >
    <template #button-content>
      Insert Variable
      <SvgIcon name="chevron-down-3" />
    </template>
    <template #default="{ hide }">
      <div class="insert-variable-dropdown-content">
        <div class="dropdown-input-wrap">
          <SvgIcon name="search" />
          <b-form-input
            size="sm"
            placeholder="Search variables"
            autocomplete="off"
          />
        </div>

        <div class="variables">
          <ul class="variables-list">
            <li
              v-for="variable in variables"
              :key="variable.token"
              @click="insertVariable(variable, hide)"
            >
              <SvgIcon name="exchange" class="variable-icon" />
              {{ variable.title }}
            </li>
          </ul>
        </div>
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
      variables: [
        {
          title: 'First Name',
          name: 'FirstName',
          token: '{{FirstName}}',
        },
        {
          title: 'Last Name',
          name: 'LastName',
          token: '{{LastName}}',
        },
        {
          title: 'Title',
          name: 'Title',
          token: '{{Title}}',
        },
        {
          title: 'Company',
          name: 'Company',
          token: '{{Company}}',
        },
        {
          title: 'Email',
          name: 'Email',
          token: '{{Email}}',
        },
        {
          title: 'City',
          name: 'City',
          token: '{{City}}',
        },
        {
          title: 'State',
          name: 'State',
          token: '{{State}}',
        },
        {
          title: 'Country',
          name: 'Country',
          token: '{{Country}}',
        },
      ],
    }
  },

  methods: {
    insertVariable(variable, hide) {
      this.$emit('insert', variable)
      hide()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.insert-variable-dropdown {
  .dropdown-menu {
    min-width: 20rem;
    margin-top: -50px;
    margin-left: -10px;

    .insert-variable-dropdown-content {
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

      .variables {
        .variables-list {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            display: flex;
            padding: 8px 0;
            align-items: center;
            cursor: pointer;

            .variable-icon {
              font-size: 1rem;
              margin-right: 7px;
              line-height: 0;
            }

            &:hover {
              color: $primary;
            }
          }
        }
      }
    }
  }
}
</style>
