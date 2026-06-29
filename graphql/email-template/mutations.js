import { gql } from 'graphql-tag'
import { EMAIL_TEMPLATE_FIELDS_FRAGMENT } from './fragments'

export const SAVE_EMAIL_TEMPLATE_FOLDER_MUTATION = gql`
  mutation SaveCampaignFolderMutation(
    $id: Int
    $title: String!
    $category: String
  ) {
    folder: saveFolder(
      id: $id
      title: $title
      category: $category
      type: "emailTemplate"
    ) {
      id
      title
      editable
    }
  }
`
export const SAVE_EMAIL_TEMPLATE_MUTATION = gql`
  mutation SaveEmailTemplateMutation(
    $id: Int
    $title: String!
    $subject: String!
    $category: String!
    $body: String!
  ) {
    saveEmailTemplate(
      id: $id
      title: $title
      subject: $subject
      category: $category
      body: $body
    ) {
      ...EmailTemplateFields
    }
  }
  ${EMAIL_TEMPLATE_FIELDS_FRAGMENT}
`
export const COPY_EMAIL_TEMPLATE_MUTATION = gql`
  mutation CopyEmailTemplateMutation(
    $title: String!
    $subject: String!
    $category: String!
    $body: String!
  ) {
    saveEmailTemplate(
      title: $title
      subject: $subject
      category: $category
      body: $body
    ) {
      ...EmailTemplateFields
    }
  }
  ${EMAIL_TEMPLATE_FIELDS_FRAGMENT}
`

export const DELETE_EMAIL_TEMPLATE_FOLDER_MUTATION = gql`
  mutation DeleteFolderMutation($id: Int!) {
    deleted: deleteFolder(id: $id)
  }
`

export const DELETE_EMAIL_TEMPLATE_MUTATION = gql`
  mutation DeleteEmailTemplateMutation($ids: [Int!]) {
    deleted: deleteEmailTemplate(ids: $ids)
  }
`
