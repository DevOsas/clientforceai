<template>
  <ProposalFabPanel
    title="Insert images"
    class="image-fab-panel"
    @close="$emit('close')"
  >
    <div class="upload-wrap" @click="$refs.fileInput.click()">
      <div class="upload-label">Upload Images</div>
      <input
        ref="fileInput"
        type="file"
        :accept="allowedFileTypes.join(',')"
        class="d-none"
        @change="handleImageUpload"
      />
    </div>

    <custom-scroll>
      <div class="fab-images">
        <div v-for="image in images" :key="image.url" class="fab-image-item">
          <img :src="image.url" alt="" />
          <div class="overlay">
            <b-button
              variant="insert-image"
              size="sm"
              @click="insertImage(image)"
            >
              Insert
            </b-button>
          </div>
        </div>
      </div>
    </custom-scroll>
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
      images: [
        {
          title: 'Writing',
          url: require('~/assets/images/gallery/writing.jpg'),
        },
        {
          title: 'Blank',
          url: require('~/assets/images/gallery/blank.jpg'),
        },
        {
          title: 'Hands',
          url: require('~/assets/images/gallery/hands.jpg'),
        },
        {
          title: 'Write',
          url: require('~/assets/images/gallery/write.jpg'),
        },
      ],
    }
  },

  computed: {
    allowedFileTypes() {
      return [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/bmp',
        'image/svg',
        'image/webp',
      ]
    },
  },

  methods: {
    insertImage(image) {
      this.editor.chain().focus().setImage({ src: image.url }).run()
    },

    handleImageUpload(event) {
      const file = event.target.files[0]

      if (!this.isValidFile(file)) return

      if (this.allowedFileTypes.includes(file.type)) {
        const fileReader = new FileReader()

        fileReader.readAsDataURL(file)

        fileReader.onload = (fileLoadedEvent) => {
          const srcData = fileLoadedEvent.target.result

          this.images = [
            {
              url: srcData,
              title: file.name,
            },
            ...this.images,
          ]
          // TODO: Actually upload this file to the server and return the url
        }
      }
    },

    isValidFile(file) {
      const inValidType = !this.allowedFileTypes.includes(file.type)

      if (inValidType) {
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Invalid file type',
          text: `You can only upload an image`,
        })
        return false
      }

      const size = file.size / 1000
      if (this.allowedFileTypes.includes(file.type) && size > 51200) {
        this.$notify({
          group: 'main',
          type: 'error',
          title: 'Image too large',
          text: 'Image size must not exceed 50MB',
        })
        return false
      }

      return true
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.image-fab-panel {
  .upload-wrap {
    padding: 10px 20px;
    border: 1px dashed $primary;
    background-color: rgba($primary, 0.2);
    margin-bottom: 20px;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;

    .upload-label {
      font-size: 1rem;
      color: darken($primary, 2);
    }

    &:hover {
      background-color: rgba($primary, 0.1);
    }
  }

  .fab-images {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-height: 400px;

    .fab-image-item {
      width: 120px;
      height: 120px;
      margin-bottom: 20px;
      cursor: pointer;
      position: relative;

      .overlay {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba($black, 0.3);
        opacity: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease-out;

        .btn-insert-image {
          background-color: $primary;
          color: $white;
          padding: 0 15px;
        }
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:hover {
        .overlay {
          opacity: 1;
        }
      }
    }
  }
}
</style>
