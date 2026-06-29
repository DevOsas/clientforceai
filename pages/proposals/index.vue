<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push({
      name: 'proposals-category',
      params: { category: 'personal' },
    })
  },
}
</script>
