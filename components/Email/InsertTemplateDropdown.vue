<template>
  <b-dropdown
    size="lg"
    :variant="variant"
    class="insert-template-dropdown"
    :toggle-class="toggleClass"
    no-caret
  >
    <template #button-content>
      Apply Template
      <SvgIcon name="chevron-down-3" />
    </template>
    <template #default="{ hide }">
      <div class="insert-template-dropdown-content">
        <div class="dropdown-input-wrap">
          <SvgIcon name="search" />
          <b-form-input
            size="sm"
            placeholder="Search templates"
            autocomplete="off"
          />
        </div>

        <ul
          v-if="!activeCategory && !$apollo.queries.allCategories.loading"
          class="template-folders-list"
        >
          <li
            v-for="category in allCategories"
            :key="category.id"
            @click.stop="setCategory(category.slug)"
          >
            <SvgIcon name="folder" class="folder-icon" />
            {{ category.title }}

            <SvgIcon name="chevron-right" class="chevron-icon" />
          </li>
        </ul>

        <div v-else class="templates">
          <b-button variant="link" @click.stop="setCategory(null)">
            <SvgIcon name="left-arrow" class="mr-1" />
            Back
          </b-button>

          <ul
            v-if="templatesLoading || (!templatesLoading && templates.length)"
            class="templates-list"
          >
            <template v-if="templatesLoading">
              <li v-for="num in 10" :key="num">
                <b-skeleton width="100%" />
              </li>
            </template>
            <template v-else>
              <li
                v-for="template in templates"
                :key="template.id"
                @click="insertTemplate(template, hide)"
              >
                <SvgIcon name="paper" class="template-icon" />
                {{ template.title }}
              </li>
            </template>
          </ul>
          <div v-else class="text-center p-4 shadow-sm rounded">
            No Templates in this category.
          </div>
        </div>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
import { ALL_CATEGORIES_QUERY } from '~/graphql/category/queries'
import { EMAIL_TEMPLATES_QUERY } from '~/graphql/email-template/queries'

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
      activeCategory: null,

      templates: [],
      templatesLoading: false,
    }
  },

  apollo: {
    allCategories: {
      query: ALL_CATEGORIES_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  methods: {
    async setCategory(activeCategory) {
      this.activeCategory = activeCategory

      if (!this.activeCategory) {
        return
      }

      this.templatesLoading = true

      const { data } = await this.$apollo.query({
        query: EMAIL_TEMPLATES_QUERY,
        variables: {
          category: this.activeCategory,
        },
      })

      this.templates = data.emailTemplates
      this.templatesLoading = false
    },

    insertTemplate(template, hide) {
      this.$emit('insert', template)

      this.activeCategory = null
      hide()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.insert-template-dropdown {
  .dropdown-menu {
    min-width: 20rem;
    margin-top: -50px;
    margin-left: -10px;

    .insert-template-dropdown-content {
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

      .template-folders-list {
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

          .chevron-icon {
            margin-left: auto;
            font-size: 0.7rem;
          }

          &:hover {
            color: $primary;
          }
        }
      }

      .templates {
        .btn-link {
          padding: 0;
          box-shadow: none;
          margin: 20px 0;
          color: $gray-600;
          text-decoration: none;
        }

        .templates-list {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            display: flex;
            padding: 8px 0;
            align-items: center;
            cursor: pointer;

            .template-icon {
              font-size: 1.5rem;
              margin-right: 5px;
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
