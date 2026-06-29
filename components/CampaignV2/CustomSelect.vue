<template>
  <div class="custom-select-wrapper" v-click-outside="closeDropdown">
    <div 
      class="custom-select-trigger" 
      :class="{ 'open': isOpen, 'has-value': value }"
      @click="toggleDropdown"
    >
      <span class="selected-text">{{ displayText }}</span>
      <SvgIcon name="chevron-down-alt-2" class="chevron-icon" />
    </div>
    
    <transition name="dropdown">
      <div v-if="isOpen" class="custom-select-dropdown">
        <div 
          v-for="option in options" 
          :key="option"
          class="dropdown-item"
          :class="{ 'selected': value === option }"
          @click="selectOption(option)"
        >
          <span>{{ option }}</span>
          <SvgIcon v-if="value === option" name="check" class="check-icon" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CustomSelect',
  
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Select an option'
    }
  },
  
  data() {
    return {
      isOpen: false
    }
  },
  
  computed: {
    displayText() {
      return this.value || this.placeholder
    }
  },
  
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    
    closeDropdown() {
      this.isOpen = false
    },
    
    selectOption(option) {
      this.$emit('input', option)
      this.closeDropdown()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.custom-select-wrapper {
  position: relative;
  width: 100%;
}

.custom-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
   border: 2px solid #e5e5e5;
    border-radius: 8px;
    padding: 14px 15px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background-color: #f4f4f4;
  
  .selected-text {
    color: #9ca3af;
    font-weight: 400;
  }
  
  &.has-value .selected-text {
    color: #2f2f41;
    font-weight: 400;
  }
  
  .chevron-icon {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
    color: #6b7280;
  }
  
  &.open {
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
    
    .chevron-icon {
      transform: rotate(180deg);
    }
  }
  
  &:hover:not(.open) {
    border-color: #d1d5db;
  }
}

.custom-select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 3px;
    
    &:hover {
      background: #b0b0b0;
    }
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.9rem;
  color: #2f2f41;
  
  .check-icon {
    width: 16px;
    height: 16px;
    color: $primary;
  }
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &.selected {
    background-color: rgba($primary, 0.05);
    color: $primary;
    font-weight: 600;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
