<template>
  <div class="sequences-tab">
    <div class="sequence-layout">
      <!-- Left Side: Timeline (from DesignSequenceStep) -->
      <section class="timeline-column">
        <div class="steps-list">
          <!-- eslint-disable-next-line vue/no-v-for-template-key, vue/require-v-for-key -->
          <template v-for="(step, index) in steps">
            <div :key="`step-${step.id}`" class="step-item" :class="{ 'is-selected': selectedStepId === step.id }" @click="selectStep(step.id)">
              <div class="step-header">
                <div class="step-circle">
                  <div class="inner-circle"></div>
                </div>
                <div class="step-badge" :class="step.badgeClass">{{ step.badgeLabel }}</div>
                <div v-if="step.schedule" class="step-timing" @click.stop="toggleDropdown(step.id)">
                  <SvgIcon name="clock" />
                  <span>{{ step.schedule }}</span>
                  <SvgIcon name="chevron-down-alt" class="ml-1" />
                  <div v-if="dropdownOpen === step.id" class="timing-dropdown">
                    <div class="dropdown-item" @click.stop="selectTiming(index, 'Right Away')">Right Away</div>
                    <div class="dropdown-item" @click.stop="selectTiming(index, '1 Day Later')">1 Day Later</div>
                    <div class="dropdown-item" @click.stop="selectTiming(index, '2 Days Later')">2 Days Later</div>
                  </div>
                </div>
              </div>

              <div class="step-content">
                <div class="action-card">
                  <div v-if="step.status" class="step-status done">
                    <div class="check-circle">
                      <SvgIcon name="check" />
                    </div>
                    {{ step.status }}
                  </div>
                  <div class="action-icon" :class="step.iconClass">
                    <SvgIcon :name="step.icon" />
                  </div>
                  <div class="action-details">
                    <h5>{{ step.title }}</h5>
                    <p>{{ step.subtitle }}</p>
                  </div>
                </div>
              </div>

              <button v-if="index < steps.length" :key="`connector-${step.id}`" class="add-step-between">
                <SvgIcon name="plus-white" />
              </button>
            </div>
          </template>

          <!-- Add Step Button at Bottom -->
          <div class="add-step-bottom">
            <button class="add-step-btn-large">
              <SvgIcon name="plus" />
              Add Step
            </button>
          </div>
        </div>
      </section>

      <!-- Right Side: Step Inspector -->
      <aside class="inspector-column" v-if="selectedStep">
        <header class="inspector-header">
          <h2>Step Inspector</h2>
          <button class="preview-button" type="button">
            <SvgIcon name="eye" />
            Preview
          </button>
        </header>

        <div class="inspector-content">
          <div class="inspector-title-block">
            <h3>{{ selectedStep.inspector.title }}</h3>
           
          </div>

          <p
            v-for="(paragraph, idx) in selectedStep.inspector.intro"
            :key="`intro-${idx}`"
            class="inspector-paragraph"
          >
            {{ paragraph }}
          </p>
            <button class="copy-button" type="button">
              <SvgIcon name="copy" />
              Copy
            </button>
          <section
            v-for="(section, sectionIndex) in selectedStep.inspector.sections"
            :key="`section-${sectionIndex}`"
            class="inspector-section"
          >
            <h4 v-if="section.heading">{{ section.heading }}</h4>
            <p
              v-for="(line, lineIndex) in section.body"
              :key="`line-${sectionIndex}-${lineIndex}`"
              class="inspector-paragraph"
            >
              {{ line }}
            </p>
          </section>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { CAMPAIGN_BY_ID_QUERY } from '~/graphql/campaign/queries'
