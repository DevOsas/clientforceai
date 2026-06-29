<template>
  <div class="email-account-select-container">
    <div class="email-account-select" :tabindex="tabindex" @blur="open = false">
      <div class="selected" :class="{ open: open }" @click="open = !open">
        <span class="selected-email">{{ selected.email }}</span>
      </div>
      <div class="items" :class="{ selectHide: !open }">
        <div
          v-for="(account, i) of accounts"
          :key="i"
          class="select-option"
          :class="{ active: (i = selected) }"
          @click="
            selectedEmail(account)
            open = false
            $emit('input', account)
          "
        >
          <span class="selected-email">
            {{ account.email }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    accounts: {
      type: Array,
      required: true,
    },
    default: {
      type: Object,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.accounts.length > 0
        ? this.accounts[0]
        : null,
      open: false,
    }
  },

  mounted() {
    this.$emit('input', this.selected)
    this.$emit('selected', this.selected)
  },

  methods: {
    selectedEmail(account) {
      this.selected = account
      this.$emit('selected', account)
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.email-account-select-container {
  .email-account-select {
    position: relative;
    width: 100%;
    text-align: left;
    outline: none;
    height: 47px;
    line-height: 47px;

    .selected {
      background-color: transparent;
      cursor: pointer;
      user-select: none;

      .open {
        border-bottom: 2px solid $primary;
        box-shadow: 0 3px 30px 20px rgbay(0, 0, 0, 0.2);
      }

      &::after {
        position: absolute;
        content: '';
        top: 22px;
        right: 1em;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-color: $gray-600 transparent transparent transparent;
      }
    }

    .selected-email {
      font-size: 16px;
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .items {
      color: $gray-600;
      overflow-y: hidden;
      position: absolute;
      background-color: $gray-100;
      left: 0;
      right: 0;
      z-index: 1;
      font-size: 20px;
      box-shadow: 0 3px 30px 20px rgba(0, 0, 0, 0.2);

      div {
        color: $gray-600;
        padding-left: 1em;
        cursor: pointer;
        user-select: none;
        font-size: 20px;
        margin: 15px auto;

        &:hover {
          color: $primary;
        }
        &:active {
          background-color: $gray-400;
        }
      }
    }
  }

  .selectHide {
    display: none;
  }
}
</style>
