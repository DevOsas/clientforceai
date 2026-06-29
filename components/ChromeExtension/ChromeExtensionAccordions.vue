<template>
  <div class="chrome-extension-accordions">
    <ChromeExtensionAccordionItem
      v-for="accordion in accordions"
      :key="accordion.id"
      :content="accordion"
      :is-open="openId === accordion.id"
      @toggle="handleAccordionClick"
    />
  </div>
</template>

<script>
import ChromeExtensionAccordionItem from '~/components/ChromeExtension/ChromeExtensionAccordionItem'

export default {
  components: { ChromeExtensionAccordionItem },

  data() {
    return {
      accordions: [
        {
          id: 1,
          title: 'Search on professional networks',
          body: 'Our Chrome extension is directly integrated with the most business-oriented famous social network: find names, emails, job titles, etc. in just one click!',
        },
        {
          id: 2,
          title: 'Search on any website',
          body: `Simply visit the prospect's website, click the extension icon and find all email addresses associated with this domain name. Just pick the ones you're interested in.`,
        },
        {
          id: 3,
          title: 'Search in any webpage',
          body: `Our Chrome extension will scout a page and its code to provide you with all emails present on that specific page, regardless of the domain you're currently on.`,
        },
      ],
      openId: 1,
    }
  },

  methods: {
    handleAccordionClick(accordion) {
      if (this.openId === accordion.id) {
        return (this.openId = null)
      }
      this.openId = accordion.id
    },
  },
}
</script>

<style lang="scss" scoped>
.chrome-extension-accordions {
  margin-top: 30px;
}
</style>
