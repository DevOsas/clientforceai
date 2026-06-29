<template>
  <b-modal
    id="CustomFieldEditorModal"
    size="sm"
    modal-class="custom-field-editor-modal"
    hide-header
    hide-footer
    centered
    @hide="$emit('close')"
  >
    <div class="p-3">
      <h3 class="modal-h">New custom field</h3>
      <p class="modal-d" v-if="limitBalance.customFields == 'unlimited'">
        You have unlimited custom fields.
      </p>
      <p v-else>
        You can add only {{ limitBalance.customFields }} more custom field(s).
      </p>
      <div class="mt-2">
        <b-form
          method="POST"
          @submit.prevent="handleSaveField"
          @keydown="form.onKeydown($event)"
        >
          <b-form-group
            label="Field label"
            label-for="label"
            :state="getInputState('label')"
          >
            <b-form-input
              id="label"
              v-model="form.label"
              name="label"
              :state="getInputState('label')"
              required
              trim
            ></b-form-input>

            <b-form-invalid-feedback
              :state="getInputState('label')"
              class="mt-2"
            >
              {{ form.errors.get('label') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            label="Field type"
            label-for="type"
            :state="getInputState('type')"
          >
            <b-form-select v-model="form.type" required>
              <b-form-select-option value="" disabled>
                Select type
              </b-form-select-option>
              <b-form-select-option value="text">Text</b-form-select-option>
              <b-form-select-option value="number">Number</b-form-select-option>
            </b-form-select>

            <b-form-invalid-feedback
              :state="getInputState('type')"
              class="mt-2"
            >
              {{ form.errors.get('type') }}
            </b-form-invalid-feedback>
          </b-form-group>

          <div class="text-right mt-4">
            <b-button
              type="reset"
              variant="link"
              class="text-muted mr-10"
              pill
              @click="$emit('close')"
            >
              Cancel
            </b-button>
            <b-button type="submit" variant="primary" class="btn px-3" pill>
              <b-spinner v-if="busy" small class="mr-1" />
              Save
            </b-button>
          </div>
        </b-form>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { SAVE_CUSTOM_FIELD_MUTATION } from '~/graphql/lead/mutations'
import { ALL_CUSTOM_FIELDS_QUERY } from '~/graphql/lead/queries'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  name: 'CustomFieldEditor',

  props: {},

  data() {
    return {
      form: new this.$form({
        id: '',
        label: '',
        type: 'text',
      }),
      busy: false,
      limitBalance: {},
    }
  },

  apollo: {
    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    async handleSaveField() {
      try {
        this.busy = true

        const { data } = await this.$apollo.mutate({
          mutation: SAVE_CUSTOM_FIELD_MUTATION,
          variables: {
            id: this.form.id ? this.form.id : null,
            label: this.form.label,
            type: this.form.type,
          },
          update: (store, { data: { field } }) => {
            this.$apollo.queries.limitBalance.refresh()
            const data = store.readQuery({ query: ALL_CUSTOM_FIELDS_QUERY })

            data.customFields = [...data.customFields, field]

            store.writeQuery({
              query: ALL_CUSTOM_FIELDS_QUERY,
              data,
            })
          },
        })

        this.$emit('saved', data.field)
        this.form.reset()

        this.busy = false
      } catch ({ graphQLErrors: errors }) {
        this.busy = false

        for (let i = 0; i < errors.length; i++) {
          if (errors[i].message === 'validation') {
            this.form.errors.set(errors[i].extensions.validation)
          } else if (errors[i].message === 'DuplicateCustomField') {
            this.form.errors.set(
              'label',
              'A custom field with that label already exists'
            )
          }
        }
      }
    },
  },
}
</script>

<style lang="scss">
.custom-field-editor-modal {
  .modal-dialog {
    max-width: 350px;
  }

  .modal-h {
    font-size: 1.25rem;
  }

  .modal-d {
    font-size: 0.85rem;
  }
}
</style>
