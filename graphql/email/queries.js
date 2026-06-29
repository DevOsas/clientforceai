import { gql } from 'graphql-tag'

export const GET_EMAIL_QUALITY_QUERY = gql`
  query GetEmailQualityQuery($subject: String!, $body: String!) {
    getEmailQuality(subject: $subject, body: $body) {
      bodyLength {
        value
        coef
        progressbarColor
        startOptimal
        startOptimalCoef
        startOptimalValue
        endOptimal
        endOptimalCoef
        endOptimalValue
      }
      positivity {
        value
        coef
        progressbarColor
        startOptimal
        startOptimalCoef
        startOptimalValue
        endOptimal
        endOptimalCoef
        endOptimalValue
      }
      questionCount {
        value
        coef
        progressbarColor
        startOptimal
        startOptimalCoef
        startOptimalValue
        endOptimal
        endOptimalCoef
        endOptimalValue
      }
      readingLevel {
        value
        coef
        progressbarColor
        startOptimal
        startOptimalCoef
        startOptimalValue
        endOptimal
        endOptimalCoef
        endOptimalValue
      }
      subjectLength {
        value
        coef
        progressbarColor
        startOptimal
        startOptimalCoef
        startOptimalValue
        endOptimal
        endOptimalCoef
        endOptimalValue
      }
      spamwordsCount {
        value
        coef
        progressbarColor
        startOptimal
        startOptimalCoef
        startOptimalValue
        endOptimal
        endOptimalCoef
        endOptimalValue
      }
      spamwords
      totalCoef
      totalColor
    }
  }
`
