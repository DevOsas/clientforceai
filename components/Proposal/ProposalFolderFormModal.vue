<template>
  <b-modal
    id="ProposalFolderFormModal"
    size="md"
    modal-class="proposal-folder-form-modal"
    hide-header
    hide-footer
    centered
    @hidden="handleOnHide"
  >
    <template #default="{ hide }">
      <div class="proposal-folder-form-modal-header">
        <h3 class="proposal-folder-form-modal-title">
          {{ form.id ? 'Update folder name' : 'Create new folder' }}
        </h3>
        <b-button variant="link" class="close-btn" @click="hide()">
          <SvgIcon name="close" />
        </b-button>
      </div>

      <b-form
        class="proposal-name-form"
        method="POST"
        @submit.prevent="saveList"
        @keydown="form.onKeydown($event)"
      >
        <b-form-input
          v-model="form.title"
          size="md"
          autofocus
          placeholder="List name"
          autocomplete="off"
          required
        />

        <div class="text-right mt-4">
          <b-button
            variant="link"
            class="text-muted mr-1 px-4"
            pill
            @click="hide"
          >
            Cancel
          </b-button>

          <b-button type="submit" variant="primary" class="px-4" pill>
            <b-spinner v-if="form.busy" class="mr-1" small></b-spinner>
            Save
          </b-button>
        </div>
      </b-form>
    </template>
  </b-modal>
</template>

<script>
import { SAVE_PROPOSAL_FOLDER_MUTATION } from '~/graphql/proposal/mutations'

export default {
  props: {
    folderItem: {
      type: Object,
      default: () => null,
    },
    category: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      form: new this.$form({ id: 0, title: '' }),
    }
  },

  watch: {
    folderItem(folderItem) {
      if (folderItem) {
        this.form.keys().forEach((key) => {
          this.form[key] = folderItem[key] ? folderItem[key] : null
        })
      }
    },
  },

  methods: {
    async saveList(edited) {
      this.form.busy = true
      await this.$apollo
        .mutate({
          mutation: SAVE_PROPOSAL_FOLDER_MUTATION,
          variables: {
            ...this.form.data(),
            category: this.category,
            type: 'proposal',
          },
        })
        .then(({ data }) => {
          this.form.busy = false
          this.$emit('saved', data.folder)

          this.$bvModal.hide('ProposalFolderFormModal')
        })
        .catch(({ graphQLErrors: errors }) => {
          this.form.busy = false

          for (let i = 0; i < errors.length; i++) {
            if (errors[i].message === 'validation') {
              this.form.errors.set(errors[i].extensions.validation)
            } else {
              this.$notify({
                group: 'main',
                type: 'error',
                title: 'Unable to save',
                text: `${errors[i].message}`,
              })
            }
          }
        })
    },

    handleOnHide() {
      this.form.reset()

      this.$emit('closed')
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.proposal-folder-form-modal {
  .modal-content {
    background-color: #f5f5f5;
    box-shadow: none;
    border: 0;
  }
  .modal-body {
    padding: 40px 70px 40px;
  }

  .proposal-folder-form-modal-header {
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

    .proposal-folder-form-modal-title {
      background-color: $primary;
      padding: 5px 40px;
      color: $white;
      border-radius: 5px;
      margin-bottom: 25px;
      font-size: 20px;
    }
  }

  .proposal-name-form {
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
