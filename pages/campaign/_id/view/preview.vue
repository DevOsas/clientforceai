<template>
  <div class="view-campagin-preview-page">
    <b-container>
      <div
        v-if="$apollo.queries.campaignPreview.loading"
        class="campaign-preview-loading"
      >
        <b-spinner variant="primary" />
      </div>
      <div v-else class="campaign-preview-row">
        <div class="preview-leads-col">
          <div class="preview-leads">
            <div
              v-for="lead in prospects"
              :key="lead.email"
              class="lead-item"
              :class="{ active: lead.id === activeLead }"
              @click="activeLead = lead.id"
            >
              <div class="lead-photo-wrap">
                <img :src="photoUrl(lead)" class="lead-photo" />
              </div>
              <div class="details">
                <div class="lead-name">
                  {{ lead.name }}
                </div>
                <div class="lead-email">{{ lead.email }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="preview-sequence-col">
          <div class="preview-sequences">
            <div
              v-for="sequence in sequences"
              :key="sequence.day"
              class="preview-step"
            >
              <div class="step-knob"></div>
              <div class="step-header">
                <div class="step-day">Day {{ sequence.day }}</div>
                <div class="step-tip">A random option will be sent</div>
              </div>

              <CampaignPreviewEmails :emails="sequence.emails" />
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import CampaignPreviewEmails from '~/components/Campaign/CampaignPreviewEmails'

import { CAMPAIGN_PREVIEW_QUERY } from '~/graphql/campaign/queries'

export default {
  components: { CampaignPreviewEmails },

  data() {
    return {
      activeLead: null,

      campaignPreview: {
        previews: [],
      },
    }
  },

  apollo: {
    campaignPreview: {
      query: CAMPAIGN_PREVIEW_QUERY,
      variables() {
        return {
          campaignId: parseInt(this.$route.params.id),
        }
      },

      result({ data, loading, networkStatus }) {
        if (!loading && data.campaignPreview.previews.length) {
          this.activeLead = data.campaignPreview.previews[0].id
        }
      },

      error() {
        // Prevent the page from crashing on error
        return false
      },
    },
  },

  computed: {
    prospects() {
      return this.campaignPreview.previews.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
      }))
    },

    sequences() {
      const prospect = this.campaignPreview.previews.find(
        (p) => p.id === this.activeLead
      )

      const steps = prospect ? prospect.steps : []

      let prevDay = 1
      return steps.map((step, index) => {
        prevDay = prevDay + step.inMinutes / 1440

        return {
          ...step,
          day: prevDay,
        }
      })
    },
  },

  methods: {
    photoUrl(lead) {
      return lead.photoUrl || require('@/assets/images/default.png')
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.view-campagin-preview-page {
  margin-top: 30px;

  .campaign-preview-loading {
    min-height: 55vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.5rem;
      height: 5rem;
      width: 5rem;
    }
  }

  .campaign-preview-row {
    display: flex;

    .preview-leads-col {
      width: 30%;
      margin-right: 30px;

      .preview-leads {
        .lead-item {
          background: $gray-100;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding: 50px 20px;
          margin-bottom: 15px;
          cursor: pointer;

          &.active {
            background: #dcffd8;
          }

          .lead-photo-wrap {
            width: 65px;
            height: 65px;
            margin-right: 10px;
            background-color: #b4c5fa;
            border-radius: 50%;
            overflow: hidden;
            border: 1px solid #111;
            box-shadow: -2px 6px 10px -1px rgba(0, 0, 0, 0.25);

            .lead-photo {
              width: 100%;
              object-fit: contain;
            }
          }

          .details {
            .lead-name {
              font-size: 18px;
            }
            .lead-email {
              font-size: 13px;
              color: #8f8f8f;
            }
          }
        }
      }
    }

    .preview-sequence-col {
      width: 68%;

      .preview-sequences {
        .preview-step {
          padding-bottom: 30px;
          padding-left: 40px;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            width: 5px;
            height: 100%;
            background-color: #e0e0e0;
            left: 8px;
            top: 10px;
            transition: all 0.3s ease-in;
          }

          .step-knob {
            position: absolute;
            width: 21px;
            height: 21px;
            border-radius: 50%;
            background-color: #e0e0e0;
            left: 0;
            top: 1px;
            transition: all 0.3s ease-in;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .step-header {
            display: flex;
            align-items: flex-end;
            margin-bottom: 7px;

            .step-day {
              font-weight: bold;
              margin-right: 10px;
              font-size: 17px;
            }

            .step-tip {
              font-size: 13px;
              color: #8f8f8f;
            }
          }

          &:last-of-type {
            &::before {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
