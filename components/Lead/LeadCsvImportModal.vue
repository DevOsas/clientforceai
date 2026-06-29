<template>
  <b-modal
    id="LeadCsvImportModal"
    size="lg"
    modal-class="lead-csv-import-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHidden"
  >
    <template #default="{ hide }">
      <b-button variant="link" class="close-btn" @click="hide()">
        <SvgIcon name="close" />
      </b-button>

      <template v-if="currentStep == 1">
        <div v-if="isUploading" class="lead-csv-uploading">
          <h4>Uploading</h4>
          <div class="spinner-wrap">
            <b-spinner variant="primary" />
          </div>
        </div>
        <template v-else>
          <div class="lead-csv-import-modal-header">
            <h3 class="lead-csv-import-modal-title">Import CSV File</h3>
          </div>

          <div class="csv-zone">
            <div class="csv-zone-icon-wrap">
              <SvgIcon name="line-wings-left" class="wings" />
              <SvgIcon name="csv" class="main-icon" />
              <SvgIcon name="line-wings-right" class="wings" />
            </div>

            <div v-if="importedDetails" class="lead-csv-file-info">
              <div class="mt-5">
                <div><strong>File:</strong> {{ importedDetails.fileName }}</div>
                <div><strong>Rows:</strong> {{ importedDetails.rows }}</div>
              </div>
            </div>

            <b-button
              variant="csv-custom"
              size="lg"
              @click="$refs.csvFileInput.click()"
            >
              Import .CSV File
            </b-button>
            <input
              ref="csvFileInput"
              type="file"
              class="d-none"
              @change="handleCsvInputChange"
            />
          </div>
        </template>
      </template>
      <template v-else-if="currentStep == 2">
        <div class="map-attributes-step">
          <h3 class="text-center text-muted mb-5">Map attributes</h3>

          <div class="csv-mapping-row">
            <div class="map-from-col">CSV FILE FIELDS</div>
            <div class="map-arrow-col"></div>
            <div class="map-to-col">CLIENTFORCE FIELDS</div>
            <div class="map-action-col"></div>
          </div>

          <div
            v-for="(header, i) in headers"
            :key="header.id"
            class="csv-mapping-row"
          >
            <div class="map-from-col">
              <div class="map-from-item">
                <div class="map-from-label">{{ header.title }}</div>
                <div class="map-from-sample">{{ header.sample }}</div>
              </div>
            </div>
            <div
              class="map-arrow-col"
              :class="{ mapped: header.tmpMapToField }"
            >
              <SvgIcon name="arrow-right" />
            </div>
            <div class="map-to-col">
              <CustomFieldDropdown
                :selected="header.tmpMapToField"
                :items="leadFields"
                :custom-fields="customFields"
                @add-custom-field="openCustomFieldEditor(header, i)"
                @change="(item) => addMapping(header, item, i)"
                @custom-field-change="
                  (item) => addCustomMapping(header, item, i)
                "
              />
            </div>
            <div class="map-action-col">
              <b-button
                v-if="isFieldMandatory(header.title)"
                variant="remove-mapping"
                size="sm"
                :class="{ disabled: !header.tmpMapToField }"
                @click="deleteMapping(header, i)"
              >
                <SvgIcon name="delete" />
              </b-button>
            </div>
          </div>

          <div class="mapped-fields-counter">
            {{ mappedCount }} / {{ headers.length }} properties mapped
          </div>
        </div>
      </template>
      <template v-else-if="currentStep == 3">
        <div class="review-wrap">
          <h4 class="text-center text-muted mb-4">Review & import</h4>

          <div class="review-groups">
            <div class="group-spits">
              <div v-for="(group, i) in groups" :key="i + 1" class="group-item">
                <div class="count-num">{{ group.count }}</div>
                <div class="count-label">
                  Contact<span v-if="group.count > 1">s</span>
                </div>

                <div>
                  <b-dropdown
                    variant="csv-list-dropdown"
                    class="csv-list-dropdown"
                  >
                    <template #button-content>
                      {{ getListTitle(group.listId) }}
                    </template>
                    <custom-scroll>
                      <div class="csv-list-dropdown-inner">
                        <b-dropdown-item @click="openNewListModal(i)">
                          <SvgIcon name="add" class="mr-1" />
                          New list
                        </b-dropdown-item>
                        <b-dropdown-item @click="setGroupList(i, 0)">
                          Not in a list
                        </b-dropdown-item>
                        <b-dropdown-item
                          v-for="list in allLists"
                          :key="list.id"
                          @click="setGroupList(i, list.id)"
                        >
                          {{ list.title }}
                        </b-dropdown-item>
                      </div>
                    </custom-scroll>
                  </b-dropdown>
                </div>

                <b-button
                  v-if="groups.length > 1"
                  v-b-tooltip.hover.bottom
                  title="Fold contacts"
                  size="sm"
                  variant="remove-csv-group"
                  @click="removeFromGroupList(i)"
                >
                  <SvgIcon name="minus-circle" class="minus-icon" />
                </b-button>
              </div>
              <b-button
                v-if="groups.length < 4"
                v-b-tooltip.hover.right
                title="Split contacts"
                variant="add-csv-group"
                @click="addToGroupList"
              >
                <SvgIcon name="add" class="plus-icon" />
              </b-button>
            </div>
            <div class="d-flex justify-content-between mt-4">
              <b-form-checkbox switch>
                Skip updating existing contacts
              </b-form-checkbox>

              <div class="layout-align-start-center layout-row">
                <b-form-checkbox switch>
                  Detect contact time zone automatically
                  <SvgIcon
                    v-b-tooltip.hover
                    name="info-circle"
                    title="Enabling this option might increase the import time by up to 30 minutes."
                    class="info-icon"
                  />
                </b-form-checkbox>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="currentStep == 4">
        <div class="import-started-wrap">
          <h4 class="text-center text-muted">Import started</h4>

          <div class="started-wrap">
            <div class="import-countdown">{{ importCountdown }}</div>
            <div class="countdown-label">
              contact<span v-if="importCountdown > 1">s</span> left...
            </div>
            <div class="started-description">
              Import has started - you can close the dialog and continue working
              with Clientforce. When the import finishes, you will receive a
              notification in the notification area. The contacts that you are
              importing now, will be available after the import finishes.
            </div>
          </div>
        </div>
      </template>

      <div class="d-flex justify-content-between mt-5">
        <WizardSteps :steps="steps" :current="currentStep" />

        <div>
          <b-button
            v-if="currentStep === 1"
            variant="link"
            class="px-4 mr-3 text-muted"
            pill
            @click="hide"
          >
            Cancel
          </b-button>
          <b-button
            v-if="currentStep > 1 && currentStep < 4"
            variant="link"
            class="px-4 mr-3 text-muted"
            pill
            @click="stepBack"
          >
            Back
          </b-button>

          <b-button
            v-if="currentStep > 1 && currentStep < 3"
            variant="primary"
            class="px-4"
            pill
            @click="stepForward"
          >
            Continue
          </b-button>

          <b-button
            v-if="currentStep === 3"
            variant="primary"
            class="px-4"
            pill
            @click="beginImport"
          >
            Import
          </b-button>

          <b-button
            v-if="currentStep == 4"
            variant="primary"
            class="px-5"
            pill
            @click="hide"
          >
            OK
          </b-button>
        </div>
      </div>

      <CustomFieldEditorModal
        @close="closeCustomFieldEditor"
        @saved="handleCustomFieldSaved"
      />
      <LeadListFormModal
        :list-item="listForEdit"
        @saved="handleLeadListSaved"
        @closed="handleLeadListClosed"
      />
    </template>
  </b-modal>
