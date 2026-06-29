<template>
  <div class="user-settings-page">
    <b-container>
      <div class="row py-3">
        <div class="col col-md-3 col-sm-12">
          <side-bar />
        </div>
        <div class="col col-md-9 col-sm-12">
          <div class="p-2">
            <SettingsCollapse
              icon="edit-alt"
              label="Custom fields"
              description="Manage your custom fields, add text or number fields, change names or look at the field ID's"
              expanded
            >
              <template>
                <b-row class="justify-content-between">
                  <b-col cols="4">
                    <b-form-group>
                      <div class="icon-input">
                        <SvgIcon name="search-line" />
                        <b-form-input
                          id="keywords"
                          size="lg"
                          placeholder="Search"
                        />
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col
                    cols="4"
                    class="d-flex justify-content-end align-items-center"
                  >
                    <b-btn
                      v-if="limitBalance && limitBalance.customFields > 0"
                      variant="primary"
                      @click="openCustomFieldEditor"
                    >
                      <SvgIcon name="plus-square" /> Add custom field</b-btn
                    >
                    <b-btn v-else variant="primary" to="billing">
                      <SvgIcon name="arrow-up" /> Upgrade</b-btn
                    >
                  </b-col>
                </b-row>

                <div
                  v-if="isFetchingFields"
                  class="d-flex justify-content-center"
                >
                  <b-skeleton-table class="my-2" />
                </div>
                <b-table
                  v-else-if="customFields && customFields.length"
                  :items="customFields"
                  :fields="headers"
                >
                </b-table>
                <div
                  style="
                    text-align: center !important;
                    padding-top: 16px !important;
                  "
                  v-else
                >
                  <h4 class="mb-5">You have no custom field yet</h4>
                  <MailBroIl />
                </div>
              </template>
            </SettingsCollapse>
          </div>
        </div>
      </div>
    </b-container>
    <CustomFieldEditorModal @close="closeCustomFieldEditor" @saved="onSave" />
  </div>
</template>

<script>
import SideBar from '../../components/Setting/SideBar.vue'
import SettingsCollapse from '~/components/General/SettingsCollapse.vue'
import MailBroIl from '~/assets/illustrations/mail-bro.svg?inline'
import CustomFieldEditorModal from '~/components/Lead/CustomFieldEditorModal.vue'
import { ALL_CUSTOM_FIELDS_QUERY } from '~/graphql/lead/queries'
import { GET_LIMIT_BALANCE_QUERY } from '~/graphql/subscription/queries'

export default {
  middleware: 'auth',

  name: 'SettingsCustomFields',

  components: { SideBar, SettingsCollapse, MailBroIl, CustomFieldEditorModal },

  data() {
    return {
      headers: [
        {
          label: 'Field label',
          key: 'title',
          sortable: false,
        },
        {
          label: 'Type',
          key: 'type',
        },
        {
          label: 'Field ID',
          key: 'slug',
          sortable: false,
        },
      ],
      customFields: [],
      isFetchingFields: false,
    }
  },
  apollo: {
    customFields: {
      query: ALL_CUSTOM_FIELDS_QUERY,
      result({ loading }) {
        this.isFetchingFields = loading
      },
      // variables() {
      //   return {
      //     page: this.transactionPage,
      //     limit: 10,
      //     action: this.transactionAction,
      //   }
      // },

      error() {
        return false
      },
    },
    limitBalance: {
      query: GET_LIMIT_BALANCE_QUERY,
      error() {
        return false
      },
    },
  },

  methods: {
    openCustomFieldEditor() {
      this.$bvModal.show('CustomFieldEditorModal')
    },
    closeCustomFieldEditor() {
      this.$bvModal.hide('CustomFieldEditorModal')
    },
    onSave() {
      this.$bvModal.hide('CustomFieldEditorModal')
      
      // Refetch custom fields to show the newly created field
      this.$apollo.queries.customFields.refetch()
      
      this.$notify({
        group: 'main',
        type: 'native',
        title: 'Operation successful',
        text: 'Custom field added successfully',
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.user-settings-page {
  margin-top: 30px;
}
.icon-input {
  position: relative;

  .icon {
    font-size: 28px;
    position: absolute;
    left: 15px;
    top: 4px;
    color: #373b3f;
  }

  .form-control {
    border: 1px solid #ededed;
    border-radius: 10px;
    padding-left: 50px;
    color: $gray-600;
    box-shadow: none;
    border-color: #c2fdb9;

    &::placeholder {
      font-size: 17px;
      line-height: 21px;
      color: $gray-500;
    }
  }
}
table,
th,
td {
  border: none !important;
  border: 0;
  border-collapse: collapse !important;
}

thead div {
  font-weight: 400 !important;
}
</style>
