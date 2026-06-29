<template>
  <div class="step-emails">
    <CampaignPreviewEmailItem
      v-for="(email, index) in emails"
      :key="email.id"
      :email="email"
      :option="alpha[index]"
      :collapsed="expanded !== email.id"
      @toggle="handleToggleCollapse"
    />
  </div>
</template>

<script>
import CampaignPreviewEmailItem from '~/components/Campaign/CampaignPreviewEmailItem'

export default {
  components: { CampaignPreviewEmailItem },

  props: {
    emails: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      alpha: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],

      expanded: this.emails[0].id,
    }
  },

  watch: {
    emails(es) {
      this.expanded = es[0].id
    },
  },

  methods: {
    handleToggleCollapse(email) {
      this.expanded = this.expanded === email.id ? null : email.id
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.step-emails {
  margin-bottom: 7px;
}
</style>
