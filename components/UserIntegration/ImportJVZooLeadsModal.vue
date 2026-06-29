<template>
  <b-modal
    id="ImportJVZooLeadsModal"
    size="md"
    modal-class="import-jvzoo-leads-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHide"
  >
    <template #default="{ hide }">
      <div class="import-jvzoo-leads-modal-header">
        <h3 class="import-jvzoo-leads-modal-title">
          Import Your JVZoo Customers
        </h3>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>
      <p>Import your JVZoo customers as leads to Clientforce.</p>
      <b-form-group label="Select Product">
        <b-form-select
          v-model="selectedProduct"
          :options="products"
        ></b-form-select>
      </b-form-group>

      <b-table striped hover :items="computedCustomers" :fields="fields">
        <!-- A custom formatted header cell for field 'checkbox' -->
        <template #head(checkbox)>
          <b-form-checkbox id="all" name="all" @change="handleToggleCheckAll" />
        </template>

        <!-- A virtual column -->
        <template #cell(checkbox)="data">
          <b-form-checkbox
            :id="`checkbox-${data.item.id}`"
            v-model="selectedCustomers"
            name="customers[]"
            :value="data.item.id"
            :checked="selectedCustomers"
          />
        </template>
      </b-table>

      <label for="">Import to List</label>
      <b-form-select v-model="selectedList" :options="lists"></b-form-select>

      <div class="text-right mt-4">
        <b-button
          variant="link"
          class="text-muted mr-1 px-4"
          pill
          @click="hide"
        >
          Cancel
        </b-button>

        <b-button
          type="submit"
          variant="primary"
          class="px-4"
          pill
          @click="handleImport"
        >
          <b-spinner v-if="isBusy" class="mr-1" small></b-spinner>
          Import Leads
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { IMPORT_JVZOO_CUSTOMERS_MUTATION } from '~/graphql/user-integration/mutations'
import { JVZOO_CUSTOMERS_QUERY } from '~/graphql/user-integration/queries'
import { ALL_LEAD_LISTS_QUERY } from '~/graphql/lead/queries'

export default {
  props: {},

  data() {
    return {
      jVZooCustomers: [],
      fields: [
        // A virtual column that doesn't exist in items
        'checkbox',
        {
          key: 'lastName',
        },
        {
          key: 'firstName',
        },
        {
          key: 'customerEmail',
          label: 'Email',
        },
      ],
      products: [],
      selectedProduct: null,
      isBusy: false,
      lists: [],
      selectedList: null,

      selectedCustomers: [],
    }
  },

  apollo: {
    jVZooCustomers: {
      query: JVZOO_CUSTOMERS_QUERY,
      result({ loading, data }) {
        if (!loading && data && data.jVZooCustomers) {
          this.products = data.jVZooCustomers.reduce(
            (accur, item) => {
              if (!accur.find((a) => a.value === item.productId)) {
                accur.push({
                  value: item.productId,
                  text: item.productName,
                })
              }

              return accur
            },
            [{ value: null, text: 'All Products' }]
          )
        }
      },
      error(error) {
        console.error('Error loading JVZoo customers:', error)
        // Prevent the page from crashing on error
        return false
      },
    },

    lists: {
      query: ALL_LEAD_LISTS_QUERY,
      result({ loading, data }) {
        if (!loading) {
          this.lists = [
            { value: null, text: 'None' },
            ...data.lists.map((l) => ({ value: l.id, text: l.title })),
          ]
        }
      },
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    computedCustomers() {
      if (!this.selectedProduct) {
        return this.jVZooCustomers
      }

      return this.jVZooCustomers.filter(
        (cust) => cust.productId === this.selectedProduct
      )
    },
  },

  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },

    handleOnHide() {
      this.$emit('closed')
    },

    handleToggleCheckAll(checked) {
      if (checked) {
        this.selectedCustomers = this.computedCustomers.map((c) => c.id)

        return
      }

      this.selectedCustomers = []
    },

    async handleImport() {
      this.isBusy = true
      await this.$apollo
        .mutate({
          mutation: IMPORT_JVZOO_CUSTOMERS_MUTATION,
          variables: {
            customers: this.selectedCustomers,
            list: this.selectedList,
          },
        })
        .then(({ data }) => {
          this.isBusy = false
          this.$emit('imported', data.importJVZooCustomers)

          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success!',
            text: 'JVZoo customers imported successfully',
          })

          this.$bvModal.hide('ImportJVZooLeadsModal')
        })
        .catch(({ graphQLErrors: errors, ...others }) => {
          this.isBusy = false

          console.log(others)

          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to connect',
            text: 'An unexptected error occurred.',
          })
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.import-jvzoo-leads-modal {
  .modal-dialog {
    max-width: 650px;
  }
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 40px 40px 40px;
  }

  .import-jvzoo-leads-modal-header {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .close-btn {
      font-size: 32px;
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .import-jvzoo-leads-modal-title {
      background-color: $primary;
      padding: 5px 40px;
      color: $white;
      border-radius: 5px;
      margin-bottom: 25px;
      font-size: 20px;
    }
  }

  .campaign-name-form {
    .form-control {
      border-color: $gray-200;
      box-shadow: 0 2px 5px 0 $gray-200;
      border-radius: 0.3rem;

      &:focus {
        border-color: $primary;
      }

      &.is-invalid {
        border-color: lighten($danger, 40);
      }
      &::placeholder {
        color: $gray-400;
      }
    }
  }
}
</style>
