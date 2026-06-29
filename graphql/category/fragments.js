import gql from 'graphql-tag'

export const CATEGORY_FIELDS_FRAGMENT = gql`
  fragment CategoryFields on Category {
    id
    title
    slug
    icon
    writable
  }
`
