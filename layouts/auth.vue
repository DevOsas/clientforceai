<template>
  <div class="auth-row">
    <!-- Left Section - Login/Signup Form -->
    <div class="auth-main">
      <!-- Logo Section -->
      <div class="logo-section">
        <img src="~assets/images/Logo.png" alt="Clientforce" class="logo" />
      </div>

      <div class="main-content">
        <nuxt />
        <notifications group="main" classes="main-notification" />
      </div>
    </div>

    <!-- Right Section - Mockup Image -->
    <div class="auth-aside">
      <img :src="mockupImage" alt="AI Prospecting Platform" class="mockup-image" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',

  computed: {
    mockupImage() {
      // Show different images based on the current route
      if (this.$route.name === 'signup') {
        return require('~/assets/images/signup-image.png')
      }
      // Default to login image
      return require('~/assets/images/login-image.png')
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.auth-row {
  height: 100vh;
  display: flex;
  background: #fff;

  // Left Section - Form
  .auth-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 40px;
    background: #fff;
    overflow: hidden;
    position: relative;

    .logo-section {
      position: absolute;
      top: 40px;
      left: 40px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10;

      .logo {
        width: 50%;
        height: 100%;
      }

     
    }

    .main-content {
      width: 100%;
      max-width: 480px;
      margin: auto;
    }
  }

  // Right Section - Mockup Image
  .auth-aside {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;

    .mockup-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 24px;
      overflow: hidden;
    }
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .auth-row {
    .auth-aside {
      display: none;
    }

    .auth-main {
      flex: 1;
      max-width: 100%;
    }
  }
}

@media (max-width: 768px) {
  .auth-row {
    .auth-main {
      padding: 24px;
    }
  }
}
</style>
