<template>
  <b-spinner
    :variant="variant"
    :type="type"
    :style="{ width: `${size}rem`, height: `${size}rem` }"
    label="Loading"
  />
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '4',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    type: {
      type: String,
      default: 'border',
    },
  },
}
</script>
