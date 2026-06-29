<template>
  <div class="container py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">AI Writing Agent Test Page</h1>
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Email Composer Test</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Subject
          </label>
          <input 
            v-model="email.subject"
            type="text"
            placeholder="Enter email subject"
            data-ai-slot="email.subject"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Body
          </label>
          <textarea 
            v-model="email.body"
            rows="8"
            placeholder="Enter email message"
            data-ai-slot="email.body"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>

        <button 
          @click="saveEmail"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Email
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Proposal Test</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Proposal Title
          </label>
          <input 
            v-model="proposal.title"
            type="text"
            placeholder="Enter proposal title"
            data-ai-slot="proposal.title"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Proposal Content
          </label>
          <textarea 
            v-model="proposal.body"
            rows="10"
            placeholder="Enter proposal content"
            data-ai-slot="proposal.body"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>

        <button 
          @click="saveProposal"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save Proposal
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Note Test</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Quick Note
          </label>
          <textarea 
            v-model="note.content"
            rows="6"
            placeholder="Enter your note"
            data-ai-slot="note.body"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          ></textarea>
        </div>

        <button 
          @click="saveNote"
          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Save Note
        </button>
      </div>

      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">🎯 How to Test:</h3>
        <ol class="list-decimal list-inside space-y-2 text-gray-700">
          <li>Look for the <strong>purple pen button</strong> in the bottom-right corner</li>
          <li>Click it to open the AI Writing Agent panel</li>
          <li>Try: <strong>"Write a friendly follow-up email after a demo"</strong></li>
          <li>Choose Tone: <strong>Friendly</strong>, Format: <strong>Email</strong></li>
          <li>Click <strong>"Generate"</strong></li>
          <li>Review the preview</li>
          <li>Click <strong>"Fill Fields"</strong> to auto-fill the form</li>
          <li>Try <strong>"Undo"</strong> to restore original values</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestWriterPage',

  data() {
    return {
      email: {
        subject: '',
        body: ''
      },
      proposal: {
        title: '',
        body: ''
      },
      note: {
        content: ''
      }
    }
  },

  methods: {
    saveEmail() {
      console.log('Email saved:', this.email)
      this.$notify({
        group: 'main',
        type: 'success',
        title: 'Success',
        text: 'Email saved!'
      })
    },

    saveProposal() {
      console.log('Proposal saved:', this.proposal)
      this.$notify({
        group: 'main',
        type: 'success',
        title: 'Success',
        text: 'Proposal saved!'
      })
    },

    saveNote() {
      console.log('Note saved:', this.note)
      this.$notify({
        group: 'main',
        type: 'success',
        title: 'Success',
        text: 'Note saved!'
      })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
