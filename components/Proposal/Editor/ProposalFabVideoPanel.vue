<template>
  <ProposalFabPanel
    title="Insert Youtube video"
    class="video-fab-panel"
    @close="$emit('close')"
  >
    <div class="video-input-wrap">
      <b-form-group :state="inputState" invalid-feedback="Invalid Youtube link">
        <b-form-input
          v-model="url"
          size="sm"
          placeholder="Paste Youtube video url"
          autocomplete="off"
          trim
          autofocus
          @keydown="inputState = null"
          @keypress.enter="insertVideo"
        />
      </b-form-group>

      <b-form-row>
        <b-col>
          <b-form-group label="Width" label-size="sm">
            <b-input-group size="sm" append="px">
              <b-form-input
                v-model="width"
                type="number"
                min="0"
                max="740"
                placeholder="Auto"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Height" label-size="sm">
            <b-input-group size="sm" append="px">
              <b-form-input
                v-model="height"
                type="number"
                min="0"
                max="740"
                placeholder="Auto"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-form-row>
    </div>
    <div class="mt-2">
      <b-button
        variant="primary"
        size="sm"
        class="px-4"
        block
        @click="insertVideo"
      >
        Insert video
      </b-button>
    </div>
  </ProposalFabPanel>
</template>

<script>
import ProposalFabPanel from '~/components/Proposal/Editor/ProposalFabPanel'

export default {
  components: { ProposalFabPanel },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      url: '',
      width: '740',
      height: '450',
      inputState: null,
    }
  },

  methods: {
    insertVideo() {
      const id = this.parseUrl(this.url)
      if (!id) {
        return (this.inputState = false)
      }

      this.editor
        .chain()
        .focus()
        .insertVideoWithCaption({
          src: `https://www.youtube.com/embed/${id}`,
          width: this.width,
          height: this.height,
        })
        .run()

      this.url = ''
      this.$emit('close')
    },

    parseUrl(url) {
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      const match = url.match(regExp)
      return match && match[7].length === 11 ? match[7] : false
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.video-fab-panel {
  .video-input-wrap {
    .form-group {
      legend {
        color: $gray-600;
      }

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
      }
    }
    .input-group-append {
      .input-group-text {
        color: $primary;
        border-color: rgba($primary, 0.5);
        background-color: rgba($primary, 0.2);
      }
    }
  }
}
</style>
