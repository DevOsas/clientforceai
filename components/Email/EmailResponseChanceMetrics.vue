<template>
  <div class="response-chance">
    <template v-if="!quality">
      <div class="response-chance-header">
        <b-skeleton animation="fade" width="100%" height="18px" class="mb-1" />
        <b-skeleton animation="fade" width="75%" height="10px" />
      </div>

      <div v-for="num in 6" :key="num" class="response-chance-metrics">
        <div class="metric">
          <b-skeleton
            animation="fade"
            width="35%"
            height="15px"
            class="mb-1 mt-3"
          />
          <b-skeleton animation="fade" width="100%" height="20px" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="response-chance-header">
        <h4 :class="chanceLevel.toLowerCase()">{{ chanceLevel }} chance</h4>
        <p>to receive a response</p>
      </div>
      <div class="response-chance-metrics">
        <div class="metric">
          <div class="d-flex justify-content-between">
            <div class="metric-label">
              Subject length ({{ quality.subjectLength.value || 0 }})
            </div>
            <SvgIcon
              v-b-tooltip.hover.topleft="{ customClass: 'score-tooltip' }"
              title="Keep the subject line short and personal. Emails are often being opened on mobile devices, so longer subject lines might get cut off. Subject lines with 3-7 words are the most effective."
              name="info"
            />
          </div>
          <ProgressBar
            :value="getPercent(quality.subjectLength.coef)"
            :variant="quality.subjectLength.progressbarColor"
          />
        </div>
        <div class="metric">
          <div class="d-flex justify-content-between">
            <div class="metric-label">
              Word count ({{ quality.bodyLength.value }})
            </div>
            <SvgIcon
              v-b-tooltip.hover.topleft="{ customClass: 'score-tooltip' }"
              title="If your goal is to increase replies, keep emails at 50-125 words. Make sure your emails appear as if you wrote them manually for one particular recipient. Keep your email short and sweet; don’t send long advertising or sales copies - those are typically ignored and never get read."
              name="info"
            />
          </div>
          <ProgressBar
            :value="getPercent(quality.bodyLength.coef)"
            :variant="bodyLengthCoefColor"
          />
        </div>
        <div class="metric">
          <div class="d-flex justify-content-between">
            <div class="metric-label">
              Question count ({{ quality.questionCount.value || 0 }})
            </div>
            <SvgIcon
              v-b-tooltip.hover.topleft="{ customClass: 'score-tooltip' }"
              title="What do you want your recipients to do? Get on a call, sign up for a course, book a demo, or upgrade their account? Your emails need to have a clear purpose. Moreover, if you want to get a response, give the recipient a question to answer; asking 1-2 questions in your email gives you the best chance of getting a response."
              name="info"
            />
          </div>
          <ProgressBar
            :value="getPercent(quality.questionCount.coef)"
            :variant="quality.questionCount.progressbarColor"
          />
        </div>
        <div class="metric">
          <div class="d-flex justify-content-between">
            <div class="metric-label">
              Reading level ({{ quality.readingLevel.value * 100 }})
            </div>
            <SvgIcon
              v-b-tooltip.hover.topleft="{ customClass: 'score-tooltip' }"
              title="Always check if your text is easy to read and if the thoughts are presented in a logical order. Surprisingly, emails written at a 3rd-grade reading level (i.e. emails that could be understood by someone with a 3rd-grade education) are most likely to get a response. Simpler words and shorter sentences yield a lower reading grade level."
              name="info"
            />
          </div>
          <ProgressBar
            :value="getPercent(quality.readingLevel.coef)"
            :variant="quality.readingLevel.progressbarColor"
          />
        </div>
        <div class="metric">
          <div class="d-flex justify-content-between">
            <div class="metric-label">
              Positivity ({{ quality.positivity.value * 100 }})
            </div>
            <SvgIcon
              v-b-tooltip.hover.topleft="{ customClass: 'score-tooltip' }"
              title="Positivity defines how positive or negative the context of your email is. The highest response rates come from emails that are positive in tone. Positivity is calculated by artificial intelligence, so it may not be 100% accurate - when in doubt, trust your judgment."
              name="info"
            />
          </div>
          <ProgressBar
            :value="getPercent(quality.positivity.coef)"
            :variant="quality.positivity.progressbarColor"
          />
        </div>
        <div class="metric">
          <div class="d-flex justify-content-between">
            <div class="metric-label">
              Spam word count ({{ quality.spamwordsCount.value }})
            </div>
            <SvgIcon
              v-b-tooltip.hover.topleft="{ customClass: 'score-tooltip' }"
              title="Our service analyzes the text for common spam words. The more spam words you use, the lower your chance to receive a reply."
              name="info"
            />
          </div>
          <div
            v-b-tooltip.hover.bottomright="{ customClass: 'score-tooltip' }"
            :title="quality.spamwords.join(', ')"
          >
            <ProgressBar
              :value="getPercent(quality.spamwordsCount.coef)"
              :variant="quality.spamwordsCount.progressbarColor"
            />
          </div>
        </div>
      </div>
    </template>

    <p class="mt-5">
      <a href="#" class="learn-more-link">Learn more</a> about the service
    </p>
  </div>
</template>

<script>
import ProgressBar from '~/components/General/ProgressBar'

export default {
  components: { ProgressBar },

  props: {
    quality: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    chanceLevel() {
      if (!this.quality) {
        return ''
      }
      return this.quality.totalColor === 'green'
        ? 'High'
        : this.quality.totalColor === 'yellow'
        ? 'Moderate'
        : 'Low'
    },

    bodyLengthCoefColor() {
      const color = this.quality.bodyLength.progressbarColor

      return color
    },
  },

  methods: {
    getPercent(coef) {
      const percent = coef * 100

      return percent > 100 ? 100 : percent
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.response-chance {
  .response-chance-header {
    margin-bottom: 45px;
    position: relative;

    h4 {
      font-size: 24px;
      color: $primary;
      margin-bottom: 0;

      &.high {
        color: #6ed160;
      }
      &.low {
        color: #f94144;
      }
      &.moderate {
        color: #f8961e;
      }
    }

    p {
      color: $gray-600;
    }

    &::after {
      content: url('~@/assets/images/long-arrow.svg');
      position: absolute;
      top: 45px;
      left: 0;
      height: 10px;
      width: 100px;
    }
  }

  .response-chance-metrics {
    .metric {
      margin-bottom: 30px;

      .metric-label {
        font-size: 16px;
        margin-bottom: 5px;
      }

      .icon {
        cursor: pointer;
      }
    }
  }

  .score-tooltip {
    .tooltip-inner {
      text-align: left;
      background-color: $gray-700;
      padding: 10px 8px;
      min-width: 250px;
    }
  }
}
</style>
