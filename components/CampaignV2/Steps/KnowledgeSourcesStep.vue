<template>
  <div class="knowledge-sources-step">
    <!-- Tabs -->
    <div v-if="showTabs" class="tabs-header">
      
      <button
        class="tab-button"
        :class="{ active: internalActiveTab === 'description' }"
        @click="internalActiveTab = 'description'"
      >
        Business Description
      </button>
      <button
        class="tab-button"
        :class="{ active: internalActiveTab === 'files' }"
        @click="internalActiveTab = 'files'"
      >
        Add Files/links
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Add Files/Links Tab -->
      <div v-if="currentTab === 'files'" class="files-tab">
        <div class="content-grid">
          <!-- Left: Upload Documents -->
          <div class="upload-section">
            <div class="section-header">
              <h4>Upload Documents</h4>
              <p class="text-muted">PDFs, Docs, FAQ, Guides</p>
            </div>

            <div
              class="dropzone"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              :class="{ dragging: isDragging }"
            >
              <SvgIcon name="doc" class="upload-icon" />
              <p class="dropzone-text">Drag & Drop your files</p>
              <p class="dropzone-subtext">Max file size: 200MB</p>
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                style="display: none"
              />
              <button class="browse-button" @click="$refs.fileInput.click()">
                Browse Files
              </button>
            </div>

            <!-- Uploaded Files List -->
            <div v-if="uploadedFiles.length > 0 || existingDocuments.length > 0" class="uploaded-files">
              <h5>Uploaded files</h5>
              
              <!-- Existing Documents -->
              <div
                v-for="doc in existingDocuments"
                :key="'doc-' + doc.id"
                class="file-item"
                :class="{ 'has-error': doc.status === 'failed' }"
              >
                <input
                  type="checkbox"
                  :checked="doc.isSelected"
                  @change="toggleSelection(doc.id, $event.target.checked)"
                  class="doc-checkbox"
                  :disabled="doc.status !== 'indexed'"
                />
                <div class="file-info">
                  <SvgIcon name="file" class="file-icon" />
                  <div class="file-details">
                    <p class="file-name">{{ doc.title }}</p>
                    <p class="file-meta">
                      {{ formatFileSize(doc.fileSize) }}
                      <span v-if="doc.status === 'indexed' && doc.openaiFileId" class="status-badge success">
                        ✓ In Vector Store
                      </span>
                      <span v-else-if="doc.status === 'indexed' && !doc.openaiFileId" class="status-badge warning">
                        ⚠️ Indexed (not uploaded)
                      </span>
                      <span v-else-if="doc.status === 'processing'" class="status-badge processing">
                        ⏳ {{ doc.processingStage || 'Processing...' }} ({{ doc.progress || 0 }}%)
                      </span>
                      <span v-else-if="doc.status === 'ready'" class="status-badge ready">
                        ⏳ Queued
                      </span>
                      <span v-else-if="doc.status === 'failed'" class="status-badge error">
                        ❌ Failed
                      </span>
                    </p>
                    <!-- Progress bar for processing documents -->
                    <div v-if="doc.status === 'processing'" class="progress-bar">
                      <div class="progress-fill" :style="{ width: (doc.progress || 0) + '%' }"></div>
                    </div>
                    <p v-if="doc.errorMessage" class="error-message">
                      {{ doc.errorMessage }}
                    </p>
                  </div>
                </div>
                <div class="file-actions">
                  <button
                    v-if="doc.status === 'failed'"
                    class="retry-btn"
                    @click="retryDocument(doc.id)"
                    title="Retry processing"
                  >
                    ↻
                  </button>
                  <button
                    class="remove-btn"
                    @click="removeDocument(doc.id)"
                    :disabled="deletingDocuments.includes(doc.id)"
                  >
                    <SvgIcon name="close" />
                  </button>
                </div>
              </div>
              
              <!-- Uploading Files -->
              <div
                v-for="(file, index) in uploadedFiles"
                :key="'upload-' + index"
                class="file-item"
              >
                <div class="file-info">
                  <SvgIcon name="file" class="file-icon" />
                  <div class="file-details">
                    <p class="file-name">{{ file.name }}</p>
                    <p class="file-meta">{{ file.size }} • {{ file.timeLeft }}</p>
                  </div>
                </div>
                <button class="remove-btn" @click="removeFile(index)">
                  <SvgIcon name="close" />
                </button>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: file.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Add URLs -->
          <div class="url-section">
            <div class="section-header">
              <h4>Add website of page URLs</h4>
            </div>

            <div class="url-input-group">
              <input
                v-model="urlInput"
                type="text"
                class="url-input"
                placeholder="https://clientforceal.com/index/FAQ"
                @keyup.enter="addUrl"
              />
              <button class="add-url-btn" @click="addUrl" :disabled="!urlInput.trim()">
                + Add URL
              </button>
            </div>

            <!-- Added URLs List -->
            <div v-if="addedUrls.length > 0" class="url-list">
              <div
                v-for="(url, index) in addedUrls"
                :key="index"
                class="url-item"
              >
                <span class="url-text" :title="url">{{ truncateUrl(url) }}</span>
                <button class="remove-url-btn" @click="removeUrl(index)">
                  <SvgIcon name="close" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Business Description Tab -->
      <div v-if="currentTab === 'description'" class="description-tab">
        <div class="content-grid">
          <!-- Left: Describe Business -->
          <div class="describe-section">
            <div class="section-header">
              <h4>Describe your business</h4>
              <p class="text-muted">In your own words tell the agent what you sell.</p>
            </div>

            <textarea
              v-model="businessDescription"
              class="business-textarea"
              placeholder="Example: We help small businesses automate their sales outreach using AI."
              rows="6"
              @blur="saveBusinessInfo"
            ></textarea>

            <div class="connect-sources">
              <h5>Connect external sources</h5>

              <div class="source-item">
                <div class="source-info">
                  <div class="source-icon notion">
                    <SvgIcon name="notion" size="lg" />
                  </div>
                  <span class="source-name">Connect Notion</span>
                </div>
                <button class="connect-btn">+ Connect</button>
              </div>

              <div class="source-item">
                <div class="source-info">
                  <div class="source-icon google-drive">
                    <SvgIcon name="drive" size="lg" />
                  </div>
                  <span class="source-name">Connect Google drive</span>
                </div>
                <button class="connect-btn">+ Connect</button>
              </div>
            </div>
          </div>

          <!-- Right: Keyphrases, Industry, Brand Tone -->
          <div class="metadata-section">
            <div class="form-group">
              <label>Business Name</label>
              <input
                v-model="businessName"
                type="text"
                class="form-input"
                placeholder="Business Name"
                @blur="saveBusinessInfo"
              />
            </div>

            <div class="form-group">
              <label>Industry</label>
              <input
                v-model="industry"
                type="text"
                class="form-input"
                placeholder="(e.g., real estate, beauty, SaaS, education, etc.)"
                @blur="saveBusinessInfo"
              />
            </div> 

            <div class="form-group">
              <label>Logo (optional) for branded messages</label>
              <input
                ref="logoInput"
                type="file"
                accept="image/jpeg,image/png,image/svg+xml"
                style="display: none"
                @change="handleLogoUpload"
              />
              <div class="logo-upload-wrapper">
                <div v-if="logoPreview" class="logo-preview">
                  <img :src="logoPreview" alt="Brand Logo" />
                </div>
                <button type="button" class="upload-logo-btn" @click="$refs.logoInput.click()">
                  <SvgIcon name="upload" class="mr-2" />
                  {{ logoPreview ? 'Change Logo' : 'Upload Logo' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'KnowledgeSourcesStep',
  props: {
    showTabs: {
      type: Boolean,
      default: true
    },
    activeTab: {
      type: String,
      default: 'description'
    }
  },
  data() {
    return {
      internalActiveTab: this.activeTab,
      isDragging: false,
      urlInput: '',
      uploadedFiles: [],
      addedUrls: [],
      existingDocuments: [],
      loadingDocuments: false,
      deletingDocuments: [],
      pollIntervalId: null
    }
  },

  mounted() {
    // Fetch existing documents when component mounts
    this.fetchExistingDocuments()
    this.startPolling()
  },

  beforeDestroy() {
    this.stopPolling()
  },

  computed: {
    ...mapState('campaignV2', ['campaign']),

    currentTab() {
      return this.showTabs ? this.internalActiveTab : this.activeTab
    },

    businessName: {
      get() { return this.campaign.businessName },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { businessName: value }) }
    },
    industry: {
      get() { return this.campaign.industry },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { industry: value }) }
    },
    businessDescription: {
      get() { return this.campaign.businessDescription },
      set(value) { this.$store.dispatch('campaignV2/updateCampaign', { businessDescription: value }) }
    },
    logoPreview() {
      if (this.campaign.brandLogo) {
        if (this.campaign.brandLogo instanceof File) {
          return URL.createObjectURL(this.campaign.brandLogo)
        }
        return this.campaign.brandLogo
      }
      return null
    }
  },

  methods: {
    getAuthToken() {
      try {
        // Try Nuxt Auth stored token
        const strategyName = this.$auth?.strategy?.name || 'local'
        let tok = null
        if (this.$auth?.getToken) {
          tok = this.$auth.getToken(strategyName) || this.$auth.getToken('local') || this.$auth.getToken('default')
        }
        // Try Apollo Helpers
        if (!tok && this.$apolloHelpers?.getToken) {
          tok = this.$apolloHelpers.getToken()
        }
        // Try common localStorage keys
        if (!tok && typeof window !== 'undefined' && window.localStorage) {
          tok = localStorage.getItem('apollo-token') || localStorage.getItem(`auth._token.${strategyName}`) || localStorage.getItem('auth._token.local')
        }
        if (!tok) return null
        const clean = String(tok).startsWith('Bearer ') ? String(tok).replace(/^Bearer\s+/i, '') : String(tok)
        return `Bearer ${clean}`
      } catch (e) {
        return null
      }
    },
    async fetchExistingDocuments(showLoading = true) {
      try {
        const agentInstanceId = this.$store.state.campaignV2.campaign.agentInstanceId
        
        if (!agentInstanceId) {
          return
        }

        if (showLoading) {
          this.loadingDocuments = true
        }

        const { data } = await this.$apollo.query({
          query: require('~/graphql/campaignV2/queries').GET_AGENT_DOCUMENTS,
          variables: { agentInstanceId },
          fetchPolicy: 'network-only', // Always fetch fresh data
        })

        this.existingDocuments = data.getAgentDocuments || []

        const hasPending = this.existingDocuments.some(doc =>
          doc.status === 'processing' || doc.status === 'ready'
        )

        if (hasPending) {
          this.startPolling()
        } else {
          this.stopPolling()
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        if (showLoading) {
          this.loadingDocuments = false
        }
      }
    },

    formatFileSize(bytes) {
      if (!bytes) return '0 B'
      const mb = bytes / (1024 * 1024)
      if (mb >= 1) {
        return `${mb.toFixed(2)} MB`
      }
      const kb = bytes / 1024
      return `${kb.toFixed(2)} KB`
    },

    async removeDocument(documentId) {
      if (!confirm('Are you sure you want to delete this document? This will remove it from the knowledge base.')) {
        return
      }

      try {
        this.deletingDocuments.push(documentId)

        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').DELETE_KNOWLEDGE_DOCUMENT,
          variables: { documentId },
        })

        this.$toast.success('Document deleted successfully')
        
        // Refresh the list
        await this.fetchExistingDocuments()
      } catch (error) {
        console.error('Delete error:', error)
        this.$toast.error(error.message || 'Failed to delete document')
      } finally {
        this.deletingDocuments = this.deletingDocuments.filter(id => id !== documentId)
      }
    },

    async retryDocument(documentId) {
      try {
        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').RETRY_DOCUMENT_PROCESSING,
          variables: { documentId },
        })
        
        this.$toast.success('Retrying document processing...')
        
        // Refresh list
        await this.fetchExistingDocuments()
      } catch (error) {
        console.error('Retry error:', error)
        this.$toast.error('Failed to retry processing')
      }
    },

    async toggleSelection(documentId, isSelected) {
      try {
        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').TOGGLE_DOCUMENT_SELECTION,
          variables: { documentId, isSelected },
        })
        
        // Update local state
        const doc = this.existingDocuments.find(d => d.id === documentId)
        if (doc) {
          doc.isSelected = isSelected
        }
        
        this.$toast.success(isSelected ? 'Document selected' : 'Document deselected')
      } catch (error) {
        console.error('Toggle selection error:', error)
        this.$toast.error('Failed to update selection')
      }
    },
    handleFileDrop(e) {
      this.isDragging = false
      const files = Array.from(e.dataTransfer.files)
      this.processFiles(files)
    },

    handleFileSelect(e) {
      const files = Array.from(e.target.files)
      this.processFiles(files)
    },

    async processFiles(files) {
      for (const file of files) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
        const fileObj = {
          name: file.name,
          size: `${sizeInMB}MB`,
          progress: 0,
          timeLeft: 'Preparing...',
          file: file,
        }
        this.uploadedFiles.push(fileObj)

        // Real upload with presigned URL
        await this.uploadFile(fileObj)
      }
    },

    async uploadFile(fileObj) {
      try {
        const agentInstanceId = this.$store.state.campaignV2.campaign.agentInstanceId
        
        if (!agentInstanceId) {
          throw new Error('Agent instance not created yet')
        }

        fileObj.timeLeft = 'Uploading...'

        // Create FormData for multipart upload
        const formData = new FormData()
        formData.append('file', fileObj.file)
        formData.append('agent_instance_id', agentInstanceId)
        formData.append('purpose', 'rag')

        // Upload via backend API (not presigned URL)
        const apiRoot = this.$config.APIRoot || 'http://localhost:8000'
        
        // Get token - robust
        const bearer = this.getAuthToken()
        if (!bearer) {
          throw new Error('Authentication required')
        }

        const xhr = new XMLHttpRequest()
        xhr.withCredentials = true
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            fileObj.progress = Math.round((e.loaded / e.total) * 100)
            const secsLeft = Math.ceil((100 - fileObj.progress) / 20)
            fileObj.timeLeft = `${secsLeft} secs left`
          }
        })

        xhr.addEventListener('load', async () => {
          if (xhr.status === 200 || xhr.status === 201) {
            const response = JSON.parse(xhr.responseText)
            
            fileObj.progress = 100
            fileObj.timeLeft = 'Complete'
            fileObj.documentId = response.id

            // Save to store
            this.$store.dispatch('campaignV2/updateCampaign', {
              knowledgeFiles: [...this.uploadedFiles],
            })

            // Refresh document list
            await this.fetchExistingDocuments()
            
            this.$toast.success('File uploaded successfully')
          } else {
            let errorMessage = 'Upload failed'
            try {
              const errorResponse = JSON.parse(xhr.responseText)
              errorMessage = errorResponse.error || errorResponse.message || errorMessage
            } catch (e) {
              errorMessage = xhr.responseText || errorMessage
            }
            throw new Error(errorMessage)
          }
        })

        xhr.addEventListener('error', () => {
          fileObj.timeLeft = 'Failed'
          fileObj.progress = 0
          this.$toast.error('Upload failed - network error')
        })

        xhr.open('POST', `${apiRoot}/api/agent/documents/upload`)
        xhr.setRequestHeader('Authorization', bearer)
        // Don't set Content-Type - browser will set it with boundary for multipart
        
        xhr.send(formData)
      } catch (error) {
        console.error('Upload error:', error)
        fileObj.timeLeft = 'Failed'
        fileObj.progress = 0
        this.$toast.error((error && error.message) || 'Upload failed')
      }
    },

    async saveBusinessInfo() {
      try {
        const agentInstanceId = this.$store.state.campaignV2.campaign.agentInstanceId
        if (!agentInstanceId) {
          console.log('⚠️ No agent instance ID, skipping business info save')
          return
        }

        const variables = {
          agentInstanceId,
          businessName: this.businessName || '',
          description: this.businessDescription || '',
          keyphrases: this.keyphrases || '',
          industry: this.industry || '',
          brandTone: this.brandTone || '',
          brandContext: this.brandContext || '',
        }

        console.log('💾 Saving business info:', {
          businessName: variables.businessName,
          industry: variables.industry,
          descriptionLength: variables.description.length,
        })

        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').SAVE_BUSINESS_DESCRIPTION,
          variables,
        })

        console.log('✅ Business info saved successfully')
      } catch (e) {
        console.error('❌ Save business info error:', e)
        throw e // Re-throw so parent can handle
      }
    },

    removeFile(index) {
      this.uploadedFiles.splice(index, 1)
      
      // Update store after removal
      this.$store.dispatch('campaignV2/updateCampaign', { 
        knowledgeFiles: [...this.uploadedFiles],
      })
    },

    async addUrl() {
      const raw = this.urlInput
      if (!raw || !raw.trim()) return

      try {
        const agentInstanceId = this.$store.state.campaignV2.campaign.agentInstanceId
        if (!agentInstanceId) {
          throw new Error('Agent instance not created yet')
        }

        const normalized = this.normalizeUrl(raw)
        if (!normalized) {
          this.$toast.error('Please enter a valid URL (e.g., https://example.com)')
          return
        }

        await this.$apollo.mutate({
          mutation: require('~/graphql/campaignV2/mutations').ADD_KNOWLEDGE_URL,
          variables: {
            agentInstanceId: agentInstanceId,
            url: normalized,
          },
        })

        await this.fetchExistingDocuments()

        this.addedUrls.push(normalized)
        this.urlInput = ''

        this.$store.dispatch('campaignV2/updateCampaign', { 
          knowledgeUrls: [...this.addedUrls] 
        })

        this.$toast.success('URL added successfully')
      } catch (error) {
        console.error('Add URL error:', error)
        this.$toast.error(error.message || 'Failed to add URL')
      }
    },

    handleLogoUpload(e) {
      const file = e.target.files[0]
      if (!file) return

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        this.$notify({
          group: 'main',
          type: 'error',
          text: 'Only JPEG, PNG, and SVG images are allowed',
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.$notify({
          group: 'main',
          type: 'error',
          text: 'Logo file size must be less than 5MB',
        })
        return
      }

      // Store file in Vuex
      this.$store.dispatch('campaignV2/updateCampaign', { brandLogo: file })
    },

    removeUrl(index) {
      this.addedUrls.splice(index, 1)
      
      // Update store after removal
      this.$store.dispatch('campaignV2/updateCampaign', {
        knowledgeUrls: [...this.addedUrls],
      })
    },

    truncateUrl(url, maxLength = 60) {
      if (!url) return ''
      if (url.length <= maxLength) return url
      try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname
        const path = (urlObj.pathname || '') + (urlObj.search || '')
        const full = `${urlObj.protocol}//${domain}${path}`
        if (full.length <= maxLength) return full
        const available = maxLength - (urlObj.protocol.length + 2) - domain.length - 3
        if (available > 10) {
          return `${urlObj.protocol}//${domain}${path.substring(0, available)}...`
        }
      } catch (e) {
        // fall through to plain truncate
      }
      return url.substring(0, maxLength - 3) + '...'
    },

    normalizeUrl(input) {
      const value = (input || '').trim()
      if (!value) return ''
      try {
        return new URL(value).toString()
      } catch (e1) {
        try {
          return new URL(`https://${value}`).toString()
        } catch (e2) {
          return ''
        }
      }
    },

    startPolling() {
      // Clear any existing polling interval
      this.stopPolling()
      
      // Poll every 3 seconds to check document status
      this.pollIntervalId = setInterval(() => {
        this.fetchExistingDocuments(false) // false = don't show loading spinner
      }, 3000)
    },

    stopPolling() {
      if (this.pollIntervalId) {
        clearInterval(this.pollIntervalId)
        this.pollIntervalId = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.knowledge-sources-step {
  padding: 20px 0;

  .tabs-header {
    display: flex;
    gap: 0;
    border-bottom: 2px solid #e5e5e5;
    margin-bottom: 30px;

    .tab-button {
      padding: 12px 24px;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      font-size: 0.95rem;
      font-weight: 500;
      color: $gray-600;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
      margin-bottom: -2px;

      &.active {
        color: $primary;
        border-bottom-color: $primary;
      }

      &:hover:not(.active) {
        color: $gray-800;
      }
    }
  }

  .tab-content {
    .files-tab {
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;

        .section-header {
          margin-bottom: 20px;

          h4 {
            font-size: 1.1rem;
            font-weight: 600;
            color: $gray-800;
            margin-bottom: 5px;
          }

          p {
            font-size: 0.9rem;
            color: $gray-500;
            margin: 0;
          }
        }

        // Upload Section
        .upload-section {
          .dropzone {
            border: 2px dashed #a6c88f;
            border-radius: 12px;
            padding: 20px 40px;
            text-align: center;
            background: #fafafa;
            transition: all 0.3s ease;
            cursor: pointer;

            &.dragging {
              border-color: $primary;
              background: rgba($primary, 0.05);
            }

            .upload-icon {
              font-size: 3rem;
              color: $primary;
              margin-bottom: 15px;

              svg {
                fill: none !important;
                stroke: currentColor !important;

                * {
                  fill: none !important;
                  stroke: currentColor !important;
                }
              }
            }

            .dropzone-text {
              font-size: 1rem;
              font-weight: 500;
              color: $gray-800;
              margin-bottom: 5px;
            }

            .dropzone-subtext {
              font-size: 0.85rem;
              color: $gray-500;
              margin-bottom: 20px;
            }

            .browse-button {
              padding: 10px 24px;
              background: transparent;
              border: 1px solid $gray-400;
              border-radius: 8px;
              color: $gray-700;
              font-size: 0.9rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;

              &:hover {
                background: $gray-100;
                border-color: $gray-500;
              }
            }
          }

          .uploaded-files {
            margin-top: 30px;

            h5 {
              font-size: 1rem;
              font-weight: 600;
              color: $gray-800;
              margin-bottom: 15px;
            }

            .file-item {
              background: $white;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 12px;
              position: relative;
              display: flex;
              align-items: flex-start;
              gap: 12px;

              .doc-checkbox {
                margin-top: 20px;
                width: 18px;
                height: 18px;
                cursor: pointer;
                flex-shrink: 0;

                &:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                }
              }

              .file-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 10px;

                .file-icon {
                  font-size: 1.8rem;
                  color: $primary;

                  svg {
                    fill: none !important;
                    stroke: currentColor !important;

                    * {
                      fill: none !important;
                      stroke: currentColor !important;
                    }
                  }
                }

                .file-details {
                  flex: 1;

                  .file-name {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: $gray-800;
                    margin: 0 0 3px 0;
                  }

                  .file-meta {
                    font-size: 0.85rem;
                    color: $gray-500;
                    margin: 0;
                  }
                }
              }

              &.has-error {
                border-color: #ff4444;
                background: #fff5f5;
              }

              .file-actions {
                position: absolute;
                top: 15px;
                right: 15px;
                display: flex;
                gap: 8px;
              }

              .retry-btn {
                background: #ffa500;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                padding: 6px 10px;
                font-size: 1rem;
                transition: all 0.2s ease;

                &:hover {
                  background: #ff8c00;
                }
              }

              .remove-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                color: $gray-400;
                padding: 4px;
                transition: all 0.2s ease;

                &:hover {
                  color: $gray-700;
                }

                &:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                }

                .icon {
                  font-size: 1.2rem;
                }
              }

              .status-badge {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 500;
                margin-left: 8px;

                &.success {
                  background: #d4edda;
                  color: #155724;
                }

                &.warning {
                  background: #fff3cd;
                  color: #856404;
                }

                &.processing {
                  background: #cfe2ff;
                  color: #084298;
                }

                &.ready {
                  background: #d1ecf1;
                  color: #0c5460;
                }

                &.error {
                  background: #f8d7da;
                  color: #721c24;
                }
              }

              .error-message {
                font-size: 0.8rem;
                color: #dc3545;
                margin: 5px 0 0 0;
                padding: 5px 10px;
                background: #fff5f5;
                border-radius: 4px;
              }

              .progress-bar {
                width: 100%;
                height: 4px;
                background: #e5e5e5;
                border-radius: 2px;
                overflow: hidden;

                .progress-fill {
                  height: 100%;
                  background: $primary;
                  transition: width 0.3s ease;
                }
              }
            }
          }
        }

        // URL Section
        .url-section {
          .url-input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;

            .url-input {
              flex: 1;
              padding: 12px 16px;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              font-size: 0.9rem;
              outline: none;
              transition: all 0.2s ease;

              &:focus {
                border-color: $primary;
                box-shadow: 0 0 0 3px rgba($primary, 0.1);
              }

              &::placeholder {
                color: $gray-500;
              }
            }

            .add-url-btn {
              padding: 12px 20px;
              background: transparent;
              border: 1px solid $gray-600;
              border-radius: 8px;
              color: $gray-800;
              font-size: 0.9rem;
              font-weight: 500;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s ease;

              &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }

              &:hover:not(:disabled) {
                background: $gray-100;
                border-color: $gray-500;
              }
            }
          }

          .url-list {
            .url-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 16px;
              background: #f3f2fe;
              border-radius: 8px;
              margin-bottom: 10px;

              .url-text {
                font-size: 0.9rem;
                color: #7e70f4;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: break-all;
                cursor: help;
              }

              .remove-url-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                color: $gray-400;
                padding: 4px;
                margin-left: 10px;
                transition: all 0.2s ease;

                &:hover {
                  color: $gray-700;
                }

                .icon {
                  font-size: 1.2rem;
                }
              }
            }
          }
        }
      }
    }

    .description-tab {
      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;

        .section-header {
          margin-bottom: 20px;

          h4 {
            font-size: 1.1rem;
            font-weight: 600;
            color: $gray-800;
            margin-bottom: 5px;
          }

          p {
            font-size: 0.9rem;
            color: $gray-500;
            margin: 0;
          }
        }

        // Left: Describe Business
        .describe-section {
          .business-textarea {
            width: 100%;
            padding: 16px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            font-size: 0.9rem;
            font-family: inherit;
            resize: vertical;
            outline: none;
            transition: all 0.2s ease;
            margin-bottom: 30px;

            &:focus {
              border-color: $primary;
              box-shadow: 0 0 0 3px rgba($primary, 0.1);
            }

            &::placeholder {
              color: $gray-400;
            }
          }

          .connect-sources {
            h5 {
              font-size: 1rem;
              font-weight: 600;
              color: $gray-800;
              margin-bottom: 15px;
            }

            .source-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 16px;
              background: $white;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              margin-bottom: 12px;

              .source-info {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px;

                .source-icon {
                  // width: 40px;
                  // height: 40px;
                  border-radius: 8px;
                  border: 1px solid $gray-100;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1.2rem;

                  &.notion {
                    // background: #f5f5f5;
                    color: $gray-700;
                  }

                  &.google-drive {
                    // background: #fef3e8;
                    color: #f4b400;
                  }

                  svg {
                    fill: none !important;
                    stroke: currentColor !important;

                    * {
                      fill: none !important;
                      stroke: currentColor !important;
                    }
                  }
                }

                .source-name {
                  font-size: 0.95rem;
                  font-weight: 500;
                  color: $gray-800;
                }
              }

              .connect-btn {
                padding: 8px 20px;
                background: transparent;
                border: 1px solid $gray-600;
                border-radius: 8px;
                color: $gray-800;
                font-size: 0.9rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                  background: $gray-100;
                  border-color: $gray-700;
                }
              }
            }
          }
        }

        // Right: Metadata
        .metadata-section {
          .form-group {
            margin-bottom: 25px;

            label {
              display: block;
              font-size: 0.95rem;
              font-weight: 600;
              color: $gray-800;
              margin-bottom: 8px;
            }

            .field-description {
              font-size: 0.85rem;
              color: $gray-500;
              margin: 0 0 8px 0;
            }

            .form-input {
              width: 100%;
              padding: 18px 16px;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              font-size: 0.9rem;
              color: $gray-800;
              background: $white;
              outline: none;
              transition: all 0.2s ease;

              &:focus {
                border-color: $primary;
                box-shadow: 0 0 0 3px rgba($primary, 0.1);
              }

              &::placeholder {
                color: $gray-500;
              }
            }

            .logo-upload-wrapper {
              display: flex;
              align-items: center;
              gap: 15px;
              padding: 15px;
              border: 2px dashed #e5e5e5;
              border-radius: 8px;
              // background: #fafafa;
              transition: all 0.2s ease;

              &:hover {
                border-color: $primary;
                background: rgba($primary, 0.02);
              }

              .logo-preview {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                overflow: hidden;
                border: 2px solid #e5e5e5;
                background: $white;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }

              .upload-logo-btn {
                flex: 1;
                padding: 10px 20px;
                background: transparent;
                border: 1px solid $gray-400;
                border-radius: 8px;
                color: $gray-700;
                font-size: 0.9rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;

                &:hover {
                  background: $gray-100;
                  border-color: $gray-500;
                }

                .icon {
                  font-size: 1rem;
                }
              }
            }

            .form-select {
              width: 100%;
              padding: 12px 16px;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              font-size: 0.9rem;
              color: $gray-800;
              background: $white;
              cursor: pointer;
              outline: none;
              transition: all 0.2s ease;
              appearance: none;
              background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position: right 16px center;
              padding-right: 40px;

              &:focus {
                border-color: $primary;
                box-shadow: 0 0 0 3px rgba($primary, 0.1);
              }

              option {
                padding: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
