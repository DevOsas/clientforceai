<template>
  <div class="menubar-wrap" :class="{ fixed: isScrollPassed }">
    <b-container>
      <div class="menubar-inner">
        <div>
          <b-button
            :to="{ name: 'proposals-category' }"
            variant="light"
            size="sm"
            class="border"
          >
            <SvgIcon name="chevron-left" />
            Back
          </b-button>
        </div>
        <div class="menubar">
          <b-dropdown
            v-b-tooltip.hover.bottom
            title="Paragraph Style"
            variant="link"
            size="sm"
            toggle-class="menubar__button headings-dropdown"
            right
            :disabled="!editor.isEditable"
          >
            <template #button-content>
              {{ getActiveHeading() }}
            </template>
            <b-dropdown-item
              :class="{ 'is-active': editor.isActive('paragraph') }"
              @click="editor.chain().focus().setParagraph().run()"
            >
              Body
            </b-dropdown-item>
            <b-dropdown-item
              v-for="heading in headings"
              :key="heading.label"
              :class="{
                'is-active': editor.isActive('heading', heading.params),
              }"
              @click="
                editor.chain().focus().toggleHeading(heading.params).run()
              "
            >
              {{ heading.label }}
            </b-dropdown-item>
          </b-dropdown>

          <ProposalEditorForeColorButton :editor="editor" />

          <ProposalEditorHighlightButton :editor="editor" />

          <b-button
            v-b-tooltip.hover.bottom
            title="Bold"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('bold') }"
            :disabled="
              !editor.isEditable ||
              !editor.can().chain().focus().toggleBold().run()
            "
            @click="editor.chain().focus().toggleBold().run()"
          >
            <SvgIcon name="bold" />
          </b-button>

          <b-button
            v-b-tooltip.hover.bottom
            title="Italic"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('italic') }"
            :disabled="
              !editor.isEditable ||
              !editor.can().chain().focus().toggleItalic().run()
            "
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <SvgIcon name="italic" />
          </b-button>

          <b-button
            v-b-tooltip.hover.bottom
            title="Strikethrough"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('strike') }"
            :disabled="
              !editor.isEditable ||
              !editor.can().chain().focus().toggleStrike().run()
            "
            @click="editor.chain().focus().toggleStrike().run()"
          >
            <SvgIcon name="strikethrough" />
          </b-button>

          <ProposalEditorLinkButton :editor="editor" />

          <b-button
            v-b-tooltip.hover.bottom
            title="Underline"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('underline') }"
            :disabled="!editor.isEditable"
            @click="editor.chain().focus().toggleUnderline().run()"
          >
            <SvgIcon name="underline" />
          </b-button>

          <b-button
            v-b-tooltip.hover.bottom
            title="Unordered List"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            :disabled="!editor.isEditable"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <SvgIcon name="list" />
          </b-button>

          <b-button
            v-b-tooltip.hover.bottom
            title="Ordered List"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            :disabled="!editor.isEditable"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <SvgIcon name="ordered-list" />
          </b-button>

          <b-dropdown
            v-b-tooltip.hover.bottom
            title="Align"
            variant="link"
            size="sm"
            class="align-dropdown"
            toggle-class="menubar__button"
            right
            :disabled="!editor.isEditable"
          >
            <template #button-content>
              <SvgIcon :name="getActiveAlignment()" />
            </template>
            <b-dropdown-item
              v-for="align in alignments"
              :key="align.label"
              v-b-tooltip.hover.right
              :title="align.label"
              :class="{
                'is-active': editor.isActive({ textAlign: align.dir }),
              }"
              @click="editor.chain().focus().setTextAlign(align.dir).run()"
            >
              <SvgIcon :name="align.icon" />
            </b-dropdown-item>
          </b-dropdown>

          <b-button
            v-b-tooltip.hover.bottom
            title="Increase Indent"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('indent') }"
            :disabled="!editor.isEditable"
            @click="editor.chain().focus().indent().run()"
          >
            <SvgIcon name="indent" />
          </b-button>

          <b-button
            v-b-tooltip.hover.bottom
            title="Decrease Indent"
            variant="link"
            size="sm"
            class="menubar__button"
            :class="{ 'is-active': editor.isActive('indent') }"
            :disabled="!editor.isEditable"
            @click="editor.chain().focus().outdent().run()"
          >
            <SvgIcon name="outdent" />
          </b-button>
        </div>

        <div>
          <b-button
            variant="proposal-preview"
            size="sm"
            class="px-4"
            @click="$emit('preview')"
          >
            Preview
          </b-button>
          <b-button
            v-if="editor.isEditable"
            variant="primary"
            size="sm"
            class="px-4"
            :disabled="isBusy"
            @click="$emit('save')"
          >
            <b-spinner v-if="isBusy" class="mr-1" small></b-spinner>
            Save
          </b-button>
          <b-button
            v-else
            variant="secondary"
            size="sm"
            class="px-4"
            :disabled="isBusy"
            @click="$emit('copy')"
          >
            <b-spinner v-if="isBusy" class="mr-1" small></b-spinner>
            Copy
          </b-button>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import ProposalEditorForeColorButton from '~/components/Proposal/Editor/ProposalEditorForeColorButton'
