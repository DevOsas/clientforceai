<template>
  <div class="color-input-wrap">
    <b-form-input
      :value="value"
      type="text"
      maxlength="7"
      class="color-input-text"
      @input="$emit('input', $event)"
    />
    <div
      class="color-input-color"
      :style="{ backgroundColor: value }"
      @click="$refs.colorPicker.click()"
    >
      <input
        ref="colorPicker"
        :value="value"
        type="color"
        class="color-input-picker"
        @input="handleColorPick"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },

  methods: {
    handleColorPick(e) {
      this.$emit('input', e.target.value)
    },
  },
}
</script>

<style lang="scss">
.color-input-wrap {
  position: relative;

  .color-input-text {
    padding-left: 35px;
  }
  .color-input-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    margin: 5.5px;
    border-radius: 3px;
    box-shadow: inset 0 0 0 1px #0000001a;
  }
  .color-input-picker {
    width: 24px;
    height: 24px;
    visibility: hidden;
  }
}
</style>
