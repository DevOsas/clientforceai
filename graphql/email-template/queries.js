import { gql } from 'graphql-tag'
import { EMAIL_TEMPLATE_FIELDS_FRAGMENT } from './fragments'

export const ALL_EMAIL_TEMPLATE_FOLDERS_QUERY = gql`
  query AllEmailTemplateFoldersQuery($category: String!) {
    folders: allEmailTemplateFolders(category: $category) {
      id
      title
      editable
    }
  }
`

export const EMAIL_TEMPLATES_QUERY = gql`
  query EmailTemplatesQuery($category: String!, $folderId: Int) {
    emailTemplates(category: $category, folderId: $folderId) {
      ...EmailTemplateFields
    }
  }
  ${EMAIL_TEMPLATE_FIELDS_FRAGMENT}
`
