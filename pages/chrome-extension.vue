<template>
  <div class="chrome-extension-page">
    <b-container>
      <div class="page-row">
        <div class="page-content">
          <div class="icon-wrapper">
            <SvgIcon name="chrome-plain" />
          </div>
          <h1 class="page-title">
            Find emails with the Clientforce<br />
            Chrome Extension
          </h1>

          <ChromeExtensionAccordions />

          <div class="mt-4">
            <b-button variant="primary" class="px-5">
              <SvgIcon name="chrome-plain" />
              Install Chrome Extension
            </b-button>
          </div>
        </div>
        <div class="page-image">
          <img src="@/assets/images/chrome-extension.jpg" alt="" />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import ChromeExtensionAccordions from '~/components/ChromeExtension/ChromeExtensionAccordions'

export default {
  components: { ChromeExtensionAccordions },

  middleware: 'auth',
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.chrome-extension-page {
  margin-top: 70px;
  margin-bottom: 40px;
  min-height: 72vh;

  .page-row {
    display: flex;

    .page-content {
      width: 450px;

      .icon-wrapper {
        margin-bottom: 20px;
        .icon {
          font-size: 2.2rem;
          color: $gray-700;
        }
      }

      .page-title {
        font-size: 1.7rem;
        color: $gray-800;
        line-height: 1.4;
      }
    }

    .page-image {
      align-self: flex-start;
      width: 720px;
      margin-left: auto;
      transition: all 0.3s ease-in;

      > img {
        display: flex;
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: all 0.3s ease-in;
      }
    }
  }
}
</style>
