/**
 * Writing Agent Feature Module
 * 
 * This module provides AI-powered content generation and field filling
 * across the ClientForce application.
 * 
 * Usage:
 * 1. Import and register the FloatingWriterButton component globally
 * 2. Add data-ai-slot attributes to fields you want to target
 * 3. Enable the feature in tenant settings
 */

import FloatingWriterButton from './FloatingWriterButton.vue'
import WriterBus from './writerBus'

export {
  FloatingWriterButton,
  WriterBus
}

export default {
  install(Vue, options = {}) {
    // Register component globally
    Vue.component('FloatingWriterButton', FloatingWriterButton)
    
    // Add to Vue prototype for easy access
    Vue.prototype.$writerBus = WriterBus
    
    // Optional: Add global mixin for writer utilities
    if (options.mixin) {
      Vue.mixin({
        methods: {
          $writerSnapshot() {
            return WriterBus.snapshotAll()
          },
          $writerRestore(snapshot) {
            WriterBus.restoreSnapshot(snapshot)
          }
        }
      })
    }
  }
}
