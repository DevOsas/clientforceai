<template>
  <div class="widget-builder">
    <!-- Header -->
    <div class="builder-header">
      <h1 class="builder-title">Widget - Builder</h1>
      <div class="header-actions">
        <button class="save-draft-btn" @click="saveDraft">
          + Save Draft
        </button>
        <button class="publish-btn" @click="publish">
          Publish
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="builder-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Design Tab -->
      <DesignTab v-if="activeTab === 'design'" />

      <!-- Fields Tab -->
      <FieldsTab v-if="activeTab === 'fields'" />

      <!-- Behaviour Tab -->
      <BehaviourTab v-if="activeTab === 'behaviour'" />

      <!-- Routing Tab -->
      <RoutingTab v-if="activeTab === 'routing'" />

      <!-- Scheduling Tab -->
      <SchedulingTab v-if="activeTab === 'scheduling'" />

      <!-- Install & Verify Tab -->
      <InstallVerifyTab v-if="activeTab === 'install'" />
    </div>
  </div>
</template>

<script>
import DesignTab from '@/components/Widget/DesignTab.vue'
import FieldsTab from '@/components/Widget/FieldsTab.vue'
import BehaviourTab from '@/components/Widget/BehaviourTab.vue'
import RoutingTab from '@/components/Widget/RoutingTab.vue'
import SchedulingTab from '@/components/Widget/SchedulingTab.vue'
import InstallVerifyTab from '@/components/Widget/InstallVerifyTab.vue'

export default {
  name: 'WidgetBuilder',

  components: {
    DesignTab,
    FieldsTab,
    BehaviourTab,
    RoutingTab,
    SchedulingTab,
    InstallVerifyTab
  },

  data() {
    return {
      activeTab: 'design',
      tabs: [
        { id: 'design', label: 'Design' },
        { id: 'fields', label: 'Fields' },
        { id: 'behaviour', label: 'Behaviour' },
        { id: 'routing', label: 'Routing' },
        { id: 'scheduling', label: 'Scheduling' },
        { id: 'install', label: 'Install & Verify' }
      ]
    }
  },

  methods: {
    saveDraft() {
      console.log('Saving draft...')
      // TODO: Implement save draft functionality
    },
    publish() {
      console.log('Publishing widget...')
      // TODO: Implement publish functionality
    }
  },

  mounted() {
    console.log('Widget builder mounted')
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.widget-builder {
  background: #fff;
  min-height: calc(100vh - 100px);
  padding: 30px 40px;
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 28px;
  border-bottom: 1px solid $gray-200;

  .builder-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;

    .save-draft-btn {
      padding: 10px 20px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #000;
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      &:active {
        transform: scale(0.98);
      }
    }

    .publish-btn {
      padding: 10px 24px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
      background: #000;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #333;
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }
}

.builder-nav {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e5e5;
  margin-bottom: 32px;

  .nav-tab {
    padding: 16px 24px;
    font-size: 0.95rem;
    font-weight: 500;
    color: #6b7280;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    bottom: -2px;

    &:hover {
      color: #000;
    }

    &.active {
      color: $primary;
      border-bottom-color: $primary;
      font-weight: 600;
    }
  }
}

.tab-content {
  padding: 20px 0;

  p {
    font-size: 1rem;
    color: #6b7280;
  }
}
</style>