export default {
  name: 'SequencesTab',
  props: {
    campaignId: { type: Number, required: true },
  },

  apollo: {
    campaignDetails: {
      query: CAMPAIGN_BY_ID_QUERY,
      variables() { return { id: this.campaignId } },
      update(data) { return data.campaign },
      error() { return false },
    },
  },

  data() {
    return {
      campaignDetails: null,
      dropdownOpen: null,
      steps: [],
      selectedStepId: 1
    }
  },

  computed: {
    selectedStep() {
      return this.steps.find((step) => step.id === this.selectedStepId) || null
    }
  },

  watch: {
    campaignDetails: {
      handler() {
        this.mapStepsFromCampaign()
      },
      immediate: true,
    }
  },

  methods: {
    selectStep(stepId) {
      this.selectedStepId = stepId
    },

    toggleDropdown(stepId) {
      this.dropdownOpen = this.dropdownOpen === stepId ? null : stepId
    },

    selectTiming(stepIndex, timing) {
      this.steps[stepIndex].schedule = timing
      this.dropdownOpen = null
    },
    mapStepsFromCampaign() {
      const c = this.campaignDetails
      if (!c || !Array.isArray(c.steps)) return
      const toDayBadge = (minutes, idx) => {
        if (!minutes || minutes <= 0) return { label: `Step ${idx+1} - Day 0`, cls: 'day-1', schedule: 'Right Away' }
        const days = Math.max(0, Math.round(minutes / (60*24)))
        return { label: `Step ${idx+1} - Day ${days}`, cls: `day-${days||1}`, schedule: days === 0 ? 'Right Away' : `${days} Day${days>1?'s':''} Later` }
      }
      this.steps = c.steps.map((s, idx) => {
        const emails = Array.isArray(s.emails) ? s.emails : []
        const first = emails[0] || {}
        const badge = toDayBadge(s.inMinutes || 0, idx)
        const channelIcon = 'email-alt'
        const iconClass = 'email'
        return {
          id: s.id || idx+1,
          badgeLabel: badge.label,
          badgeClass: badge.cls,
          schedule: badge.schedule,
          status: null,
          icon: channelIcon,
          iconClass,
          title: first.subject || `Step ${idx+1}`,
          subtitle: (first.body ? String(first.body).slice(0, 80) + '…' : ''),
          inspector: {
            title: first.subject || `Step ${idx+1}`,
            intro: [first.body || ''],
            sections: []
          }
        }
      })
      if (this.steps.length) this.selectedStepId = this.steps[0].id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.sequences-tab {
  padding: 20px 0;
  background: #fafafa;
  // min-height: calc(100vh - 120px);
}

.sequence-layout {
  display: flex;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.timeline-column {
  flex: 1;
  min-width: 0;
}

.steps-list {
  .step-item {
    margin-bottom: 20px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &.is-selected {
      .action-card {
        border-color: $primary;
        box-shadow: 0 4px 12px rgba($primary, 0.15);
      }
    }

    &::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 40px;
      width: 2px;
      height: calc(100% - 20px);
      background-color: #2f2f41;
      z-index: 0;
    }

    &:last-child::before {
      display: none;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;

      .step-circle {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #000;
        border: 2px solid $gray-400;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
        padding: 4px;

        .inner-circle {
          width: 80%;
          height: 80%;
          border-radius: 50%;
          background: #3a3a3a;
          border: 1px solid #fff;
        }
      }

      .step-badge {
        padding: 6px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;

        &.day-1,
        &.day-3,
        &.day-6 {
          background: #d0f56b;
          color: #2f2f41;
          font-weight: 900;
        }
      }

      .step-timing {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 6px;
        font-size: 0.85rem;
        color: $gray-700;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;

        &:hover {
          border-color: $primary;
        }

        .timing-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 160px;
          background: $white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 100;
          overflow: hidden;

          .dropdown-item {
            padding: 10px 16px;
            font-size: 0.9rem;
            color: $gray-700;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: rgba($primary, 0.05);
              color: $primary;
            }

            &:not(:last-child) {
              border-bottom: 1px solid #f5f5f5;
            }
          }
        }
      }
    }

    .step-content {
      padding-left: 44px;

      .action-card {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 20px;
        background: $white;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        margin-bottom: 12px;
        position: relative;
        transition: all 0.2s ease;

        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid $gray-200;
          background: #fff;
          color: #000;

          ::v-deep svg {
            width: 24px !important;
            height: 24px !important;

            path,
            circle,
            rect,
            line,
            polyline,
            polygon,
            ellipse {
              fill: none !important;
              stroke: #000 !important;
              
            }
          }
        }

        .step-status {
          position: absolute;
          top: -16px;
          right: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          z-index: 10;

          &.done {
            background: $primary;
            color: $white;

            .check-circle {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: $white;
              display: flex;
              align-items: center;
              justify-content: center;
              color: $primary;

              svg {
                width: 12px;
                height: 12px;
              }
            }
          }
        }

        .action-details {
          flex: 1;

          h5 {
            font-size: 1rem;
            font-weight: 600;
            color: $gray-800;
            margin: 0 0 6px 0;
          }

          p {
            font-size: 0.9rem;
            color: $gray-600;
            margin: 0;
            line-height: 1.5;
          }
        }
      }
    }

    .add-step-between {
      position: absolute;
      bottom: -29px;
      left: 50%;
      transform: translateX(-50%);
      width: 32px;
      height: 32px;
      background: $gray-800;
      color: $white;
      border: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 10;

      &:hover {
        background: $gray-700;
      }
    }
  }

  .add-step-bottom {
    padding: 40px 0 20px;
    text-align: center;

    .add-step-btn-large {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: transparent;
      border: 1px solid $gray-400;
      border-radius: 8px;
      color: $gray-700;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $gray-100;
        border-color: $gray-500;
      }
    }
  }
}

// Right Side: Inspector
.inspector-column {
  flex: 0 0 380px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 180px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 20px;
}

.inspector-header {
  // display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;

  h2 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #101828;
    margin: 0;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 24px;



  }
}

.preview-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  padding: 6px 14px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: $gray-400;
    background: #fafafa;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

.inspector-content {
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -1.4rem;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 3px;

    &:hover {
      background: #c0c0c0;
    }
  }
}

.inspector-title-block {
  // display: flex;
  justify-content: space-between;
  align-items: flex-start;
  // margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: #101828;
    flex: 1;
  }
}

.copy-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  margin-top: 24px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  svg {
    width: 14px;
    height: 14px;
  }
}

.inspector-section {
  margin-bottom: 24px;

  h4 {
    margin: 0 0 12px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #101828;
  }
}

.inspector-paragraph {
  margin: 0 0 10px;
  font-size: 0.88rem;
  color: #4b5563;
  line-height: 1.65;
  white-space: pre-line;

  &:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 1200px) {
  .sequence-layout {
    flex-direction: column;
  }

  .inspector-column {
    flex: 1;
    max-height: none;
    position: relative;
    top: 0;
  }
}
</style>
