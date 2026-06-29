<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push({
      name: 'templates-category',
      params: { category: 'personal' },
    })
  },
}
</script>
