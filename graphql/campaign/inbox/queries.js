import { gql } from 'graphql-tag'

import { EMAIL_THREAD_FIELDS_FRAGMENT } from './fragments'

export const EMAIL_THREADS_QUERY = gql`
  query ThreadsQuery($campaignId: Int!, $categoryId: Int) {
    threads: allThreads(campaignId: $campaignId, categoryId: $categoryId) {
      ...EmailThreadFields
    }
  }
  ${EMAIL_THREAD_FIELDS_FRAGMENT}
`

export const EMAIL_CATEGORIES_QUERY = gql`
  query CategoriesQuery($campaignId: Int!) {
    inboxCategories(campaignId: $campaignId) {
      id
      title
      isSystem
      count(campaignId: $campaignId)
    }
  }
`

export const EMAIL_THREAD_QUERY = gql`
  query EmailThreadQuery($campaignId: Int!, $threadId: Int!) {
    emailThread(campaignId: $campaignId, threadId: $threadId) {
      ...EmailThreadFields
    }
  }
  ${EMAIL_THREAD_FIELDS_FRAGMENT}
`
