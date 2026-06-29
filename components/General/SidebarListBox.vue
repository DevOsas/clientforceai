<template>
  <div class="sidebar-list-box">
    <div v-if="loading" class="lead-lists-loading">
      <b-spinner variant="primary" />
    </div>
    <template v-else-if="!isEmpty">
      <header class="box-header">
        <slot name="header" />
      </header>
      <div class="box-list-wrap">
        <custom-scroll :ops="{ scrollPanel: { scrollingX: false } }">
          <ul class="box-list">
            <slot name="list" />
          </ul>
        </custom-scroll>
      </div>
    </template>
    <div v-else class="empty-lead-lists">
      <slot name="empty-list" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    isEmpty: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.sidebar-list-box {
  width: 100%;
  min-height: 305px;
  background: #ebffe9;
  border: 1px solid $gray-300;
  border-radius: 5px;

  .lead-lists-loading {
    min-height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;

    .spinner-border {
      border-width: 0.4rem;
      height: 3.5rem;
      width: 3.5rem;
    }
  }

  .box-header {
    padding: 20px 20px 10px 30px;
    color: #8f8f8f;
    border-bottom: 1px solid $gray-300;
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;

    .btn {
      padding: 0;
      font-size: 20px;
      line-height: 24px;
      color: #8f8f8f;
      box-shadow: none;
    }
  }

  .box-list-wrap {
    padding-bottom: 20px;
    overflow-x: hidden;

    .box-list {
      max-height: 450px;
      list-style: none;
      padding: 0;
      margin: 0;
      padding-bottom: 20px;

      > li {
        > a {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px 0 30px;
          color: $dark;
          text-decoration: none;
          font-size: 1.1rem;

          > span {
            display: inline-block;
            max-width: 85%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .dropdown-toggle {
            padding: 0;
            opacity: 0;
            transition: all 0.3s ease;
            box-shadow: none;

            .icon {
              font-size: 0.8rem;
            }
          }

          &:hover {
            .dropdown-toggle {
              opacity: 1;
            }
          }
        }

        &.active {
          > a {
            color: $primary;
          }
        }
      }
    }
  }

  .empty-lead-lists {
    text-align: center;
    padding-top: 30px;

    .empty-lists-icon {
      font-size: 5rem;
      color: #8f8f8f;
    }

    .btn {
      margin-top: 7px;
    }
  }
}
</style>