</template>

<script>
import WizardSteps from '~/components/General/WizardSteps'
import CustomFieldDropdown from '~/components/Lead/CustomFieldDropdown'
import CustomFieldEditorModal from '~/components/Lead/CustomFieldEditorModal'
import LeadListFormModal from '~/components/Lead/LeadListFormModal'

import {
  UPLOAD_LEAD_CSV_MUTATION,
  BEGIN_CSV_LEAD_IMPORT_MUTATION,
} from '~/graphql/lead/mutations'

import { ALL_CUSTOM_FIELDS_QUERY, ALL_LEADS_QUERY } from '~/graphql/lead/queries'

export default {
  components: { WizardSteps, CustomFieldDropdown, CustomFieldEditorModal, LeadListFormModal },

  props: {
    campaignId: {
      type: Number,
      default: 0,
    },

    lists: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      steps: [
        {
          number: 1,
          label: 'Select file',
        },
        {
          number: 2,
          label: 'Map attributes',
        },
        {
          number: 3,
          label: 'Review & Import',
        },
      ],
      leadFields: [
        {
          title: 'Email',
          alias: 'email',
        },
        {
          title: 'First Name',
          alias: 'firstName',
        },
        {
          title: 'Last Name',
          alias: 'lastName',
        },
        {
          title: 'City',
          alias: 'city',
        },
        {
          title: 'Domain',
          alias: 'domain',
        },
        {
          title: 'Phone',
          alias: 'phone',
        },
        {
          title: 'Address',
          alias: 'address',
        },
        {
          title: 'Title',
          alias: 'title',
        },
        {
          title: 'Company',
          alias: 'company',
        },
      ],
      currentStep: 1,

      isUploading: false,
      headers: [],
      importedDetails: null,

      mapping: {},
      customFields: [],
      customMappings: [],

      importCountdown: 0,

      groups: [],

      isShowingAddCustomField: false,

      // Lead list creation support
      listForEdit: null,
      createdListGroupIndex: null,
      newLists: [],
    }
  },

  computed: {
    mappedCount() {
      return Object.keys(this.mapping).length + this.customMappings.length
    },

    isEmailMapped() {
      return this.mapping && this.mapping.email
    },

    isNameMapped() {
      return this.mapping && (this.mapping.firstName || this.mapping.fullName)
    },

    isRequiredFieldsChecked() {
      const has = (field) =>
        !!this.headers.find((headerItem) => headerItem.tmpMapToField === field)
      return (
        this.isEmailMapped &&
        this.isNameMapped &&
        (has('First Name') || has('Full Name')) &&
        has('Email')
      )
    },

    // Merge parent-provided lists with newly created ones locally
    allLists() {
      const byId = {}
      ;[...(this.lists || []), ...this.newLists].forEach((l) => {
        if (l && typeof l.id !== 'undefined') byId[l.id] = l
      })
      return Object.values(byId)
    },
  },

  async beforeCreate() {
    const { data } = await this.$apollo.query({
      query: ALL_CUSTOM_FIELDS_QUERY,
    })

    this.customFields = data.customFields
  },

  methods: {
    stepForward() {
      this.currentStep < 4 && ++this.currentStep
    },

    stepBack() {
      --this.currentStep
    },

    isFieldMandatory(field) {
      return !['Email', 'First Name'].includes(field)
    },

    handleCsvInputChange() {
      this.isUploading = true
      const csv = this.$refs.csvFileInput.files[0]

      this.$apollo
        .mutate({
          mutation: UPLOAD_LEAD_CSV_MUTATION,
          variables: {
            csv,
          },
        })
        .then(({ data }) => {
          const response = data.uploadLeadCsv

          this.importedDetails = {
            fileName: response.fileName,
            rows: response.rows,
            serverFileId: response.serverFileId,
          }

          const arranged = this.moveMandatoryToTheTop(
            this.mapping,
            response.headers,
            this.leadFields
          )

          const mapped = arranged.reduce((accumulator, header) => {
            const foundField = this.leadFields.find(
              (fd) => fd.title === header.title
            )
            if (!header.checked && foundField) {
              accumulator.push(this.getMappedHeader(header, foundField))
            } else {
              accumulator.push(header)
            }
            return accumulator
          }, [])

          this.headers = mapped

          this.currentStep = 2

          this.isUploading = false

          this.groups = [
            {
              count: response.rows,
              listId: 0,
            },
          ]
        })
        .catch((err) => {
          this.isUploading = false

          const errors = err.graphQLErrors
          if (errors && errors.length) {
            for (let i = 0; i < errors.length; i++) {
              this.$notify({
                group: 'main',
                type: 'error',
                title: 'Unable to upload',
                text: `${errors[i].message}`,
              })
            }
          } else {
            // console.log(err)
          }
        })
    },

    fetchImportedLeads() {
      this.$apollo
        .query({
          query: ALL_LEADS_QUERY,
          variables: {
            limit: this.importedDetails.rows,
            offset: 0,
          },
          fetchPolicy: 'network-only', // Force fresh data from server
        })
        .then(({ data }) => {
          if (data && data.result && data.result.leads) {
            // Emit the imported leads to parent component
            this.$emit('complete', data.result.leads)
          }
        })
        .catch(() => {
          // Still emit complete even if fetch fails
          this.$emit('complete', [])
        })
    },

    beginImport() {
      this.importCountdown = this.importedDetails.rows
      this.currentStep = 4

      this.$apollo
        .mutate({
          mutation: BEGIN_CSV_LEAD_IMPORT_MUTATION,
          variables: {
            mapping: JSON.stringify(this.mapping),
            customMappings: JSON.stringify(this.customMappings),
            groupIds: this.groups.map((group) => group.listId),
            serverFileId: this.importedDetails.serverFileId,
            campaignId: this.campaignId,
          },
        })
        .then(({ data }) => {
          if (data.beginCsvLeadImport) {
            this.countDownInterval = window.setInterval(() => {
              --this.importCountdown

              if (this.importCountdown === 0) {
                window.clearInterval(this.countDownInterval)
                
                // Fetch the recently imported leads
                this.fetchImportedLeads()

                this.$bvModal.hide('LeadCsvImportModal')

                // TODO: Implement realtime feature and update this
                this.$bvModal.show('LeadCsvImportResultModal')
                this.$store.dispatch(
                  'lead/updateImportedRows',
                  this.importedDetails.rows
                )
              }
            }, 100)
          }
        })
    },

    moveMandatoryToTheTop(mapping, headers, defaultFields) {
      const args = [mapping, headers, defaultFields]

      const emailIndex = this.findMandatoryFields(...args.concat(['email', 0]))
      const updatedHeaders = this.moveToTheTop(headers, emailIndex)

      const firstNameIndex = this.findMandatoryFields(
        ...args.concat(['firstName', 1])
      )
      return this.moveToTheTop(updatedHeaders, firstNameIndex)
    },

    findMandatoryFields(mapping, headers, defaultFields, mandatoryField) {
      let index = 0
      return (
        headers.some((header, currentIndex) => {
          if (this.unify(header.title).includes(mandatoryField)) {
            index = currentIndex
            return true
          }
          return false
        }),
        index
      )
    },

    unify(str) {
      return String(str).replace(/\s+/g, '').toLowerCase()
    },

    moveToTheTop(arr, currentIndex) {
      return currentIndex > 1 ? this.swapPlaces(arr, currentIndex, 0) : arr
    },

    swapPlaces(arr, replaceIndex, startIndex) {
      // First get the item we want to replace
      const item = arr[replaceIndex]

      // Then we remove it from from its previous position in the array
      const newArr = [
        ...arr.slice(0, replaceIndex),
        ...arr.slice(replaceIndex + 1),
      ]

      // Finally we place the item in our desired position
      return [...newArr.slice(0, startIndex), item, ...newArr.slice(startIndex)]
    },

    getMappedHeader(header, field, isCustomField) {
      if (isCustomField) {
        this.customMappings = [
          {
            fieldHeader: field.title,
            csvHeader: header.title,
            customFieldId: field.id,
          },
          ...this.customMappings,
        ]
        return {
          ...header,
          tmpMapToField: field.title,
          visible: true,
          checked: true,
          sampleCustomField: field.id,
        }
      } else {
        this.mapping = {
          ...this.mapping,
          [field.alias]: header.title,
        }
        return {
          ...header,
          tmpMapToField: field.title,
          visible: true,
          checked: true,
        }
      }
    },

    openCustomFieldEditor(header, index) {
      this.addingCustomFieldTo = {
        header,
        index,
      }
      this.$bvModal.show('CustomFieldEditorModal')
    },

    closeCustomFieldEditor() {
      this.addingCustomFieldTo = null

      this.$bvModal.hide('CustomFieldEditorModal')
    },

    handleCustomFieldSaved(field) {
      if (this.addingCustomFieldTo) {
        const { header, index } = this.addingCustomFieldTo
        this.addCustomMapping(header, field, index)
      }
      this.customFields = [...this.customFields, field]

      this.closeCustomFieldEditor()
    },

    addMapping(header, field, index) {
      const alreadyMappedToIndex = this.headers.findIndex(
        (headerItem) => headerItem.tmpMapToField === field.title
      )
      let headers = this.headers

      if (alreadyMappedToIndex !== -1) {
        headers = [
          ...this.headers.slice(0, alreadyMappedToIndex),
          this.getNullHeaderValues(this.headers[alreadyMappedToIndex]),
          ...this.headers.slice(alreadyMappedToIndex + 1),
        ]
      }

      const key = Object.keys(this.mapping).find(
        (key) => this.mapping[key] === header.title
      )
      if (key) {
        const { [key]: value, ...mapping } = this.mapping
        this.mapping = mapping
      }

      this.headers = [
        ...headers.slice(0, index),
        this.getMappedHeader(header, field),
        ...headers.slice(index + 1),
      ]
    },

    addCustomMapping(header, field, index) {
      const alreadyMappedToIndex = this.headers.findIndex(
        (headerItem) => headerItem.tmpMapToField === field.title
      )
      let headers = this.headers

      if (alreadyMappedToIndex !== -1) {
        headers = [
          ...this.headers.slice(0, alreadyMappedToIndex),
          this.getNullHeaderValues(this.headers[alreadyMappedToIndex]),
          ...this.headers.slice(alreadyMappedToIndex + 1),
        ]
      }

      const key = Object.keys(this.mapping).find(
        (key) => this.mapping[key] === header.title
      )
      if (key) {
        // eslint-disable-next-line
        const { [key]: value, ...mapping } = this.mapping
        this.mapping = mapping
      }

      this.headers = [
        ...headers.slice(0, index),
        this.getMappedHeader(header, field, true),
        ...headers.slice(index + 1),
      ]
    },

    isCustomField(field) {
      return this.customFields.some((eachField) => {
        return eachField.id === field.id
      })
    },

    deleteCustomMapping(fieldId) {
      const index = this.customMappings.findIndex((customMap) => {
        return customMap.customFieldId === fieldId
      })
      this.customMappings.splice(index, 1)
    },

    deleteOrdinaryMapping(headerTitle) {
      for (const key in this.mapping) {
        this.mapping[key] === headerTitle && delete this.mapping[key]
      }
    },

    getNullHeaderValues(header) {
      return {
        ...header,
        tmpMapToField: '',
        visible: !1,
        sampleCustomField: '',
      }
    },

    conditionalMappingDelete(header) {
      header.sampleCustomField
        ? this.deleteCustomMapping(header.sampleCustomField)
        : this.deleteOrdinaryMapping(header.title)
    },

    deleteMapping(header, index) {
      if (header.sampleCustomField) {
        const customMapIndex = this.customMappings.findIndex((customMap) => {
          return customMap.customFieldId === header.sampleCustomField
        })

        this.customMappings = [
          ...this.customMappings.slice(0, customMapIndex),
          ...this.customMappings.slice(customMapIndex + 1),
        ]
      } else {
        const key = Object.keys(this.mapping).find(
          (key) => this.mapping[key] === header.title
        )
        if (key) {
          const { [key]: value, ...mapping } = this.mapping
          this.mapping = mapping
        }
      }

      this.headers = [
        ...this.headers.slice(0, index),
        this.getNullHeaderValues(this.headers[index]),
        ...this.headers.slice(index + 1),
      ]
    },

    getListTitle(id) {
      const list = this.allLists.find((list) => list.id === id)
      return list ? list.title : 'Not in a List'
    },

    addToGroupList() {
      const groups = [
        ...this.groups,
        {
          listId: 0,
        },
      ]

      this.groups = groups.map((group, index) => {
        const nextCount = Math.floor(this.importedDetails.rows / groups.length)
        const remainder = this.importedDetails.rows % groups.length
        const isLast = index === groups.length - 1

        return {
          ...group,
          count: isLast ? nextCount + remainder : nextCount,
        }
      })
    },

    removeFromGroupList(index) {
      const groups = [
        ...this.groups.slice(0, index),
        ...this.groups.slice(index + 1),
      ]

      this.groups = groups.map((group, index) => {
        const nextCount = Math.floor(this.importedDetails.rows / groups.length)
        const remainder = this.importedDetails.rows % groups.length
        const isLast = index === groups.length - 1

        return {
          ...group,
          count: isLast ? nextCount + remainder : nextCount,
        }
      })
    },

    setGroupList(index, id) {
      this.groups = [
        ...this.groups.slice(0, index),
        {
          ...this.groups[index],
          listId: id,
        },
        ...this.groups.slice(index + 1),
      ]
    },

    // Lead list create/edit from CSV modal
    openNewListModal(groupIndex) {
      // Prefill unique Untitled name similar to sidebar behavior
      let title = 'Untitled'
      const names = new Set(this.allLists.map((l) => l.title))
      if (names.has(title)) {
        let num = 1
        while (names.has(`Untitled ${num}`)) num++
        title = `Untitled ${num}`
      }

      this.listForEdit = { id: 0, title }
      this.createdListGroupIndex = groupIndex
      this.$bvModal.show('LeadListFormModal')
    },

    handleLeadListClosed() {
      this.listForEdit = null
      this.createdListGroupIndex = null
    },

    handleLeadListSaved(listItem) {
      // Keep locally so dropdown and title reflect immediately
      const idx = this.newLists.findIndex((l) => l.id === listItem.id)
      if (idx !== -1) this.newLists.splice(idx, 1, listItem)
      else this.newLists.push(listItem)

      if (typeof this.createdListGroupIndex === 'number') {
        this.setGroupList(this.createdListGroupIndex, listItem.id)
      }
      this.handleLeadListClosed()
    },

    reset() {
      this.currentStep = 1

      this.isUploading = false
      this.headers = []
      this.importedDetails = null

      this.mapping = {}
      this.customFields = []
      this.customMappings = []

      this.importCountdown = 0

      this.groups = []
    },

    handleOnHidden() {
      this.reset()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.lead-csv-import-modal {
  .lead-csv-uploading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    min-height: 50vh;
    text-align: center;

    h4 {
      align-self: flex-start;
      width: 100%;
    }

    .spinner-wrap {
      margin-bottom: 5.7rem;
      width: 100%;

      .spinner-border {
        width: 4rem;
        height: 4rem;
        border-width: 0.4rem;
      }
    }
  }

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

  .lead-csv-import-modal-header {
    margin-bottom: -45px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .lead-csv-import-modal-title {
      background-color: $primary;
      padding: 10px 50px;
      color: $white;
      border-radius: 20px;
      margin-bottom: 25px;
      font-size: 20px;
      text-transform: uppercase;
    }
  }

  .csv-zone {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 800px;
    margin: auto;
    height: 467px;
    background: #ececec;
    border: 1px dashed $primary;
    border-radius: 20px;
    padding: 100px 50px 50px;

    .csv-zone-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 164px;
      height: 144px;

      .icon {
        color: #8f8f8f;
      }

      .wings {
        font-size: 55px;
        margin-top: 15px;
      }

      .main-icon {
        font-size: 140px;
        margin: 0 5px;
      }
    }

    .lead-csv-file-info {
      text-align: center;
      font-size: 1.1rem;
      color: $gray-700;
    }

    .btn-csv-custom {
      background: #edfeeb;
      border: 1px solid #3abc29;
      box-shadow: 0 25px 50px -20px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: bold;
      font-size: 16px;
      line-height: 115.8%;
      text-align: center;
      text-transform: uppercase;
      color: #3abc29;
      margin-top: 30px;
      padding: 0.7rem 4.5rem;
    }
  }

  .map-attributes-step {
    padding-bottom: 10px;

    .csv-mapping-row {
      display: flex;
      margin-bottom: 20px;

      .map-from-col {
        width: 45%;

        .map-from-item {
          display: flex;
          border-bottom: 1px solid $gray-500;
          padding: 10px 0;

          .map-from-label {
            margin-right: 5px;
            font-size: 1.1rem;
            color: darken($gray-500, 40);
          }
          .map-from-sample {
            font-size: 0.8rem;
            color: $gray-500;
            margin-top: 5px;
          }
        }
      }
      .map-arrow-col {
        width: 5%;
        display: flex;
        justify-content: center;
        align-items: center;

        &.mapped {
          .icon {
            color: $success;
          }
        }
      }

      .map-to-col {
        width: 45%;
      }

      .map-action-col {
        width: 5%;
        display: flex;
        align-items: center;
        padding-left: 17px;

        .btn-remove-mapping {
          padding: 0;

          .icon {
            font-size: 1.1rem;
          }
        }
      }
    }

    .mapped-fields-counter {
      text-align: right;
      color: $gray-500;
      margin-top: 35px;
      padding-right: 15px;
    }
  }

  .review-wrap {
    .review-groups {
      width: 90%;
      margin: 0 auto;
      padding-bottom: 40px;
      padding-top: 25px;
      text-align: center;

      .group-spits {
        display: flex;
        justify-content: center;

        .group-item {
          width: 200px;
          margin-bottom: 15px;

          .count-num {
            color: $primary;
            font-size: 72px;
          }

          .count-label {
            text-transform: uppercase;
            color: #8f94a0;
            font-size: 14px;
          }

          .csv-list-dropdown {
            .btn-csv-list-dropdown {
              min-width: 120px;
              margin-top: 10px;
              border: 0;
              border-radius: 0;
              padding: 0.3rem 0;
              text-align: initial;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid $gray-400;
              box-shadow: none;
            }

            .dropdown-menu {
              margin-top: -40px;
              margin-left: -5px;

              .csv-list-dropdown-inner {
                max-height: 300px;
              }
            }
          }

          .btn-remove-csv-group {
            padding: 0;
            margin-top: 10px;
            box-shadow: none;

            .minus-icon {
              cursor: pointer;
              font-size: 28px;
              color: #cdcdcd;
            }
          }
        }

        .btn-add-csv-group {
          padding: 0;
          align-self: center;
          position: relative;
          top: 22px;
          box-shadow: none;

          .plus-icon {
            font-size: 40px;
            color: #cdcdcd;
            cursor: pointer;
          }
        }
      }
    }
  }

  .import-started-wrap {
    text-align: center;

    .started-wrap {
      min-height: 350px;
      margin: auto;

      .import-countdown {
        padding-top: 40px;
        color: $primary;
        font-size: 60px;
      }

      .countdown-label {
        color: $gray-500;
      }

      .started-description {
        width: 70%;
        margin: auto;
        margin-top: 40px;
        line-height: 24px;
        font-size: 17px;
      }
    }
  }
}
</style>
