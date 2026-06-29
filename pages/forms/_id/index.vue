<template>
  <div class="forms-edit-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="form-title-wrap">
        <b-button variant="link" @click="$router.push({ name: 'forms' })">
          <SvgIcon name="arrow-left" />
        </b-button>
        <b-form-input v-model="title" class="form-title-input" />
      </div>

      <div>
        <b-button
          v-if="formId != 0"
          variant="danger"
          class="create-btn shadow"
          :disabled="busy || isDeleting"
          @click="$bvModal.show('DeleteLeadFormWarningModal')"
        >
          <b-spinner v-if="isDeleting" small />
          <SvgIcon v-else name="delete" class="mr-1" />
          Delete Form
        </b-button>
        <b-button
          variant="primary"
          class="create-btn shadow"
          :disabled="busy || isDeleting"
          @click="saveAndPublish"
        >
          <b-spinner v-if="busy" small />
          <SvgIcon v-else name="check" class="mr-1" />
          Save & Publish
        </b-button>
      </div>
    </div>

    <b-row>
      <b-col md="6" class="pr-4">
        <SettingsCollapse
          icon="check-circle"
          label="Choose a template"
          description="Select a starting template or build from scratch."
          :expanded="currentlyExpanded === 'template'"
        >
          <template>
            <div class="templates-items">
              <div
                v-for="template in templates"
                :key="template.name"
                class="template-item"
                :class="{ active: template.name === currentTemplateName }"
                @click="handleChooseTemplate(template)"
              >
                <div class="template-icon">
                  <SvgIcon :name="template.icon" />
                </div>
                <div class="template-title">{{ template.title }}</div>
              </div>
            </div>
          </template>
        </SettingsCollapse>

        <SettingsCollapse
          icon="check-circle"
          label="Build your Form"
          description="Add and rearrange fields to convert your visitors into contacts."
          :expanded="currentlyExpanded === 'build'"
          class="form-fields"
        >
          <template>
            <draggable
              v-model="fields"
              class="fields-list"
              ghost-class="ghost"
              group="fields"
              handle=".drag-handle"
              @start="drag = true"
              @end="drag = false"
            >
              <div
                v-for="(field, i) in fields"
                :key="`${field.name}${i + 1}`"
                class="field-item"
              >
                <div class="field-btns">
                  <b-dropdown
                    v-b-tooltip.hover
                    title="Options"
                    variant="link"
                    size="sm"
                    no-caret
                  >
                    <template #button-content>
                      <SvgIcon name="menu-dots-circle" />
                    </template>
                    <template>
                      <b-dropdown-item @click.capture.native.stop>
                        <div class="d-flex justify-content-between">
                          <label :for="`req${i}`" class="mb-0">
                            <SvgIcon name="star-circle" class="mr-1" />
                            Required
                          </label>
                          <b-form-checkbox
                            :id="`req${i}`"
                            v-model="field.required"
                            switch
                          />
                        </div>
                      </b-dropdown-item>
                      <b-dropdown-item class="sub-dropdown-item">
                        <div
                          class="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <SvgIcon name="list" class="mr-1" />
                            Type
                          </div>

                          <SvgIcon class="chevron" name="chevron-right" />
                        </div>

                        <div class="dropdown-sub-wrap">
                          <custom-scroll>
                            <ul class="dropdown-folder-list">
                              <li v-for="itype in inputTypes" :key="itype.name">
                                <a
                                  href="#"
                                  @click="changeFieldType(itype.name, i)"
                                >
                                  <SvgIcon :name="itype.icon" class="mr-1" />
                                  {{ itype.title }}
                                </a>
                              </li>
                            </ul>
                          </custom-scroll>
                        </div>
                      </b-dropdown-item>
                      <b-dropdown-item @click="removeFieldItem(i)">
                        <SvgIcon name="delete" class="mr-1" />
                        Delete
                      </b-dropdown-item>
                    </template>
                  </b-dropdown>

                  <b-button
                    v-b-tooltip.hover
                    title="Drag to reorder items."
                    variant="link"
                    size="sm"
                    class="drag-handle"
                  >
                    <SvgIcon name="drag-vertical" />
                  </b-button>
                </div>
                <div class="w-100">
                  <b-dropdown
                    v-if="!field.name"
                    :ref="`custom${i}`"
                    variant="light"
                    size="sm"
                    class="custom-field-dropdown"
                    toggle-class="border px-4"
                    no-caret
                  >
                    <template #button-content> Select custom field </template>
                    <template>
                      <div class="cf-search-wrap">
                        <b-form-input
                          v-model="customFieldKeyword"
                          size="sm"
                          placeholder="Search..."
                        />
                      </div>
                      <template v-if="computedCustomFields.length > 0">
                        <custom-scroll>
                          <div class="cf-scroll">
                            <b-dropdown-item
                              v-for="customField in computedCustomFields"
                              :key="customField.slug"
                              @click="updateCustomFieldItem(i, customField)"
                            >
                              <SvgIcon
                                :name="
                                  customField.type === 'number'
                                    ? 'hash-tag'
                                    : 'text-field'
                                "
                                class="custom-field-icon"
                              />
                              {{ customField.title }}
                            </b-dropdown-item>
                          </div>
                        </custom-scroll>
                      </template>
                      <div v-else class="text-center px-2 py-4">
                        No custom fields
                      </div>

                      <div class="px-2 py-2">
                        <b-button
                          variant="light"
                          size="sm"
                          class="border"
                          @click.capture.stop="openCustomFieldEditor(i)"
                        >
                          <SvgIcon name="plus" />
                          Add Custom Field
                        </b-button>
                      </div>
                    </template>
                  </b-dropdown>
                  <template v-else>
                    <div class="field-name">{{ field.name }}</div>
                    <b-form-row>
                      <b-col>
                        <b-form-group v-if="field.type === 'info'">
                          <b-form-textarea
                            v-model="field.label"
                            type="text"
                            size="sm"
                          />
                        </b-form-group>
                        <b-form-group v-else label="Field label">
                          <b-form-input
                            v-model="field.label"
                            type="text"
                            size="sm"
                          />
                        </b-form-group>
                      </b-col>
                      <b-col v-if="isUseLabel(field)">
                        <b-form-group label="Placeholder text">
                          <b-form-input
                            v-model="field.placeholderText"
                            type="text"
                            size="sm"
                          />
                        </b-form-group>
                      </b-col>
                    </b-form-row>
                    <div
                      v-if="field.type === 'select'"
                      class="form-select-options-wrap"
                    >
                      <draggable
                        v-model="field.options"
                        ghost-class="ghost"
                        group="options"
                        handle=".opt-drag-handle"
                      >
                        <div
                          v-for="(option, io) in field.options"
                          :key="io + 1"
                          class="form-option-item"
                        >
                          <div class="field-btns">
                            <b-button
                              v-b-tooltip.hover
                              title="Delete option"
                              variant="link"
                              size="sm"
                              @click="removeSelectOption(i, io)"
                            >
                              <SvgIcon name="delete" />
                            </b-button>
                            <b-button
                              v-b-tooltip.hover
                              title="Drag to reorder items."
                              variant="link"
                              size="sm"
                              class="opt-drag-handle"
                            >
                              <SvgIcon name="drag-vertical" />
                            </b-button>
                          </div>
                          <b-form-row class="w-100">
                            <b-col>
                              <b-form-group>
                                <b-form-input
                                  v-model="option.label"
                                  type="text"
                                  size="sm"
                                  placeholder="Option..."
                                />
                              </b-form-group>
                            </b-col>
                            <b-col>
                              <b-form-group>
                                <b-form-input
                                  v-model="option.value"
                                  type="text"
                                  size="sm"
                                  placeholder="Value..."
                                />
                              </b-form-group>
                            </b-col>
                          </b-form-row>
                        </div>
                      </draggable>
                      <div class="form-select-footer">
                        <div class="field-btns">
                          <SvgIcon name="plus-alt" />
                        </div>
                        <div class="w-100">
                          <b-button
                            variant="light"
                            size="sm"
                            class="border px-4"
                            @click="addSelectOption(i)"
                          >
                            Add an Option
                          </b-button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </draggable>
            <div class="field-item">
              <div class="field-btns">
                <b-button variant="link" size="sm" class="mt-1">
                  <SvgIcon name="plus-alt" />
                </b-button>
              </div>
              <div class="w-100">
                <b-dropdown
                  variant="light"
                  size="sm"
                  toggle-class="border px-4"
                  no-caret
                >
                  <template #button-content> Add a Field </template>
                  <template>
                    <b-dropdown-item
                      v-for="attr in computedLeadAttrs"
                      :key="attr.name"
                      @click="addFieldItem(attr)"
                    >
                      <SvgIcon :name="attr.icon" class="mr-1" />
                      {{ attr.label }}
                    </b-dropdown-item>

                    <b-dropdown-item class="sub-dropdown-item custom-item">
                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <SvgIcon name="list" class="mr-1" />
                          Other
                        </div>

                        <SvgIcon class="chevron" name="chevron-right" />
                      </div>

                      <div class="dropdown-sub-wrap">
                        <custom-scroll>
                          <ul class="dropdown-folder-list">
                            <li v-for="itype in inputTypes" :key="itype.name">
                              <a href="#" @click="addCustomField(itype)">
                                <SvgIcon :name="itype.icon" class="mr-1" />
                                {{ itype.title }}
                              </a>
                            </li>
                          </ul>
                        </custom-scroll>
                      </div>
                    </b-dropdown-item>
                  </template>
                </b-dropdown>
              </div>
            </div>
            <div class="field-item">
              <div class="field-btns">
                <b-button variant="link" size="sm">
                  <SvgIcon name="padlock" />
                </b-button>
              </div>
              <div class="w-100">
                <b-form-group label="Submit button label">
                  <b-form-input
                    v-model="form.submitButtonText"
                    type="text"
                    size="sm"
                  />
                </b-form-group>
              </div>
            </div>
          </template>
        </SettingsCollapse>

        <SettingsCollapse
          icon="check-circle"
          label="Style your Form"
          description="Configure your design settings."
        >
          <template>
            <b-form-row class="w-100">
              <b-col>
                <b-form-group label="Background:" label-size="sm">
                  <ColorInput v-model="form.bgColor" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Text:" label-size="sm">
                  <ColorInput v-model="form.textColor" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row class="w-100">
              <b-col>
                <b-form-group label="Button:" label-size="sm">
                  <ColorInput v-model="form.buttonColor" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Button Text:" label-size="sm">
                  <ColorInput v-model="form.buttonTextColor" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row class="w-100">
              <b-col>
                <b-form-group label="Success Background:" label-size="sm">
                  <ColorInput v-model="form.successBgColor" />
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group label="Success Text:" label-size="sm">
                  <ColorInput v-model="form.successTextColor" />
                </b-form-group>
              </b-col>
            </b-form-row>

            <div class="d-flex">
              <b-form-checkbox
                v-model="form.isEnableDarkMode"
                switch
                size="lg"
              />
              <div>
                <small class="font-weight-bold">Dark Mode</small>
                <b-form-text class="mt-0">
                  Forms can respond to a dark mode setting passed either by your
                  website or by the users system.
                </b-form-text>
              </div>
            </div>

            <template v-if="form.isEnableDarkMode">
              <b-form-row class="w-100">
                <b-col>
                  <b-form-group label="Background:" label-size="sm">
                    <ColorInput v-model="form.darkBgColor" />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Text:" label-size="sm">
                    <ColorInput v-model="form.darkTextColor" />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row class="w-100">
                <b-col>
                  <b-form-group label="Button:" label-size="sm">
                    <ColorInput v-model="form.darkButtonColor" />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Button Text:" label-size="sm">
                    <ColorInput v-model="form.darkButtonTextColor" />
                  </b-form-group>
                </b-col>
              </b-form-row>
            </template>
          </template>
        </SettingsCollapse>

        <SettingsCollapse
          icon="check-circle"
          label="Advanced Options"
          description="Choose the behaviours of your form."
        >
          <template>
            <b-form-group label="Redirect URL (Optional):" label-size="sm">
              <b-form-input
                v-model="form.redirectUrl"
                type="url"
                placeholder="e.g. https://www.clientforce.io/thanks"
              />
            </b-form-group>
            <b-form-group
              label="Success page heading (Optional):"
              label-size="sm"
            >
              <b-form-input
                v-model="form.successHeading"
                type="text"
                @keyup="handleSuccessHeadingInput"
              />
            </b-form-group>
            <b-form-group label="Success page text (Optional):" label-size="sm">
              <b-form-input
                v-model="form.successText"
                type="text"
                @keyup="handleSuccessTextInput"
              />
            </b-form-group>

            <div class="d-flex">
              <b-form-checkbox
                v-model="form.isEnableDoubleOptInMode"
                switch
                size="lg"
              />
              <div>
                <small class="font-weight-bold">Enable Double-Opt in</small>
                <b-form-text class="mt-0">
                  Automatically send a verification email to contacts when they
                  submit their email address to confirm their identity.
                </b-form-text>
              </div>
            </div>
          </template>
        </SettingsCollapse>

        <div
          v-if="formId != 0"
          class="snippet-wrap bg-white shadow rounded p-4 mb-4"
        >
          <h5>Install Code Snippet</h5>
          <p class="snippet-desc text-muted">
            Simply paste the snippet below into the HTML of your website
            wherever you want to place your Clientforce Form.
          </p>

          <div class="code-box">
            {{ codeSnippet }}
          </div>
        </div>

        <div class="text-right my-5">
          <b-button
            variant="link"
            class="px-4 text-dark mr-1"
            @click="$router.push({ name: 'forms' })"
          >
            Cancel
          </b-button>

          <b-button
            variant="primary"
            class="create-btn shadow"
            :disabled="busy"
            @click="saveAndPublish"
          >
            <b-spinner v-if="busy" small />
            <SvgIcon v-else name="check" class="mr-1" />
            Save & Publish
          </b-button>
        </div>
      </b-col>
      <b-col
        md="6"
        class="form-preview-col"
        :class="{
          'dark-mode': !form.isLightMode,
          'light-mode': form.isLightMode,
        }"
      >
        <div class="preview-content">
          <div class="text-center position-relative">
            <div class="nav-switch-wrap form">
              <a
                class="nav-switch-item"
                :class="{ active: !form.isShowSuccess }"
                href="#"
                @click.prevent="form.isShowSuccess = false"
              >
                Form
              </a>
              <a
                class="nav-switch-item"
                :class="{ active: form.isShowSuccess }"
                href="#"
                @click.prevent="form.isShowSuccess = true"
              >
                Success
              </a>
            </div>
            <b-button
              v-if="form.isEnableDarkMode"
              variant="link"
              class="dark-mode-switch"
              @click="form.isLightMode = !form.isLightMode"
            >
              <SvgIcon :name="form.isLightMode ? 'light-mode' : 'dark-mode'" />
            </b-button>
          </div>
          <iframe
            ref="previewFrame"
            sandbox="allow-same-origin allow-scripts"
            scrolling="no"
            :src="computedUrl"
            width="400"
            :height="computedHeight"
          ></iframe>
        </div>
      </b-col>
    </b-row>

    <CustomFieldEditorModal
      @close="closeCustomFieldEditor"
      @saved="handleCustomFieldSaved"
    />

    <b-modal id="DeleteLeadFormWarningModal" centered hide-header hide-footer>
      <template #default="{ hide }">
        <div v-if="isDeleting" class="forms-deleting">
          <b-spinner variant="primary" />
        </div>
        <div v-else class="text-center p-4">
          <h4>Delete Form</h4>
          <p>
            Deleting this Form will remove it permanently. Are you sure you want
            to continue.
          </p>

          <div class="mt-4">
            <b-button
              variant="link"
              class="text-dark px-4 mr-1"
              pill
              @click="hide"
            >
              Cancel
            </b-button>
            <b-button
              variant="primary"
              class="px-4 mr-1"
              pill
              @click="handleDeleteForm"
            >
              Delete
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