import ProposalEditorHighlightButton from '~/components/Proposal/Editor/ProposalEditorHighlightButton'
import ProposalEditorLinkButton from '~/components/Proposal/Editor/ProposalEditorLinkButton'

export default {
  components: {
    ProposalEditorForeColorButton,
    ProposalEditorHighlightButton,
    ProposalEditorLinkButton,
  },

  props: {
    editor: {
      type: [Object],
      required: true,
    },

    isBusy: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      scrollY: 0,
      headings: [
        {
          label: 'Heading 1',
          params: { level: 1 },
        },
        {
          label: 'Heading 2',
          params: { level: 2 },
        },
        {
          label: 'Heading 3',
          params: { level: 3 },
        },
        {
          label: 'Heading 4',
          params: { level: 4 },
        },
      ],
      alignments: [
        {
          label: 'Align Left',
          icon: 'text-align-left',
          dir: 'left',
        },
        {
          label: 'Align Center',
          icon: 'text-align-center',
          dir: 'center',
        },
        {
          label: 'Align Right',
          icon: 'text-align-right',
          dir: 'right',
        },
        {
          label: 'Align Justified',
          icon: 'text-justified',
          dir: 'justify',
        },
      ],
    }
  },

  computed: {
    isScrollPassed() {
      return this.scrollY > 55
    },
  },

  mounted() {
    window.addEventListener('scroll', this.scrollHandler)
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollHandler)
  },

  methods: {
    scrollHandler() {
      this.scrollY = Math.round(window.scrollY)
    },

    getActiveHeading() {
      const heading = this.headings.find((heading) => {
        return this.editor.isActive('heading', heading.params)
      })

      return heading ? heading.label : 'Body'
    },

    getActiveAlignment() {
      const alignment = this.alignments.find((align) => {
        return this.editor.isActive({ textAlign: align.dir })
      })

      return alignment ? alignment.icon : 'text-align-left'
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.menubar-wrap {
  background-color: #fff;
  position: absolute;
  top: 55px;
  left: 0;
  padding: 7px;
  z-index: 1;
  width: 100%;
  box-shadow: 0 5px 4px rgba($gray-500, 0.25);

  &.fixed {
    position: fixed;
    top: 0;
  }

  .menubar-inner {
    display: flex;
    justify-content: space-between;

    .menubar {
      .headings-dropdown {
        min-width: 120px;
        border-left: 1px solid $gray-200;
        border-right: 1px solid $gray-200;
        border-radius: 0;

        &:hover {
          background-color: $gray-100;
        }
      }

      .align-dropdown {
        .dropdown-menu {
          min-width: 50px;
        }
      }

      .menubar__button {
        color: $gray-600;
        box-shadow: none;
        text-decoration: none;

        &.is-active {
          background-color: #f4f4f4;
        }

        &:active {
          box-shadow: none !important;
        }
      }
    }

    .btn-proposal-preview {
      border: 1px solid $gray-300;
      background-color: $gray-100;
      margin-right: 5px;
      box-shadow: none;

      &:hover {
        background-color: $gray-200;
      }
    }
  }
}
</style>
