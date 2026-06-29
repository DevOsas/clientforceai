<template>
  <div class="setup-agent-step">
    <div class="step-header">
      <div class="agent-avatar">
        <img :src="avatarPreview" alt="Agent Avatar" />
      </div>
      <h3 class="agent-title">{{ agentName || 'New ForceAgent 1' }}</h3>
    </div>

    <b-form @submit.prevent="handleNext">
      <b-row class="mb-4">
        <b-col md="6">
          <b-form-group label="Agent Name" label-for="agent-name">
            <b-form-input
              id="agent-name"
              v-model="agentName"
              placeholder="New Force Agent"
              class="custom-input agent-name-input"
              required
            />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group label="Avatar" label-for="avatar">
            <input
              ref="avatarInput"
              type="file"
              accept="image/jpeg,image/png"
              style="display: none"
              @change="handleAvatarUpload"
            />
            <div class="avatar-upload justify-content-between">
              <b-button variant="outline-none" size="sm" class="upload-btn" @click="$refs.avatarInput.click()">
                <SvgIcon name="upload" class="mr-2" />
                Upload Avatar
              </b-button>
              <b-button variant="light" size="sm" class="mr-2" @click="useDefaultAvatar">
                Use Default
              </b-button>
            </div>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="mb-4">
        <b-col md="6">
          <b-form-group label="Campaign Name" label-for="campaign-name">
            <b-form-input
              id="campaign-name"
              v-model="campaignName"
              placeholder="Campaign Name"
              class="custom-input"
              required
            />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group label="Agent Tone" label-for="agent-tone">
            <CustomSelect
              v-model="agentTone"
              :options="toneOptions"
              placeholder="Select tone"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <b-form-group label="Voice Persona" label-for="voice-persona">
            <CustomSelect
              v-model="voicePersona"
              :options="personaOptions"
              placeholder="Select persona"
            />
          </b-form-group>
        </b-col>

        <b-col md="6">
          <b-form-group label="Role" label-for="role">
            <CustomSelect
              v-model="role"
              :options="roleOptions"
              placeholder="Select role"
            />
          </b-form-group>
        </b-col>
      </b-row>

    
    </b-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CustomSelect from '~/components/CampaignV2/CustomSelect'

export default {
  name: 'SetupAgentStep',

  components: {
    CustomSelect
  },

  data() {
    return {
      toneOptions: ['Friendly', 'Professional', 'Persuasive', 'Conversational', 'Formal'],
      personaOptions: ['Advisor', 'Expert', 'Friend', 'Consultant', 'Coach'],
      roleOptions: ['Sales', 'Marketing', 'Customer Success', 'HR', 'Recruiting', 'Support']
    }
  },

  computed: {
    ...mapState('campaignV2', ['campaign']),
    
    agentName: {
      get() { return this.campaign.agentName },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { agentName: value }) }
    },
    campaignName: {
      get() { return this.campaign.campaignName },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { campaignName: value }) }
    },
    agentTone: {
      get() { return this.campaign.agentTone },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { agentTone: value }) }
    },
    voicePersona: {
      get() { return this.campaign.voicePersona },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { voicePersona: value }) }
    },
    role: {
      get() { return this.campaign.role },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { role: value }) }
    },
    avatarPreview() {
      if (this.campaign.agentAvatar) {
        // If it's a File object, create object URL
        if (this.campaign.agentAvatar instanceof File) {
          return URL.createObjectURL(this.campaign.agentAvatar)
        }
        // If it's already a URL string
        return this.campaign.agentAvatar
      }
      // Default avatar
      return require('@/assets/images/default.png')
    }
  },

  methods: {
    handleNext() {
      // Data is already in store via computed setters
      // Just emit next event
      this.$emit('next')
    },
    
    handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.$notify({
            group: 'main',
            type: 'error',
            text: 'Image size must not exceed 5MB',
          })
          return
        }
        
        // Validate file type
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          this.$notify({
            group: 'main',
            type: 'error',
            text: 'Only JPEG and PNG images are allowed',
          })
          return
        }
        
        // Store file in Vuex
        this.$store.dispatch('campaignV2/updateCampaign', { agentAvatar: file })
      }
    },
    
    useDefaultAvatar() {
      this.$store.dispatch('campaignV2/updateCampaign', { agentAvatar: null })
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.setup-agent-step {
  .step-header {
    background: linear-gradient(135deg, #e6ffef 0%, #e6ffef 100%);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;

    .agent-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;
      border: 3px solid $white;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .agent-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 0;
    }
  }
  .agent-name-input{
    background-color: none !important;
  }
  .custom-input,
  .custom-select {
    border: 2px solid #e5e5e5;
    border-radius: 8px;
    padding: 25px 15px;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    background-color: #f4f4f4;

    &::placeholder {
      color: #2f2f41;
      font-weight: 400;
    }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
  }

  .btn {
    outline: none !important;

    &:focus {
      box-shadow: none !important;
    }
  }

  .avatar-upload {
    display: flex;
    align-items: center;
    background-color: #f4f4f4;
    padding: 6px 0;
    border-radius: 8px;
    border: 2px solid #e5e5e5;



    .upload-btn {
      font-size: 0.85rem;
      padding: 8px 16px;
      border-radius: 6px;
    }

    .btn {
      font-size: 0.85rem;
      padding: 8px 16px;
      border-radius: 6px;
    }
  }

  // .form-actions {
  //   display: flex;
  //   justify-content: space-between;
  //   margin-top: 40px;
  //   padding-top: 20px;
  //   border-top: 1px solid #e5e5e5;

  //   .btn {
  //     padding: 10px 30px;
  //     font-size: 0.95rem;
  //     font-weight: 500;
  //     border-radius: 8px;
  //   }

  //   .next-btn {
  //     background: $primary;
  //     border: none;
  //     display: flex;
  //     align-items: center;

  //     &:hover {
  //       background: darken($primary, 5%);
  //     }

  //     .icon {
  //       font-size: 1rem;
  //     }
  //   }
  // }
}
</style>
