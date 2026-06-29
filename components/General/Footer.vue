<template>
  <footer class="footer">
    <b-container>
      <p class="copyright">
        &copy; {{ new Date().getFullYear() }} Clientforce. Alright reserved.
      </p>
    </b-container>
  </footer>
</template>

<style lang="scss">
@import '~@/assets/scss/variables';

footer.footer {
  padding: 20px 0;
  background-color: lighten($gray-100, 1);

  .copyright {
    margin-bottom: 0;
  }
}
</style>