import SettingsCollapse from '~/components/General/SettingsCollapse'
import formTemlates from '~/utils/formTemplates'
import CustomFieldEditorModal from '~/components/Lead/CustomFieldEditorModal'
import ColorInput from '~/components/General/ColorInput'

import { ALL_CUSTOM_FIELDS_QUERY } from '~/graphql/lead/queries'
import {
  SAVE_FORM_MUTATION,
  DELETE_LEAD_FORM_MUTATION,
} from '~/graphql/form/mutations'

import {
  ALL_LEAD_FORMS_QUERY,
  LEAD_FORM_BY_ID_QUERY,
} from '~/graphql/form/queries'

export default {
  components: {
    SettingsCollapse,
    draggable,
    CustomFieldEditorModal,
    ColorInput,
  },

  middleware: 'auth',

  async asyncData({ app, store, params }) {
    if (parseInt(params.id) === 0) {
      return {}
    }

    const {
      apolloProvider: { defaultClient },
    } = app

    const { data } = await defaultClient.query({
      query: LEAD_FORM_BY_ID_QUERY,
      variables: {
        id: params.id,
      },
    })

    const form = data.form

    store.dispatch('leadForm/updateSubmissionsCount', form.submissionsCount)

    return {
      title: form.title,
      description: form.description,
      form: JSON.parse(form.config),
      fields: JSON.parse(form.fields),
      submissionsCount: form.submissionsCount,
    }
  },

  data() {
    return {
      templates: formTemlates,
      currentTemplateName: null,
      currentlyExpanded: null,
      fields: [],
      inputTypes: [
        {
          name: 'text',
          title: 'Text Field',
          icon: 'text-align-left',
        },
        {
          name: 'textarea',
          title: 'Extended Text',
          icon: 'text-align-left',
        },
        {
          name: 'select',
          title: 'Select',
          icon: 'circle-arrow-down',
        },
        {
          name: 'checkbox',
          title: 'Checkbox',
          icon: 'checked-circle',
        },
        {
          name: 'info',
          title: 'Informational Text',
          icon: 'info-circle-alt',
        },
      ],
      leadAttrs: [
        {
          name: 'name',
          icon: 'user',
          label: 'Name',
          fieldProps: {
            name: 'name',
            label: 'Name',
            type: 'text',
            placeholderText: 'Joe Doe',
            required: false,
          },
        },
        {
          name: 'first_name',
          icon: 'user',
          label: 'First Name',
          fieldProps: {
            name: 'first_name',
            label: 'First Name',
            type: 'text',
            placeholderText: 'Joe',
            required: false,
          },
        },
        {
          name: 'last_name',
          icon: 'user',
          label: 'Last Name',
          fieldProps: {
            name: 'last_name',
            label: 'Last Name',
            type: 'text',
            placeholderText: 'Doe',
            required: false,
          },
        },
        {
          name: 'email',
          icon: 'email-at',
          label: 'Email',
          fieldProps: {
            name: 'email',
            label: 'Email',
            type: 'email',
            placeholderText: 'name@example.com',
            required: false,
          },
        },
        {
          name: 'company_name',
          icon: 'company',
          label: 'Company Name',
          fieldProps: {
            name: 'company_name',
            label: 'Company Name',
            type: 'text',
            placeholderText: 'Company Inc.',
            required: false,
          },
        },
        {
          name: 'company_size',
          icon: 'list',
          label: 'Company Size',
          fieldProps: {
            name: 'company_size',
            label: 'Company Size',
            type: 'number',
            placeholderText: '15',
            required: false,
          },
        },
        {
          name: 'email_opt_in',
          icon: 'checked-circle',
          label: 'Email Opt-in',
          fieldProps: {
            name: 'email_opt_in',
            label: 'Email Opt-in',
            type: 'checkbox',
            placeholderText: '',
            required: false,
          },
        },
      ],
      indexToUpdate: null,
      customFieldKeyword: '',
      title: '',
      description: 'Clientforce form',
      form: {
        submitButtonText: 'Submit',
        bgColor: '#ffffff',
        textColor: '#000000',
        buttonColor: '#2ecb3a',
        buttonTextColor: '#ffffff',
        successBgColor: '#ffffff',
        successTextColor: '#000000',
        isEnableDarkMode: false,
        isLightMode: true,
        darkBgColor: '#000000',
        darkTextColor: '#ffffff',
        darkButtonColor: '#2ecb3a',
        darkButtonTextColor: '#ffffff',
        redirectUrl: '',
        successHeading: 'Thanks!',
        successText: 'Your details were successfully submitted.',
        isEnableDoubleOptInMode: false,
        isShowSuccess: false,
      },
      busy: false,
      isDeleting: false,
    }
  },

  apollo: {
    customFields: {
      query: ALL_CUSTOM_FIELDS_QUERY,
      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    currentTemplate() {
      return this.templates.find((t) => t.name === this.currentTemplateName)
    },

    addedAttrs() {
      return this.fields.map((f) => f.name)
    },

    computedLeadAttrs() {
      return this.leadAttrs.filter(
        (attr) => !this.addedAttrs.includes(attr.name)
      )
    },

    computedCustomFields() {
      return this.customFields.filter((cf) => {
        const title = cf.title.toLowerCase()
        const keyword = this.customFieldKeyword.toLowerCase()
        const hasKeyword = title.includes(keyword)
        return hasKeyword && !this.addedAttrs.includes(`custom.${cf.slug}`)
      })
    },

    formHost() {
      return this.$config.formHost
    },

    computedUrl() {
      if (this.formId == 0) {
        return `${this.formHost}/f/preview`
      }
      return `${this.formHost}/f/preview/${this.formId}`
    },

    formId() {
      return this.$route.params.id
    },

    computedHeight() {
      return 228 + this.fields.length * 80
    },

    codeSnippet() {
      const tagName = 'script'

      return `<iframe src="${this.formHost}/f/${this.formId}" frameborder="0" width="400" height="${this.computedHeight}"></iframe>
      <${tagName} src="${this.formHost}/forms.js" async></${tagName}>`
    },
  },

  watch: {
    'form.isEnableDarkMode'(value) {
      if (!value) {
        this.form.isLightMode = true
      }
    },

    fields: {
      handler(after, before) {
        this.sendUpdateToIframe()
      },
      deep: true,
    },

    form: {
      handler(after, before) {
        this.sendUpdateToIframe()
      },
      deep: true,
    },

    formId() {
      this.initTemplate()
    },
  },

  created() {
    this.initTemplate()
  },

  mounted() {
    window.addEventListener('message', (event) => {
      const { source, ready } = event.data
      if (source === 'cf-form' && ready) {
        this.sendUpdateToIframe()
      }
    })
  },

  methods: {
    initTemplate() {
      if (parseInt(this.formId) === 0) {
        this.currentTemplateName = 'newsletter'

        this.seedFormWithTemplate(this.currentTemplate)
      } else {
        this.currentTemplateName = 'custom'
      }
    },

    sendUpdateToIframe() {
      const iframe = this.$refs.previewFrame
      const message = {
        fields: this.fields,
        config: this.form,
      }
      iframe && iframe.contentWindow.postMessage(message, '*')
    },

    isUseLabel(field) {
      return field.type !== 'checkbox' && field.type !== 'info'
    },

    addFieldItem(field) {
      this.fields = [...this.fields, field.fieldProps]
    },

    updateCustomFieldItem(index, customField) {
      this.fields = [
        ...this.fields.slice(0, index),
        {
          ...this.fields[index],
          name: `custom.${customField.slug}`,
          label: customField.title,
        },
        ...this.fields.slice(index + 1),
      ]
    },

    addCustomField(itype) {
      this.fields = [
        ...this.fields,
        {
          name: '',
          label: itype.title,
          type: itype.name,
          placeholderText: '',
          required: false,
        },
      ]

      setTimeout(() => {
        const index = this.fields.length - 1
        const bvdd = this.$refs[`custom${index}`][0]

        bvdd.show()
      }, 300)
    },

    handleChooseTemplate(template) {
      this.currentTemplateName = template.name
      this.currentlyExpanded = 'build'

      this.seedFormWithTemplate(template)
    },

    seedFormWithTemplate(template) {
      this.fields = template.fields
      this.form.submitButtonText = template.submitButtonText
      this.title = `${template.title} Form`
      this.description = template.description
    },

    changeFieldType(name, i) {
      const update =
        name === 'select' ? { type: name, options: [] } : { type: name }
      this.fields = [
        ...this.fields.slice(0, i),
        {
          ...this.fields[i],
          ...update,
        },
        ...this.fields.slice(i + 1),
      ]
    },

    removeFieldItem(i) {
      this.fields = [...this.fields.slice(0, i), ...this.fields.slice(i + 1)]
    },

    addSelectOption(i) {
      const options = this.fields[i].options || []
      this.fields = [
        ...this.fields.slice(0, i),
        {
          ...this.fields[i],
          options: [...options, { label: '', value: '' }],
        },
        ...this.fields.slice(i + 1),
      ]
    },

    removeSelectOption(i, io) {
      this.fields = [
        ...this.fields.slice(0, i),
        {
          ...this.fields[i],
          options: [
            ...this.fields[i].options.slice(0, io),
            ...this.fields[i].options.slice(io + 1),
          ],
        },
        ...this.fields.slice(i + 1),
      ]
    },

    openCustomFieldEditor(index) {
      this.indexToUpdate = index

      this.$bvModal.show('CustomFieldEditorModal')
    },

    closeCustomFieldEditor() {
      this.indexToUpdate = null

      this.$bvModal.hide('CustomFieldEditorModal')
    },

    handleCustomFieldSaved(field) {
      const index = this.indexToUpdate
      this.fields = [
        ...this.fields.slice(0, index),
        {
          ...this.fields[index],
          name: `custom.${field.slug}`,
          label: field.title,
        },
        ...this.fields.slice(index + 1),
      ]

      this.closeCustomFieldEditor()
    },

    handleSuccessHeadingInput(e) {
      const value = e.target.value
      if (!value) {
        this.form.successHeading = 'Thanks!'
      }
    },

    handleSuccessTextInput(e) {
      const value = e.target.value
      if (!value) {
        this.form.successText = 'Your details were successfully submitted.'
      }
    },

    async saveAndPublish() {
      try {
        this.busy = true

        const { data } = await this.$apollo.mutate({
          mutation: SAVE_FORM_MUTATION,
          variables: {
            id: this.formId !== 0 ? this.formId : null,
            title: this.title,
            description: this.description,
            config: JSON.stringify(this.form),
            fields: JSON.stringify(this.fields),
          },
          // update: (store, { data: { field } }) => {
          //   const data = store.readQuery({ query: ALL_CUSTOM_FIELDS_QUERY })

          //   data.customFields = [...data.customFields, field]

          //   store.writeQuery({
          //     query: ALL_CUSTOM_FIELDS_QUERY,
          //     data,
          //   })
          // },
        })

        this.$notify({
          group: 'main',
          type: 'native',
          title: 'Success',
          text: `The Form has been saved successfully`,
        })

        this.$router.push({
          name: 'forms-id',
          params: { id: data.saveForm.id },
        })
        // this.form.reset()

        this.busy = false
      } catch ({ graphQLErrors: errors }) {
        this.busy = false

        for (let i = 0; i < errors.length; i++) {
          if (errors[i].message === 'validation') {
            // this.form.errors.set(errors[i].extensions.validation)
            console.log(errors[i].extensions.validation)
          }
        }
      }
    },

    handleDeleteForm() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_LEAD_FORM_MUTATION,
          variables: {
            id: this.formId,
          },
          update: (store) => {
            this.removeDeletedFromList(this.formId)
          },
        })
        .then(() => {
          this.$notify({
            group: 'main',
            type: 'native',
            title: 'Success',
            text: `Form has been deleted successfully`,
          })

          this.isDeleting = false
          this.$bvModal.hide('DeleteLeadFormWarningModal')

          this.$router.push({ name: 'forms' })
        })
        .catch(() => {
          this.$notify({
            group: 'main',
            type: 'error',
            title: 'Unable to delete',
            text: 'An error occurred while processing your request.',
          })

          this.isDeleting = false
          this.$bvModal.hide('DeleteLeadFormWarningModal')
        })
    },

    removeDeletedFromList(id) {
      const store = this.$apollo.getClient()
      try {
        // Read the data from our cache for this query.
        const data = store.readQuery({
          query: ALL_LEAD_FORMS_QUERY,
          variables: {
            offset: 0,
          },
        })

        // Update forms
        data.result.forms = data.result.forms.filter((form) => form.id !== id)

        // Write the forms data back to the cache.
        store.writeQuery({
          query: ALL_LEAD_FORMS_QUERY,
          variables: {
            offset: 0,
          },
          data,
        })
      } catch (err) {
        // Catch errors
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.forms-edit-page {
  // padding-top: 40px;

  .form-title-wrap {
    display: flex;
    align-items: center;
    width: 49%;

    .btn {
      margin-right: 10px;
      color: $gray-700;
      box-shadow: none;
    }

    .form-title-input {
      width: 100%;
      padding: 0;
      border: 0;
      border-bottom: 1px dotted;
      border-radius: 0;
      font-size: 25px;

      &:focus {
        outline: 0;
        box-shadow: none;
      }
    }
  }

  .settings-collapse {
    margin-bottom: 20px;
    position: relative;
    // z-index: -1;

    .collapse-header {
      border-radius: 4px;
      padding: 20px 30px;

      .collapse-description {
        margin-top: 0;
      }
    }

    .settings-label {
      margin-bottom: 12px;
    }

    &.form-fields {
      .collapse-body {
        padding: 0;
      }
    }
  }

  .templates-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .template-item {
      border-radius: 6px;
      box-sizing: border-box;
      border: 1px solid $gray-100;
      color: #678194;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-right: 1em;
      cursor: pointer;
      box-shadow: 0 1px 1px #0000001a, 0 2px 4px #0000001a;
      min-height: 10em;
      min-width: 10em;
      margin-bottom: 1em;

      &.active,
      &:hover {
        border: 2px solid $primary;
      }

      .template-icon {
        font-size: 3.5rem;
      }

      .template-title {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        text-transform: uppercase;
      }
    }
  }

  .fields-list {
    //
  }
  .custom-field-dropdown {
    .custom-field-icon {
      color: $primary;
    }

    .cf-search-wrap {
      padding: 0.3rem 0.5rem;

      .form-control {
        border: 1px solid transparent;
        box-shadow: 1px 1px 5px #e0e0e0;
      }
    }

    .cf-scroll {
      min-height: 50px;
      max-height: 250px;
    }

    /* stylelint-disable no-descending-specificity */
    .dropdown-item {
      font-size: 0.85rem;

      .custom-field-icon {
        font-size: 1rem;
        line-height: 1;

        > svg {
          margin-top: 0;
        }
      }

      &:active {
        .custom-field-icon {
          color: white;
        }
      }
    }
  }

  .field-item {
    display: flex;
    padding: 20px;
    background: #ffff;
    border-top: 1px solid darken($gray-100, 2);
    border-bottom: 1px solid $gray-100;
    align-items: flex-start;

    &.ghost {
      opacity: 0.5;
      background: $gray-300;
    }

    .field-name {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 1.1em;
      color: $gray-600;
      margin-bottom: 5px;
    }

    .dropdown-menu {
      z-index: 1002;
    }

    .dropdown-item {
      padding: 0.45rem 0.8rem;
    }

    .sub-dropdown-item {
      position: relative;

      .custom-switch {
        margin-right: -7px;
      }

      .chevron {
        font-size: 0.7rem;
        color: $gray-500;
        margin-top: 4px;
      }

      &:active {
        .chevron {
          color: white;
        }
      }

      .dropdown-sub-wrap {
        position: absolute;
        top: 0;
        right: -180px;
        width: 180px;
        background-color: $white;
        box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        opacity: 0;

        .dropdown-folder-list {
          list-style: none;
          padding: 0;
          margin: 10px 0;
          max-height: 250px;

          li {
            a {
              padding: 0.45rem 15px;
              color: $dark;
              display: block;

              &:hover {
                text-decoration: none;
              }
            }

            &:hover {
              background-color: $gray-100;
            }

            &:active {
              color: $white;
              background-color: $primary;
            }
          }
        }
      }

      &.custom-item {
        .dropdown-sub-wrap {
          top: -100px;
        }
      }

      &:hover {
        .dropdown-sub-wrap {
          opacity: 1;
        }
      }
    }

    .field-btns {
      display: flex;
      margin-right: 10px;
      column-gap: 5px;
      margin-top: 2px;
      min-width: 42px;
      justify-content: flex-end;

      .btn {
        color: $gray-600;
        font-size: 1rem;
        padding: 0;
        line-height: 1;
        box-shadow: none !important;
        z-index: 1000;
      }
    }

    .form-group {
      margin-bottom: 0;
    }

    .col-form-label {
      font-size: 0.8rem;
      padding-bottom: 3px;
      color: $gray-600;
    }

    .form-control-sm {
      border-radius: 0.25rem;
    }

    .form-select-options-wrap {
      margin-top: 15px;
      background-color: #f3fbf5;
      border-radius: 10px;
      padding: 7px;
    }
    .form-option-item {
      padding: 10px 10px 0;
      display: flex;
      align-items: flex-start;

      &.ghost {
        opacity: 0.5;
        background: $gray-300;
      }
    }
    .form-select-footer {
      padding: 10px;
      display: flex;
      align-items: flex-start;
    }
  }

  .snippet-wrap {
    .snippet-desc {
      font-size: 0.9rem;
    }
    .code-box {
      margin-top: 1em;
      border-radius: 5px;
      font-size: 13px;
      overflow: hidden;
      background: #f3f8f5;
      color: #5d6f84;
      box-shadow: inset 0 0 0 1px #0000000d, inset 0 -1px 2px #0000001a,
        0 1px 1px #0000000d;
      margin-bottom: 2em;
      padding: 15px;
    }
  }

  iframe {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }

  .form-preview-col {
    padding: 2rem 7rem;
    border-radius: 5px;

    .preview-content {
      position: sticky;
      top: 15px;
    }

    &.dark-mode {
      background-color: #000;
      transition: background-color 0.7s ease-in-out;
    }
    &.light-mode {
      background-color: #f7f7f7;
      transition: background-color 0.7s ease-in-out;
    }

    .nav-switch-wrap.form {
      border-radius: 8px;
      padding: 5px;
      margin: auto;
      margin-bottom: 2rem;
      background-color: white;

      .nav-switch-item {
        border-radius: 8px;
        font-size: 0.9rem;
        padding: 7px 30px;
      }
    }

    .dark-mode-switch {
      position: absolute;
      top: 2px;
      right: -90px;
      font-size: 1.2rem;
      box-shadow: none !important;

      &:hover {
        color: lighten($color: $primary, $amount: 15);
      }
    }
  }
}
.forms-deleting {
  min-height: 200px;
  min-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .spinner-border {
    height: 3rem;
    width: 3rem;
    border-width: 0.4rem;
  }
}
</style>
