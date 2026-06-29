# Onboarding Modal System - Setup Guide

## Overview
This onboarding system shows modals automatically to new users and persists their completion state across sessions.

## Files Created

1. **`store/onboarding.js`** - Vuex store for onboarding state management
2. **`components/Onboarding/OnboardingContainer.vue`** - Global container for onboarding modals
3. **`components/Onboarding/Modals/NewCampaignV2Modal.vue`** - First onboarding modal (migrated from CampaignV2 folder)

## Files Removed

1. **`components/CampaignV2/NewCampaignV2Modal.vue`** - Moved to Onboarding folder

## Setup Instructions

### Step 1: Add OnboardingContainer to Your Layout

Edit `layouts/dashboard.vue` (or your main layout):

```vue
<template>
  <div class="dashboard-layout">
    <!-- Your existing layout content -->
    <Navbar />
    <Sidebar />
    <main>
      <nuxt />
    </main>

    <!-- Add Onboarding Container -->
    <OnboardingContainer />
  </div>
</template>

<script>
import OnboardingContainer from '@/components/Onboarding/OnboardingContainer.vue'

export default {
  components: {
    OnboardingContainer
  }
}
</script>
```

### Step 2: Initialize Onboarding on Login

In your login page or auth middleware, start onboarding after successful login:

```javascript
// pages/login.vue or middleware/auth.js
async login() {
  // ... your login logic
  
  // After successful login
  await this.$store.dispatch('onboarding/startOnboarding')
  
  // Redirect to dashboard
  this.$router.push('/dashboard')
}
```

### Step 3: Configure Onboarding Steps

Edit `store/onboarding.js` to add your onboarding steps:

```javascript
onboardingSteps: [
  {
    id: 'create-campaign',
    name: 'Create Campaign',
    component: 'NewCampaignV2Modal',
    completed: false,
    required: true
  },
  {
    id: 'setup-email',
    name: 'Setup Email',
    component: 'SetupEmailModal',  // Create this modal
    completed: false,
    required: true
  },
  // Add more steps...
]
```

### Step 4: Create Additional Onboarding Modals

Create new modals in `components/Onboarding/Modals/`:

```vue
<!-- components/Onboarding/Modals/SetupEmailModal.vue -->
<template>
  <div class="onboarding-modal">
    <div class="modal-card">
      <!-- Your modal content -->
      
      <div class="modal-footer">
        <b-button @click="$emit('skip')">Skip</b-button>
        <b-button @click="handleComplete">Continue</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleComplete() {
      // Emit complete event with data
      this.$emit('complete', { /* your data */ })
    }
  }
}
</script>
```

## How It Works

### 1. **Auto-Show on Login**
- When user logs in, `startOnboarding()` is called
- System checks localStorage for completed steps
- Shows first incomplete required step

### 2. **Persistence**
- Completed steps saved to localStorage
- Can also save to backend API (see store actions)
- State persists across browser sessions

### 3. **Modal Flow**
- User fills modal → clicks "Continue" → `@complete` event
- System marks step complete, saves state, shows next modal
- User clicks "Skip" → `@skip` event → modal closes but will reappear next time
- All steps completed → modals stop appearing

### 4. **Backdrop Blur**
- CSS `backdrop-filter: blur(8px)` on backdrop
- Semi-transparent background
- Prevents interaction with page behind

## API Integration (Optional)

To save onboarding state to backend:

```javascript
// In store/onboarding.js actions

async saveOnboardingState({ state }) {
  await this.$apollo.mutate({
    mutation: gql`
      mutation UpdateOnboardingStatus($completedSteps: [String!]!) {
        updateUserOnboardingStatus(completedSteps: $completedSteps) {
          success
        }
      }
    `,
    variables: {
      completedSteps: state.completedSteps
    }
  })
}

async loadOnboardingState({ commit }) {
  const { data } = await this.$apollo.query({
    query: gql`
      query GetOnboardingStatus {
        currentUser {
          onboardingCompletedSteps
        }
      }
    `
  })
  commit('SET_COMPLETED_STEPS', data.currentUser.onboardingCompletedSteps)
}
```

## Testing

### Test Onboarding Flow
```javascript
// In browser console
$nuxt.$store.dispatch('onboarding/resetOnboarding')
$nuxt.$store.dispatch('onboarding/startOnboarding')
```

### Check Completion State
```javascript
// In browser console
$nuxt.$store.getters['onboarding/isOnboardingComplete']
$nuxt.$store.state.onboarding.completedSteps
```

### Force Show Specific Step
```javascript
// In browser console
$nuxt.$store.commit('onboarding/SET_CURRENT_STEP', 'create-campaign')
$nuxt.$store.commit('onboarding/SET_ONBOARDING_ACTIVE', true)
```

## Customization

### Hide Progress Bar
```vue
<!-- In OnboardingContainer.vue -->
<data>
  return {
    showProgress: false  // Set to false
  }
</data>
```

### Prevent Closing on Backdrop Click
```vue
<!-- In OnboardingContainer.vue -->
<methods>
  handleBackdropClick() {
    // Comment out or remove this line
    // this.closeOnboarding()
  }
</methods>
```

### Change Blur Amount
```scss
/* In OnboardingContainer.vue */
.onboarding-backdrop {
  backdrop-filter: blur(12px);  /* Increase blur */
}
```

## Next Steps

1. ✅ Add OnboardingContainer to your layout
2. ✅ Create your onboarding modal designs
3. ✅ Configure onboarding steps in store
4. ✅ Test the flow
5. ✅ (Optional) Integrate with backend API

Send me the designs for the remaining modals and I'll help you implement them!
