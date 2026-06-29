<template>
  <div class="editor-video-edit-panel">
    <div class="video-input-wrap">
      <b-form-group
        :state="inputState"
        label="Video URL"
        label-size="sm"
        invalid-feedback="Invalid Youtube link"
      >
        <b-form-input
          v-model="url"
          size="sm"
          placeholder="Paste Youtube video url"
          autocomplete="off"
          trim
          autofocus
          @paste.stop
          @keydown="inputState = null"
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
                @paste.stop
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
                @paste.stop
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
        @click="updateVideo"
      >
        Update video
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    attrs: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      url: this.attrs.src,
      width: this.attrs.width,
      height: this.attrs.height,
      inputState: null,
    }
  },

  methods: {
    updateVideo() {
      const id = this.parseUrl(this.url)
      if (!id) {
        return (this.inputState = false)
      }

      this.$emit('update', {
        src: `https://www.youtube.com/embed/${id}`,
        width: this.width,
        height: this.height,
      })
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

.editor-video-edit-panel {
  position: absolute;
  right: 0;
  top: -2px;
  border: 1px solid $gray-300;
  background: $white;
  z-index: 10;
  padding: 20px;
  border-radius: 5px;
  text-align: left;
  white-space: initial;
  box-shadow: 0 0 10px $gray-200;

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
