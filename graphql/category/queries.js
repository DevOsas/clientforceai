import gql from 'graphql-tag'
import { CATEGORY_FIELDS_FRAGMENT } from './fragments'

export const ALL_CATEGORIES_QUERY = gql`
  query AllGategoriesQuery {
    allCategories {
      ...CategoryFields
    }
  }
  ${CATEGORY_FIELDS_FRAGMENT}
`
