<template>
  <div class="templates-list">
    <div class="templates-thead">
      <div class="templates-list-row">
        <div class="templates-list-col"></div>
        <div class="templates-list-col">Name</div>
        <div class="templates-list-col">Subject</div>
        <div class="templates-list-col">Body</div>
      </div>
    </div>

    <div class="templates-tbody">
      <div
        v-for="template in templates"
        :key="template.id"
        class="templates-list-row"
        :class="{ selected: selected.includes(template.id) }"
        @click="$emit('edit', template)"
      >
        <div class="templates-list-col" @click.stop>
          <b-form-checkbox
            :checked="selected.includes(template.id)"
            size="lg"
            @change.native="handleCheck(template, $event)"
          />
        </div>
        <div class="templates-list-col">{{ template.title }}</div>
        <div class="templates-list-col">{{ template.subject }}</div>
        <div class="templates-list-col">
          {{ stripTags(template.body) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { stripTags } from '~/utils/helpers'

export default {
  props: {
    templates: {
      type: Array,
      default: () => [],
    },

    selected: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    stripTags,

    handleCheck(template, e) {
      if (e.target.checked) {
        this.$emit('select', [...this.selected, template.id])
      } else {
        const index = this.selected.findIndex((id) => id === template.id)
        if (index !== -1) {
          this.$emit('select', [
            ...this.selected.slice(0, index),
            ...this.selected.slice(index + 1),
          ])
        }
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.templates-list {
  margin-top: 30px;

  .templates-list-row {
    display: flex;
    align-items: center;

    .templates-list-col {
      font-size: 17px;
      line-height: 21px;

      &:nth-child(1) {
        width: 60px;

        .custom-control-input {
          &:not(:checked) {
            ~ .custom-control-label {
              &::before {
                background-color: transparent;
              }
            }
          }
        }
      }

      &:nth-child(2) {
        width: 150px;
        font-weight: bold;
      }

      &:nth-child(3) {
        width: 210px;
      }

      &:nth-child(4) {
        width: 490px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .templates-thead {
    .templates-list-row {
      margin-bottom: 20px;
      padding: 0 25px;

      .templates-list-col {
        font-weight: normal;
        text-transform: uppercase;
        font-size: 1rem;
      }
    }
  }

  .templates-tbody {
    .templates-list-row {
      background-color: #f4f4f4;
      border-radius: 10px;
      margin-bottom: 15px;
      padding: 12px 25px;
      cursor: pointer;
      transition: all 0.3s ease-in;

      &.selected {
        background-color: #84fd74;
      }
    }
  }
}
</style>
