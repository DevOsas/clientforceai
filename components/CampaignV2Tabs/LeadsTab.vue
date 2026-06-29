<template>
  <div class="leads-tab">
    <div class="table-wrapper">
      <div class="leads-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="table-row">
            <div class="table-cell checkbox-cell">
              <input type="checkbox" @change="toggleSelectAll" />
            </div>
            <div class="table-cell">Name</div>
            <div class="table-cell">Email</div>
            <div class="table-cell">Company</div>
            <div class="table-cell">Phone</div>
            <div class="table-cell">Website</div>
            <div class="table-cell actions-cell">Action</div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div 
            v-for="(lead, index) in leads" 
            :key="lead.id"
            class="table-row"
            :class="{ 'alternate': index % 2 === 1 }"
          >
            <div class="table-cell checkbox-cell">
              <input type="checkbox" v-model="selectedLeads" :value="lead.id" />
            </div>
            <div class="table-cell">{{ lead.name }}</div>
            <div class="table-cell">{{ lead.email }}</div>
            <div class="table-cell">{{ lead.company }}</div>
            <div class="table-cell">{{ lead.phone }}</div>
            <div class="table-cell">
              <a :href="lead.website" target="_blank" class="website-link">{{ lead.website }}</a>
            </div>
            <div class="table-cell actions-cell">
              <button class="action-icon">
                <SvgIcon name="trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CAMPAIGN_MEMBERS_QUERY } from '~/graphql/campaign/queries'
export default {
  name: 'LeadsTab',
  props: {
    campaignId: { type: Number, required: true },
  },

  apollo: {
    campaignMembers: {
      query: CAMPAIGN_MEMBERS_QUERY,
      variables() { return { campaignId: this.campaignId, offset: 0 } },
      update(data) { return data.campaignMembers || { members: [], total: 0, hasMore: false } },
      error() { return false },
    }
  },

  data() {
    return {
      selectedLeads: [],
      leads: [],
      campaignMembers: { members: [], total: 0, hasMore: false },
    }
  },

  methods: {
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedLeads = this.leads.map(l => l.id)
      } else {
        this.selectedLeads = []
      }
    }
  },

  mounted() {
    console.log('Leads tab mounted')
    // Map campaignMembers to table rows
    this.$watch('campaignMembers', (val) => {
      const members = (val && Array.isArray(val.members)) ? val.members : []
      this.leads = members.map((m) => ({
        id: m.id,
        name: `${m.lead.firstName || ''} ${m.lead.lastName || ''}`.trim(),
        email: m.lead.email || '',
        company: m.lead.company || '',
        phone: m.lead.phone || '',
        website: m.lead.domain ? (m.lead.domain.startsWith('http') ? m.lead.domain : `https://${m.lead.domain}`) : ''
      }))
    }, { immediate: true })
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/variables';

.leads-tab {
  padding: 0;
  background: #fff;

  .table-wrapper {
    overflow-x: auto;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    background: #fff;

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d0d0d0;
      border-radius: 4px;

      &:hover {
        background: #b0b0b0;
      }
    }
  }

  .leads-table {
    width: 100%;
    min-width: 900px;

    // Shared checkbox styles for both header and body
    .checkbox-cell {
      display: flex;
      justify-content: center;
      align-items: center;

      input[type="checkbox"] {
        width: 19px;
        height: 19px;
        cursor: pointer;
        appearance: none;
        border: 2px solid #d1d5db;
        border-radius: 5px;
        position: relative;
        transition: all 0.2s ease;

        &:checked {
          background: $primary;
          border-color: $primary;
          color: $white;

          &::after {
            content: '';
            position: absolute;
            left: 5px;
            top: 2px;
            width: 4px;
            height: 8px;
            border: solid #000;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        }

        &:hover {
          border-color: $primary;
        }
      }
    }

    .table-header {
      background: #fff;

      .table-row {
        display: grid;
        grid-template-columns: 50px 1fr 1fr 1fr 1fr 1fr 80px;
        align-items: center;
        padding: 0;
        border-bottom: 1.5px solid #e5e5e5;
        width: 100%;

        .table-cell {
          padding: 16px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #000;
          border-right: 1px solid #f0f0f0;

          &:last-child {
            border-right: none;
          }
        }
      }
    }

    .table-body {
      .table-row {
        display: grid;
        grid-template-columns: 50px 1fr 1fr 1fr 1fr 1fr 80px;
        align-items: center;
        padding: 0;
        transition: background 0.2s ease;
        width: 100%;

        &.alternate {
          background: #fafafa;
        }

        &:hover {
          background: #f5f5f5;
        }

        .table-cell {
          padding: 16px 12px;
          font-size: 0.9rem;
          color: #2f2f41;

          .website-link {
            color: #2f2f41;
            text-decoration: underline;
            transition: color 0.2s ease;

            &:hover {
              color: $primary;
            }
          }
        }

        .actions-cell {
          display: flex;
          justify-content: center;
          align-items: center;

          .action-icon {
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 1;
            transition: opacity 0.2s ease;
            border-radius: 6px;

            ::v-deep svg {
              width: 18px;
              height: 18px;
              color: #9ca3af;
            }

            &:hover {
              background: #f3f4f6;

              ::v-deep svg {
                color: #ef4444;
              }
            }
          }
        }

       
      }
    }
  }
}
</style>
