<template>
  <div>
    <div class="company-detail">
      <span class="personal-info-text">Company details</span>
      <div class="row">
        <b-form
          class="update-companyDetail-form"
          method="POST"
          @submit.prevent="updateCompanyDetail"
          @keydown="form.onKeydown($event)"
        >
          <div class="col-12">
            <h6>
              <span class="company-name">Company name</span>
              <span class="company-industry">Company industry</span>
            </h6>

            <div class="form-group">
              <b-form-input
                v-model="form.companyName"
                type="text"
                class="company"
                autofocusplaceholder="Company Name"
                autocomplete="on"
                required
              />
              <b-form-input
                v-model="form.companyIndustry"
                type="text"
                class="industry"
                autofocusplaceholder="Company Industry"
                autocomplete="on"
                required
              />
            </div>
            <div class="form-group">
              <button type="submit" class="company-update-btn">
                <b-spinner v-if="form.busy" class="mr-1" small />
                <span>Update</span>
              </button>
            </div>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import { UPDATE_COMPANY_DETAILS_MUTATION } from '~/graphql/user/mutations'
export default {
  middleware: 'auth',

  data() {
    return {
      userData: '',
      form: new this.$form({
        companyIndustry: this.$auth.user.companyIndustry,
        companyName: this.$auth.user.companyName,
      }),
    }
  },

  methods: {
    async updateCompanyDetail() {
      this.form.busy = true
      await this.$apollo
        .mutate({
          mutation: UPDATE_COMPANY_DETAILS_MUTATION,
          variables: this.form.data(),
        })
        .then(({ data }) => {
          this.form.busy = false
          this.userData = data
          this.$notify({
            group: 'main',
            type: 'success',
            title: 'successful',
            text: 'Updated successfully',
          })
        })
        .catch(({ graphQLErrors: errors }) => {
          this.form.busy = false
          if (typeof errors !== 'undefined') {
            for (let i = 0; i < errors.length; i++) {
              if (errors[i].message === 'validation') {
                this.form.errors.set(errors[i].extensions.validation)
              } else {
                this.$notify({
                  group: 'main',
                  type: 'error',
                  title: 'Update Failed',
                  text: `${errors[i].message}`,
                })
              }
            }
          }
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.company-detail {
  width: 888px;
  height: 300px;
  top: 717px;
  left: 455px;
  border: 1px #bcfdb5 solid;
  border-radius: 24px;
  margin-top: 70px;
}

.company-name {
  top: 39px;
  left: 48px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  color: #979797;
  position: relative;
}
.company {
  width: 300px;
  height: 43px;
  border-radius: 7px;
  font-size: 18px;
  position: relative;
  display: inline-block;
  top: 60px;
  border: 1px solid #e1e1e1;
  background: #f9f9f9;
  left: 43px;
}
.company-industry {
  width: 129px;
  height: 17px;
  top: 39px;
  left: 356px;
  font-size: 14px;
  font-weight: 600;
  line-height: 16.94px;
  letter-spacing: 0.25px;
  color: #979797;
  position: relative;
}
.industry {
  width: 300px;
  height: 43px;
  left: 153px;
  font-size: 18px;
  display: inline-flex;
  position: relative;
  top: 60px;
  background: #fafafa;
  border: 1px solid #e1e1e1;
  border-radius: 7px;
}
.company-update-btn {
  width: 96px;
  height: 46px;
  border-radius: 7px;
  color: #fff;
  background: #33c442;
  border: 1px #bcfdb5 solid;
  position: relative;
  top: 80px;
  left: 38px;
}

.modal-content {
  background-color: #f5f5f5;
  box-shadow: none;
  border: 0;
}
.modal-body {
  padding: 40px 70px 40px;
}

.update-companyDetail-form-modal-header {
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

  .update-companyDetail-form-modal-title {
    background-color: $primary;
    padding: 5px 40px;
    color: $white;
    border-radius: 5px;
    margin-bottom: 25px;
    font-size: 20px;
  }
}

.update-companyDetail-form {
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
</style>
